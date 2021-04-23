<template>
    <div id="modal">
		device name <br>
        <input type="text" placeholder="device name" v-model='device_name'> <br>
        <button @click="add_sensor">add device</button>
    </div>
</template>

<script>
import Constant from '../store/Constant'
import EventBus from '../store/Eventbus'
export default {
    data() {
        return{
            device_name:null,
        }
    },
    methods:{
        add_sensor() {
            this.$store.commit(Constant.PUBLISH, {'topic':`${this.device_name}_sub`, 'payload':'get_info'});
            EventBus.$emit('sensor');
            EventBus.$emit('modal');
        }
    }
}
</script>