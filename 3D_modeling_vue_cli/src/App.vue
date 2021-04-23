<template>
  <div id="app">
    <nav class="main-nav">
      <Burger/>
    </nav>
    <div class="body"><router-view></router-view></div>
    <Sidebar>
      <ul class="sidebar-panel-nav">
        <li>
          <router-link to="/">Sensor List</router-link>
        </li>
      </ul>
      <ul class="sidebar-panel-nav">
        <li >
          <router-link v-for="(sensor, index) in sensor_list" :key="index" :to="'/render/'+index">- {{sensor}}</router-link>
        </li>
      </ul>
    </Sidebar>
  </div>
</template>

<script>
import Burger from "./components/Menu/Burger.vue";
import Sidebar from "./components/Menu/Sidebar.vue";
import mqtt from './assets/mqtt.min.js'
import Constant from './store/Constant'

export default {
  name: "app",
  components: {
    Burger,
    Sidebar,
  },
  data() {
    return {
      sensor_list : this.$store.state.sensor_list,
      connection: {
        host: 'localhost',
        port: 8889,
        endpoint: '/mqtt',
        clean: true, // Reserved session
        connectTimeout: 4000, // Time out
        reconnectPeriod: 4000, // Reconnection interval
      },
      client: {connected: false},
    }
  },
  created() {
      //connect mqtt
      this.create_connection();
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
        this.client.subscribe('device_info', 2);
        this.$store.commit(Constant.SETCLIENT, mqtt.connect(connectUrl, options));
      })
      this.client.on('error', error => {
        console.log('Connection failed', error);
        alert(error);
      })
      this.client.on('message', (topic, payload)=>{
        if(`${topic}` === 'device_info'){
          this.$store.commit(Constant.ADDSENSOR, JSON.parse(`${payload}`));
        }
      })
    },
  }
};
</script>
<style>
 @import './assets/css/style.css';
</style>