const THREE = require('three')
const OrbitControls = require('three-orbit-controls')(THREE)
const EffectComposer = require('three-effectcomposer')(THREE)

import * as Glow from './glow'
import { createAmbientLight, createSpotLight } from './lights'
import { createEarth } from './earth'
import { createCloud } from './cloud'
import { createLocationSprite } from './locations'
import { PAGE_WIDTH, PAGE_HEIGHT, LOCATIONS } from '@/assets/js/constants'

const WIDTH = PAGE_WIDTH
const HEIGHT = PAGE_HEIGHT

export default class Earth {
  constructor (el, options) {
    this.container = typeof el === 'string' ? document.getElementById(el) : el

    this.width = WIDTH * 2
    this.height = HEIGHT * 2
    this.camera = null
    this.renderer = null
    this.controller = null

    this.scene = null
    this.earthGroup = null
    this.locationGroup = null
    this.cloud = null
    this.hasGlow = false

    this.autoRotate = true
    this.rotationSpeed = 0.001
    this.cloudSpeed = -0.0003

    this._init()
  }

  _init () {
    this._createRenderer()
    this._createScene()
    this._createCamera()
    this._createLight()
    this._createEarth()
    this._createCloud()
    this._createLocations()
    this._createOutGlow()
    this._createController()

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
    let camera = new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 1000)
    // camera.position.set(0, 0, -28)
    camera.position.set(3.55, 0, -328)
    this.scene.add(camera) // this is required cause there is a light under camera
    this.camera = camera
  }

  _createLight () {
    this.scene.add(createAmbientLight())
    this.camera.add(createSpotLight())  // fixed light direction by adding it as child of camera
  }

  _createScene () {
    this.scene = new THREE.Scene()
    this.earthGroup = new THREE.Group()
    this.locationGroup = new THREE.Group()

    this.scene.add(this.earthGroup)
    this.earthGroup.add(this.locationGroup)
  }

  _createEarth () {
    let earth = createEarth()
    this.earthGroup.add(earth)
  }

  _createCloud () {
    let cloud = createCloud()
    this.earthGroup.add(cloud)
    this.cloud = cloud
  }

  _createLocations () {
    LOCATIONS.forEach(location => {
      let sprite = createLocationSprite(location)
      this.locationGroup.add(sprite)
    })
  }

  _createRenderer () {
    let renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    })
    let container = this.container

    renderer.setClearColor(0x000000, 0)
    // renderer.setPixelRatio(window.devicePixelRatio) // this line would make FPS decreased at 30 for mobile device
    renderer.setSize(this.width, this.height)
    renderer.domElement.style.position = 'relative'
    renderer.domElement.style.width = this.width / 2 + 'px'
    renderer.domElement.style.height = this.height / 2 + 'px'
    container.appendChild(renderer.domElement)
    this.renderer = renderer
  }

  _createOutGlow () {
    this.blurScene = new THREE.Scene()
    this.glowGroup = Glow.createOuterGlow()
    this.blurScene.add(this.glowGroup)

    let blurRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: true
    })

    let blurRenderPass = new EffectComposer.RenderPass(this.blurScene, this.camera)
    let sceneRenderPass = new EffectComposer.RenderPass(this.scene, this.camera)

    this.blurComposer = new EffectComposer(this.renderer, blurRenderTarget)
    this.blurComposer.addPass(blurRenderPass)
    this.sceneComposer = new EffectComposer(this.renderer, blurRenderTarget)
    this.sceneComposer.addPass(sceneRenderPass)

    let effectBlend = new EffectComposer.ShaderPass(Glow.AdditiveBlendShader, 'tSampler1')
    effectBlend.uniforms['tSampler2'].value = this.blurComposer.renderTarget2.texture
    effectBlend.renderToScreen = true

    this.sceneComposer.addPass(effectBlend)
    this.hasGlow = true
  }

  _loop () {
    requestAnimationFrame(this._loop.bind(this))
    this._animate()
    this._render()
  }

  _animate () {
    let rotationSpeed = this.rotationSpeed
    let cloudSpeed = this.cloudSpeed

    if (this.autoRotate) {
      this.camera.position.x = this.camera.position.x * Math.cos(rotationSpeed) - this.camera.position.z * Math.sin(rotationSpeed)
      this.camera.position.z = this.camera.position.z * Math.cos(rotationSpeed) + this.camera.position.x * Math.sin(rotationSpeed)
    }

    this.cloud.rotation.y += cloudSpeed
    this.controller.update()
  }

  _render () {
    if (this.isStart && this.hasGlow) {
      this.blurComposer.render()
      this.sceneComposer.render()
    } else {
      this.renderer.render(this.scene, this.camera)
      this.isStart = true
    }
  }

  setCamera () {
    if (arguments.length === 3) {
      this.camera.position.set(arguments[0], arguments[1], arguments[2])
    } else {
      this.camera.position.set(arguments[0].x, arguments[0].y, arguments[0].z)
    }
  }

  cameraPosition () {
    return {
      x: this.camera.position.x,
      y: this.camera.position.y,
      z: this.camera.position.z
    }
  }

  startAutoRotate () {
    this.autoRotate = true
  }

  stopAutoRotate () {
    this.autoRotate = false
  }
}
