<template>
    <div id="modal">
		device name
        <input type="text" placeholder="device name" v-model='device_name'>
        <button @click="add_sensor(device_name)">add device</button>
    </div>
</template>

<script>
import Constant from '../store/Constant'
import EventBus from '../store/Eventbus'
import mqtt from '../assets/mqtt.min.js'
export default {
    data(){
        return{
            device_name:null
        }
    },
    methods:{
        add_sensor(device_name) {
            this.$store.commit(Constant.ADDSENSOR, device_name);
            EventBus.$emit('sensor');
            EventBus.$emit('modal');
        }
    }
}
</script>