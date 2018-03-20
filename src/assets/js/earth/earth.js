import { Mesh, SphereGeometry, MeshPhongMaterial, Color, LineSegments, WireframeGeometry } from 'three'
import { getTexture } from '@/assets/js/utils'

export function createEarth (wireframe = false) {
  if (wireframe) {
    return createWireFrameEarth()
  } else {
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
}

export function createWireFrameEarth () {
  const geometry = new SphereGeometry(5, 32, 32)
  const wireframe = new WireframeGeometry(geometry)
  const line = new LineSegments(wireframe)

  line.material.depthTest = false
  line.material.opacity = 0.25
  line.material.transparent = true

  return line
}
