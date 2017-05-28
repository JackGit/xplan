import TWEEN from 'tween.js'
import { LOCATIONS } from '@/assets/js/constants'

window.TWEEN = TWEEN

export default class Action {

  constructor (earth, cloud) {
    this.earth = earth
    this.cloud = cloud
    this.tween = null
    this.passingThroughCloud = false
    this.location = null
  }

  setTarget (name) {
    this.location = LOCATIONS.filter(l => l.name === name)[0]
  }

  setDirection (direction) {
    if (this.tween) {
      this.tween = null
    }

    if (direction === 'backward') {
      this._backward()
    } else {
      this._forward()
    }
  }

  _forward () {
    let that = this
    let cloud = this.cloud
    let earth = this.earth
    let location = this.location
    let twEarth = null
    let twCloud = null

    twCloud = new TWEEN.Tween({
      frameIndex: 0
    }).to({
      frameIndex: 12
    }).onStart(function () {
      that.passingThroughCloud = true
    }).onUpdate(function () {
      cloud.jump(this.frameIndex)
    }).onComplete(function () {
      that.passingThroughCloud = false
    })

    if (!this.passingThroughCloud) {
      twEarth = new TWEEN.Tween(
        earth.cameraPosition()
      ).to(
        location.cameraNearPosition
      ).onStart(function () {
        that.passingThroughCloud = false
      }).onUpdate(function () {
        earth.setCamera(this.x, this.y, this.z)
      })

      twEarth.chain(twCloud)
      this.tween = twEarth
    } else {
      this.tween = twCloud
    }

    this.tween.start()
  }

  _backward () {
    let that = this
    let cloud = this.cloud
    let earth = this.earth
    let location = this.location
    let twEarth = null
    let twCloud = null

    twEarth = new TWEEN.Tween(
      earth.cameraPosition()
    ).to(
      location.cameraFarPosition
    ).onStart(function () {
      that.passingThroughCloud = false
    }).onUpdate(function () {
      earth.setCamera(this.x, this.y, this.z)
    })

    if (this.passingThroughCloud) {
      twCloud = new TWEEN.Tween({
        frameIndex: 12
      }).to({
        frameIndex: 0
      }).onStart(function () {
        that.passingThroughCloud = true
      }).onUpdate(function () {
        cloud.jump(this.frameIndex)
      }).onComplete(function () {
        that.passingThroughCloud = false
      })

      twCloud.chain(twEarth)
      this.tween = twCloud
    } else {
      this.tween = twEarth
    }

    this.tween.start()
  }
}
