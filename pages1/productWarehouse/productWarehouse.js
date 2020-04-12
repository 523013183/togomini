let tim = getApp().globalData.tim;
var that;
var _params = {};
_params.style = "";
_params.room = "";
_params.cat_id = "";
_params.keyword = "";
_params.page = 1;
_params.amount_min = '';
_params.amount_max = '';
Page({
  data: {
    stylenamea: '',
    roonname: '',
    max: '',
    min: '',
    stylename: '',
    roomname: '',
    typename: '',
    show: true,
    price: [{
        price: '500-1000',
        min: '500',
        max: '1000'
      },
      {
        price: '1001-3000',
        min: '1001',
        max: '3000'
      },
      {
        price: '3001-9000',
        min: '3001',
        max: '9000'
      }
    ],
    sort: true,
    zhe: true,
    productList: [],
    styleIndex: -1, //分格
    roomIndex: -1, //空间
    cateIndex: -1, //类型
    showStyle: false,
    showRoom: false,
    showCategory: false,
    motip: "下拉加载更多"
  },
  onShow: function () {
    if (!wx.getStorageSync('list_')) {
      wx.setStorageSync("list_", {})
    }
  },
  onLoad: function (options) {
    if (!wx.getStorageSync('list_')) {
      wx.setStorageSync("list_", {})
    }
    var self = this;
    if (options.imtype) {
      self.setData({
        imtype: options.imtype
      })
    }
    if (options.name) {
      self.setData({
        roonname: options.name
      })
      _params.room = options.name;
      _params.keyword = '';
      _params.style = '';
      self.getStyleList();
      self.getRoomList();
      self.getCateList();
      self.getGoods(_params);
      return;
    }
    if (options.val) {
      _params.keyword = options.val;
      _params.style = '';
      _params.room = '';
      self.getGoods(_params);
      self.getStyleList();
      self.getRoomList();
      self.getCateList();
      return;
    }
    if (options.style) {
      self.setData({
        stylenamea: options.style
      })
      _params.style = options.style;
      _params.keyword = '';
      _params.room = '';
      self.getGoods(_params);
      self.getStyleList();
      self.getRoomList();
      self.getCateList();
      return;
    }
    if (options.show) {
      self.setData({
        show: options.show
      })
    }
    self.getcartList();
    self.getStyleList();
    self.getRoomList();
    self.getCateList();
    if (options.key) {
      self.searchGoods(options.key);
      self.setData({
        keyWord: options.key
      })
    } else {
      self.getGoods(_params);
    }
  },
  //触底加载
  onReachBottom: function () {
    _params.page++;
    this.getGoods(_params, 1);
  },
  //跳转到商品详情
  linkGoods: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    wx.setStorageSync("addlistItem", item);
    wx.setStorageSync('item', item)
    var url = "/pages1/commodityDetail/commodityDetail?id=" + id + "&index2=" + index + "&index=1&collect=1";
    if (self.data.show) {
      url += "&show=1";
    }
    if (self.data.imtype) {
      url += "&imtype=" + self.data.imtype;
    }
    wx.navigateTo({
      url: url
    })
  },
  //获取列表
  getcartList: function () {
    var self = this;
    getApp().request({
      url: getApp().api.cartList,
      method: "post",
      data: {
        page: 1
      },
      success: function (res) {
        self.setData({
          cartList: res.data.list,
        })
      }
    });
  },
  //获取风格列表
  getStyleList: function () {
    var self = this;
    getApp().request({
      url: getApp().api.styleList,
      method: "post",
      data: {},
      success: function (res) {
        self.setData({
          styleList: res.data.list,
        })
      }
    });
  },
  //获取空间接口
  getRoomList: function () {
    var self = this;
    getApp().request({
      url: getApp().api.roomList,
      method: "post",
      data: {},
      success: function (res) {
        self.setData({
          roomList: res.data.list,
        })
      }
    });
  },
  //获取类别接口
  getCateList: function () {
    var self = this;
    getApp().request({
      url: getApp().api.productList,
      method: "post",
      data: {},
      success: function (res) {
        self.setData({
          cateList: res.data.list,
        })
      }
    });
  },

  //关键字搜索
  searchGoods: function (obj) {
    var keyWord = this.data.keyWord;
    if (obj) {
      _params.keyword = obj;
    } else {
      _params.keyword = keyWord;
    }
    this.getGoods(_params);
    this.setData({
      keyWord: ''
    })
  },
  //获取关键字
  getKeyword: function (e) {
    var val = e.detail.value;
    this.setData({
      keyWord: val
    })
    _params.keyword = val;
  },
  //isOnbottom=1 触底加载
  getGoods: function (params, isOnbottom) {
    if (isOnbottom != 1) {
      _params.page = 1;
    }
    this.setData({
      motip: "加载中..."
    })
    var self = this;
    getApp().request({
      url: getApp().api.cartList,
      method: "post",
      data: params,
      success: function (res) {
        if (isOnbottom == 1) {
          var arr = [];
          var oldList = self.data.cartList;
          var list = res.data.list;
          list.forEach(function (item, index) {
            oldList.push(item)
          })
          self.setData({
            cartList: oldList
          })
          if (list.length < 12) {
            self.setData({
              motip: "没有更多数据了"
            })
          } else {
            self.setData({
              motip: "上拉加载更多"
            })
          }
        } else {
          self.setData({
            cartList: res.data.list,
          })
          var list = res.data.list;
          if (list.length < 12) {
            self.setData({
              motip: "没有更多数据了"
            })
          } else {
            self.setData({
              motip: "上拉加载更多"
            })
          }
        }
      }
    });
  },
  //风格
  showStyle: function () {
    let that = this;
    that.setData({
      showStyle: !that.data.showStyle,
      showCategory: false,
      showRoom: false
    })
  },
  chooseStyle: function (e) {
    let that = this;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    if (name == '全部') {
      _params.style = ""
    } else {
      _params.style = name;
    }
    that.setData({
      styleIndex: index,
      stylenamea: '',
      cartList: []
    })
    that.getGoods(_params);
    that.hideTab();
  },
  //空间
  showRoom: function () {
    // that.hideTab();
    let that = this;
    that.setData({
      showRoom: !that.data.showRoom,
      showCategory: false,
      showStyle: false
    })
  },
  chooseRoom: function (e) {
    let that = this;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    if (name == '全部') {
      _params.room = ""
    } else {
      let arr = {};
      arr.id = e.currentTarget.dataset.id;
      arr.name = name
      wx.setStorageSync('roomid', arr)
      _params.room = name;
    }
    that.setData({
      roomIndex: index,
      roonname: '',
      cartList: []
    })
    that.getGoods(_params);
    that.hideTab();
  },
  showCategory: function () {
    // that.hideTab();
    let that = this;
    that.setData({
      showCategory: !that.data.showCategory,
      showRoom: false,
      showStyle: false
    })
  },
  chooseCategory: function (e) {
    let that = this;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    if (name == '全部') {
      _params.cat_id = ""
    } else {
      _params.cat_id = name;
    }
    that.setData({
      cateIndex: index,
      cartList: []
    })
    that.getGoods(_params);
    that.hideTab();
  },
  //隐藏
  hideTab: function () {
    let that = this;
    that.setData({
      showStyle: false,
      showRoom: false,
      showCategory: false
    })
  },
  price() {
    let that = this;
    _params.sort = 2;
    if (that.data.sort) {
      _params.sort_type = 0;
    } else {
      _params.sort_type = 1;
    }
    that.getGoods(_params);
    that.setData({
      sort: !that.data.sort
    })
  },
  choose() {
    let that = this;
    that.setData({
      show: !that.data.show
    })
  },
  close() {
    let that = this;
    that.setData({
      show: !that.data.show
    })
  },
  style(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    that.setData({
      stylename: name,
      styleIndex: index
    })
  },
  room(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    that.setData({
      roomname: name,
      roomIndex: index
    })
  },
  type(e) {
    let that = this;
    let name = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    that.setData({
      typename: name,
      cateIndex: index
    })
  },
  reset() {
    let that = this;
    that.setData({
      roomIndex: -1,
      styleIndex: -1,
      cateIndex: -1,
      stylename: '',
      roomname: '',
      typename: '',
      max: '',
      min: ''
    })
  },
  submit() {
    let that = this;
    _params.style = that.data.stylename;
    _params.room = that.data.roomname;
    _params.cat_id = that.data.typename;
    _params.amount_min = that.data.min;
    _params.amount_max = that.data.max;
    that.setData({
      cartList: []
    })
    that.getGoods(_params);
    that.setData({
      show: !that.data.show,
      max: '',
      min: ''
    })
  },
  max(e) {
    this.setData({
      max: e.detail.value
    })
  },
  min(e) {
    this.setData({
      min: e.detail.value
    })
  },
  chooseprice(e) {
    let min = e.currentTarget.dataset.min;
    let max = e.currentTarget.dataset.max;
    this.setData({
      max: max,
      min: min
    })
  },
  stylea() {
    this.setData({
      showStyle: !this.data.showStyle
    })
  },
  typea() {
    this.setData({
      showCategory: !this.data.showCategory
    })
  },
  rooma() {
    this.setData({
      showRoom: !this.data.showRoom
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
          item.rooms = name[index];
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
        }
      })
    } else {
      obj.id = e.currentTarget.dataset.id;
      obj.name = e.currentTarget.dataset.name;
      wx.setStorageSync('roomid', obj)
      let item = e.currentTarget.dataset.item;
      item.rooms = e.currentTarget.dataset.name;
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
    }

  },
  collectlist() {
    wx.navigateTo({
      url: '/pages1/collectlist/collectlist',
    })
  },
  send(e) {
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 2];
    var obj = {
      userid: curPage.data.userid,
      name: e.currentTarget.dataset.name,
      id: e.currentTarget.dataset.id,
      pic: e.currentTarget.dataset.pic_url,
      price: e.currentTarget.dataset.price,
    }
    this.msg(obj);
  },
  msg(obj) {
    let that = this;
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createCustomMessage({
      to: '' + obj.userid,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        data: "" + obj.id, // 用于标识该消息是骰子类型消息
        description: obj.name + ',产品', // 获取骰子点数
        extension: obj.pic + ',' + obj.price //其他
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      var pages = getCurrentPages();
      var curPage = pages[pages.length - 2];
      wx.navigateBack({
        success() {
          curPage.pageScrollToBottom(11);
        }
      })
    }).catch(function (imError) {
      // 发送失败
    });
  },
  onUnload() {
    _params.style = "";
    _params.room = "";
    _params.cat_id = "";
    _params.keyword = "";
    _params.page = 1;
    _params.amount_min = '';
    _params.amount_max = '';
  }
})