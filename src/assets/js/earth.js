import THREE from 'three'

export default class Earth {
  constructor (el, options) {
    let defaultOptions = {
      directionalLight: 0xffffff,
      ambientLight: 0x101010,
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

    this._init()
  }

  _init () {
    this._createCamera()
    this._createScene()
    this._createLight()
    this._createEarch()
    this._createCloud()
    this._createLabels()
    this._createRenderer()

    this._bindEvents()
    this._loop()
  }

  _createCamera () {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000)
    this.camera.position.z = 1.5
  }

  _createLight () {
    let light = new THREE.DirectionalLight(this.options.DirectionalLight, 1)
    light.position.set(5, 3, 5)
    this.scene.add(light)
    this.scene.add(new THREE.AmbientLight(this.options.ambientLight))
  }

  _createScene () {
    this.scene = new THREE.Scene()
  }

  _createEarth () {
    let loader = new THREE.TextureLoader()
		let material = new THREE.MeshPhongMaterial({
      map: loader.load('textures/earth/earth4.jpg'),
		  bumpMap: loader.load('textures/earth/earth_bump.jpg'),
			bumpScale: 0.005,
			specularMap: loader.load('textures/earth/earth_spec.jpg'),
			specular: new THREE.Color('grey'),
			overdraw: 0.7
		})
		let sphere = new THREE.SphereGeometry(0.5, 32, 32)
		group.add(new THREE.Mesh(sphere, material))
  }

  _createCloud () {
    let sphere = new THREE.SphereGeometry(0.503, 32, 32)
    let material = new THREE.MeshPhongMaterial({
      map: loader.load('textures/earth/earth_cloud.png'),
      transparent: true
    })
    group.add(new THREE.Mesh(sphere, material))
  }

  _createLabels () {
    this.options.labels.forEach(label => {
      let sprite = this._createSprite(label)
      this.group.add(sprite)
    })
  }

  _createSprite (label) {
    let spriteMaterial = new THREE.SpriteMaterial({
			map: loader.load('textures/earth/i_namibia.png'),
			color: 0xffffff,
			fog: true
		})
		let sprite = new THREE.Sprite(spriteMaterial)
		sprite.position.set(0.5, 0.3, 0);
		sprite.scale.set(.1, .1, .1)
  }

  _createRenderer () {
    let renderer = new THREE.WebGLRenderer()
    let container = this.container

	  renderer.setClearColor(0xffffff)
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.domElement.style.position = 'relative'
		container.appendChild(renderer.domElement)
    this.renderer = renderer
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))
		this._render()
  }

  _render () {
    this.group.rotation.y -= 0.005
		this.renderer.render(this.scene, this.camera)
  }

  _bindEvents () {
    let camera = this.camera
    let renderer = this.renderer

    window.addEventListener('resize', this._resize.bind(this))
  }

  _resize () {
    windowHalfX = window.innerWidth / 2
    windowHalfY = window.innerHeight / 2
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
  }

  _start () {

  }

  _move () {

  }

  _end () {

  }
}
