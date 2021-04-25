# RpLidar 3D Modeling

## Keywords

RpLidar, three.js, MQTT

## Contents

## 1. Project Synopsis

- 행사명 : 엔코아 플레이데이터 최종 프로젝트 발표회
- 주최 : 엔코아 플레이데이터
- 진행 기간 : '21.4.1 ~ '21.4.26
- 목적 : ROS기반 자율주행 및 AIoT연계 공간 공기 살균 및 청정 로봇 개발 프로젝트의 일부분인 lidar sensor 통신 프로토콜을 연구하고, sensor로부터 수집된 데이터를 분석하여 이를 3D 환경에서 rendering하는 것을 목적으로 하였습니다.
- 내용 : Raspberry pi 3B+ 디바이스에 RpLidar sensor를 연결하여 UART 통신을 통해 실시간으로 데이터를 수집했습니다. 수집된 데이터는 MQTT 통신을 통해 특정 topic으로 데이터를 server로 실시간으로 전달했습니다. 전달받은 데이터를 통해 서버에서는 three.js라는 javascript library를 활용하여 3D 환경에서 rendering할 수 있습니다. 이러한 실시간 3D 환경 rendering함으로써 자율주행 로봇이 특정 위치로 이동할 때에 장애물과 로봇의 거리를 실시간으로 파악할 수 있으며, path finding 도중 발생할 수 있는 장애물과의 충돌을 방지할 수 있다는 역할을 할 수 있을 것으로 기대됩니다. 또한, 자율주행 로봇의 supervisor 등이 user experience 측면에서 모니터를 통해 현재 로봇의 상태 및 위치 등을 손쉽게 파악할 수 있을 것으로 기대됩니다.

## 2. Tools

### Platform

- Raspberry pi 3B+
- Desktop

### Sensor

- RPLIDAR A2M8

### Software

- Vue Cli
- Three.js
- Node-RED
- MQTT

## 3. Big Picture

<img src="https://i.imgur.com/Kzi8eaS.png">

## 4. Project Details

### 1) RPLIDAR A2M8

### **Theory**
Slamtec에서 개발한 Lidar Sensor인 RPLIDAR는 A 시리즈와 S 시리즈가 있습니다. 두 시리즈의 가장 큰 차이점은 측정 원리입니다. A 시리즈는 triangulation 원리를 사용하였고, S 시리즈는 TOF 원리를 사용했습니다. 각각을 간단히 설명하자면 먼저 triangulation 원리란, device에서 방출한 laser는 물체와 충돌 후 반사되는 신호를 선형 CCD가 감지합니다. 물체에서 반사된 laser가 CCD에 측정된 위치의 차이를 이용하여 device와 물체와의 거리를 계산하는 원리입니다. <br>
<p align="center"><img src="https://blog.seeedstudio.com/wp-content/uploads/2019/08/image-29-768x967.png" width="50%"></p>
TOF 원리란, triangulation와 마찬가지로 laser를 방출하는데, 이 laser가 물체에 도달한 후 반사되어 receiver로 되돌아오는 시간을 측정하여 물체와의 거리를 계산하는 원리입니다. 
<p align="center"><img src="https://blog.seeedstudio.com/wp-content/uploads/2019/08/image-32-768x246.png" width="80%"></p>
그로 인해 TOF 원리가 더 먼 거리를 측정할 수 있다는 장점이 있고, 실제로 현업에서는 대부분 TOF 원리를 사용하는 lidar sensor를 활용하고 있습니다.
<br><br>
RPLIDAR A2M8은 실내 로봇 SLAM(Simultaneous Localization And Mapping) 분야에 주로 쓰이는 센서입니다. 비교적 가격이 저렴하다는 장점과 함께, 이 센서로부터 생성된 2D 데이터들을 활용하여 mapping, localization, 그리고 environment modeling을 하는데 충분하기 때문입니다.
<br><br>
Slantec에서 제공하는 Lidar sensor의 종류와 performance는 다음 표와 같습니다.
<p align="center"><img src="https://i.imgur.com/DM2K5Xm.png"></p>

출처 : <a href='https://www.seeedstudio.com/blog/2019/08/05/all-you-need-to-know-about-slamtec-rplidar-mapper-and-slamware/'>seeedstudio</a>

### **Application**

이번 프로젝트에 사용한 RPLIDAR A2M8의 구체적인 performance는 다음 표와 같습니다.
<p align="center"><img src="https://blog.seeedstudio.com/wp-content/uploads/2019/08/image-21-1030x807.png" width="70%"></p>

RPLIDAR 센서를 활용하기 위해 *adafruit_rplidar*라는 Python library를 사용했습니다. 이 라이브러리를 사용하여 센서를 작동 및 중지시킬 수 있었고, 10Hz의 속도로 360° 회전을 하며 얻은 물체와의 거리 데이터 array를 *process_data*라는 함수로 전달하는 loop를 생성하였습니다.
```python
try:
    for scan in lidar.iter_scans():
        for (_, angle, distance) in scan:
            scan_data[min([359, floor(angle)])] = distance
        process_data(scan_data)
except KeyboardInterrupt:
    print('Stoping.')
```

이 데이터를 server로 전달하기 위해 mqtt를 활용하여 'rplidar_1' topic으로 array format의 string으로 변환하여 publish하였습니다.
```python
def process_data(data):
    client.publish('rplidar_1', '['+','.join(str(e) for e in data)+']')
    pass
```

이 코드는 platform에 구애받지 않지만 이번 프로젝트에서 raspberry pi 디바이스 상에서 mqtt 무선통신을 이용하여 데이터를 server로 전달했습니다. 그 이유는 센서가 활용되는 endpoint는 자율주행 로봇이라고 가정했기 때문입니다. 자율주행 로봇은 한정된 물리적 공간 및 전원 자원을 이용하기 때문에 소형 싱글보드 컴퓨터인 raspberry pi를 이용하는 것이 필수였습니다.

### 2) THREE with Vue

THREE.js는 WebGL renderer를 이용한 3D cross-browser javascript library입니다. THREE.js를 이용하여 도형, 선, 면 등 다양한 기하를 3D 공간에 그릴 수 있습니다. 이번 프로젝트에서 이 THREE.js를 활용하여 RPLDIAR 센서로부터 전달받은 데이터를 3D 공간에 그리는 것이 목표였습니다. 더 나아가, 단순히 html body에 그리는 것이 아닌 오픈소스 MVVM front-end javascript frameworkd인 Vue를 활용하여 더 웹사이트 환경을 구성하려고 노력했습니다. 구체적으로 Vue Cli를 활용하여 사용자가 직접 센서를 선택하고, 특정 mqtt topic을 구독하며, 다양한 센서들을 관리할 수 있는 페이지를 제작했습니다.

3D modeling이 이루어지는 *3D_Modeling.vue*에서 주요하게 사용되는 method는 대표적으로 *add_curve(data)*가 있습니다.
```js
add_curve(data) {
    this.scene = this.init_scene.clone();
    let coordinate_data = [];
    //convert distance data of 360 degrees to coordinate data which is (x, y);
    for(let i = 1; i <= data.length ; i++){
        if(data[i-1] < 10) continue;
        coordinate_data.push(new THREE.Vector2(data[i-1]*Math.cos(i*Math.PI/180)/10, data[i-1]*Math.sin(i*Math.PI/180)/10))
    }
    let curve = new THREE.SplineCurve(coordinate_data);
    let points = curve.getPoints(coordinate_data.length);
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    let material = new THREE.LineBasicMaterial( { color : 0x87ceeb, linewidth : 10 } );
    let splineObject = new THREE.Line( geometry, material );
    splineObject.rotation.x = Math.PI/2;
    this.scene.add(splineObject);
}
```

이 method는 현재 선택한 센서로부터 mqtt를 통해 데이터가 전달될 때마다 실행됩니다. 새로운 데이터가 도착하여 이 method가 실행되면 가장 먼저 scene을 초기화합니다. 이 때 초기화하는 scene은 init_scene으로, x, y, z축이 포함된 scene입니다. 그렇게 함으로써 새로이 curve를 그리더라도 x, y, z축은 변하지 않는 것처럼 보이기 때문입니다. 이후, 1°마다 물체와의 거리를 담은 360 크기의 데이터 array를 각각 삼각함수를 이용하여 2차원 평면의 x, y 좌표를 계산합니다. 변환된 데이터 array를 curve를 그려주는 *SplineCurve*에 넣어 scene에 추가해줍니다.

이 외에도, 카메라 위치 기억, axis 그리기, 화면 resize에 반응, 페이지 전환시 element 제거, 동적 mqtt topic subscribe, modal을 이용한 센서 추가, 센서 info 및 health 상태 표시, Vuex Store를 이용한 전역 데이터 및 함수 처리 등 다양한 기능을 이용하여 프로젝트를 완성했습니다.

### 3) Node-RED

Node-RED는 Nodejs기반 server side 개발 도구입니다. 다양한 노드들을 연결하여 flow 형태로 프로그래밍을 할 수 있다는 장점이 있습니다.
<br><br>
저는 이번 프로젝트에서 Node-RED는 단순히 MQTT broker만을 위해 이용했습니다.

## 5. Demo Video

![](https://i.imgur.com/SFWIYoN.gif)

## 6. Review
우선 데이터를 매우 빠른 속도로 mqtt 무선 통신으로 전달하고, 또 전달받은 데이터를 곧바로 3D로 그려야 했기 때문에 과연 메모리가 버텨줄지, 또는 작업 환경에 병목 현상이 일어나지 않을까 걱정이 되었습니다. 다행히 해당 문제는 발생하지 않았고, 실시간으로 3D modeling이 이루어졌습니다. 이번 프로젝트를 통해 먼저 vue와 three.js를 연결하여 작업하며 front-end 프로그래밍 실력에 큰 성장을 할 수 있었습니다. 다음으로, 혼자 약 한 달여 프로젝트를 진행하며, 팀으로서 프로젝트에 참여할 때와는 다른 경험을 할 수 있었습니다. 팀 프로젝트에서는 팀장 또는 팀원들과 소통하며 미처 본인이 고려하지 못한 부분이나, 생각하지 못했던 아이디어들을 얻는 것이 큰 장점이라면, 혼자 프로젝트를 진행할 경우 이 프로젝트의 전체적인 방향성을 스스로 결정하고 한계점 및 목표 달성 가능성을 철저히 분석해야 하는 책임감이 중요하다는 것을 배울 수 있었습니다.