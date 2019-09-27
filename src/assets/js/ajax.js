import $http from '@/http'
export function comHttp (url, method, data, callback, back, error, loginBack) {
  $http[method](url, data).then((res) => {
    if (method === 'downLoad') {
      let rHeader = res.headers['content-disposition']
      let fileName = decodeURI(rHeader ? rHeader.split('=')[1] : '')
      let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
      let eLink = document.createElement('a')
      eLink.href = URL.createObjectURL(blob)
      eLink.download = fileName
      document.body.appendChild(eLink)
      eLink.click()
      document.body.removeChild(eLink)
      if (callback) {
        callback()
      }
    } else {
      if (res.data.code === 200) {
        callback(res.data.result)
      } else if (res.data.code === 2004) {
        if (loginBack) {
          loginBack(res.data.result)
        }
      } else {
        if (error) {
          error()
        }
      }
    }
    if (back) {
      back()
    }
  }).catch(() => {
    if (back) {
      back()
    }
  })
}
// 提醒
export function taxiList (callback, back) {
  comHttp('/userInfo/selectList', 'get', '', callback, back)
}
