// pages1/productindex/productindex.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{
      img: 'http://oss.diywoju.com/web/uploads/image/store_1/a7a64f993736c591dae1be54364b328a9a112679.png',
      id: 139
    }, {
      img: 'http://oss.diywoju.com/web/uploads/image/store_1/a6e72023f9a91e6a87c73f64ca9d9313886abed6.png',
      id: 268
    }],
    list: [],
    swiperCurrent: 0,
    page: 1,
    page_count: 1,
    wenzi: '上拉加载更多'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showModal({
      title: '提示',
      content: '产品持续更新中，因产品图片问题有很多产品未能及时展示，如未找到合适的产品可联系客服询问',
      showCancel: false
    })
    if (!wx.getStorageSync('list_')) {
      wx.setStorageSync('list_', {})
    }
    if (options.user_id) {
      this.setData({
        user_id: options.user_id,
        id: options.carid
      })
    }
    this.room();
    this.style();
    this.shoplist(1);
    this.banner();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that = this;
    that.shoplist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var user_id = wx.getStorageSync('USER_INFO').id;
    var id = wx.getStorageSync('carid')
    if (wx.getStorageSync('msg') == "") {
      return {
        title: '设计知+_家居产品库',
        path: 'pages1/productindex/productindex?user_id=' + user_id + "&carid=" + id, //点击分享消息是打开的页面
      }
    } else {
      return {
        title: '设计知+_家居产品库'
      }
    }
  },
  swiperChange(e) {
    let current = e.detail.current;
    let that = this;
    that.setData({
      swiperCurrent: current,
    })
  },
  room() {
    let that = this;
    getApp().request({
      url: getApp().api.roomList,
      data: {
        system: 1
      },
      method: "post",
      success(res) {
        that.setData({
          roomlist: res.data.list
        })
      }
    })
  },
  style() {
    let that = this;
    getApp().request({
      url: getApp().api.styleList,
      data: {
        system: 1
      },
      method: "post",
      success(res) {
        that.setData({
          stylelist: res.data.list
        })
      }
    })
  },
  shoplist(page) {
    let that = this;
    if (page > that.data.page_count) {
      that.setData({
        wenzi: '暂无更多'
      })
    } else {
      that.setData({
        wenzi: '加载中...'
      })
      getApp().request({
        url: getApp().api.cartList,
        data: {
          is_recommend: 1,
          page: that.data.page
        },
        method: "post",
        success(res) {
          var arr = that.data.list;
          for (let i = 0; i < res.data.list.length; i++) {
            arr.push(res.data.list[i])
          }
          setTimeout(function() {
            if (page < res.data.page_count) {
              that.setData({
                list: arr,
                page_count: res.data.page_count,
                wenzi: '上拉加载更多',
                page:that.data.page+1
              })
            } else {
              that.setData({
                list: arr,
                page_count: res.data.page_count,
                wenzi: '暂无更多',
                page: that.data.page + 1
              })
            }
          }, 500)
        }
      })
    }
  },
  linkGoods: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync("addlistItem", e.currentTarget.dataset.item);
    wx.setStorageSync('item', e.currentTarget.dataset.item)
    var url = "/pages1/commodityDetail/commodityDetail?id=" + id + '&index=1&collect=1';
    if (self.data.show) {
      url += "&show=1";
    }
    wx.navigateTo({
      url: url
    })
  },
  gomore(e) {
    let name = e.currentTarget.dataset.name;
    let arr = {};
    arr.id = e.currentTarget.dataset.id;
    arr.name = name
    wx.setStorageSync('roomid', arr)
    wx.navigateTo({
      url: '/pages1/productWarehouse/productWarehouse?name=' + name,
    })
  },
  morea() {
    wx.navigateTo({
      url: '/pages1/productWarehouse/productWarehouse',
    })
  },
  getKeyword(e) {
    let val = e.detail.value;
    this.setData({
      val: val
    })
  },
  search() {
    wx.navigateTo({
      url: '/pages1/productWarehouse/productWarehouse?val=' + this.data.val,
    })
    this.setData({
      val: ''
    })
  },
  stylea(e) {
    wx.navigateTo({
      url: '/pages1/productWarehouse/productWarehouse?style=' + e.currentTarget.dataset.name,
    })
  },
  link_group(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: id
    })
  },
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
  // 返回设计师名片页
  backme() {
    let that = this;
    wx.navigateTo({
      url: '/pages1/postCard/postCard?user_id=' + that.data.user_id + '&id=' + that.data.id,
    })
  },
  collect(e) {
    var obj = {};
    if (e.currentTarget.dataset.id.length > 1) {
      let name = e.currentTarget.dataset.name.split(',');
      let id = e.currentTarget.dataset.id;
      wx.showActionSheet({
        itemList: name,
        success(res) {
          var index = res.tapIndex;
          obj.id = id[index];
          obj.name = name[index];
          wx.setStorageSync('roomid', obj)
          let item = e.currentTarget.dataset.item;
          item.rooms = name[index]
          item.attr = 1;
          var json = {};
          if (!json[item.id]) {
            json[item.id] = item;
            json[item.id].number = 1;
          } else {
            json[item.id].number++;
          }
          json[item.id].choose = false;
          let arr = wx.getStorageSync('list_');
          for (let i in arr[obj.id]) {
            if (arr[obj.id][i].id === item.id) {
              wx.showToast({
                title: '你已经收藏过此产品',
                icon: 'none'
              })
              return;
            }
          }
          let arr2 = [];
          for (var k in json) {
            var value = json[k];
            arr2.push(value);
          }
          if (arr[wx.getStorageSync('roomid').id] != undefined) {
            for (let i = 0; i < arr2.length; i++) {
              // arr2[i].price = arr2[i].original_price
              arr[wx.getStorageSync('roomid').id].push(arr2[i])
            }
          } else {
            arr[wx.getStorageSync('roomid').id] = arr2;
          }
          wx.setStorageSync('list_', arr)
          wx.showToast({
            title: '收藏成功',
            icon: 'none'
          })
        },
        fail(res) {
        }
      })
    } else {
      obj.id = e.currentTarget.dataset.id;
      obj.name = e.currentTarget.dataset.name;
      wx.setStorageSync('roomid', obj)
      let item = e.currentTarget.dataset.item;
      item.attr = 1;
      var json = {};
      if (!json[item.id]) {
        json[item.id] = item;
        json[item.id].number = 1;
      } else {
        json[item.id].number++;
      }
      json[item.id].choose = false;
      let arr = wx.getStorageSync('list_');
      for (let i in arr[e.currentTarget.dataset.id]) {
        if (arr[e.currentTarget.dataset.id][i].id === item.id) {
          wx.showToast({
            title: '你已经收藏过此产品',
            icon: 'none'
          })
          return;
        }
      }
      let arr2 = [];
      for (var k in json) {
        var value = json[k];
        arr2.push(value);
      }
      if (arr[wx.getStorageSync('roomid').id] != undefined) {
        for (let i = 0; i < arr2.length; i++) {
          arr[wx.getStorageSync('roomid').id].push(arr2[i])
        }
      } else {
        arr[wx.getStorageSync('roomid').id] = arr2;
      }
      wx.setStorageSync('list_', arr)
      wx.showToast({
        title: '收藏成功',
        icon: 'none'
      })
    }

  },
  collectlist() {
    wx.navigateTo({
      url: '/pages1/collectlist/collectlist',
    })
  }
})