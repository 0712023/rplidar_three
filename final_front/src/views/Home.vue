<template>
  <div>
    <div id="area"></div>
  </div>
</template>

<script type="module">
import * as THREE from "../assets/three.module.js";
import * as OrbitControls from "../assets/OrbitControls.module.js";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "../assets/three.MeshLine.js"
import mqtt from '../assets/mqtt.min.js'
export default {
  data:function(){
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
        topic: 'test',
        qos: 0,
      },
      client: {connected: false},
      scene:null,
      init_scene:null,
      camera:null,
      renderer:null,
      origin:0,
      sphere:null,
      }
  },
  created: function () {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45,window.innerWidth / window.innerHeight,1,1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.position.x = 250;
    this.camera.position.y = 250;
    this.camera.position.z = 250;
    window.addEventListener("resize", this.resize);
    new OrbitControls.OrbitControls(this.camera, this.renderer.domElement);

    //X, Y, Z Axis
		this.drawLine(1000, this.origin, this.origin, 0xff0000);
		this.drawLine(this.origin, 1000, this.origin, 0x00ff00);
		this.drawLine(this.origin, this.origin, 1000, 0x0000ff);
		this.init_scene = this.scene.clone();
    const geometry = new THREE.SphereGeometry( 1, 32, 32 );
		const material = new THREE.MeshBasicMaterial( {color: 0x87CEFA, wireframe: false });
		this.sphere = new THREE.Mesh( geometry, material );
    
    document.body.appendChild(this.renderer.domElement);
    this.animate();
    this.createConnection();
  },
  destroyed:function(){
    document.body.removeChild(this.renderer.domElement);
  },
  methods:{
    createConnection:function() {
      const { host, port, endpoint, ...options } = this.connection;
      const connectUrl = `mqtt://${host}:${port}`;
      try {
        this.client = mqtt.connect(connectUrl, options);
      } catch (error) {
        console.log('mqtt.connect error', error);
      }
      this.client.on('connect', () => {
        console.log('Connection succeeded!');
        this.doSubscribe();
      })
      this.client.on('error', error => {
        console.log('Connection failed', error);
      })
      this.client.on('message', (topic, message) => {
        let data = JSON.parse(`${message}`);
        this.scene = this.init_scene.clone();
        this.draw(data);
      })
    },
    doSubscribe:function() {
        const { topic, qos } = this.subscription
        this.client.subscribe(topic, { qos })
    },
    add_curve:function(data){
      let curve_data = [];
      for(let i = 1; i <= data.length ; i++){
        if(data[i-1] < 10) continue;
        curve_data.push(new THREE.Vector2(data[i-1]*Math.cos(i*Math.PI/180)/10, data[i-1]*Math.sin(i*Math.PI/180)/10))
      }
      let curve = new THREE.SplineCurve(curve_data);
      let points = curve.getPoints(curve_data.length);
      let geometry = new THREE.BufferGeometry().setFromPoints( points );
		  let material = new THREE.LineBasicMaterial( { color : 0x87ceeb, linewidth : 10 } );
      let splineObject = new THREE.Line( geometry, material );
      splineObject.rotation.x = Math.PI/2;
      this.scene.add(splineObject);
    },
    add_sphere:function(x, y, sphere){
			sphere.position.set(x, 0, y);
			this.scene.add( sphere );
		},
    draw:function(data){
			// for(let i = 1; i <= data.length ; i++){
			// 	this.add_sphere(data[i-1]*Math.cos(i*Math.PI/180), data[i-1]*Math.sin(i*Math.PI/180), this.sphere.clone());
			// }
      // let coor = [];
      // for(let i = 0; i < data.length ; i++){
      //   coor.push({'x':data[i]*Math.cos(i*Math.PI/180), 'y':data[i]*Math.sin(i*Math.PI/180)})
      // }
      // for(let i = 1; i <= data.length ; i++){
			// 	if(data[i-1] == 0) continue;
			// 	// let x = data[i-1]*Math.cos(i*Math.PI/180);
			// 	// let y = data[i-1]*Math.sin(i*Math.PI/180);
			// 	// this.drawPlane((data[i]+data[i-1])*Math.PI/360, i, x, y)
			// 	this.add_sphere(data[i-1]*Math.cos(i*Math.PI/180), data[i-1]*Math.sin(i*Math.PI/180), this.sphere.clone());
			// }
      this.add_curve(data);
		},
    drawLine:function (x, y, z, Color){
			let material = new THREE.LineBasicMaterial({color: Color});
			let points = [];
			points.push(new THREE.Vector3(x, y, z));
			points.push(new THREE.Vector3(this.origin, this.origin, this.origin));
      let geometry = new THREE.BufferGeometry().setFromPoints(points);
      let axis = new THREE.Line(geometry, material)
			this.scene.add(axis);
    },
    animate:function () {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    resize:function () {
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    drawPlane:function(r, i, x, z){
			const geometry = new THREE.PlaneGeometry( r, 200 );
			const material = new THREE.MeshBasicMaterial( {color: 0x87ceeb, side: THREE.DoubleSide} );
			const plane = new THREE.Mesh( geometry, material );
			plane.rotation.y = i*Math.PI/180;
			plane.position.set(x, 0, z)
			this.scene.add( plane );
		}
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  margin: 0;
}

canvas {
  display: block;
}
</style>