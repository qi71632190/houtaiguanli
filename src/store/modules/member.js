import { getMenberList} from '../../unitl/axios'
const state = {
    memberList: [],
}
const getters = {
    getMemberList(state) {
        return state.memberList
    },
}
const mutations = {
    REQ_MEMBERLIST(state, payload) {
        state.memberList = payload
        // console.log(state.memberList)
    },

}
const actions = {
    getMemberAction({ commit }) {
        getMenberList()
        .then(res => {
            console.log(res)
                
                if (res.data.code == 200) {
                    // console.log(res.data.list)
                    //提交一个mutations
                    commit('REQ_MEMBERLIST', res.data.list)
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