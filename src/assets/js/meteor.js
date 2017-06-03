import random from 'lodash.random'
import sample from 'lodash.samplesize'
import { IMAGE_URLS } from '@/assets/js/constants'

const RANGE_TOTAL_STARS = [50, 100]
const RANGE_STAR_RADIUS = [1, 3]

export default class Meteor {
  constructor (el) {
    this.el = el
    this.meteorImage = null
    this.width = window.innerWidth * 2
    this.height = window.innerHeight * 2
    this.context = null

    this.stars = []
    this.meteor = null

    this._init()
  }

  _init () {
    this._loadImage()
    this._createCanvas()
    this._createStars()
    this._loop()
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))

    this._shine()
    this._moveMeteor()
    this._render()
  }

  _render () {
    this._clear()
    this._drawStars()

    if (this.meteor && this.meteorImage) {
      this._drawMeteor()
    }
  }

  _loadImage () {
    let image = new Image()
    image.src = IMAGE_URLS.meteor
    this.meteorImage = image
  }

  _createCanvas () {
    let canvas = document.createElement('canvas')
    canvas.width = this.width
    canvas.height = this.height
    canvas.style.width = this.width / 2 + 'px'
    canvas.style.height = this.height / 2 + 'px'

    this.el.appendChild(canvas)
    this.context = canvas.getContext('2d')
  }

  _createStars () {
    let total = random.apply(null, RANGE_TOTAL_STARS)
    let width = this.width
    let height = this.height

    for (let i = 0; i < total; i++) {
      this.stars.push({
        x: random(0, width),
        y: random(0, height),
        r: random.apply(null, RANGE_STAR_RADIUS),
        shine: false
      })
    }
  }

  _clear () {
    this.context.clearRect(0, 0, this.width, this.height)
  }

  _shine () {
    let shineStar = sample(this.stars, random(this.stars.length * 0.9, this.stars.length))
    this.stars.forEach(star => {
      if (shineStar.indexOf(star) === -1) {
        star.shine = false
      } else {
        star.shine = true
      }
    })
  }

  _drawStars () {
    this.stars.forEach(star => {
      this._drawStar(star)
    })
  }

  _drawStar (star) {
    let context = this.context

    context.globalAlpha = 0.2
    context.fillStyle = '#FFF'
    context.beginPath()
    context.arc(star.x, star.y, star.r, 0, Math.PI * 2, true)
    context.closePath()
    context.fill()

    if (star.shine) {
      context.globalAlpha = random(0.5, 1)
      context.fillStyle = '#FFF'
      context.beginPath()
      context.arc(star.x, star.y, star.r * 0.8, 0, Math.PI * 2, true)
      context.closePath()
      context.fill()
    }
  }

  _drawMeteor () {
    if (this.meteorImage.complete) {
      this.context.drawImage(this.meteorImage, this.meteor.x, this.meteor.y)
    }
  }

  _createMeteor () {
    setTimeout(() => {
      let startX = random(this.width * 0.5, this.width * 1.5)
      let startY = random(this.height * -0.5, this.height * 0.5)

      this.meteor = {
        x: startX,
        y: startY,
        fromX: startX,
        fromY: startY,
        toX: this.width * -0.1,
        toY: this.height * 1.1,
        speed: random(2, 4)
      }
    }, random(0, 1))
  }

  _moveMeteor () {
    let meteor = this.meteor
    if (!meteor) {
      this._createMeteor()
    } else {
      if (meteor.x < meteor.toX || meteor.y > meteor.toY) {
        this._createMeteor()
      } else {
        meteor.x -= meteor.speed
        meteor.y += meteor.speed
      }
    }
  }
}
