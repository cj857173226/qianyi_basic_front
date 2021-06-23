export function dateForm(time, type = true) {
  try {
    let year = dateLenHandle(time.getFullYear())
    let month = dateLenHandle(time.getMonth() + 1)
    let day = dateLenHandle(time.getDate())
    let hours = dateLenHandle(time.getHours())
    let minute = dateLenHandle(time.getMinutes())
    let second = dateLenHandle(time.getSeconds())
    if (type) {
      return `${year}-${month}-${day} ${hours}:${minute}:${second}`
    } else {
      return `${year}-${month}-${day}`
    }
  } catch (err) {
    // console.log(err)
  }
}

function dateLenHandle(time) {//时间长度处理
  if (['string', 'number'].includes(typeof time)) {
    if (time.toString().length < 2) {
      const times = '0' + time.toString()
      return times
    } else {
      return time
    }
  } else {
    return time
  }

}
