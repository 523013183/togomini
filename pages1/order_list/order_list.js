// pages1/order_list/order_list.js
const app = getApp();
Page({
  data: {
    nonedata: '', //无数据
    height: '',
    active: 0,
    data: [],
    keyword: '',
    page: 1,
    onload:true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.index();
    var query = wx.createSelectorQuery();
    query.select('.add_new').boundingClientRect();
    query.select('.tab').boundingClientRect();
    query.exec((res) => {
      var windowHeight = wx.getSystemInfoSync().windowHeight;
      that.setData({
        height: windowHeight - (res[0].height + res[1].height)
      })
    })
  },
  onTop() {
    if(!this.data.onload){
      return
    }
    console.log("下拉",this.data.onload)
    this.setData({
      page: 1,
      data: []
    })
    this.index();
  },
  active(e) {
    let active = e.currentTarget.dataset.active;
    this.setData({
      active,
      data: '',
      page: 1,
      nonedata: false
    })
    this.index();
  },
  gotodetail(e) {
    wx.requestSubscribeMessage({
      tmplIds: ['rzsefT33kVRaR-BpUcdYyCeFXzT-iTYJJJOk3oDvQns'],
      success(res) {
        console.log(res)
        wx.navigateTo({
          url: '/pages1/order_detail/order_detail?id=' + e.currentTarget.dataset.id,
        })
      }
    })
  },
  index() {
    let that = this;
    that.setData({
      onload: false
    })
    let data = that.data.data;
    wx.showLoading({})
    app.request({
      url: app.api.orderlist,
      method: 'POST',
      data: {
        is_fin: that.data.active,
        limit: 10,
        page: that.data.page,
        keyword: that.data.keyword
      },
      complete() {
        setTimeout(() => {
          that.setData({
            onload: true
          })
          wx.hideLoading({})
        }, 500);
      },
      success(res) {
        console.log(res)
        if (res.data.list.length == 0) {
          that.setData({
            nonedata: true
          })
          return;
        }
        data = [...data, ...res.data.list]
        that.setData({
          data,
          page: that.data.page + 1
        })
      }
    })
  },
  getKeyword(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search(e) {
    if (this.data.keyword == '') {
      wx.showToast({
        title: '请输入搜索条件',
        icon: 'none'
      })
      return;
    }
    this.setData({
      data: '',
      page: 1
    })
    this.index();
  },
  onBottom() {
    if(this.data.nonedata){
      wx.showToast({
        title: '没有更多数据',
        icon:'none'
      })
      return;
    }
    if(!this.data.onload){
      return
    }
    console.log("上拉",this.data.onload)
    this.index();
  }
})