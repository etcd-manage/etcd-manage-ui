import axios from './api'

const SERVER = {
    /**
     * 查询指定目录的key列表
     */
    GetMemberList() {
        return axios.get(`/v1/keys/members`);
    },

    /**
     * 获取所有etcd服务列表
     */
    GetEtcdServerList(name){
        name = name || '';
        return axios.get(`/v1/server?name=${name}`);
    },

    /**
     * 添加
     * @param {Object} info 添加详情
     */
    AddEtcdServer(info){
        return axios.post(`/v1/server`, info);
    },

    /**
     * 修改
     * @param {Object} edit 修改详情
     */
    UpdateEtcdServer(edit){
        return axios.put(`/v1/server`, edit);
    },

    /**
     * 修复etcd key目录结构
     */
    RestoreEtcdServer(id){
        if (!id){
            return
        }
        return axios.get(`/v1/server/restore?etcd_id=${id}`);
    }

}

export {
    SERVER
}
