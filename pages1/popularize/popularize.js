var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiper: {
      imgUrls: [],
      indicatorDots: true,
      autoplay: false,
      interval: 5000,
      duration: 1000,
      current: 0,
      data: '',
    },
    userid: '', //用户id
    id: "", //样板间id
    self: false,
    date: false,
    lx_phone: '',
    lx_name: '',
    fang_hao: '',
    lou_pan: '',
    level_name: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.userid)
    let self = this.data.self;
    if (options.userid == wx.getStorageSync("USER_INFO").id) {
      self = true;
    }
    this.setData({
      id: options.id,
      userid: options.userid,
      self
    })
    this.index(this.data.id);
  },

  onReady: function() {

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
        id,
        is_self: 1,
        designer_user_id: that.data.userid
      },
      success(res) {
        wx.hideLoading()
        console.log(res)
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
  // 加入套餐
  addpackage() {
    let that = this;
    let packagelist = that.data.data.package[wx.getStorageSync('USER_INFO').id];
    let idarr = [];
    let a = '["010101"]'
    for (let i in packagelist) {
      idarr.push(packagelist[i].id);
    }
    console.log(JSON.stringify(idarr))
    if (JSON.stringify(idarr) == '[]' || JSON.stringify(idarr) == '[null]') {
      wx.navigateTo({
        url: '/pages1/manageGroup/manageGroup?idarr=' + a + "&idarrtype=2",
      })
    } else {
      wx.navigateTo({
        url: '/pages1/manageGroup/manageGroup?idarr=' + JSON.stringify(idarr) + "&idarrtype=2",
      })
    }
  },
  choosePic(e) {
    let index = e.currentTarget.dataset.index;
    let father = e.currentTarget.dataset.father;
    let up = "goods[" + father + "].currentIndex"
    this.setData({
      [up]: index
    })
  },
  goToDetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages1/commodityDetail/commodityDetail?id=' + id,
    })
  },
  gotodetail2(e) {
    wx.navigateTo({
      url: '/pages1/groupDetail/groupDetail?roomtypeid=' + e.currentTarget.dataset.id,
    })
  },
  onShareAppMessage(e) {
    let that = this;
    let id = '';
    for (let i in that.data.data.package) {
      id = i;
    }
    return {
      title: that.data.data.apartment + that.data.data.room_no,
      path: '/pages1/popularize/popularize?id=' + that.data.id + "&userid=" + id
    }
  },
  look() {
    if (!wx.getStorageSync("ACCESS_TOKEN")) {
      util.checkLogin();
      return;
    }
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
      url: getApp().api.looksampleroom,
      method: 'POST',
      data: {
        property: lou_pan,
        room_no: fang_hao,
        contact_name: lx_name,
        contact_phone: lx_phone,
        sampleroom_id: that.data.id,
        designer_user_id: that.data.userid
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
  removepackage(e) {
    let that = this;
    let package_id = e.currentTarget.dataset.id; //套餐id
    let sampleroom_id = that.data.data.id; //样板间id
    let index = e.currentTarget.dataset.index;
    let packagelist = that.data.data.package[wx.getStorageSync('USER_INFO').id];
    getApp().request({
      url: getApp().api.removepackage,
      method: 'POST',
      data: {
        package_id,
        sampleroom_id
      },
      success(res) {
        console.log(res)
        if (res.code == 0) {
          wx.showToast({
            title: "移除成功",
            icon: 'none'
          })
          that.index(that.data.id);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  }
})