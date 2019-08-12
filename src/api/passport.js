import axios from './api'

const Passport = {

    /**
     * 登录
     * @param {*} username 用户名
     * @param {*} password 密码
     */
    Login(username, password) {
        return axios.post(`/v1/passport/login`, {
            username: username,
            password: password
        });
    },

}

// 获取指定目录的key列表
export {
    Passport
}