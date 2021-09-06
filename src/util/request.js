import axios from 'axios'
import { Notification, MessageBox, Message } from 'element-ui'

const BASE_URL = ''
// axios.defaults.baseURL = '/watwise_war'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  // baseURL: axios.defaults.baseURL,
  baseURL:BASE_URL,
  // 超时
  timeout: 20000
})

// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    const code = Number(res.status);
    if (code === 401) {
     console.log("图片服务返回401-json下载失败");
     
    } else if (code === 402) {
     console.log("图片服务返回402- json内容为空");
    }
  },
  error => {
    console.log('err')
    return Promise.reject(error)
  }
)

export default service
