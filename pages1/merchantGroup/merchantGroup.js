// pages1/merchantGroup/merchantGroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    index_style: '',
    index_jvshi: "",
    amount_min: '', //最小价格
    amount_max: '', //最高价格 
    keyword: "", //关键词
    style: '', //风格
    style2: '', //居室
    showStyle: false,
    showStyle2: false,
    styleList: [],
    styleLista: [{
        id: 1,
        name: "一居室"
      },
      {
        id: 2,
        name: "二居室"
      },
      {
        id: 3,
        name: "三居室"
      },
      {
        id: 4,
        name: "四居室"
      },
      {
        id: 5,
        name: "五居室"
      },
      {
        id: 6,
        name: "六居室"
      }
    ],
    list: [],
    screen: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var params = {
      keyword: "",
      style: "",
      is_merchant: 1,
      amount_min: "",
      amount_max: '',
      room_count: '',
      type: this.data.active
    }
    // this.getStyleList();
    // this.getGroupList(params);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var params = {
      keyword: "",
      style: "",
      is_merchant: 1,
      amount_min: "",
      amount_max: '',
      room_count: '',
      type: this.data.active
    }
    this.getStyleList();
    this.getGroupList(params);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  screen() {
    let that = this;
    that.setData({
      screen: !that.data.screen,
      keyword: ''
    })
  },
  close() {
    let that = this;
    that.setData({
      screen: false
    })
  },
  //获取风格列表
  getStyleList: function() {
    var self = this;
    getApp().request({
      url: getApp().api.styleList,
      method: "post",
      data: {},
      success: function(res) {
        self.setData({
          styleList: res.data.list,
        })
      }
    });
  },
  showStyle() {
    let that = this;
    that.setData({
      showStyle: !that.data.showStyle,
      showStyle2: false
    })
  },
  showStyle2() {
    let that = this;
    that.setData({
      showStyle2: !that.data.showStyle2,
      showStyle: false
    })
  },
  chooseStyle(e) {
    let that = this;
    if (e.currentTarget.dataset.id == -1) {
      that.setData({
        style: e.currentTarget.dataset.name,
        index_style: '',
        showStyle: false
      })
    } else {
      that.setData({
        style: e.currentTarget.dataset.name,
        index_style: e.currentTarget.dataset.id,
        showStyle: false
      })
    }
    var params = {
      keyword: that.data.keyword,
      style: that.data.index_style,
      is_merchant: 1,
      amount_min: that.data.amount_min,
      amount_max: that.data.amount_max,
      room_count: that.data.index_jvshi,
      type: this.data.active
    }
    that.getGroupList(params);
  },
  chooseStyle2(e) {
    let that = this;
    if (e.currentTarget.dataset.id == -1) {
      that.setData({
        style2: e.currentTarget.dataset.name,
        index_jvshi: '',
        showStyle2: false
      })
    } else {
      that.setData({
        style2: e.currentTarget.dataset.name,
        index_jvshi: e.currentTarget.dataset.id,
        showStyle2: false
      })
    }
    var params = {
      keyword: that.data.keyword,
      style: that.data.index_style,
      is_merchant: 1,
      amount_min: that.data.amount_min,
      amount_max: that.data.amount_max,
      room_count: that.data.index_jvshi,
      type: this.data.active
    }
    that.getGroupList(params);
  },
  // 海报套餐的详情
  godetail() {
    wx.navigateTo({
      url: '/pages1/merchantGroup_detail/merchantGroup_detail'
    })
  },
  // 获取列表
  getGroupList: function(params) {
    wx.showLoading({
      title: '',
    })
    var self = this;
    //获取套餐列表
    getApp().request({
      url: getApp().api.groupList,
      method: "post",
      data: params,
      success: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 100)
        var arr = []; //显示的商家套餐
        for (let i in res.data.list) {
          if (res.data.list[i].has_copy == 1) {
            arr.push(res.data.list[i])
          }
        }
        if (self.data.active == 1) {
          self.setData({
            list: arr,
            amount_max: '',
            amount_min: '',
            keyword: ''
          })
        } else {
          self.setData({
            list: res.data.list,
            amount_max: '',
            amount_min: '',
            keyword: ''
          })
        }
      }
    })
  },
  // 关键词
  getkeyword(e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  search() {
    let that = this;
    var params = {
      keyword: that.data.keyword,
      style: that.data.index_style,
      is_merchant: 1,
      amount_min: that.data.amount_min,
      amount_max: that.data.amount_max,
      room_count: that.data.index_jvshi,
      type: this.data.active
    }
    that.getGroupList(params)
  },
  min(e) {
    this.setData({
      amount_min: e.detail.value
    })
  },
  max(e) {
    this.setData({
      amount_max: e.detail.value
    })
  },
  style(e) {
    let that = this;
    that.setData({
      style: e.currentTarget.dataset.name,
      index_style: e.currentTarget.dataset.id
    })
  },
  jvshi(e) {
    let that = this;
    that.setData({
      style2: e.currentTarget.dataset.name,
      index_jvshi: e.currentTarget.dataset.id
    })
  },
  save() {
    let that = this;
    var params = {
      keyword: that.data.keyword,
      style: that.data.index_style,
      is_merchant: 1,
      amount_min: that.data.amount_min,
      amount_max: that.data.amount_max,
      room_count: that.data.index_jvshi,
      type: this.data.active
    }
    that.getGroupList(params);
    that.setData({
      screen: false
    })
  },
  reset() {
    let that = this;
    that.setData({
      keyword: '',
      style: '',
      amount_max: '',
      amount_min: '',
      room_count: '',
      index_jvshi: '',
      index_style: '',
    })
  },
  /*跳转到我的套餐*/
  link_group(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: "/pages1/groupDetail/groupDetail?id=" + id + "&shop=1" + "&type=3"
      })
    } else {
      wx.navigateTo({
        url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + "&shop=1" + "&type=3"
      })
    }

  },
  avtive(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.setData({
      active: id
    })
    // 
    var params = {
      keyword: "",
      style: this.data.index_style,
      is_merchant: 1,
      amount_min: "",
      amount_max: '',
      room_count: this.data.index_jvshi,
      type: this.data.active
    }
    this.getGroupList(params);
  },
  hide() {
    let that = this;
    that.setData({
      showStyle: !that.data.showStyle,
    })
  },
  hide2() {
    let that = this;
    that.setData({
      showStyle2: !that.data.showStyle2
    })
  },
})