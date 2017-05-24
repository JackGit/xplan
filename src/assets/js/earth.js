import * as THREE from 'three'
import imageEarth4 from '@/assets/images/earth4.jpg'
import imageEarthBump from '@/assets/images/earth_bump.jpg'
import imageEarthSpec from '@/assets/images/earth_spec.jpg'
import imageEarthCloud from '@/assets/images/earth_cloud.png'
/* import imageNamibia from '@/assets/images/i_namibia.png'
import imageMariana from '@/assets/images/i_mariana.png'
import imageGreenland from '@/assets/images/i_greenland.png'
import imageGalapagos from '@/assets/images/i_galapagos.png'
import imageAntarcica from '@/assets/images/i_antarctica.png' */

import Constants from '@/assets/js/constants'

const OrbitControls = require('three-orbit-controls')(THREE)
const WIDTH = Constants.PAGE_WIDTH
const HEIGHT = Constants.PAGE_HEIGHT

let loader = new THREE.TextureLoader()

export default class Earth {
  constructor (el, options) {
    let defaultOptions = {
      directionalLight: 0xffffff,
      ambientLight: 0x393939,
      earth: {},
      cloud: {},
      labels: [],
      camera: {}
    }
    this.options = defaultOptions
    this.container = typeof el === 'string' ? document.getElementOf(el) : el

    this.camera = null
    this.renderer = null
    this.scene = null
    this.earth = null
    this.cloud = null
    this.controller = null

    this.autoRotate = true

    this._init()
  }

  _init () {
    this._createScene()
    this._createCamera()
    this._createLight()
    this._createEarth()
    this._createCloud()
    // this._createLabels()
    this._createController()
    this._createRenderer()

    this._bindEvents()
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
    camera.position.set(3.55, 0, -28)
    this.scene.add(camera) // this is required cause there is a light under camera
    this.camera = camera
  }

  _createLight () {
    let ambientLight = new THREE.AmbientLight(this.options.ambientLight, 0.5)
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
    let material = new THREE.MeshPhongMaterial({
      map: loader.load(imageEarth4),
      bumpMap: loader.load(imageEarthBump),
      bumpScale: 0.15,
      specularMap: loader.load(imageEarthSpec),
      specular: new THREE.Color('#909090'),
      shininess: 5,
      transparent: true
    })
    let sphere = new THREE.SphereGeometry(5, 32, 32)
    let earth = new THREE.Mesh(sphere, material)

    this.earth = earth
    this.scene.add(earth)
  }

  _createCloud () {
    let sphere = new THREE.SphereGeometry(5.2, 32, 32)
    let material = new THREE.MeshPhongMaterial({
      map: loader.load(imageEarthCloud),
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending
    })
    let cloud = new THREE.Mesh(sphere, material)

    this.cloud = cloud
    this.scene.add(cloud)
  }

  _createLabels () {
    this.options.labels.forEach(label => {
      let sprite = this._createSprite(label)
      this.scene.add(sprite)
    })
  }

  _createSprite (label) {
    let spriteMaterial = new THREE.SpriteMaterial({
      map: loader.load('/static/img/i_namibia.png'),
      color: 0xffffff,
      fog: true
    })
    let sprite = new THREE.Sprite(spriteMaterial)
    sprite.position.set(0.5, 0.3, 0)
    sprite.scale.set(0.1, 0.1, 0.1)
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
    this.controller.update()
    this._render()
  }

  _render () {
    // this.earth.rotation.y += 0.001
    // this.cloud.rotation.y += 0.0005
    // let rotSpeed = 0.001
    // this.camera.position.x = this.camera.position.x * Math.cos(rotSpeed) - this.camera.position.z * Math.sin(rotSpeed)
    // this.camera.position.z = this.camera.position.z * Math.cos(rotSpeed) + this.camera.position.x * Math.sin(rotSpeed)
    this.renderer.render(this.scene, this.camera)
  }

  _bindEvents () {}

  start () {}
  stop () {}
  zoomIn () {}
  zoomOut () {}
  rotateTo () {}
}
