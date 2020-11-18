import { getMenuadd, getRoleAdd, getRoleList } from '../../unitl/axios'
const state = {
    roleList: []

}
const getters = {
    getRoleList() {
        return state.roleList
    }
}
const mutations = {
    REQ_ROLELIST(state, payload) {
        state.roleList = payload
    }

}
const actions = {
    getRoleAction({ commit }) {
        getRoleList()
        .then(res => {
                
                if (res.data.code == 200) {
                    // console.log(res.data.list)
                    //提交一个mutations
                    commit('REQ_ROLELIST', res.data.list)
                }
        })

    }

}
export default {
    state,
    getters,
    mutations,
    actions,
    //命名空间
    namespaced: true
}