import { LOCATIONS } from '@/assets/js/constants'
import shuffle from 'lodash.shuffle'
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
 * IdleState EnteringState
 *
 * Foward: rotate the earth for entering animation, then go to the next state, which is IdleState
 * Backward: no backward
 */
class EnteringState extends BaseState {
  constructor (controller) {
    super(controller)
    this.tween = new TWEEN.Tween({
      x: 3.55, y: 0, z: -328, ry: 0
    }).to({
      x: 0, y: 0, z: -28, ry: Math.PI * -2
    }, 1600).onUpdate(function () {
      controller.earth.setCamera(this.x, this.y, this.z)
      controller.earth.earthGroup.rotation.y = this.ry
    }).onComplete(function () {
      controller.changeState('idle')
    }).easing(TWEEN.Easing.Cubic.Out).start()
  }

  forward () {
    TWEEN.update()
  }
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
    // don't play audio sprite if EnteringState => IdleState
    // cause nextTarget() will play the audio
    if (!(controller.state instanceof EnteringState)) {
      controller.playSprite('audio')
    }

    controller.earth.controller.enabled = true
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
    controller.pauseSprite('audio')
    controller.earth.controller.enabled = false
  }

  forward () {
    let that = this
    let earth = this.controller.earth
    let target = this.controller.target

    if (this.tween) {
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
      TWEEN.update()
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
    controller.hideCloud()
    controller.showEarth()
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
    controller.showCloud()
    controller.hideEarth()
    controller.hideVideo()
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
    controller.hideCloud()
    controller.showVideo()
  }

  backward () {
    this.controller.changeState('diving')
  }
}

/* Controller class */
export default class Controller {
  constructor (options) {
    this.earth = options.earth
    this.cloud = options.cloud
    this.audioSprite = options.audioSprite
    this.videoSprite = options.videoSprite
    this.onStateChange = options.onStateChange
    this.onTargetChange = options.onTargetChange

    this.state = null
    this.touchDown = false

    this.target = null
    this.targetList = []

    this._init()
  }

  _init () {
    setTimeout(_ => { this.state = new EnteringState(this) }, 800)
    this._shuffleTargetList()
    this._loop()
  }

  _shuffleTargetList () {
    this.targetList = shuffle(LOCATIONS.map(location => location.name))
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))
    this._animate()
  }

  _animate () {
    if (!this.state) {
      return
    }

    if (this.state instanceof EnteringState) {
      this.state.forward()
    }

    if (this.touchDown && this.target) {
      this.state.forward()
    } else {
      this.state.backward()
    }
  }

  showEarth () {
    this.earth.container.style.display = 'block'
  }

  hideEarth () {
    this.earth.container.style.display = 'none'
  }

  showCloud () {
    this.cloud.el.style.display = 'block'
  }

  hideCloud () {
    this.cloud.el.style.display = 'none'
  }

  showVideo () {
    this.playSprite('video')
    this.videoSprite.media.style.display = 'block'
  }

  hideVideo () {
    this.pauseSprite('video')
    this.videoSprite.media.style.display = 'none'
  }

  playSprite (type) {
    if (!this.target) {
      return
    }

    if (type === 'video') {
      this.videoSprite.repeat(this.target.name)
    } else if (type === 'audio') {
      this.audioSprite.play(this.target.name)
    }
  }

  pauseSprite (type) {
    if (type === 'video') {
      this.videoSprite.pause()
    } else if (type === 'audio') {
      this.audioSprite.pause()
    }
  }

  start () {
    this.touchDown = true
  }

  end () {
    this.touchDown = false
  }

  nextTarget () {
    let nextTargetIndex = (this.targetList.indexOf(this.target ? this.target.name : null) + 1) % this.targetList.length
    this.setTarget(this.targetList[nextTargetIndex])
  }

  setTarget (locationName) {
    this.target = LOCATIONS.filter(location => location.name === locationName)[0]
    this.playSprite('audio')
    this.videoSprite.set(locationName)
    this.onTargetChange && this.onTargetChange()
  }

  changeState (stateName) {
    switch (stateName) {
      case 'idle':
        this.state = new IdleState(this)
        break
      case 'rotating':
        this.state = new RotatingState(this)
        break
      case 'zooming':
        this.state = new ZoomingState(this)
        break
      case 'diving':
        this.state = new DivingState(this)
        break
      case 'presenting':
        this.state = new PresentingState(this)
        break
      default:
        this.state = new BaseState(this)
    }
    this.onStateChange && this.onStateChange(stateName)
  }
}
