var wxparse = require("../../wxParse/wxParse.js");
let tim = getApp().globalData.tim;
const app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    replacelist: {},
    plus_price: 0,
    plusprice_tan: true,
    replacenum: 2, //可替换项
    imgimg: '',
    curPrice3: '0.00',
    attr: [],
    group_index: 0,
    goodsDetail: null,
    detailPic: "",
    curPrice: "",
    boxid: "",
    price: '',
    attrid: 1,
    priceshow: true,
    share_box: true,
  },
  //获取商品数据
  onLoad: function (options) {
    wx.showLoading({})
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      var id = this.getSenceParams(scene, "id");
      var index = this.getSenceParams(scene, "index");
      var designer_id = this.getSenceParams(scene, "designer_id");
      this.setData({
        index,
        designer_id
      })
    }
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 3] //获取上一个页面信息栈
    if (prevPage) {
      if (prevPage.data.replacenum == 1) {
        this.setData({
          replacenum: prevPage.data.replacenum
        })
      }
    }
    if (options.collect) {
      this.setData({
        collect: options.collect,
        imtype: options.imtype
      })
    }
    if (options.user_id) {
      this.setData({
        user_ida: options.user_id,
        carid: options.carid
      })
    }
    wx.hideShareMenu()
    this.setData({
      hide_sever: wx.getStorageSync('hide_sever')
    })
    if (options.index) {
      this.setData({
        index: options.index,
        item: wx.getStorageSync('item')
      })
    }
    if (options.index2) {
      this.setData({
        index2: options.index2
      })
    }
    var self = this;
    if (options.id) {
      var id = options.id;
    }
    if (options.item) {
      this.setData({
        addItem: options.item
      })
    }
    if (options.addlist) {
      this.setData({
        addlist: options.addlist
      })
    }
    if (options.show) {
      this.setData({
        show: options.show
      })
    }
    this.setData({
      goodId: id
    })
    getApp().request({
      url: getApp().api.goodsDetail,
      method: "post",
      data: {
        id: id
      },
      success: function (res) {
        console.log(res)
        var price = res.data.original_price;
        var use_attr = res.data.user_id;
        if (self.data.show == 1) {
          price = "";
        } else {
          price = Math.floor(price)
        }
        if (use_attr == 0) {
          self.setData({
            goodsDetail: res.data,
            curPrice: res.data.original_price,
            chooseprice: res.data.original_price,
            curPrice2: res.data.original_price,
            detailPic: res.data.detail,
            attr: res.data.attr,
            size: res.data.size,
            use_attr: use_attr,
            user_id: res.data.user_id,
            priceprice: res.data.price,
            id: res.data.id
          })
        } else {
          self.setData({
            goodsDetail: res.data,
            curPrice: res.data.price,
            curPrice2: res.data.price,
            detailPic: res.data.detail,
            attr: res.data.attr,
            size: res.data.size,
            use_attr: use_attr,
            user_id: res.data.user_id,
            id: res.data.id
          })
        }
        if (res.data.attr.length > 1) {
          self.setData({
            attrid: res.data.attr[0].attr_list[0].attr_id,
            curPrice3: res.data.attr[0].original_price == null ? res.data.attr[0].price : res.data.attr[0].original_price,
            curPrice: res.data.attr[0].original_price == null ? res.data.attr[0].price : res.data.attr[0].original_price,
            priceprice: res.data.attr[0].price
          })
        }
        wxparse.wxParse('detailPic', 'html', res.data.detail, self, 5)
      },
      complete() {
        wx.hideLoading({})
      }
    });
  },
  addlist: function () {
    var self = this
    var arr = [];
    var curPrice = self.data.curPrice;
    var getDownloadListId = wx.getStorageSync("downloadListId");
    if (getDownloadListId) {
      arr = getDownloadListId;
      var isit = 0;
      arr.forEach(function (item, index) {
        if (item.id == self.data.goodId) {
          isit = 1;
        }
      })
      if (isit == 0) {
        var obj = {};
        obj.id = self.data.goodId;
        obj.price = curPrice;
        arr.push(obj);
        wx.setStorageSync("downloadListId", arr)
      }
    } else {
      var obj = {};
      obj.id = self.data.goodId;
      obj.price = curPrice;
      arr.push(obj);
      wx.setStorageSync("downloadListId", arr)
    }
    wx.showToast({
      title: '加入成功',
    })
  },
  addlist1: function (e) {
    var that = this;
    // return;
    var item = wx.getStorageSync("addlistItem");
    var json = wx.getStorageSync("listarr");
    var a = 0
    // 数组操作（new）
    if (json.length > 0) {
      var obj = false;
      var num = '';
      for (let i in json) {
        if (json[i].id == item.id && json[i].attr == that.data.attrid) {
          obj = true;
          num = i;
          break;
        }
      }
      if (obj) {
        json[num].number++;
      } else {
        item.number = 1;
        item.original_price = Number(this.data.curPrice).toFixed(2);
        item.attr = that.data.attrid;
        item.idid = item.id;
        item.pic_url = this.data.imgimg == '' ? this.data.goodsDetail.cover_pic : this.data.imgimg;
        json.push(item);
      }
    } else {
      item.number = 1;
      item.original_price = Number(this.data.curPrice).toFixed(2);
      item.attr = that.data.attrid;
      item.idid = item.id;
      item.pic_url = this.data.imgimg == '' ? this.data.goodsDetail.cover_pic : this.data.imgimg;
      json.push(item);
    }
    wx.setStorageSync('listarr', json);
    wx.showToast({
      title: '加入成功',
    })
    // 跳转
    setTimeout(function () {
      wx.navigateBack({
        delta: 1 // 返回上一级页面。
      })
    }, 800)
  },
  //输入价格
  inputprice: function (e) {
    var value = e.detail.value;
    this.setData({
      curPrice: value
    })
  },
  //加价
  add: function (e) {
    var self = this;
    if (self.data.curPrice == "") {
      self.data.curPrice = 0;
    }
    var curPrice = parseInt(self.data.curPrice) + 10;
    self.setData({
      curPrice: curPrice
    })
  },
  //减价
  decrease: function (e) {
    var self = this;
    if (self.data.curPrice == "") {
      self.data.curPrice = 0;
    }
    var curPrice = parseInt(self.data.curPrice) - 10;
    if (curPrice < 0) {
      curPrice = 0;
    }
    self.setData({
      curPrice: curPrice
    })
  },
  group(e) {
    console.log(e)
    let that = this;
    var reg = /[\u4e00-\u9fa5]/g; //去除中文
    let addlistItem = wx.getStorageSync('addlistItem');
    let name = e.currentTarget.dataset.name;
    let priceprice = e.currentTarget.dataset.price2;
    let index = e.currentTarget.dataset.index;
    let imgimg = e.currentTarget.dataset.imgimg;
    let attrid = e.currentTarget.dataset.attrid;
    var price = '';
    if (e.currentTarget.dataset.price == 0) {
      price = that.data.curPrice
    } else {
      price = e.currentTarget.dataset.price
    }
    let id = e.currentTarget.dataset.id;
    addlistItem.original_price = price;
    addlistItem.size = name;
    addlistItem.attrid = attrid;
    if (imgimg != '') {
      addlistItem.pic_url = imgimg;
    }
    wx.setStorageSync('addlistItem', addlistItem)
    that.setData({
      group_index: index,
      price: price,
      curPrice: price,
      curPrice3: price,
      guige: name,
      attrid: id,
      priceprice: priceprice,
      imgimg
    })
    if (that.data.group_index == -1) {
      that.setData({
        curPrice: that.data.chooseprice,
      })
    }
  },
  priceclick(e) {
    let that = this;
    that.setData({
      priceshow: !that.data.priceshow
    })
    setTimeout(function () {
      that.setData({
        priceshow: !that.data.priceshow
      })
    }, 1000)
  },
  del(e) {
    let that = this;
    let carindex = that.data.index2;
    getApp().request({
      url: getApp().api.delTemporaryPro,
      method: "post",
      data: {
        id: e.currentTarget.dataset.id
      },
      success: function (res) {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2];
        let cartList = prevPage.data.cartList;
        cartList.splice(carindex, 1)
        wx.navigateBack({
          success() {
            prevPage.setData({
              cartList: cartList
            })
          }
        })
      }
    });
    // 删除列表当前数据
    var index = e.currentTarget.dataset.id;
    var cartList = wx.getStorageSync("listarr");
    if (cartList[index]) {
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
    }
  },
  onShareAppMessage: function (e) {
    if (e.from == 'button') {
      if (wx.getStorageSync('msg') == '') {
        return {
          title: '设计知+_' + this.data.goodsDetail.name,
          path: 'pages1/commodityDetail/commodityDetail?user_id=' + wx.getStorageSync('USER_INFO').id + '&carid=' + wx.getStorageSync('carid') + '&index=1&id=' + this.data.id
        }
      } else {
        return {
          title: '设计知+_' + this.data.goodsDetail.name
        }
      }
    }
  },
  // 返回设计师名片也
  backme() {
    let that = this;
    wx.navigateTo({
      url: '/pages1/postCard/postCard?user_id=' + that.data.user_ida + '&id=' + that.data.carid,
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
          wx.setStorageSync('roomid', obj);
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
          wx.removeStorageSync('item');
        }
      })
    } else {
      obj.id = e.currentTarget.dataset.id;
      obj.name = e.currentTarget.dataset.name;
      wx.setStorageSync('roomid', obj);
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
      wx.removeStorageSync('item');
    }
  },
  collectlist() {
    wx.navigateTo({
      url: '/pages1/collectlist/collectlist',
    })
  },
  replace(e) {
    var item = wx.getStorageSync("addlistItem");
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 3] //获取上一个页面信息栈
    for (let i in prevPage.data.replacelist[prevPage.data.replace_id]) {
      if (prevPage.data.replacelist[prevPage.data.replace_id][i].id == item.id) {
        wx.showToast({
          title: '您已经添加过此产品',
          icon: 'none'
        })
        return;
      }
    }
    for (let i in wx.getStorageSync('replacelist')) {
      if (i == item.id) {
        wx.showToast({
          title: '您已经添加过此产品',
          icon: 'none'
        })
        return;
      }
    }
    let that = this;
    that.setData({
      plusprice_tan: !that.data.plusprice_tan
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
    let item = wx.getStorageSync('addlistItem');
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 3] //获取上一个页面信息栈
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
    if (item.attrid) {
      jsona.attr = item.attrid;
    } else {
      jsona.attr = 1;
    }
    jsona.replace_price = Math.abs(that.data.plus_price);
    jsona.id = item.id;
    jsona.room = roomId;
    jsona.material = item.material;
    jsona.original_price = item.original_price;
    jsona.size = item.size;
    jsona.cover_pic = item.pic_url;
    jsona.parent_goods_id = replace_id;
    json[jsona.id] = jsona;
    wx.setStorageSync('replacelist', json)
    that.setData({
      plus_price: 0
    })
    wx.showToast({
      title: '加入成功!',
    })
  },
  send(e) {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      util.checkLogin();
      return;
    }
    let list = getApp().globalData.onConversationListUpdated;
    for (let i in list) {
      if (list[i].userProfile.userID == this.data.designer_id) {
        let time = Math.round(new Date() / 1000) - list[i].lastMessage.lastTime;
        if (time < 60 && list[i].lastMessage.payload.data == e.currentTarget.dataset.id) {
          wx.navigateTo({
            url: '../im/im?userid=' + this.data.designer_id + "&id=" + list[i].conversationID + "&username=" + list[i].userProfile.nick + "&useravater=" + list[i].userProfile.avatar,
          })
          return;
        }
      }
    }
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 3];
    var obj = {
      userid: this.data.designer_id ? this.data.designer_id : curPage.data.userid,
      id: e.currentTarget.dataset.id,
      name: e.currentTarget.dataset.name,
      pic: e.currentTarget.dataset.pic,
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
      if (that.data.designer_id) {
        let message = imResponse.data.message;
        // 查询用户信息
        let promise = tim.getUserProfile({
          userIDList: ["" + that.data.designer_id] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
        });
        promise.then(function (imResponse) {
          wx.navigateTo({
            url: '../im/im?im=im&id=' + message.conversationID + "&userid=" + that.data.designer_id + '&useravater=' + imResponse.data[0].avatar + '&username=' + imResponse.data[0].nick,
          })
        }).catch(function (imError) {});
      } else {
        wx.navigateBack({
          delta: 2
        })
      }

    }).catch(function (imError) {
      // 发送失败
    });
  },
  sharebtn() {
    this.setData({
      share_box: !this.data.share_box
    })
  },
  downloadimg() {
    wx.showLoading({
      title: '',
    })
    let that = this;
    let img1 = new Promise((resolve, reject) => {
      wx.downloadFile({
        url: that.data.imgimg ? that.data.imgimg.replace('http', 'https') : that.data.goodsDetail.cover_pic.replace('http', 'https'),
        success(res) {
          resolve(res.tempFilePath)
        }
      })
    })
    let img2 = new Promise((resolve, reject) => {
      app.request({
        url: app.api.shop_ewm,
        method: 'POST',
        data: {
          goods_id: that.data.goodsDetail.id,
          designer_id: wx.getStorageSync('level_name') != '普通用户' && wx.getStorageSync('level_name') ? wx.getStorageSync('USER_INFO').id : ''
        },
        success: (res) => {
          console.log(res)
          wx.downloadFile({
            url: res.data.pic_url,
            success(res) {
              resolve(res.tempFilePath)
            }
          })
        }
      })
    })
    let img3 = new Promise((resolve, reject) => {
      var Expression = /(https):\/\/([\w.]+\/?)\S*/;
      var objExp = new RegExp(Expression);
      let img = '';
      if (objExp.test(wx.getStorageSync('avatar'))) {
        img = wx.getStorageSync('avatar');
      } else {
        img = wx.getStorageSync('avatar').replace('http', 'https')
      }
      if (wx.getStorageSync('avatar')) {
        console.log(img)
        wx.downloadFile({
          url: img,
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })

    Promise.all([img1, img2, img3]).then(res => {
      console.log(res)
      that.canvas(res)
    })
  },
  // 开始画图
  canvas(img) {
    let that = this;
    const ctx = wx.createCanvasContext('canvas'); //创建画布
    wx.createSelectorQuery().select('#canvas2').boundingClientRect(function (rect) {
      var height = rect.height;
      var width = rect.width;
      ctx.setFillStyle('#ccc')
      ctx.fillRect(0, 0, width, height);
      /**
       * 
       * @param {CanvasContext} ctx canvas上下文
       * @param {number} x 圆角矩形选区的左上角 x坐标
       * @param {number} y 圆角矩形选区的左上角 y坐标
       * @param {number} w 圆角矩形选区的宽度
       * @param {number} h 圆角矩形选区的高度
       * @param {number} r 圆角的半径
       */
      // 开始绘制
      var x = 20
      var y = 20
      var w = width - 40
      var h = height - 40
      var r = 10
      ctx.beginPath()
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      // 这里是使用 fill 还是 stroke都可以，二选一即可
      ctx.setFillStyle('#fff')
      ctx.setStrokeStyle('#fff')
      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

      // border-top
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      // 右上角
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

      // border-right
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

      // border-bottom
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      // 左下角
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

      // border-left
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)

      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      ctx.stroke()
      ctx.closePath()
      ctx.fill()
      // 剪切
      ctx.restore();
      ctx.save();
      // 头图
      if (img[0]) {
        let x = 20
        let y = 20
        let w = 276
        let h = 240
        let r = 10
        let rate = 0.5
        ctx.beginPath()
        // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
        // 这里是使用 fill 还是 stroke都可以，二选一即可
        // ctx.setFillStyle('#fff')
        // ctx.setStrokeStyle('#fff')
        // 左上角
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
        // border-top
        ctx.moveTo(x + r, y)
        ctx.lineTo(x + w - r, y)
        ctx.lineTo(x + w, y + r)
        // 右上角
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
        // border-right
        ctx.lineTo(x + w, y + h - r)
        ctx.lineTo(x + w - r, y + h)
        // 右下角
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
        // border-bottom
        ctx.lineTo(x + r, y + h)
        ctx.lineTo(x, y + h - r)
        // 左下角
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
        // border-left
        ctx.lineTo(x, y + r)
        ctx.lineTo(x + r, y)
        // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
        ctx.clip()
        ctx.drawImage(img[0], 20, 20, 276, 230);
        ctx.setFontSize(30);
        // 剪切
        ctx.restore();
        ctx.save();
      }
      // 标题
      if (that.data.goodsDetail.name) {
        const CONTENT_ROW_LENGTH = 18; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = that.textByteLength(that.data.goodsDetail.name, CONTENT_ROW_LENGTH);
        let contentHh = 20 * 1;
        ctx.setFillStyle('gray');
        ctx.setFontSize(14);
        for (let m = 0; m < contentArray.length; m++) {
          ctx.fillText(contentArray[m], 40, 270 + contentHh * m);
        }
        ctx.beginPath()
        ctx.setStrokeStyle('#ccc')
        ctx.moveTo(180, 290)
        ctx.lineTo(180, 250)
        ctx.stroke()
      }
      if (that.data.goodsDetail.material) {
        ctx.setFillStyle('#ccc');
        ctx.setFontSize(10);
        ctx.fillText(that.data.guige ? "尺寸：" + that.data.guige : that.data.goodsDetail.size ? "尺寸：" + that.data.goodsDetail.size : '尺寸：暂无', 40, 320);
      }
      if (that.data.goodsDetail.material) {
        ctx.setFillStyle('#ccc');
        ctx.setFontSize(10);
        ctx.fillText("材质：" + that.data.goodsDetail.material, 40, 340);
      }
      if (that.data.goodsDetail.original_price) {
        ctx.setFillStyle('red');
        ctx.setFontSize(18);
        ctx.fillText(that.data.curPrice3 == '0.00' ? "￥" + that.data.goodsDetail.original_price : "￥" + that.data.curPrice3, 190, 270);

      }
      if (img[1]) {
        ctx.drawImage(img[1], 50, 360, 50, 50);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.setFontSize(12);
        let click_width = ctx.measureText('扫码了解更多').width;
        let w_width2 = (width - click_width) / 2
        ctx.setFillStyle('#666666');
        ctx.fillText('扫码了解更多', 40, 430);
      }
      if (img[2]) {
        ctx.beginPath();
        ctx.setFillStyle('#000');
        ctx.arc(250, 390, 30, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(img[2], 220, 360, 60, 60);
        ctx.restore();
        ctx.save();
      }


    }).exec()

    setTimeout(function () {
      ctx.draw(true, () => {
        that.saveimg();
      })
    }, 500)
  },
  saveimg() {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      destWidth: 632,
      destHeight: 922,
      success: function (res) {
        console.log(res)
        wx.hideLoading();
        that.setData({
          sharePic: res.tempFilePath,
          hidden1: false,
        })
      }
    });
  },
  // 多行处理
  textByteLength(text, num) {
    let strLength = 0; // text byte length
    let rows = 1;
    let str = 0;
    let arr = [];
    for (let j = 0; j < text.length; j++) {
      if (text.charCodeAt(j) > 255) {
        strLength += 2;
        if (strLength > rows * num) {
          strLength++;
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      } else {
        strLength++;
        if (strLength > rows * num) {
          arr.push(text.slice(str, j));
          str = j;
          rows++;
        }
      }
    }
    arr.push(text.slice(str, text.length));
    return [strLength, arr, rows] //  [处理文字的总字节长度，每行显示内容的数组，行数]
  },
  saveposter() {
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.sharePic, //这个只是测试路径，没有效果
      success(res) {
        console.log("success");
        wx.showToast({
          title: '保存成功，请到相册查看',
          icon: 'none'
        })
        that.setData({
          sharePic: false
        })
      },
      fail: function (res) {
        console.log(res);
        if (res.errMsg != 'openSetting:ok') {
          wx.showModal({
            title: '提示',
            content: '您好,请先授权，在保存此图片。',
            cancelText: '取消',
            confirmText: '是',
            success(res) {
              if (res.cancel) {
                // 用户点击了取消属性的按钮，对应选择了'女'

              } else if (res.confirm) {
                // 用户点击了确定属性的按钮，对应选择了'男'
                wx.openSetting({
                  success(settingdata) {
                    console.log(settingdata)
                    if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                      console.log("获取权限成功，再次点击图片保存到相册")
                    } else {
                      console.log("获取权限失败")
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  close() {
    this.setData({
      sharePic: false
    })
  },
  getSenceParams(scene, key) {
    var spl = scene.split(",");
    for (var i = 0; i < spl.length; i++) {
      var k = spl[i].split(":"); //type:2
      if (k[0] == key) {
        return k[1]
      }
    }
    return "";
  },
})