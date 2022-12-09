# cesium-with-threejs

将Cesium与ThreeJs集成的样例。

* cesium 1.95.0
* three 0.147.0

参考并修改自[cesium-threejs-experiment](https://github.com/CesiumGS/cesium-threejs-experiment)

## 升级记录

* Cesium 升级到 1.95.0
* threejs 升级到 0.147.0，Cesium 升级到 1.90.0
* threejs 从 0.96.0 升级到 0.128.0
* threejs 从 0.95.0 升级到 0.96.0

    缺少灯光的话将无法显示，场景需要加入灯光
  
    ```js
    const Amlight = new AmbientLight(0xffffff, 2)
    three.scene.add(Amlight)
    ThreeContainer.appendChild(three.renderer.domElement)
    ```

* threejs 从 0.88.0 升级到 0.95.0
* threejs 从 0.87.1 升级到 0.88.0

    lookAt 函数签名有变化
  
    ```js
    _3Dobjects[id].threeMesh.lookAt(centerHigh)
    ```

    修改为

    ```js
   _3Dobjects[id].threeMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z)
    ```

* cesium 从 1.45.0 升级到 1.81.0，threejs 为 0.87.1

## 参考引用

* [cesium-threejs-experiment](https://github.com/CesiumGS/cesium-threejs-experiment)
