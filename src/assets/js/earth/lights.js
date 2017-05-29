import { AmbientLight, SpotLight, DirectionalLight } from 'three'

export function createAmbientLight () {
  return new AmbientLight(0x393939, 0.5)
}

export function createSpotLight () {
  let spotLight = new SpotLight(0xffffff, 1.2)
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
  return spotLight
}

export function createDirectionalLight () {
  let light = new DirectionalLight(0xffffff, 1)
  light.position.set(5, 3, 5)
  return light
}
