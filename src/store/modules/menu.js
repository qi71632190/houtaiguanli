import { getMenuadd, getMenuList } from '../../unitl/axios'
const state = {
    menuList: []
}
const getters = {
    getMenuList(state) {
        return state.menuList
    }

}
const mutations = {
    REQ_MENULIST(state, payload) {
        state.menuList = payload
    }

}
const actions = {
    getMenuListAction({ commit }) {
        getMenuList({
            istree: true
        })
            .then(res => {
                // console.log(res)
                if (res.data.code == 200) {
                    commit("REQ_MENULIST", res.data.list)
                }

            })
            .catch(err => {
                console.log(err, '错误响应')
            })

    }

}
export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true

}