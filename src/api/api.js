import axios from 'axios'
import iView from 'iview'
import { Message } from 'iview'
import { bus } from "@/page/bus.js";
import { Config } from "@/config"

// 请求前缀
axios.defaults.baseURL = Config.BaseUrl

// 请求之前拦截
axios.interceptors.request.use(
    config => {
        // 添加用户认证信息
        let loginInfoStr = sessionStorage.getItem('login-info');
        if(loginInfoStr){
            let loginInfo = JSON.parse(loginInfoStr);
            config.headers.Token = loginInfo.token;
        }
        // etcd服务
        let etcdID = localStorage.getItem('EtcdID') || ''; // 读取当前选中的etcd server
        config.headers.EtcdID = etcdID;
        iView.LoadingBar.start();
        return config
    },
    err => {
        return Promise.reject(err)
    })


// 请求相应拦截器
axios.interceptors.response.use(
    response => {
        // console.log(response)
        // 未登录情况
        if (response.status == 401) {
            ShowLogin();
        }
        if (response.status == 400) {
            Message.error('req err')
        }
        iView.LoadingBar.finish();
        return response
    },
    error => {
        iView.LoadingBar.error();
        // console.log(error.response);
        if (error.response) {
            if (error.response.status == 400) {
                Message.error(error.response.data.msg);
            }
        } else {
            Message.error('请求错误' + JSON.stringify(error));
        }

        if (error.response) {
            switch (error.response.status) {
                case 401:
                    ShowLogin();
                    break
            }
        }

        return Promise.reject(error)
    });

const ShowLogin = () => {
    // todo 删除本地用户缓存
    sessionStorage.removeItem('login-info');
    // window.location.href = '/login'
    bus.$emit('show-login', true);
    Message.error('未登录，或登录失效，请登录')
}

export default axios