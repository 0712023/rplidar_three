<template>
    <div>
        <button @click="createConnection">test</button>
    </div>
</template>

<script>
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
        topic: 'test',
        qos: 0,
      },
      client: {
        connected: false,
      },
    }
  },
  methods: {
    createConnection() {
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
        console.log(`${message}`)
      })
    },
    doSubscribe() {
        const { topic, qos } = this.subscription
        this.client.subscribe(topic, { qos })
    },
  }
}
</script>
