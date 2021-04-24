<template>
  <div id="app">
    <nav class="main-nav">
      <Burger/><button v-if="!(this.$route.name==`Home`)" @click="route_home">Back to Home</button>
    </nav>
    <div class="body"><router-view></router-view></div>
    <Sidebar>
      <ul class="sidebar-panel-nav">
        <li>
          <router-link to="/">Robot List</router-link>
        </li>
      </ul>
      <ul class="sidebar-panel-nav">
        <li>
          <router-link v-for="sensor in sensor_list" :key="sensor[0]" :to="'/render/'+sensor[0]">- {{sensor[0]}}</router-link>
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
import EventBus from './store/Eventbus'

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
      serial: null
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
          this.serial = JSON.parse(`${payload}`)[0]
          this.client.subscribe(JSON.parse(`${payload}`)[0]);
          this.$store.commit(Constant.ADDSENSOR, JSON.parse(`${payload}`));
        } else {
          EventBus.$emit(this.serial, JSON.parse(`${payload}`));
        }
      })
    },
    route_home() {
      this.$router.push('/')
    }
  }
};
</script>
<style>
 @import './assets/css/style.css';
</style>