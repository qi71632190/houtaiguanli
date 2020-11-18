//引入核心库
import Vue from 'vue'
//引入vuex
import Vuex from 'vuex'
//调用vuex插件
Vue.use(Vuex)
import menu from './modules/menu'
import role from './modules/role'
import use from './modules/use'
import cate from './modules/cate'
import specs from './modules/specs'
import goods from './modules/goods'
import member from './modules/member'
import banner from './modules/banner'
import seck from './modules/seck'
export default new Vuex.Store({

    state:{
        // userInfo:null
        userInfo:sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null

    },
    getters:{
        getUserInfo(state){
            console.log(1);
            console.log(state.userInfo)
            return state.userInfo
        }

    },
    mutations:{
        CHANGE_USER(state,payload){
            state.userInfo=payload
            if(payload){
                sessionStorage.setItem('userInfo',JSON.stringify(payload))
            }else{
                sessionStorage.removeItem('userInfo')
            }
        }


    },
    actions:{
        changeUserInfoAction({commit},payload){
            console.log(payload)
            commit('CHANGE_USER',payload)
        }

    },
    modules: {
        menu,
        role,
        use,
        cate,
        specs,
        goods,
        member,
        banner,
        seck
    }

})