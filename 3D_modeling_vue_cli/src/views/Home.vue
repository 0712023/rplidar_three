<template>
    <div class="wrap" >
        <div class="box" v-for="sensor in sensor_list" :key="sensor[0]" @click="router_link(sensor[0])">
            sensor : {{sensor[0]}} <br>
            model : {{sensor[1]}} <br>
            firmware : {{sensor[2]}} <br>
            hardware : {{sensor[3]}} <br>
            serial number : {{sensor[4]}} <br>
            health : {{sensor[5]}} <br>
        </div>
        <div class="box" @click="show_modal_addSensor">
            <span style="font-size:44px;">+</span>
        </div>
        <modal name="addSensor"><addSensor/></modal>
    </div>
</template>

<script>
import EventBus from '../store/Eventbus'
import addSensor from '../modal/add_sensor'
export default {
    data() {
        return{
            sensor_list : this.$store.state.sensor_list,
        }
    },
    components:{
        addSensor
    },
    created() {
        EventBus.$on('modal', this.hide_modal_addSensor);
    },
    methods:{
        router_link(serial){
            this.$router.push('/render/'+serial);
        },
        show_modal_addSensor(){
            this.$modal.show('addSensor');
        },
        hide_modal_addSensor(){
            this.$modal.hide('addSensor');
        }
    }
}
</script>