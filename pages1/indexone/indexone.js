var util = require('../../utils/util.js')
Page({
  data: {
    sharproomlist:[],
    scroll_left: 1000,
    auto: false,
    stylistactive: 0,
    opuslistactive: 1,
    packagelistactive: 1,
    login: false
  },
  // 登录
  login() {
    util.checkLogin();
  },
  onLoad: function(options) {
    this.index();
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      wx.switchTab({
        url: '/pages1/homePage/homePage',
      })
    }
    if (wx.getStorageSync('user_name')) {
      this.setData({
        login: true,
        user_name: wx.getStorageSync('user_name')
      })
    }
    this.banner();
    this.item()
    this.stylist({
      is_new: 1,
      is_recommend: 0
    })
    this.opuslist({
      is_recommend: 0
    })
    this.package({
      is_recommend: 0
    })
  },
  onShow() {
    this.item()
  },
  // 轮播
  banner() {
    let that = this;
    getApp().request({
      url: getApp().api.adbanner,
      method: 'post',
      success(res) {
        that.setData({
          imgUrls: res
        })
      }
    })
  },
  // 产品
  item() {
    let that = this;
    getApp().request({
      url: getApp().api.cartList,
      method: 'POST',
      data: {
        is_recommend: 1,
        page: 1
      },
      success(res) {
        that.setData({
          itemlist: res.data.list
        })
      }
    })
  },
  // 设计师
  stylist(obj) {
    let that = this;
    getApp().request({
      url: getApp().api.relation_list,
      method: 'POST',
      data: obj,
      success(res) {
        for (let i in res.data.list) {
          res.data.list[i].style = JSON.parse(res.data.list[i].style)
        }
        that.setData({
          stylist: res.data.list
        })
      }
    })
  },
  // 案例
  opuslist(obj) {
    let that = this;
    getApp().request({
      url: getApp().api.projectList,
      method: 'POST',
      data: obj,
      success(res) {
        let arr = [];
        for (let i in res.data.list) {
          if (res.data.list[i].is_show == 1 && arr.length < 6) {
            arr.push(res.data.list[i])
          }
        }
        that.setData({
          opuslist: arr
        })
      }
    })
  },
  // 套餐
  package(obj) {
    let that = this;
    getApp().request({
      url: getApp().api.groupList,
      method: 'POST',
      data: obj,
      success(res) {
        let arr = [];
        for (let i in res.data.list) {
          if (res.data.list[i].is_show == 1 && arr.length < 6) {
            arr.push(res.data.list[i])
          }
        }
        that.setData({
          packagelist: arr
        })
      }
    })
  },
  // 跳转产品
  linkGoods: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var url = "/pages1/commodityDetail/commodityDetail?id=" + id;
    wx.navigateTo({
      url: url
    })
  },
  // 设计师详情
  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid;
    var a = '/pages1/postCard/postCard?id=' + id + "&user_id=" + userid; //点击分享消息是打开的页面
    wx.navigateTo({
      url: a,
    })
  },
  // 案例详情
  link_project(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/productDetail/productDetail?id=" + id + "&type=1"
    })
  },
  // 套餐详情
  link_groupDetail(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: "/pages1/groupDetail/groupDetail?id=" + id
      })
    } else {
      wx.navigateTo({
        url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + '&type=1'
      })
    }
  },
  // 设计师切换
  bindstylist(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      stylistactive: index,
      scroll_left: 0
    })
    if (index == 1) {
      this.stylist({
        is_new: 0,
        is_recommend: 1
      })
    } else {
      this.stylist({
        is_new: 1,
        is_recommend: 0
      })
    }
  },
  bindopus(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      opuslistactive: index,
      auto: false
    })
    if (index == 1) {
      this.opuslist({
        is_recommend: 0
      })
    } else {
      this.opuslist({
        is_recommend: 1
      })
    }
  },
  bingpackage(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      packagelistactive: index,
      scroll_left: 0
    })
    if (index == 1) {
      this.package({
        is_recommend: 0
      })
    } else {
      this.package({
        is_recommend: 1
      })
    }
  },
  getKeyword(e) {
    this.setData({
      key: e.detail.value
    })
  },
  searchGoods() {
    wx.navigateTo({
      url: '/pages1/productWarehouse/productWarehouse?key=' + this.data.key,
    })
  },
  auto() {
    this.setData({
      auto: !this.data.auto
    })
  },
  moreproduct() {
    wx.navigateTo({
      url: '/pages1/productindex/productindex',
    })
  },
  bindscroll(e) {

  },
  prototyperoomdetail(e){
    wx.navigateTo({
      url: '/pages1/shareroom_detail/shareroom_detail?id='+e.currentTarget.dataset.id,
    })
  },
  shareroom(){
    wx.navigateTo({
      url: '/pages1/shareroom/shareroom',
    })
  },
  // 获取样板间列表
  index() {
    let that = this;
    getApp().request({
      url: getApp().api.sampleroomlist,
      data: {},
      success(res) {
        that.setData({
          sharproomlist: res.data
        })
      }
    })
  }
})