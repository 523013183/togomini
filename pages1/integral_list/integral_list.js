// pages1/integral_list/integral_list.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    data: '',
    height:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.index();
    var query = wx.createSelectorQuery();
    query.select('.my_integral').boundingClientRect();
    query.exec(function (res) {
      var windowHeight = wx.getSystemInfoSync().windowHeight;
      that.setData({
        height:windowHeight - res[0].height
      })
    })
  },
  index() {
    wx.showLoading({
      title: '',
    })
    let that = this;
    app.request({
      url: app.api.integral.integral_detail,
      success(res) {
        console.log(res)
        that.setData({
          list: res.data.list
        })
      }
    })
    // 
    app.request({
      url: app.api.integral.index,
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