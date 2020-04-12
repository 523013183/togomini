// pages1/sign/sign.js
var util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign_day:0,//连续签到天数
    hebdomad: ["日", "一", "二", "三", "四", "五", "六"],
    datanum: '',
    is_sign: false,
    data: '',
    week: '',
    year: '',
    month: '',
    register_rule: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    util.checkLogin()
  },
  onLoad: function (options) {
    let that = this;
    that.rule();
    that.pointnum();
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    // 换算星期几
    var dataobj = year + "/" + (month + 1) + "/1";
    var weekDay = ["星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var myDate = new Date(Date.parse(dataobj));
    console.log(weekDay[myDate.getDay()], dataobj, myDate.getDay()); // 星期六
    that.setData({
      week: myDate.getDay(),
      month,
      year
    })
  },
  // 获取规则
  rule() {
    let that = this;
    app.request({
      url: app.api.integral.explain,
      method: 'GET',
      data: {
        // today:"2020/2/3"
      },
      success(res) {
        console.log(res)
        let arr = [];
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日
        var today = year + "/" + (month + 1) + "/" + date;
        if(res.data.register != null){
          if (today == res.data.register.register_time) {
            that.setData({
              is_sign: true
            })
          }
        }
        for (let i = 0; i < util.getCurrentMonthDayNum(); i++) {
          let obj = {
            time: year + "/" + (month + 1) + "/" + Number(i + 1),
            sign: false
          }
          arr.push(obj)
        }
        res.data.registerTime.forEach(function (item2, index2) {
          arr.forEach(function (item, index) {
            if (item2 == item.time) {
              arr[index].sign = true;
            }
          })
        })
        let sign_day = 0;
        arr.forEach((item, index) => {
          if (item.sign) {
            sign_day++;
          }
        })
        that.setData({
          sign_day,
          datanum: arr,
          register_rule: res.data.setting.register_rule
        })
      }
    })
  },
  // 签到
  sign() {
    let that = this;
    if (that.data.is_sign) {
      wx.showToast({
        title: '请勿重复操作',
        icon: 'none'
      })
      return;
    }
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    var today = year + "/" + (month + 1) + "/" + date;
    app.request({
      url: app.api.integral.register,
      method: 'GET',
      data: {
        today
      },
      success(res) {
        let data = that.data.data;
        data.user.integral = Number(data.user.integral) + 1;
        let datanum = that.data.datanum;
        datanum.forEach((item, index) => {
          if (item.time === today) {
            datanum[index].sign = true;
          }
        })
        that.setData({
          sign_day: that.data.sign_day + 1,
          data,
          datanum,
          is_sign: true
        })
        console.log(res)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 积分记录
  pointnum() {
    wx.showLoading({
      title: '',
    })
    let that = this;
    app.request({
      url: app.api.integral.index,
      method: 'GET',
      success(res) {
        that.setData({
          data: res.data
        })
      },
      complete() {
        wx.hideLoading({})
      }
    })
  }
})