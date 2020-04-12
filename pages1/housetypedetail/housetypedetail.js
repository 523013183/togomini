var util = require('../../utils/util.js')
Page({
  data: {
    date: false,
    lx_phone: '',
    lx_name: '',
    fang_hao: '',
    lou_pan: '',
    level_name: '',
    logign: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      this.setData({
        level_name: wx.getStorageSync('level_name'),
        login: true
      })
    }
    this.index({
      id: options.id,
    })
  },
  index(obj) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    getApp().request({
      url: getApp().api.housetypedetail,
      method: 'POST',
      data: obj,
      success(res) {
        wx.hideLoading()
        console.log(res)
        that.setData({
          data: res.data
        })
      }
    })
  },
  morepackage() {
    wx.navigateTo({
      url: '/pages1/otherpackage/otherpackage?type=apartment&id=' + this.data.data.id,
    })
  },
  joinroom() {
    this.setData({
      date: !this.data.date,
      lx_phone: '',
      lx_name: '',
      fang_hao: '',
      lou_pan: ''
    })
  },
  submit() {
    let that = this;
    let lou_pan = this.data.lou_pan;
    let fang_hao = this.data.fang_hao;
    let lx_name = this.data.lx_name;
    let lx_phone = this.data.lx_phone;
    if (lou_pan == '' || fang_hao == '' || lx_name == '' || lx_phone == '') {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
      return;
    }
    getApp().request({
      url: getApp().api.housetypeapply,
      method: 'POST',
      data: {
        property: lou_pan,
        room_no: fang_hao,
        contact_name: lx_name,
        contact_phone: lx_phone,
        apartment_id: that.data.data.id
      },
      success(res) {
        console.log(res)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        that.setData({
          date: false
        })
      }
    })
  },
  lou_pan(e) {
    this.setData({
      lou_pan: e.detail.value
    })
  },
  fang_hao(e) {
    this.setData({
      fang_hao: e.detail.value
    })
  },
  lx_name(e) {
    this.setData({
      lx_name: e.detail.value
    })
  },
  lx_phone(e) {
    this.setData({
      lx_phone: e.detail.value
    })
  },
  login() {
    util.checkLogin();
  },
  // 加入套餐
  addpackage() {
    let that = this;
    let packagelist = that.data.data.package;
    let idarr = [];
    let a = '["010101"]'
    for (let i in packagelist) {
      idarr.push(packagelist[i].id);
    }
    console.log(idarr)
    if (JSON.stringify(idarr) == '[]') {
      wx.navigateTo({
        url: '/pages1/manageGroup/manageGroup?idarr=' + a + "&idarrtype=1",
      })
    } else {
      wx.navigateTo({
        url: '/pages1/manageGroup/manageGroup?idarr=' + JSON.stringify(idarr) + "&idarrtype=1",
      })
    }
  },
  packagedetail(e) {
    wx.navigateTo({
      url: '/pages1/groupDetail/groupDetail?type=11&roomtypeid=' + e.currentTarget.dataset.id,
    })
  },
  look() {
    this.setData({
      date: !this.data.date,
      lx_phone: '',
      lx_name: '',
      fang_hao: '',
      lou_pan: '',
      level_name: '',
    })
  },
})