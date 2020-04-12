// pages1/shareroom/shareroom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    sharproomlist:[],//样式间列表
    page:1,
    keyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.index();
    var query = wx.createSelectorQuery();
    query.select('.head').boundingClientRect();
    query.exec((res) => {
      console.log(res)
      var windowHeight = wx.getSystemInfoSync().windowHeight;
      that.setData({
        height: windowHeight - res[0].height
      })
    })
  },
  gotodetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages1/shareroom_detail/shareroom_detail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 获取列表
  index() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    getApp().request({
      url: getApp().api.sampleroomlist,
      method:'POST',
      data: {
        limit: 5,
        // page: that.data.page,
        keyword: that.data.keyword
      },
      success(res) {
        console.log(res)
        wx.hideLoading()
        that.setData({
          sharproomlist: res.data,
          page: that.data.page+1
        })
      }
    })
  },
  onBottom(){
    this.index()
  },
  keyword(e){
    this.setData({
      keyword:e.detail.value
    })
  },
  saerchbtn(){
    let keyword = this.data.keyword;
    this.setData({
      page: 1,
    })
    this.index()
  }
})