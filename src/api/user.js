import axios from './api'

const User = {
    /**
     * 全部角色
     */
    GetList(userId, username, roleId, page, pageSize) {
        return axios.get(`/v1/user?user_id=${userId}&name=${username}&role_id=${roleId}&page=${page}&page_size=${pageSize}`);
    },

    /**
     * 添加
     * @param {*} data 添加角色信息
     */
    Add(data){
        return axios.post('/v1/user', data)
    },

    /**
     * 删除角色
     * @param {*} id 
     */
    Del(id){
        return axios.delete(`/v1/user?id=${id}`)
    },

    /**
     * 修改角色
     * @param {*} data 
     */
    Save(data){
        return axios.put('/v1/user', data)
    },

}

export {
    User
}
