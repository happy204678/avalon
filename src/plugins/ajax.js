
import axios from 'axios'
import qs from 'qs'

import store from '../store'

export default {
  post: (url, param) => {
    // console.log(param)
    // // 添加響應攔截器
    // axios.interceptors.request.use(
    //   config => {
    //     if (config.method === 'post') {
    //       config.data = qs.stringify(param)
    //       // config.transformResponse = [function (data) {
    //       //   // 作資料轉換
    //       //   return data.data
    //       // }]
    //     }
    //     return config
    //   },
    //   error => {
    //     console.log(error)
    //     Promise.reject(error)
    //   }
    // )


    param.accountName = store.getters.accountName
    param.authToken = store.getters.authToken

    // return axios.post('http://' + process.env.IPADDRESS + ':' + process.env.PORT + url, qs.stringify(param))
    return axios.post('https://rattan-inc.com:' + process.env.PORT + url, qs.stringify(param))
  }
}



