function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDate(now) {
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
function formatTimeTwo(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

  var date = new Date(number * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

function checkLogin() {
  if (!getApp().core.getStorageSync(getApp().const.ACCESS_TOKEN)) {
    var pages = getCurrentPages() //获取加载的页面
    var currentPage = pages[pages.length - 1] //获取当前页面的对象
    var url = currentPage.route //当前页面url
    var options = currentPage.options //如果要获取url中所带的参数可以查看options
    var options = JSON.stringify(options)
    wx.navigateTo({
      url: '/pages1/login/login?url=' + url + '&obj=' + options,
    })
  }
}

function transformTime(timestamp) {
  if (timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear(); //getFullYear方法以四位数字返回年份
    var M = time.getMonth() + 1; // getMonth方法从 Date 对象返回月份 (0 ~ 11)，返回结果需要手动加一
    var d = time.getDate(); // getDate方法从 Date 对象返回一个月中的某一天 (1 ~ 31)
    var h = time.getHours(); // getHours方法返回 Date 对象的小时 (0 ~ 23)
    var m = time.getMinutes(); // getMinutes方法返回 Date 对象的分钟 (0 ~ 59)
    var s = time.getSeconds(); // getSeconds方法返回 Date 对象的秒数 (0 ~ 59)
    return y + '-' + M + '-' + d + ' ' + h + ':' + m + ':' + s;
  } else {
    return '';
  }
}
transformTime(); // "2018-8-8 12:9:12"

function loginim(e){
  console.log(e)
  let options = {
    SDKAppID: 1400272185 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
  };
  var tim = e.create(options); // SDK 实例通常用 tim 表示
  tim.setLogLevel(1);
  tim.login({
    userID: "user0",
    userSig: "eJyrVgrxCdYrSy1SslIy0jNQ0gHzM1NS80oy0zLBwqXFqUUwieKU7MSCgswUJStDEwMDI3MjQwtTiExJZm4qUNTU3NDIwNTc1AgimlpRkFkEFDczMLEwMICakZkOMtUxQLs4tSQ5WTsrNCLbzykyMjGpNK04MCgq0tws1zWgMskp0DAy09XH09dWqRYAyHYxGQ__" //通过服务端获得
  }).then((imResponse) => {
    console.log("登录", imResponse.data); // 登录成功
  }).catch((imError) => {
    console.warn('login error:', imError); // 登录失败的相关信息
  })
}
// 计算这个月有多少天
function getCurrentMonthDayNum() {
  let today = new Date();
  let dayAllThisMonth = 31;
  if (today.getMonth() + 1 != 12) {
    let currentMonthStartDate = new Date(today.getFullYear() + "/" + (today.getMonth() + 1) + "/01"); // 本月1号的日期
    let nextMonthStartDate = new Date(today.getFullYear() + "/" + (today.getMonth() + 2) + "/01"); // 下个月1号的日期
    dayAllThisMonth = (nextMonthStartDate - currentMonthStartDate) / (24 * 3600 * 1000);
  }

  return dayAllThisMonth;
}

function get_time_diff(time) {
  var diff = '';
  var time_diff =time - Date.parse(new Date())/1000; //时间差的毫秒数 

  //计算出相差天数 
  var days = Math.floor(time_diff / (24 * 3600 * 1000));
  if (days > 0) {
    diff += days + '天';
  }
  return diff;
}

module.exports = {
  getCurrentMonthDayNum,
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  checkLogin: checkLogin,
  formatDate: formatDate,
  transformTime: transformTime,
  loginim: loginim,
  get_time_diff:get_time_diff
}