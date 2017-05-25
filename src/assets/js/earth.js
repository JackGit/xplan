import * as THREE from 'three'
import TWEEN from 'tween.js'
import { PAGE_WIDTH, PAGE_HEIGHT, IMAGE_URLS, LOCATIONS } from '@/assets/js/constants'

const WIDTH = PAGE_WIDTH
const HEIGHT = PAGE_HEIGHT
const OrbitControls = require('three-orbit-controls')(THREE)

let loader = new THREE.TextureLoader()

export default class Earth {
  constructor (el, options) {
    this.container = typeof el === 'string' ? document.getElementOf(el) : el

    this.camera = null
    this.renderer = null
    this.controller = null

    this.scene = null
    this.earthGroup = null
    this.spriteGroup = null
    this.earth = null
    this.cloud = null

    this.autoRotate = true
    this.rotationSpeed = 0.001
    this.cloudSpeed = -0.0003
    this.tween = null
    this.isTweening = false

    this._init()
  }

  _init () {
    this._createScene()
    this._createCamera()
    this._createLight()
    this._createEarth()
    this._createCloud()
    this._createLabels()
    this._createController()
    this._createRenderer()

    this._loop()
  }

  _createController () {
    let controller = new OrbitControls(this.camera)
    controller.rotateSpeed = 0.3
    controller.autoRotate = false
    controller.enableZoom = false
    controller.enablePan = false
    controller.enabled = true
    this.controller = controller
  }

  _createCamera () {
    let camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 0.1, 1000)
    camera.position.set(0, 0, -28)
    this.scene.add(camera) // this is required cause there is a light under camera
    this.camera = camera
  }

  _createLight () {
    let ambientLight = new THREE.AmbientLight(0x393939, 0.5)
    let spotLight = new THREE.SpotLight(0xffffff, 1.5)

    spotLight.position.set(-26, 11, -11)
    spotLight.angle = 0.2
    spotLight.castShadow = false
    spotLight.penumbra = 0.4
    spotLight.distance = 124
    spotLight.decay = 1
    spotLight.shadow.camera.near = 50
    spotLight.shadow.camera.far = 200
    spotLight.shadow.camera.fov = 35
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.mapSize.width = 1024

    this.scene.add(ambientLight)
    this.camera.add(spotLight)  // fixed light direction by adding it as child of camera
  }

  _createScene () {
    this.scene = new THREE.Scene()
  }

  _createEarth () {
    let group = new THREE.Group()
    let material = new THREE.MeshPhongMaterial({
      map: loader.load(IMAGE_URLS.earth),
      bumpMap: loader.load(IMAGE_URLS.earthBump),
      bumpScale: 0.15,
      specularMap: loader.load(IMAGE_URLS.earthSpec),
      specular: new THREE.Color('#909090'),
      shininess: 5,
      transparent: true
    })
    let sphere = new THREE.SphereGeometry(5, 32, 32)
    let earth = new THREE.Mesh(sphere, material)

    group.add(earth)
    this.scene.add(group)
    this.earthGroup = group
    this.earth = earth
  }

  _createCloud () {
    let sphere = new THREE.SphereGeometry(5.2, 32, 32)
    let material = new THREE.MeshPhongMaterial({
      map: loader.load(IMAGE_URLS.earthCloud),
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    })
    let cloud = new THREE.Mesh(sphere, material)

    this.earthGroup.add(cloud)
    this.cloud = cloud
  }

  _createLabels () {
    let group = new THREE.Group()
    LOCATIONS.forEach(location => {
      let sprite = this._createSprite(location)
      group.add(sprite)
    })

    this.earthGroup.add(group)
    this.spriteGroup = group
  }

  _createSprite (location) {
    let spriteMaterial = new THREE.SpriteMaterial({
      map: loader.load(location.labelImage),
      color: 0xffffff,
      fog: true
    })
    let sprite = new THREE.Sprite(spriteMaterial)
    sprite.position.set(location.position[0], location.position[1], location.position[2])
    sprite.scale.set(1.4, 1.4, 1.4)
    return sprite
  }

  _createRenderer () {
    let renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    })
    let container = this.container

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(WIDTH * 2, HEIGHT * 2)
    renderer.domElement.style.position = 'relative'
    renderer.domElement.style.width = WIDTH + 'px'
    renderer.domElement.style.height = HEIGHT + 'px'
    container.appendChild(renderer.domElement)
    this.renderer = renderer
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))
    this._render()
  }

  _render () {
    let rotationSpeed = this.rotationSpeed
    let cloudSpeed = this.cloudSpeed

    if (this.autoRotate) {
      this.camera.position.x = this.camera.position.x * Math.cos(rotationSpeed) - this.camera.position.z * Math.sin(rotationSpeed)
      this.camera.position.z = this.camera.position.z * Math.cos(rotationSpeed) + this.camera.position.x * Math.sin(rotationSpeed)
    }

    if (this.tween) {
      TWEEN.update()
    }

    this.cloud.rotation.y += cloudSpeed

    this.controller.update()
    this.renderer.render(this.scene, this.camera)
  }

  _tweenTo (position, duration = 1000, easing = TWEEN.Easing.Linear.None) {
    let camera = this.camera

    this.tween = new TWEEN.Tween({
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    }).easing(easing).to({
      x: position[0],
      y: position[1],
      z: position[2]
    }, duration).start()

    this.tween.onUpdate(function () {
      camera.position.set(this.x, this.y, this.z)
    })
    this.tween.onComplete(() => {
      this.isTweening = false
      console.log('tween completed')
    })
    this.isTweening = true
  }

  _toLocation (name, isNear = false, duration, easing) {
    let location = LOCATIONS.filter(location => location.name.toLowerCase() === name)[0]
    if (location) {
      this._tweenTo(isNear ? location.cameraNearPosition : location.cameraFarPosition, duration, easing)
    }
  }

  startAutoRotate () {
    this.autoRotate = true
  }

  stopAutoRotate () {
    this.autoRotate = false
  }

  rotateTo (name) {
    this._toLocation(name)
  }

  zoomInTo (name) {
    this._toLocation(name, true, 1000, TWEEN.Easing.Quadratic.In)
  }

  zoomOutTo (name) {
    this._toLocation(name, false, 1000, TWEEN.Easing.Quadratic.Out)
  }
}
