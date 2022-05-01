import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/8.png')

/**
 * Fonts
 */
const fontLoader = new FontLoader()

// Material
const materialEn = new THREE.MeshMatcapMaterial({ 
    matcap: matcapTexture,
    transparent: true
})

const materialCh = new THREE.MeshMatcapMaterial({ 
    matcap: matcapTexture,
    transparent: true
})

fontLoader.load(
    '/fonts/FangSong_Regular.json',
    (font) =>
    {
        

        // Text
        //English
        const textGeometryEn = new TextGeometry(
            'epiphany\nvicissitude\neuphoria\nserendipity\nethereal\npetrichor\niridescent\nEureka\nbenevolence\noblivion\naurora',
            {
                font: font,
                size: 0.7,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.003,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometryEn.center()
        const textEn = new THREE.Mesh(textGeometryEn, materialEn)
        textEn.position.set(-4, 0, 0)
        scene.add(textEn)

        //Chinese
        const textGeometryCh = new TextGeometry(
            'n.顿悟\nn.沧海桑田\nn.极度兴奋\nn.机缘巧合\nadj.超凡脱俗的\nadj.雨后的泥土味\nadj.色彩斑斓的\nInt.我发现了\nn.仁慈\nn.忘却\nn.极光',
            {
                font: font,
                size: 0.7,
                height: 0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.003,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        const textCh = new THREE.Mesh(textGeometryCh, materialCh)
        textCh.position.set(0, 4.8, 0)
        scene.add(textCh)

        
    }
)

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 10000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for(let i = 0; i < count * 3; i++){
    positions[i] =( Math.random() - .5) * 40
    colors[i] = Math.random()
}


particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: .01,
    color: 0xff88cc,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.y = - 1
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate
    camera.position.x = Math.sin(elapsedTime * 1) * 4
    camera.position.z = 10 + Math.sin(elapsedTime * 1) * 0.03
    materialCh.opacity = (camera.position.x * 0.25 + 1) * 0.5
    materialEn.opacity = 1 - materialCh.opacity

    particles.position.y = Math.sin(elapsedTime * 0.02) * 4
    particles.position.x = Math.sin(elapsedTime * 0.02) * 4

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()