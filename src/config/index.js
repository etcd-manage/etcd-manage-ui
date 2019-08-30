// 开发环境配置
const DEV = {
    BaseUrl: 'http://127.0.0.1:10280'
}

// 正式环境
const PRO = {
    BaseUrl: ''
}

export const Config = process.env.NODE_ENV === 'development' ? DEV : PRO
