import { Mesh, SphereGeometry, MeshPhongMaterial, AdditiveBlending } from 'three'
import { getTexture } from '@/assets/js/utils'

export function createCloud () {
  return new Mesh(
    new SphereGeometry(5.2, 40, 40),
    new MeshPhongMaterial({
      map: getTexture('earthCloud'),
      transparent: true,
      opacity: 1,
      blending: AdditiveBlending
    })
  )
}
