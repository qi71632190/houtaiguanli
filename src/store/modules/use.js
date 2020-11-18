import { getUserList, getUserCount } from '../../unitl/axios'
const state = {
    userList: [],
    size: 2, //每个组件渲染的条数
    page: 1, //页码
    total: 0 //总条数


}
const getters = {
    getUserList(state) {
        return state.userList
    },
    getUserCount(state) {
        return state.total
    },
    getUserSize(state){
        return state.size
    }
}
const mutations = {
    REQ_USERLIST(state, payload) {
        state.userList = payload
        // console.log(state.userList)
    },
    // 总数
    REQ_USERCOUNT(state, payload){
        state.total=payload
    },
    REQ_PAGE(state, payload){
        state.page=payload
    }

}
const actions = {
    getUserAction(context) {

        //调取列表接口
        getUserList({
            size: context.state.size,
            page: context.state.page
        }).then(res => {
            if (res.data.code == 200) {
                // console.log(res, "响应数据");
                let data = res.data.list ?res.data.list :[]
                //提交一个mutations
                context.commit("REQ_USERLIST", res.data.list);
                if(context.state.page!=1&&data.length==0){
                    //重新调取修改页码的行动
                    context.dispatch('changePageAction',context.state.page-1)
                    //重新调取列表
                    context.dispatch('getUserAction')
                    return
                  }
            }
        });
    },
    //封装一个获取总条数事件
    getCountAction({ commit }) {
        getUserCount().then(res => {
            console.log(res)
            if (res.data.code == 200) {
                commit("REQ_USERCOUNT", res.data.list[0].total);
            }
        });
    },
    //封装一个修改page的action
    changePageAction(context, payload) {
        console.log(context, '页码')
        context.commit('REQ_PAGE', payload)
        //重新调取列表
        context.dispatch('getUserAction')
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