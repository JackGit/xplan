import { Mesh, SphereGeometry, MeshPhongMaterial, Color } from 'three'
import { getTexture } from '@/assets/js/utils'

export function createEarth () {
  return new Mesh(
    new SphereGeometry(5, 32, 32),
    new MeshPhongMaterial({
      map: getTexture('earth'),
      bumpMap: getTexture('earthBump'),
      bumpScale: 0.15,
      specularMap: getTexture('earthSpec'),
      specular: new Color('#909090'),
      shininess: 5,
      transparent: true
    })
  )
}
