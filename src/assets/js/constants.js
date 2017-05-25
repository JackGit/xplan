import imageEarth from '@/assets/images/earth4.jpg'
import imageEarthBump from '@/assets/images/earth_bump.jpg'
import imageEarthSpec from '@/assets/images/earth_spec.jpg'
import imageEarthCloud from '@/assets/images/earth_cloud.png'
import imageNamibia from '@/assets/images/i_namibia.png'
import imageMariana from '@/assets/images/i_mariana.png'
import imageGreenland from '@/assets/images/i_greenland.png'
import imageGalapagos from '@/assets/images/i_galapagos.png'
import imageAntarcica from '@/assets/images/i_antarctica.png'

export const PAGE_WIDTH = 375
export const PAGE_HEIGHT = 600

export const IMAGE_URLS = {
  earth: imageEarth,
  earthBump: imageEarthBump,
  earthSpec: imageEarthSpec,
  earthCloud: imageEarthCloud,
  iNambia: imageNamibia,
  iMariana: imageMariana,
  iGreenland: imageGreenland,
  iGalapagos: imageGalapagos,
  iAntarcica: imageAntarcica
}

export const LOCATIONS = [{
  name: 'namibia',
  coord: [-19.2, 14.11666667], // 19° 12' S, 13° 67' E
  position: [4.6, -1.29, -2.42],
  cameraPosition: [25.368540929334287, -6.819723575818188, -9.6916717580675],
  labelImage: IMAGE_URLS['iNambia'],
  coordSpriteIndex: 4,
  videoSprite: [2.80, 8.40],
  soundSprite: [0, 10.057142857142857]
}, {
  name: 'mariana',
  coord: [18.25, 142.81666667], // 17° 75' N, 142° 49' E
  position: [-4.390, 2.660, -2.410],
  cameraPosition: [-19.982976671844476, 13.228701213123163, -14.480404260462839],
  labelImage: IMAGE_URLS['iMariana'],
  coordSpriteIndex: 3,
  videoSprite: [10.80, 19.10],
  soundSprite: [24, 34.10938775510204]
}, {
  name: 'greenland',
  coord: [72.16666667, -43], // 71° 70' N, 42° 60' W
  position: [1.880, 5.09, 0.89],
  cameraPosition: [-0.39611171577911675, 0.16666877337906366, 27.99670189555551],
  labelImage: IMAGE_URLS['iGreenland'],
  coordSpriteIndex: 2,
  videoSprite: [40.20, 47.80],
  soundSprite: [48, 58.10938775510204]
}, {
  name: 'galapagos',
  coord: [1.33333333, -91.15], // 01° 20' N, 90° 69' W
  position: [0.550, 0.024, 5.39],
  cameraPosition: [-0.37281244673071273, 0.1666687733790265, 27.997021848752823],
  labelImage: IMAGE_URLS['iGalapagos'],
  coordSpriteIndex: 1,
  videoSprite: [22.00, 37.43],
  soundSprite: [12, 22.057142857142857]
}, {
  name: 'antarctica',
  coord: [-77.96666667, -155.63333333], // 77° 58' S, 155° 38' W
  position: [-1.32, -5.05, 0.98],
  cameraPosition: [-7.82702209455022, -26.806729459455603, 2.0339569363627636],
  labelImage: IMAGE_URLS['iAntarcica'],
  coordSpriteIndex: 0,
  videoSprite: [50.90, 69.00],
  soundSprite: [36, 46.05714285714286]
}]
