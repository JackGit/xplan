import { Mesh, SphereGeometry, MeshPhongMaterial, Color, LineSegments, WireframeGeometry } from 'three'
import { getTexture, latlng2Xyz } from '@/assets/js/utils'

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

export function createSphere (r) {
  const geometry = new SphereGeometry(r, 8, 8)
  const wireframe = new WireframeGeometry(geometry)
  const line = new LineSegments(wireframe)
  line.material.depthTest = false
  line.material.transparent = true
  return line
}

export function createBeijing () {
  const sphere = createSphere(0.1)
  const { x, y, z } = latlng2Xyz(40.13, 117.10, 5)
  sphere.position.x = x
  sphere.position.y = y
  sphere.position.z = z
  return sphere
}
