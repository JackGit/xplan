import * as THREE from 'three'
import imageEarth4 from '@/assets/images/earth4.jpg'
import imageEarthBump from '@/assets/images/earth_bump.jpg'
import imageEarthSpec from '@/assets/images/earth_spec.png'
import imageEarthCloud from '@/assets/images/earth_cloud.png'
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

    this._init()
  }

  _init () {
    this._createCamera()
    this._createScene()
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
    this.camera = new THREE.PerspectiveCamera(54, WIDTH / HEIGHT, 0.01, 1000)
    this.camera.position.z = 2
  }

  _createLight () {
    let directionalLight = new THREE.DirectionalLight(this.options.DirectionalLight, 1)
    let ambientLight = new THREE.AmbientLight(this.options.ambientLight, 0.5)
    let spotLight = new THREE.SpotLight(0xffffff, 1.2)

    directionalLight.position.set(-50, 20, 10)

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

    this.scene.add(directionalLight)
    this.scene.add(ambientLight)
    // this.scene.add(spotLight)
  }

  _createScene () {
    this.scene = new THREE.Scene()
  }

  _createEarth () {
    let material = new THREE.MeshPhongMaterial({
      map: loader.load(imageEarth4),
      bumpMap: loader.load(imageEarthBump),
      bumpScale: 0.005,
      specularMap: loader.load(imageEarthSpec),
      specular: new THREE.Color('#909090'),
      shininess: 5,
      transparent: true
    })
    let sphere = new THREE.SphereGeometry(0.5, 32, 32)
    let earth = new THREE.Mesh(sphere, material)

    this.earth = earth
    this.scene.add(earth)
  }

  _createCloud () {
    let sphere = new THREE.SphereGeometry(0.52, 32, 32)
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
    let renderer = new THREE.WebGLRenderer({alpha: true})
    let container = this.container

    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(WIDTH, HEIGHT)
    renderer.domElement.style.position = 'relative'
    container.appendChild(renderer.domElement)
    this.renderer = renderer
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))
    this.controller.update()
    this._render()
  }

  _render () {
    this.earth.rotation.y += 0.001
    this.cloud.rotation.y += 0.0005
    this.renderer.render(this.scene, this.camera)
  }

  _bindEvents () {
    window.addEventListener('resize', this._resize.bind(this))
  }

  _resize () {
    /* let camera = this.camera
    let renderer = this.renderer
    // windowHalfX = window.innerWidth / 2
    // windowHalfY = window.innerHeight / 2
    camera.aspect = WIDTH / HEIGHT
    camera.updateProjectionMatrix()
    renderer.setSize(WIDTH, HEIGHT) */
  }

  _start () {}
  _move () {}
  _end () {}

  start () {}
  stop () {}
  zoomIn () {}
  zoomOut () {}
  rotate () {}
}
