<template>
</template>

<script type="module">
import * as THREE from "../assets/three.module.js";
import * as OrbitControls from "../assets/OrbitControls.module.js";
import EventBus from "../store/Eventbus"
import Constant from "../store/Constant"
export default {
  data() {
    return {
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
    this.camera.position.x = this.$store.state.camera_position.x;
    this.camera.position.y = this.$store.state.camera_position.y;
    this.camera.position.z = this.$store.state.camera_position.z;

    //resize event callback
    window.addEventListener("resize", this.resize);
    window.addEventListener("click", ()=>{this.set_camera_position(this.camera.position)})
    //camera control
    new OrbitControls.OrbitControls(this.camera, this.renderer.domElement);

    //X, Y, Z Axis
		this.draw_axis(1000, 0, 0, 0xff0000);
		this.draw_axis(0, 1000, 0, 0x00ff00);
		this.draw_axis(0, 0, 1000, 0x0000ff);
		this.init_scene = this.scene.clone();

    //render over screen
    document.body.appendChild(this.renderer.domElement);

    //initiate loop
    this.animate();

    //draw curve when data arrive
    EventBus.$on(this.$route.params.serial, (data)=>this.add_curve(data))
  },
  destroyed() {
    //remove element when destroy to save memory
    document.body.removeChild(this.renderer.domElement);
  },
  methods:{
    set_camera_position(camera_position){
      this.$store.commit(Constant.SETCAMERAPOSITION, camera_position)
    },
    resize() {
      var width = window.innerWidth;
      var height = window.innerHeight;
      this.renderer.setSize(width, height);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    },
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    draw_axis(x, y, z, color) {
			let material = new THREE.LineBasicMaterial({color: color});
			let points = [];
			points.push(new THREE.Vector3(x, y, z));
			points.push(new THREE.Vector3(0, 0, 0));
      let geometry = new THREE.BufferGeometry().setFromPoints(points);
      let axis = new THREE.Line(geometry, material)
			this.scene.add(axis);
    },
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
    },
  }
};
</script>