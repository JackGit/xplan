import { LOCATIONS } from '@/assets/js/constants'
import TWEEN from 'tween.js'

/* BaseState class */
class BaseState {
  constructor (controller) {
    this.controller = controller
  }

  forward () {}

  backward () {}
}

/**
 * IdleState class
 *
 * Foward: go the next state, which is RotatingState
 * Backward: no backward
 */
class IdleState extends BaseState {
  constructor (controller) {
    super(controller)
  }

  forward () {
    this.controller.changeState('rotating')
  }
}

/**
 * RotatingState class
 *
 * Forward: if reaches the cameraFarPosition, then move to the next state, which is ZoomingState; otherwise, keep set camera till reaches the target
 * Backward: back to IdleState util the rotation completed
 */
class RotatingState extends BaseState {
  constructor (controller) {
    super(controller)
    this.tween = null
  }

  forward () {
    let that = this
    let earth = this.controller.earth
    let target = this.controller.target

    if (this.tween) {
      console.log('RotatingState update')
      TWEEN.update()
    } else {
      this.tween = new TWEEN.Tween(earth.cameraPosition()).to({
        x: target.cameraFarPosition[0],
        y: target.cameraFarPosition[1],
        z: target.cameraFarPosition[2]
      }, 1000).onUpdate(function () {
        earth.setCamera(this.x, this.y, this.z)
      }).onComplete(function () {
        that.controller.changeState('zooming')
        that.tween = null
      }).start()
    }
  }

  backward () {
    if (this.tween) {
      this.tween.update()
    } else {
      this.controller.state = new IdleState(this.controller)
    }
  }
}

/**
 * ZoomingState class
 *
 * Forward: from current camera position to the camera near position of the target, once reach the position, go to the next state, which is DivingState
 * Backward: from current camera position to the camera far position of the target, once reach the position, go to the IdleState
 */
class ZoomingState extends BaseState {
  constructor (controller) {
    super(controller)
    this.direction = ''
    this.tween = null
  }

  _setDirection (direction) {
    let that = this
    let earth = this.controller.earth
    let target = this.controller.target
    let from = earth.cameraPosition()
    let to = null

    if (this.direction !== direction) {
      if (direction === 'forward') {
        to = {
          x: target.cameraNearPosition[0],
          y: target.cameraNearPosition[1],
          z: target.cameraNearPosition[2]
        }
      } else {
        to = {
          x: target.cameraFarPosition[0],
          y: target.cameraFarPosition[1],
          z: target.cameraFarPosition[2]
        }
      }

      this.direction = direction
      this.tween && this.tween.stop()

      this.tween = new TWEEN.Tween(from).to(to, 1000).onUpdate(function () {
        earth.setCamera(this.x, this.y, this.z)
      }).onComplete(function () {
        that._handleTweenComplete()
      }).start()
    }
  }

  _handleTweenComplete () {
    if (this.direction === 'forward') {
      this.controller.changeState('diving')
    } else {
      this.controller.changeState('idle')
    }
    this.tween = null
  }

  forward () {
    this._setDirection('forward')
    if (this.tween) {
      TWEEN.update()
    }
  }

  backward () {
    this._setDirection('backward')
    if (this.tween) {
      TWEEN.update()
    }
  }
}

/**
 * DivingState class
 *
 * Forward: from current frame index to the end of frame index, once reach the end, go to the next state, which is PresentingState
 * Backward: from current frame index to the beginning of the frame index, once reach the beginning, go to the previous state, which is DivingState
 */
class DivingState extends BaseState {
  constructor (controller) {
    super(controller)
    this.count = 0
  }

  _throttle (fn) {
    if (this.count % 3 === 0) {
      fn && fn()
      this.count = 0
    }
    this.count++
  }

  forward () {
    let cloud = this.controller.cloud
    if (cloud.currentFrameIndex === cloud.images.length - 1) {
      this.controller.changeState('presenting')
    } else {
      this._throttle(_ => cloud.next())
    }
  }

  backward () {
    let cloud = this.controller.cloud
    if (cloud.currentFrameIndex === 0) {
      this.controller.changeState('zooming')
    } else {
      this._throttle(_ => cloud.prev())
    }
  }
}

/**
 * PresentingState class
 *
 * Forward: no more forward actions
 * Backward: go to the previous state, which is DivingState
 */
class PresentingState extends BaseState {
  constructor (controller) {
    super(controller)
  }

  backward () {
    this.controller.changeState('diving')
  }
}

/* Controller class */
export default class Controller {
  constructor (earth, cloud) {
    this.earth = earth
    this.cloud = cloud
    this.target = null
    this.state = new IdleState(this)
    this.touchDown = false
    this._loop()
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))
    this._animate()
  }

  _animate () {
    if (this.touchDown && this.target) {
      this.state.forward()
    } else {
      this.state.backward()
    }
  }

  _handleTouchStart () {
    this.touchDown = true
  }

  _handleTouchEnd () {
    this.touchDown = false
  }

  showCloud () {
    this.cloud.el.style.display = 'block'
  }

  hideCloud () {
    this.cloud.el.style.display = 'none'
  }

  showVideo () {
    document.getElementById('video').style.display = 'block'
  }

  hideVideo () {
    document.getElementById('video').style.display = 'none'
  }

  setTarget (locationName) {
    this.target = LOCATIONS.filter(location => location.name === location.name)[0]
  }

  changeState (stateName) {
    console.log('change state', stateName)

    switch(stateName) {
      case 'idle':
        this.state = new IdleState(this);
        break;
      case 'rotating':
        this.state = new RotatingState(this);
        break;
      case 'zooming':
        this.hideCloud()
        this.state = new ZoomingState(this);
        break;
      case 'diving':
        this.showCloud()
        this.hideVideo()
        this.state = new DivingState(this);
        break;
      case 'presenting':
        this.hideCloud()
        this.showVideo()
        this.state = new PresentingState(this);
        break;
      default:
        this.state = new BaseState(this);
    }
  }
}
