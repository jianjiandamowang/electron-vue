import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    userInfo:{   //存放用户信息

    },
    ErrDev:[],  //存放从故障设备中 选择的设备 用于发布工单
    Permision:{},   //用户权限
    WebSocket:null,     //通信websocket
}

const mutations = {
    saveUserInfo(state,userInfo){
        state.userInfo = userInfo;
    },
    saveErrDev(state,errDev){   //存放添加工单的故障设备
        state.ErrDev = errDev;
    },
    setPermision(state,permision){  //设置权限
        state.Permision = permision;
    },
    setWebSocket(state,websocket){  //存放websocket
        state.WebSocket = websocket;
    }
 
}

const actions = {
    saveUserInfo({commit}){
        commit('saveUserInfo');
    }
}



export default new Vuex.Store({
    state,
    actions,
    mutations
})