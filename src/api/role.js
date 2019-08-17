import axios from './api'

const Role = {
    /**
     * 查询指定目录的key列表
     * @param {string} dir 查询key的目录
     */
    GetAll(dir) {
        return axios.get(`/v1/role`);
    },

}