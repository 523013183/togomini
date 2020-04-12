Page({
  data: {
    cartList: [],
    pricenum: 0,
    num: 0
  },
  onShow: function () {
    var self = this;
    self.getcartList();
  },
  onLoad: function (options) {
    var self = this;
    if (options.merchant) {
      self.setData({
        merchant: options.merchant
      })
    }
    if (options.detail) {
      self.setData({
        detail: options.detail
      })
    }
    self.getcartList();
  },
  //获取列表
  getcartList: function () {
    var self = this;
    var cartList = wx.getStorageSync("listarr");
    var arr = [];
    for (var k in cartList) {
      var value = cartList[k];
      arr.push(value);
    };
    self.setData({
      cartList: arr
    });
    var pricenum = 0;
    var num = 0;
    for (let i in arr) {
      pricenum = Number(pricenum) + Number(arr[i].original_price * arr[i].number)
      num = Number(num) + Number(arr[i].number)
    }
    self.setData({
      pricenum: Math.floor(pricenum * 100) / 100,
      num
    })
  },
  del: function (e) {
    let self = this;
    var index = e.currentTarget.dataset.id;
    var index2 = e.currentTarget.dataset.index;
    var cartList = wx.getStorageSync("listarr");
    cartList.splice(index2, 1)
    this.setData({
      cartList: cartList
    })
    wx.setStorageSync("listarr", cartList);
    // return;
    var pricenum = 0;
    var num = 0;
    for (let i in cartList) {
      pricenum = Number(pricenum) + Number(cartList[i].original_price * cartList[i].number)
      num = Number(num) + Number(cartList[i].number)
    }
    self.setData({
      pricenum: Math.floor(pricenum * 100) / 100,
      num
    })
  },
  //删除临时商品
  canclePro: function (e) {
    var self = this;
    getApp().request({
      url: getApp().api.delTemporaryPro,
      method: "post",
      data: {
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        getApp().core.showModal({
            title: "提示",
            content: res.msg,
            showCancel: !1,
          }),
          self.getcartList();
      }
    });
    // 删除列表当前数据
    var index = e.currentTarget.dataset.id;
    var cartList = wx.getStorageSync("listarr");

    var arr = [];
    for (var k in cartList) {
      if (index == k) {
        delete cartList[k];
      } else {
        var value = cartList[k];
        arr.push(value);
      }
    };
    wx.setStorageSync("listarr", cartList);

    this.setData({
      cartList: arr
    })
  },
  //跳转到商品详情
  linkGoods: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var user_id = e.currentTarget.dataset.userid;
    var item = e.currentTarget.dataset.item;
    wx.setStorageSync("addlistItem", item);
    wx.navigateTo({
      url: "/pages1/commodityDetail/commodityDetail?id=" + id + '&addlist=1'
    })
  },
  savebtn: function () {
    if (this.data.cartList.length == 0) {
      wx.showToast({
        title: '列表为空..',
        icon: 'none'
      })
      return;
    }
    var cartList = this.data.cartList;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 3];
    var roomId = prevPage.data.roomId;
    var goodsImgtopfileds = prevPage.data.goodsImgtopfileds;
    var preImgtopfileds = prevPage.data.preImgtopfileds;
    // 新添加物品
    if (goodsImgtopfileds[roomId] != undefined) {
      let arrid = [];
      for (let i in goodsImgtopfileds[roomId]) {
        arrid.push(Number(goodsImgtopfileds[roomId][i].attr))
      }
      for (let i = 0; i < cartList.length; i++) {
        if (arrid.indexOf(cartList[i].attr) != -1) {
          if (cartList[i].original_price == goodsImgtopfileds[roomId][arrid.indexOf(cartList[i].attr)].original_price) {
            goodsImgtopfileds[roomId][arrid.indexOf(cartList[i].attr)].number = Number(Number(goodsImgtopfileds[roomId][arrid.indexOf(cartList[i].attr)].number) + Number(cartList[i].number));
          } else {
            goodsImgtopfileds[roomId].push(cartList[i])
          }
        } else {
          goodsImgtopfileds[roomId].push(cartList[i])
        }
      }
    } else {
      goodsImgtopfileds[roomId] = cartList;
    }
    if (!goodsImgtopfileds[roomId]) {
      goodsImgtopfileds[roomId] = [];
    }
    let pricenum = 0;
    let num = 0;
    for (let i in goodsImgtopfileds[roomId]) {
      pricenum = Number(pricenum) + Number(goodsImgtopfileds[roomId][i].original_price * goodsImgtopfileds[roomId][i].number)
      num = Number(num) + Number(goodsImgtopfileds[roomId][i].number)
    }
    prevPage.setData({
      goodsImgtopfileds: goodsImgtopfileds,
      merchant: this.data.merchant,
      pricenum: Math.floor(pricenum * 100) / 100,
      numa: num
    });
    wx.setStorageSync("listarr", "")
    wx.navigateBack({
      delta: 2 // 返回上一级页面。
    })
  },
  reduce(e) {
    let that = this;
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    if (num < 2) {
      num = 1
    } else {
      num--
    }
    let arr = that.data.cartList;
    let up = 'cartList[' + index + '].number';
    that.setData({
      [up]: num
    })
    var pricenum = 0;
    var numa = 0;
    for (let i in that.data.cartList) {
      pricenum = Number(pricenum) + Number(that.data.cartList[i].original_price * that.data.cartList[i].number)
      numa = numa = Number(numa) + Number(that.data.cartList[i].number)
    }
    that.setData({
      pricenum: Math.floor(pricenum * 100) / 100,
      num: numa
    })
  },
  add(e) {
    let that = this;
    let num = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index;
    num++
    let up = 'cartList[' + index + '].number';
    that.setData({
      [up]: num
    })
    var pricenum = 0;
    var numa = 0;
    for (let i in that.data.cartList) {
      pricenum = Number(pricenum) + (Number(that.data.cartList[i].original_price * that.data.cartList[i].number))
      numa = numa = Number(numa) + Number(that.data.cartList[i].number)
    }
    that.setData({
      pricenum: Math.floor(pricenum * 100) / 100,
      num: numa
    })
  }
})