// pages1/otherhousetype/otherhousetype.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:'',
    data: [], //页面数据
    page: 1,
    keyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options)
    that.setData({
      property_id: options.property_id
    })
    that.index()
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
  index() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let data = that.data.data;
    getApp().request({
      url: getApp().api.housetypelist,
      method: 'POST',
      data: {
        property_id: that.data.property_id,
        limit: 10,
        // page: that.data.page,
        keyword: that.data.keyword
      },
      success(res) {
        wx.hideLoading()
        let arr = [...data, ...res.data];
        console.log(res)
        that.setData({
          data: arr,
          page: that.data.page+1
        })
      }
    })
  },
  detail(e) {
    wx.navigateTo({
      url: '/pages1/housetypedetail/housetypedetail?id=' + e.currentTarget.dataset.id,
    })
  },
  onBottom() {
    this.index()
  },
  keyword(e){
    this.setData({
      keyword: e.detail.value
    })
  },
  saerchbtn() {
    this.setData({
      page: 1,
    })
    this.index()
  }
})