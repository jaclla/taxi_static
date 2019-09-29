import axios from 'axios'
import qs from 'qs'
import {Message, Notification} from 'element-ui'
import Vue from 'vue'
Vue.component(Message.name, Message)

axios.interceptors.request.use(config => {
  // 发起请求
  if (store.state.token) {
    config.headers.Authorization = `Bearer ${store.state.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401) {
    store.commit('removeToken')
    router.replace({
      path: '/login'
    })
  }
  return Promise.resolve(error.response)
})

function checkStatus (response) {
  // loading
  // 如果http状态码正常，则直接返回数据
  if (response && (response.status === 200 || response.status === 304 ||
    response.status === 400)) {
    return response
    // 如果不需要除了data之外的数据，可以直接 return response.data
  }
  // 异常状态下，把错误信息返回去
  return {
    status: -404,
    msg: '网络异常'
  }
}

function checkCode (res) {
  let rd = res.data
  // 如果code异常(这里已经包括网络错误，服务器错误，后端抛出的错误)，可以弹出一个错误提示，告诉用户
  if (rd.status === -404) {
    Message.error(rd.msg)
  }
  if (rd.code) {
    switch (rd.code) {
      case 2000:
      case 2001:
        store.commit('removeToken')
        Message.error('信息校验失败，请重新登录')
        router.replace({
          path: '/login'
        })
        break
      case 2002:
        store.commit('removeToken')
        Message.error('登录信息已过期，请重新登录')
        router.replace({
          path: '/login'
        })
        break
      case 1009:
      case 2003:
        store.commit('removeToken')
        Message.error(rd.msg)
        router.replace({
          path: '/login'
        })
        break
      case 2005:
        store.commit('removeToken')
        Message.error('您的账号已在其它设备登录，请重新登录')
        router.replace({
          path: '/login'
        })
        break
      case 200:
      case 2004:
        break
      case 1021:
        Notification.error(
          '未认证企业无法发送短信邮件，请您前往用户设置中完成企业认证，如有疑问请联系在线客服400-876-0929')
        break
      case 1022:
        Notification.error('您的手机号未存在e员工系统，需要您所在企业HR将您添加到员工花名册中再进行登录')
        break
      default:
        Message.error(rd.msg)
        break
    }
  }
  return res
}

export default {
  post (url, data, process) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      onUploadProgress: (pe) => {
        if (pe.lengthComputable) {
          let num = Math.round((pe.loaded / pe.total) * 100)
          if (process) {
            process(num)
          }
        }
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  get (url, params) {
    return axios({
      method: 'get',
      url,
      params,
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  downLoad (url, params) {
    return axios({
      method: 'get',
      url,
      params,
      responseType: 'blob',
      headers: {'X-Requested-With': 'XMLHttpRequest'}
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  put (url, params) {
    return axios({
      method: 'put',
      url,
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  del (url, params) {
    return axios({
      method: 'delete',
      url,
      params,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  }
}
