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
    },
    
    /**
     * 获取权限列表
     * @param {*} id etcd服务id
     */
    GetRoles(id){
        if (!id){
            return
        }
        return axios.get(`/v1/server/roles?etcd_id=${id}`);
    },

    /**
     * 设置etcd服务权限配置
     * @param {*} data 
     */
    SetRoles(data){
        if (!data){
            return
        }
        return axios.post(`/v1/server/roles`, data);
    },

    /**
     * 删除
     * @param {*} id 
     */
    Del(id){
        return axios.delete(`/v1/server?id=${id}`)
    },


}

export {
    SERVER
}
