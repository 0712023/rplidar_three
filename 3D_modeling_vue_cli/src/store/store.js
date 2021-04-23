import Vue from "vue";
import Vuex from 'vuex';
import Constant from './Constant'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isNavOpen : false,
    sensor_list : [],
    client : null
  },
  mutations: {
    [Constant.SETISNAVOPEN]: (oldState, payload) =>{ //nav bar 상태 설정
      oldState.isNavOpen = payload;
    },
    [Constant.TOGGLENAV]: (oldState) =>{ //nav bar 상태 토글
      oldState.isNavOpen = !oldState.isNavOpen;
    },
    [Constant.ISNAVOPEN]: (oldState) =>{ //nav bar 상태 return
      return oldState.isNavOpen;
    },
    [Constant.ADDSENSOR]: (oldState, payload) =>{
      if(JSON.stringify(oldState.sensor_list).includes(payload[0])){
        alert('device already exist!');
      } else{
        oldState.sensor_list.push(payload);
        alert('device added successfully!');
      }
    },
    [Constant.REMOVESENSOR]: (oldState, payload) =>{
      oldState.sensor_list = oldState.sensor_list.splice(oldState.sensor_list.indexOf(payload), 1);
    },
    [Constant.SETCLIENT]: (oldState, payload) =>{
      oldState.client = payload;
    },
    [Constant.SUBSCRIBE]: (oldState, payload) =>{
      let client = oldState.client;
      client.subscribe(payload, 2);
      oldState.client = client;
    },
    [Constant.UNSUBSCRIBE]: (oldState, payload) =>{
      let client = oldState.client;
      client.unsubscribe(payload);
      oldState.client = client;
    },
    [Constant.PUBLISH]: (oldState, payload) =>{
      let client = oldState.client;
      client.publish(payload['topic'], payload['payload']);
    },
  }
})