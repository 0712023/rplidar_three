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

- Three.js
- Node-RED
- MQTT

## 3. Big Picture

## 4. Project Details

## 5. Demo Video

![](https://i.imgur.com/SFWIYoN.gif)

## 6. Research Prospects

## 7. Review

Main Source Code <br>
[/raspberrypi_lidar_sensor/rplidar_mqtt_publish.py](https://github.com/0712023/rplidar_three/blob/main/raspberrypi_lidar_sensor/rplidar_mqtt_publish.py) <br>
[/3D_modeling_vue_cli/src/views/3D_Modeling.vue](https://github.com/0712023/rplidar_three/blob/main/3D_modeling_vue_cli/src/views/3D_Modeling.vue) <br>
