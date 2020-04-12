var util = require('../../utils/util.js')
Page({
  data: {
    date: false,
    swiper: {
      imgUrls: [],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0,
      data: '',
      login: false,
      level_name: ''
    },
    lou_pan: '',
    fang_hao: '',
    lx_phone: '',
    lx_name: "",
    id: '' //详情id
  },
  onLoad(options) {
    // console.log(options)
    this.index(options.id);
    this.setData({
      id: options.id
    })
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      this.setData({
        login: true,
        level_name: wx.getStorageSync('level_name')
      })
    }
  },
  onShow() {
    this.index(this.data.id);
    this.setData({
      level_name: wx.getStorageSync('level_name')
    })
  },
  // 获取详情信息
  index(id) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    getApp().request({
      url: getApp().api.sampleroominfo,
      method: 'POST',
      data: {
        id
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data.system_package.opus_goods, res)
        for (let i in res.data.designer) {
          res.data.designer[i].style = JSON.parse(res.data.designer[i].style).join(",");
        }
        let swiper = that.data.swiper;
        swiper.imgUrls = res.data.pic;
        that.setData({
          data: res.data,
          goods: res.data.system_package.opus_goods,
          swiper
        })
      }
    })
  },
  // 设计师加入共享样板间
  joinroom() {
    let that = this;
    getApp().request({
      url: getApp().api.sampleroomadd,
      method: "POST",
      data: {
        sampleroom_id: that.data.data.id
      },
      success(res) {
        // console.log(res)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  // 其他户型
  otherhouse() {
    wx.navigateTo({
      url: '/pages1/otherhousetype/otherhousetype?property_id=' + this.data.data.property_id,
    })
  },
  // 其他套餐
  otherpackages() {
    wx.navigateTo({
      url: '/pages1/otherpackage/otherpackage?type=room&sampleroome_id=' + this.data.data.id,
    })
  },
  packagedetail(e) {
    wx.navigateTo({
      url: '/pages1/groupDetail/groupDetail?type=11&roomtypeid=' + e.currentTarget.dataset.id,
    })
  },
  popularize() {
    wx.navigateTo({
      url: '/pages1/popularize/popularize?id=' + this.data.data.id + '&userid=' + wx.getStorageSync('USER_INFO').id,
    })
  },
  phone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.id,
    })
  },
  wechat(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  // 名片详情
  gotopostcar(e) {
    wx.navigateTo({
      url: '/pages1/postCard/postCard?id=' + e.currentTarget.dataset.carid + '&user_id=' + e.currentTarget.dataset.userid,
    })
  },
  choosePic(e) {
    let index = e.currentTarget.dataset.index;
    let father = e.currentTarget.dataset.father;
    let up = "goods[" + father + "].currentIndex";
    this.setData({
      [up]: index
    })
  },
  goToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages1/commodityDetail/commodityDetail?type=1&id=' + id,
    })
  },
  login() {
    util.checkLogin();
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
  submit() {
    let that = this;
    if (that.data.lou_pan == '' || that.data.fang_hao == '' || that.data.lx_name == '' || that.data.lx_phone == '') {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
      return;
    }
    getApp().request({
      url: getApp().api.looksampleroom,
      method: 'POST',
      data: {
        sampleroom_id: that.data.data.id,
        property: that.data.lou_pan,
        room_no: that.data.fang_hao,
        contact_name: that.data.lx_name,
        contact_phone: that.data.lx_phone,
      },
      success(res) {
        // console.log(res)
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
})