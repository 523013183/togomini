// pages1/otherpackage/otherpackage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datalist: [],
    page: 1,
    none: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      type: options.type,
      id: options.id,
      sampleroom_id: options.sampleroom_id
    })
    if (options.type === 'room') {
      this.roomindex({
        sampleroom_id: options.sampleroome_id,
        limit: 10,
        page: this.data.page
      })
    } else {
      wx.setNavigationBarTitle({
        title: '已上传套餐',
      })
      this.apartmentindex({
        apartment_id: options.id,
        limit: 10,
        page: this.data.page
      })
    }
  },
  roomindex(obj) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(obj)
    let that = this;
    let datalist = that.data.datalist;
    getApp().request({
      url: getApp().api.sampleroompackagelist,
      method: 'POST',
      data: obj,
      success(res) {
        wx.hideLoading()
        console.log(res)
        let arr = [...datalist, ...res.data]
        if (res.data.length > 0) {
          that.setData({
            datalist: arr,
            page: that.data.page + 1
          })
        } else {
          wx.showToast({
            title: '没有更多数据...',
            icon: "none"
          })
          that.setData({
            none: true
          })
        }
      }
    })
  },
  apartmentindex(obj) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(obj)
    let that = this;
    let datalist = that.data.datalist;
    getApp().request({
      url: getApp().api.housetypepackagelist,
      method: 'POST',
      data: obj,
      success(res) {
        wx.hideLoading()
        console.log(res)
        let arr = [...datalist, ...res.data]
        if (res.data.length > 0) {
          that.setData({
            datalist: arr,
            page: that.data.page + 1
          })
        } else {
          wx.showToast({
            title: '没有更多数据...',
            icon: "none"
          })
          that.setData({
            none: true
          })
        }
      }
    })
  },
  onReachBottom() {
    if (this.data.none) {
      wx.showToast({
        title: '没有更多数据...',
        icon: "none"
      })
      return;
    }
    if (this.data.type === 'room') {
      this.roomindex({
        sampleroom_id: this.data.sampleroome_id,
        limit: 10,
        page: this.data.page
      })
    } else {
      wx.setNavigationBarTitle({
        title: '已上传套餐',
      })
      this.apartmentindex({
        apartment_id: this.data.id,
        limit: 10,
        page: this.data.page
      })
    }
  },
  packagedetail(e) {
    wx.navigateTo({
      url: '/pages1/groupDetail/groupDetail?type=11&roomtypeid=' + e.currentTarget.dataset.id,
    })
  },
})