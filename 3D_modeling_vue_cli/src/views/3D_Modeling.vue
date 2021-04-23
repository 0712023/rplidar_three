<template>
  <div></div>
</template>

<script type="module">
import * as THREE from "../assets/three.module.js";
import * as OrbitControls from "../assets/OrbitControls.module.js";
import mqtt from '../assets/mqtt.min.js'
export default {
  data() {
    return {
      connection: {
        host: 'localhost',
        port: 8889,
        endpoint: '/mqtt',
        clean: true, // Reserved session
        connectTimeout: 4000, // Time out
        reconnectPeriod: 4000, // Reconnection interval
      },
      subscription: {
        topic: 'rplidar_1',
        qos: 0,
      },
      client: {connected: false},
      scene:null,
      camera:null,
      renderer:null,
      init_scene:null, //scene include X, Y, Z axis
      }
  },
  created() {
    //initialize scene
    this.scene = new THREE.Scene();

    //initialize renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    //initialize camera
    this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight, 1, 1000);
    this.camera.position.x = 250;
    this.camera.position.y = 250;
    this.camera.position.z = 250;

    //resize event callback
    window.addEventListener("resize", this.resize);

    //camera control
    new OrbitControls.OrbitControls(this.camera, this.renderer.domElement);

    //X, Y, Z Axis
		this.draw_line(1000, 0, 0, 0xff0000);
		this.draw_line(0, 1000, 0, 0x00ff00);
		this.draw_line(0, 0, 1000, 0x0000ff);
		this.init_scene = this.scene.clone();
    
    //render over screen
    document.body.appendChild(this.renderer.domElement);

    //initiate loop
    this.animate();

    //connect mqtt
    this.create_connection();
  },
  destroyed() {
    //remove element when destroy to save memory
    document.body.removeChild(this.renderer.domElement);
  },
  methods:{
    create_connection() {
      const { host, port, endpoint, ...options } = this.connection;
      const connectUrl = `mqtt://${host}:${port}`;
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.log('mqtt.connect error', error);
        alert(error);
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!');
        //subscribe topic when connection succeeded
        this.do_subscribe();
      })
      this.client.on('error', error => {
        console.log('Connection failed', error);
        alert(error);
      })
      this.client.on('message', (topic, message) => {
        let data = JSON.parse(`${message}`);
        //remove old data and draw new data
        this.scene = this.init_scene.clone();
        this.add_curve(data);
      })
    },
    do_subscribe() {
        const { topic, qos } = this.subscription;
        this.client.subscribe(topic, { qos });
    },
    draw_line(x, y, z, color) {
			let material = new THREE.LineBasicMaterial({color: color});
			let points = [];
			points.push(new THREE.Vector3(x, y, z));
			points.push(new THREE.Vector3(0, 0, 0));
      let geometry = new THREE.BufferGeometry().setFromPoints(points);
      let axis = new THREE.Line(geometry, material)
			this.scene.add(axis);
    },
    add_curve(data) {
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
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    resize() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
  }
};
</script>