import { getGoodsList, getGoodsCount } from '../../unitl/axios'
const state = {
    goodsList: [],
    size: 2, //每个组件渲染的条数
    page: 1, //页码
    total: 0 //总条数


}
const getters = {
    getGoodsList(state) {
        return state.goodsList
    },
    getGoodsCount(state) {
        return state.total
    },
    getGoodsSize(state){
        return state.size
    }
}
const mutations = {
    REQ_GOODSLIST(state, payload) {
        state.goodsList = payload
        // console.log(state.userList)
    },
    // 总数
    REQ_GOODSCOUNT(state, payload){
        state.total=payload
    },
    REQ_PAGE(state, payload){
        state.page=payload
    }

}
const actions = {
    getGoodsAction(context) {

        //调取列表接口
        getGoodsList({
            size: context.state.size,
            page: context.state.page
        }).then(res => {
            if (res.data.code == 200) {
                // console.log(res, "响应数据");
                //提交一个mutations
                context.commit("REQ_GOODSLIST", res.data.list);
            }
        });
    },
    //封装一个获取总条数事件
    getCountAction({ commit }) {
        getGoodsCount().then(res => {
            console.log(res)
            if (res.data.code == 200) {
                commit("REQ_GOODSCOUNT", res.data.list[0].total);
            }
        });
    },
    //封装一个修改page的action
    changePageAction(context, payload) {
        console.log(context, '页码')
        context.commit('REQ_PAGE', payload)
        //重新调取列表
        context.dispatch('getGoodsAction')
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