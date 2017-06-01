import { LOCATIONS } from '@/assets/js/constants'
import { isSamePosition } from '@/assets/js/utils'
import TWEEN from 'tween.js'
window.TWEEN = TWEEN

/* BaseState class */
class BaseState {
  constructor (controller) {
    this.controller = controller
  }

  forward () {}

  backward () {}
}

/* IdleState class */
class IdleState extends BaseState {
  constructor (controller) {
    super(controller)
  }

  forward () {
    this.controller.changeState('rotating')
  }
}

/* RotatingState class */
class RotatingState extends BaseState {
  constructor (controller) {
    super(controller)
    this.tween = null
  }

  forward () {
    /* let earth = this.controller.earth
    let target = this.controller.target

    if (isSamePosition(earth.camera.position, target.position)) {
      this.controller.changeState('zooming')
    } else {
      earth.setCamera()
    } */
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

/* ZoomingState class */
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
      this.controller.showCloud()
      this.controller.changeState('diving')
    } else {
      this.controller.hideCloud()
      this.controller.changeState('idle')
    }
    this.tween = null
  }

  forward () {
    /* let earth = this.controller.earth
    let target = this.controller.target

    if (isSamePosition(earth.camera.position, target.cameraFarPosition)) {
      this.controller.changeState('diving')
    } else {
      earth.setCamera()
    } */
    this._setDirection('forward')
    if (this.tween) {
      TWEEN.update()
    }
  }

  backward () {
    /* let earth = this.controller.earth
    let target = this.controller.target

    if (isSamePosition(earth.camera.position, target.cameraNearPosition)) {
      this.controller.changeState('idle')
    } else {
      earth.setCamera()
    } */
    this._setDirection('backward')
    if (this.tween) {
      TWEEN.update()
    }
  }
}

/* DivingState class */
class DivingState extends BaseState {
  constructor (controller) {
    super(controller)
  }

  forward () {
    let cloud = this.controller.cloud
    if (cloud.currentFrameIndex === cloud.images.length - 1) {
      this.controller.changeState('revealed')
    } else {
      cloud.next()
    }
  }

  backward () {
    let cloud = this.controller.cloud
    if (cloud.currentFrameIndex === 0) {
      this.controller.changeState('diving')
      this.controller.showCloud()
    } else {
      cloud.prev()
    }
  }
}

/* RevealedState class */
class RevealedState extends BaseState {
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
        this.state = new ZoomingState(this);
        break;
      case 'diving':
        this.state = new DivingState(this);
        break;
      case 'revealed':
        this.state = new RevealedState(this);
        break;
      default:
        this.state = new BaseState(this);
    }
  }
}
