function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var config = {
  videoprefix: "http://182.254.242.48/project/",
  prefix: "https://online.yueyinyuemei.com/project/",
  // prefix: "http://localhost:8002/"
}

module.exports = {
  formatTime: formatTime,
  config: config
}
