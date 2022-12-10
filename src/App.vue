<template>
  <div id="app">
    <div id="cesiumContainer"></div>
    <div id="ThreeContainer"></div>
    <div id="cover">
      <div
        id="loadingIndicator"
        class="loadingIndicator"
      ></div>
    </div>
  </div>
</template>

<script>
import {
  VERSION as CesiumVersion,
  Cartesian3 as CesiumCartesian3,
  Viewer as CesiumViewer,
  ShadowMode as CesiumShadowMode,
  Color as CesiumColor,
  Math as CesiumMath,
  TileMapServiceImageryProvider as CesiumTileMapServiceImageryProvider,
  buildModuleUrl as CesiumBuildModuleUrl
} from '@/thirdparty/Cesium/Cesium.js'

// 使用到的 ThreeJs模块
import {
  REVISION as ThreeVersion,
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  // Vector2,
  Vector3,
  MeshNormalMaterial,
  // LatheGeometry,
  BoxGeometry,
  Mesh,
  Group,
  AmbientLight,
  DoubleSide,
  AxesHelper
} from '@/thirdparty/Three/Three.js'

import { GLTFLoader } from '@/thirdparty/ThreeExamples/loaders/GLTFLoader.js'

export default {
  name: 'App',
  mounted() {
    function main() {
      const loadingIndicator = document.getElementById('loadingIndicator')
      loadingIndicator.style.display = 'none'

      // boundaries in WGS84 around the object
      let minWGS84 = [115.23, 39.55]
      let maxWGS84 = [116.23, 41.55]
      const cesiumContainer = document.getElementById('cesiumContainer')
      const ThreeContainer = document.getElementById('ThreeContainer')

      const _3Dobjects = [] // Could be any Three.js object mesh
      const three = {
        renderer: null,
        camera: null,
        scene: null
      }

      const cesium = {
        viewer: null
      }

      function _3DObject() {
        // THREEJS 3DObject.mesh
        this.threeMesh = null
        // location bounding box
        this.minWGS84 = null
        this.maxWGS84 = null
      }

      function initCesium() {
        cesium.viewer = new CesiumViewer(cesiumContainer, {
          useDefaultRenderLoop: false,
          selectionIndicator: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          infoBox: false,
          navigationInstructionsInitiallyVisible: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          allowTextureFilterAnisotropic: false,
          contextOptions: {
            webgl: {
              alpha: false,
              antialias: true,
              preserveDrawingBuffer: true,
              failIfMajorPerformanceCaveat: false,
              depth: true,
              stencil: false,
              anialias: false
            }
          },
          targetFrameRate: 60,
          resolutionScale: 0.1,
          orderIndependentTranslucency: true,
          // imageryProvider: null,
          imageryProvider: new CesiumTileMapServiceImageryProvider({
            url: CesiumBuildModuleUrl('Assets/Textures/NaturalEarthII') // 离线模式的图层
          }),
          baseLayerPicker: false,
          geocoder: false,
          automaticallyTrackDataSourceClocks: false,
          dataSources: null,
          clock: null,
          terrainShadows: CesiumShadowMode.DISABLED
        })

        // 开启或关闭地下模式
        cesium.viewer.scene.screenSpaceCameraController.enableCollisionDetection = true
        cesium.viewer.scene.globe.translucency.frontFaceAlpha = 0.8 // 设置透明度

        const center = CesiumCartesian3.fromDegrees(
          (minWGS84[0] + maxWGS84[0]) / 2,
          (minWGS84[1] + maxWGS84[1]) / 2 - 1,
          200000
        )
        cesium.viewer.camera.flyTo({
          destination: center,
          orientation: {
            heading: CesiumMath.toRadians(0),
            pitch: CesiumMath.toRadians(-60),
            roll: CesiumMath.toRadians(0)
          },
          duration: 1
        })

        // Cesium entity
        const entity = {
          name: 'Polygon',
          polygon: {
            hierarchy: CesiumCartesian3.fromDegreesArray([
              minWGS84[0], minWGS84[1],
              maxWGS84[0], minWGS84[1],
              maxWGS84[0], maxWGS84[1],
              minWGS84[0], maxWGS84[1]
            ]),
            material: CesiumColor.RED.withAlpha(0.2)
          }
        }
        cesium.viewer.entities.add(entity)
      }

      function initThree(callback) {
        const fov = 45
        const width = window.innerWidth
        const height = window.innerHeight
        const aspect = width / height
        const near = 1
        const far = 10 * 1000 * 1000

        three.scene = new Scene()
        three.camera = new PerspectiveCamera(fov, aspect, near, far)
        three.renderer = new WebGLRenderer({ alpha: true })
        const Amlight = new AmbientLight(0xffffff, 2)
        three.scene.add(Amlight)
        ThreeContainer.appendChild(three.renderer.domElement)

        const axesHelper = new AxesHelper(3000000000000)
        three.scene.add(axesHelper)

        init3DObject(function () {
          callback()
        }) // Initialize Three.js object mesh with Cesium Cartesian coordinate system
      }

      function init3DObject(callback) {
        // Three.js Objects
        const doubleSideMaterial = new MeshNormalMaterial({
          side: DoubleSide
        })
        const geometry = new BoxGeometry(1, 2, 4)
        const mesh = new Mesh(geometry, doubleSideMaterial)
        const scaleSize = 15000
        mesh.scale.set(scaleSize, scaleSize, scaleSize) // 放大物体，不然可能在地球表面看不见

        /**
         *  three的坐标系（右手坐标系），关键数据结构 Vector3
         *    Y
         *    |
         *    |___ X
         *   /
         * Z
         *
         * Cesium的坐标系，关键数据结构 Cartesian3
         *    Z
         *    |
         *    |__ Y
         *   /
         * X
         *
         */
        // 在three的坐标系空间里，先向Z轴平移模型，然后绕X轴向上翻转90度，物体就面向Y轴了，对应Cesiumn的Z轴
        // const up = 15000.0
        // mesh.position.z += up //  translate "up" in Three.js space so the "bottom" of the mesh is the handle
        // mesh.rotation.x = Math.PI / 2 // rotate mesh for Cesium's Y-up system

        // 将模型放入同一个组，然后对该组做一个整体的位置变换
        const meshYup = new Group()
        meshYup.add(mesh)
        three.scene.add(meshYup) // don’t forget to add it to the Three.js scene manually

        // Assign Three.js object mesh to our object array
        const _3DOB = new _3DObject()
        _3DOB.threeMesh = meshYup
        _3DOB.minWGS84 = minWGS84
        _3DOB.maxWGS84 = maxWGS84
        _3Dobjects.push(_3DOB)

        const loader = new GLTFLoader().setPath('models/gltf/')
        loader.load('example.glb', function (gltf) {
          const scaleSize = 150000
          gltf.scene.scale.set(scaleSize, scaleSize, scaleSize)
          gltf.scene.position.z += 15000.0
          gltf.scene.rotation.x = Math.PI / 2

          const meshYup = new Group()
          meshYup.add(gltf.scene)
          three.scene.add(meshYup) // don’t forget to add it to the Three.js scene manually
          // Assign Three.js object mesh to our object array
          const _3DOB = new _3DObject()
          _3DOB.threeMesh = meshYup
          _3DOB.minWGS84 = minWGS84
          _3DOB.maxWGS84 = maxWGS84
          _3Dobjects.push(_3DOB)

          callback()
        })
      }

      // Looping Renderer
      function renderCesium() {
        cesium.viewer.render()
      }

      function renderThreeObj() {
        // register Three.js scene with Cesium
        three.camera.fov = CesiumMath.toDegrees(
          cesium.viewer.camera.frustum.fovy
        ) // ThreeJS FOV is vertical
        three.camera.updateProjectionMatrix()

        const cartToVec = function(cart) {
          return new Vector3(cart.x, cart.y, cart.z)
        }

        // Configure Three.js meshes to stand against globe center position up direction
        for (const id in _3Dobjects) {
          minWGS84 = _3Dobjects[id].minWGS84
          maxWGS84 = _3Dobjects[id].maxWGS84
          // convert lat/long center position to Cartesian3
          const center = CesiumCartesian3.fromDegrees(
            (minWGS84[0] + maxWGS84[0]) / 2,
            (minWGS84[1] + maxWGS84[1]) / 2
          )

          // get forward direction for orienting model
          const centerHigh = CesiumCartesian3.fromDegrees(
            (minWGS84[0] + maxWGS84[0]) / 2,
            (minWGS84[1] + maxWGS84[1]) / 2,
            1
          )

          // use direction from bottom left to top left as up-vector
          const bottomLeft = cartToVec(
            CesiumCartesian3.fromDegrees(minWGS84[0], minWGS84[1])
          )
          const topLeft = cartToVec(
            CesiumCartesian3.fromDegrees(minWGS84[0], maxWGS84[1])
          )
          const latDir = new Vector3().subVectors(bottomLeft, topLeft).normalize()

          // configure entity position and orientation
          _3Dobjects[id].threeMesh.position.copy(center)
          _3Dobjects[id].threeMesh.lookAt(
            centerHigh.x,
            centerHigh.y,
            centerHigh.z
          )
          _3Dobjects[id].threeMesh.up.copy(latDir)
        }

        // Clone Cesium Camera projection position so the
        // Three.js Object will appear to be at the same place as above the Cesium Globe
        three.camera.matrixAutoUpdate = false
        const cvm = cesium.viewer.camera.viewMatrix
        const civm = cesium.viewer.camera.inverseViewMatrix
        three.camera.lookAt(0, 0, 0)
        /* eslint-disable */
        three.camera.matrixWorld.set(
          civm[0], civm[4], civm[8],  civm[12],
          civm[1], civm[5], civm[9],  civm[13],
          civm[2], civm[6], civm[10], civm[14],
          civm[3], civm[7], civm[11], civm[15]
        )
        three.camera.matrixWorldInverse.set(
          cvm[0], cvm[4], cvm[8],  cvm[12],
          cvm[1], cvm[5], cvm[9],  cvm[13],
          cvm[2], cvm[6], cvm[10], cvm[14],
          cvm[3], cvm[7], cvm[11], cvm[15]
        )
        /* eslint-enable */
        const width = ThreeContainer.clientWidth
        const height = ThreeContainer.clientHeight
        const aspect = width / height
        three.camera.aspect = aspect
        three.camera.updateProjectionMatrix()
        three.renderer.setSize(width, height)
        three.renderer.clear()
        three.renderer.render(three.scene, three.camera)
      }

      function loop() {
        requestAnimationFrame(loop)
        renderCesium()
        renderThreeObj()
      }

      initCesium() // Initialize Cesium renderer
      initThree(function () {
        loop() // Looping renderer
      }) // Initialize Three.js renderer
    }
    console.info('Cesium : ' + CesiumVersion)
    console.info('ThreeJs : ' + ThreeVersion)
    main()
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  background: #000;
}

#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}

#ThreeContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
  pointer-events: none;
}

.fullWindow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}

.loadingIndicator {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -33px;
  margin-left: -33px;
  width: 66px;
  height: 66px;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url(./assets/ajax-loader.gif);
}
</style>
