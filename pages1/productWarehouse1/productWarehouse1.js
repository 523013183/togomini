var that;
var _params = {};
_params.style = "";
_params.room = "";
_params.cat_id = "";
_params.keyword = "";
_params.page = 1;
Page({
  data: {
    stylename: '',
    catename: '',
    cat_id: '',
    replacelist: [],
    plusprice_tan: true,
    plus_price: 0,
    replacenum: 2,
    roonname: '',
    message: false,
    stylename: '',
    roomname: '',
    typename: '',
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
        price: '30001-9000',
        min: '30001',
        max: '9000'
      }
    ],
    min: '',
    max: '',
    show: true,
    sort: true,
    zhe: true,
    cartList: [],
    showStyle: false,
    showRoom: false,
    showCategory: false,
    styleIndex: -1, //分格
    roomIndex: -1, //空间
    cateIndex: -1, //类型
    motip: "下拉加载更多"
  },
  onLoad: function (option) {
    var self = this;
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 2] //获取上一个页面信息栈
    if (prevPage) {
      wx.setStorageSync('replacelist', {});
      if (prevPage.data.replacenum == 1) {
        self.setData({
          replacenum: prevPage.data.replacenum
        })
      }
    }
    if (option.merchant) {
      self.setData({
        merchant: option.merchant
      })
    }
    if (option.cat_id) {
      _params.cat_id = option.cat_id;
      self.setData({
        cat_id: option.cat_id
      })
    } else {
      _params.cat_id = '';
      self.setData({
        cateIndex: '-1'
      })
    }
    if (option.room) {
      if (option.room == "空") {
        self.setData({
          roonname: '全部',
          replacenum: 2,
        })
        _params.room = '';
      } else {
        self.setData({
          roonname: option.room,
          replacenum: 2,
        })
        _params.room = option.room;
      }
      _params.style = self.data.stylename;
    } else {
      _params.room = '';
      _params.style = self.data.stylename;
    }
    self.getStyleList();
    self.getRoomList();
    self.getCateList();
    self.getGoods(_params);
  },
  //获取商品列表
  onShow: function (options) {
    if (!(wx.getStorageSync("listarr"))) {
      wx.setStorageSync("listarr", [])
    }
  },
  //触底加载
  onReachBottom: function () {
    _params.page++;
    this.getGoods(_params, 1);
  },

  //获取列表
  getcartList: function () {
    var self = this;
    getApp().request({
      url: getApp().api.cartList,
      method: "post",
      data: {},
      success: function (res) {
        self.setData({
          cartList: res.data.list,
          message: false
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
        if (self.data.cat_id != '') {
          for (var i = 0; i < res.data.list.length; i++) {
            if (res.data.list[i].id == self.data.cat_id) {
              self.setData({
                cateIndex: i,
              })
            }
          }
        }
      }
    });
  },
  //跳转到商品详情
  linkGoods: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var item = e.currentTarget.dataset.item;
    wx.setStorageSync("addlistItem", item);
    wx.navigateTo({
      url: "/pages1/commodityDetail/commodityDetail?id=" + id + "&addlist=1&item=" + item + "&index2=" + index
    })
  },
  addlist: function (e) {
    var item = e.currentTarget.dataset.item;
    var json = wx.getStorageSync("listarr");
    item.attr = e.currentTarget.dataset.attr;
    item.idid = item.id;
    // 数组操作（new）
    if (json.length > 0) {
      var obj = false;
      var num = '';
      for (let i in json) {
        if (json[i].id == item.id && item.attr == json[i].attr) {
          obj = true;
          num = i;
        }
      }
      if (obj) {
        json[num].number++;
      } else {
        item.number = 1;
        json.push(item);
      }
    } else {
      item.number = 1;
      json.push(item);
    }
    wx.setStorageSync('listarr', json);
    wx.showToast({
      title: '加入成功',
    })
  },

  //关键字搜索
  searchGoods: function () {
    var keyWord = this.data.keyWord;
    _params.keyword = keyWord;
    this.getGoods(_params);
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
        console.log(res)
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
    that.getGoods(_params);
    that.hideTab();
    that.setData({
      styleIndex: index,
      stylename: name
    })
  },
  //空间
  showRoom: function () {
    let that = this;
    that.setData({
      showRoom: !that.data.showRoom,
      showStyle: false,
      showCategory: false
    })
  },
  chooseRoom: function (e) {
    let that = this;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    if (name == '全部') {
      _params.room = ""
    } else {
      _params.room = name;
    }
    _params.cat_id = that.data.cat_id;
    that.getGoods(_params);
    that.hideTab();
    that.setData({
      roomIndex: index,
      roonname: ''
    })
  },
  showCategory: function () {
    let that = this;
    that.setData({
      showCategory: !that.data.showCategory,
      showStyle: false,
      showRoom: false
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
    that.getGoods(_params);
    that.hideTab();
    that.setData({
      cateIndex: index,
      catename: name
    })
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
  hide() {
    this.setData({
      zhe: true
    })
  },
  input(e) {
    this.setData({
      change: e.detail.value
    })
  },
  save() {
    let that = this;
    let price = Number(that.data.change).toFixed(2);
    let list = wx.getStorageSync("listarr")
    let item = that.data.changeitem;
    item.price = Number(that.data.change).toFixed(2);
    let num = 0;
    for (let i in list) {
      num++
    }
    if (num >= 4) {
      // 商品存在
      if (list[item.id]) {
        list[item.id].number++;
        wx.setStorageSync("listarr", list);
        wx.showToast({
          title: '加入成功!',
        })
      } else {
        wx.showToast({
          title: '最多添加4个商品',
          icon: "none"
        })
      }
    } else {
      // 小于4
      // 商品不存在
      if (!list[item.id]) {
        list[item.id] = item;
        list[item.id].number = 0;
        wx.setStorageSync("listarr", list);
      }
      list[item.id].number++;
      wx.setStorageSync("listarr", list);
      wx.showToast({
        title: '加入成功!',
      })

    }
    // 关闭弹窗
    that.setData({
      zhe: true
    })
  },
  myCatchTouch: function () {
    return;
  },
  add() {
    this.setData({
      change: (Number(this.data.change) + 10).toFixed(2)
    })
  },
  jian() {
    this.setData({
      change: (Number(this.data.change) - 10).toFixed(2)
    })
  },
  price() {
    let that = this;
    that.setData({
      sort: !this.data.sort
    })
    _params.sort = 2;
    if (this.data.sort) {
      _params.sort_type = 1
    } else {
      _params.sort_type = 0
    }
    that.getGoods(_params);
  },
  choose() {
    this.setData({
      show: !this.data.show
    })
  },
  close() {
    this.setData({
      show: !this.data.show
    })
  },
  min(e) {
    this.setData({
      min: e.detail.value
    })
  },
  max(e) {
    this.setData({
      max: e.detail.value
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
  submit() {
    let that = this;
    _params.style = that.data.stylename;
    _params.room = that.data.roomname;
    _params.cat_id = that.data.typename;
    _params.amount_min = that.data.min;
    _params.amount_max = that.data.max;
    that.getGoods(_params);
    that.setData({
      show: !that.data.show,
      max: '',
      min: ''
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
  onUnload: function () {
    _params.style = "";
    _params.room = "";
    _params.cat_id = "";
    _params.keyword = "";
    _params.page = 1;
    this.setData({
      roonname: ''
    })
  },
  addreplace(e) {
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 2] //获取上一个页面信息栈
    // for (let i in prevPage.data.replacelist[prevPage.data.replace_id]) {
    //   if (prevPage.data.replacelist[prevPage.data.replace_id][i].id == e.currentTarget.dataset.item.id) {
    //     wx.showToast({
    //       title: '您已经添加过此产品',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    // }
    // for (let i in wx.getStorageSync('replacelist')) {
    //   if (i == e.currentTarget.dataset.item.id) {
    //     wx.showToast({
    //       title: '您已经添加过此产品',
    //       icon: 'none'
    //     })
    //     return;
    //   }
    // }
    let that = this;
    that.setData({
      plusprice_tan: !that.data.plusprice_tan,
      plusprice_item: e.currentTarget.dataset.item
    })
  },
  subtract() {
    let that = this;
    that.setData({
      plus_price: Number(that.data.plus_price - 10)
    })
  },
  plus() {
    let that = this;
    that.setData({
      plus_price: Number(that.data.plus_price + 10)
    })
  },
  input_val(e) {
    let val = e.detail.value;
    let that = this;
    that.setData({
      plus_price: Number(val)
    })
  },
  plusprice_tan() {
    let that = this;
    that.setData({
      plusprice_tan: !that.data.plusprice_tan
    })
  },
  qr_plusprice() {
    let that = this;
    that.setData({
      plusprice_tan: !that.data.plusprice_tan
    })
    let item = that.data.plusprice_item;
    console.log(item)
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 2] //获取上一个页面信息栈
    let roomId = prevPage.data.roomId;
    let replace_id = prevPage.data.replace_id;
    let replacelist = that.data.replacelist;
    var json = wx.getStorageSync('replacelist');
    let jsona = {};
    if (that.data.plus_price < 0) {
      jsona.price_type = 2;
    } else {
      jsona.price_type = 1;
    }
    jsona.replace_price = Math.abs(that.data.plus_price);
    jsona.id = item.id;
    jsona.room = roomId;
    jsona.attr = 1;
    jsona.material = item.material;
    jsona.original_price = item.original_price;
    jsona.size = item.size;
    jsona.cover_pic = item.pic_url;
    // jsona.parent_goods_id = replace_id;
    json[jsona.id] = jsona;
    wx.setStorageSync('replacelist', json)
    that.setData({
      plus_price: 0
    })
    wx.showToast({
      title: '加入成功!',
    })
  }
})