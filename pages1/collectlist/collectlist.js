// pages1/collectlist/collectlist.js
let tim = getApp().globalData.tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    choose: false,
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if(wx.getStorageSync('level_name') != '普通用户'){
      this.setData({
        show:true
      })
    }
    if (options.imtype == '聊天') {
      this.setData({
        imtype: options.imtype
      })
    }
    this.getlist();
  },
  getlist() {
    let that = this;
    let list = wx.getStorageSync('list_');
    let arr = [];
    let name = [];
    for (let i in list) {
      name.push(list[i][0].rooms)
      for (let j in list[i]) {
        arr.push(list[i][j])
      }
    }
    let obj2 = [];
    for (let i in name) {
      var obj = {};
      var lista = [];
      var num = 0;
      var num2 = 0;
      obj.name = name[i];
      obj.open = false;
      for (let j in arr) {
        if (arr[j].rooms === name[i]) {
          num += parseInt(arr[j].original_price * arr[j].number);
          num2 += parseInt(arr[j].number);
          lista.push(arr[j]);
        }
        obj.list = lista; //产品数组
        obj.price = num; //产品总价
        obj.number = num2; //产品单个的数量
      }
      obj2.push(obj)
    }
    if (obj2.length > 0) {
      obj2[0].open = true;
    }
    console.log(obj2)
    that.setData({
      list: obj2,
      name: name
    })
  },
  savebtn() {
    let that = this;
    let list = that.data.list;
    let arr = [];
    for (let i in list) {
      for (let j in list[i].list) {
        if (list[i].list[j].choose == true) {
          arr.push(list[i].list[j])
        }
      }
    }
    if (arr.length == 0) {
      wx.showToast({
        title: '请勾选生成套餐的产品',
        icon: "none"
      })
      return;
    }
    if (list.length == 0) {
      wx.showToast({
        title: '无添加商品',
        icon: "none"
      })
      return;
    }
    wx.navigateTo({
      url: '/pages1/addGroup/addGroup?collect=1',
    })
  },
  add(e) {
    let that = this;
    let num = e.currentTarget.dataset.num;
    let father = e.currentTarget.dataset.father;
    let arr = that.data.list;
    let id = e.currentTarget.dataset.id;
    let list = wx.getStorageSync('list_');
    father++
    num++
    let up = 'list[' + e.currentTarget.dataset.index2 + '].list[' + e.currentTarget.dataset.index + '].number';
    let up2 = 'list[' + e.currentTarget.dataset.index2 + '].number';
    that.setData({
      [up]: num,
      [up2]: father
    })
    var pricenum = 0;
    for (let i in arr[e.currentTarget.dataset.index2].list) {
      pricenum += parseInt(arr[e.currentTarget.dataset.index2].list[i].original_price * arr[e.currentTarget.dataset.index2].list[i].number)
    }
    let up3 = 'list[' + e.currentTarget.dataset.index2 + '].price';
    that.setData({
      [up3]: pricenum,
    })
    for (let i in list) {
      for (let j in list[i]) {
        if (id === list[i][j].id) {
          list[i][j].number = num;
        }
      }
    }
    wx.setStorageSync('list_', list)
  },
  reduce(e) {
    let that = this;
    let num = e.currentTarget.dataset.num;
    let id = e.currentTarget.dataset.id;
    let father = e.currentTarget.dataset.father;
    let list = wx.getStorageSync('list_');
    let arr = that.data.list;
    father--
    num--
    if (num == 0) {
      num = 1;
    }
    if (father < arr[e.currentTarget.dataset.index2].list.length) {
      father = arr[e.currentTarget.dataset.index2].list.length
    }
    let up = 'list[' + e.currentTarget.dataset.index2 + '].list[' + e.currentTarget.dataset.index + '].number';
    let up2 = 'list[' + e.currentTarget.dataset.index2 + '].number';
    that.setData({
      [up]: num,
      [up2]: father
    })
    var pricenum = 0;
    for (let i in arr[e.currentTarget.dataset.index2].list) {
      pricenum += parseInt(arr[e.currentTarget.dataset.index2].list[i].original_price * arr[e.currentTarget.dataset.index2].list[i].number)
    }
    let up3 = 'list[' + e.currentTarget.dataset.index2 + '].price';
    that.setData({
      [up3]: pricenum,
    })
    for (let i in list) {
      for (let j in list[i]) {
        if (id === list[i][j].id) {
          list[i][j].number = num;
        }
      }
    }
    wx.setStorageSync('list_', list)
  },
  del(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let father = e.currentTarget.dataset.index2;
    let price = e.currentTarget.dataset.price;
    let list = that.data.list;
    let num = list[father].list[index].number;
    let pricenum = Number(list[father].price) - Number(price);
    list[father].price = pricenum;
    list[father].number = list[father].number - num;
    list[father].list.splice(index, 1);
    console.log(list, pricenum)
    // return;
    if (list[father].list.length == 0) {
      list.splice(father, 1);
    }
    that.setData({
      list: list
    })
    let arr = wx.getStorageSync('list_');
    for (let i in arr) {
      for (let j in arr[i]) {
        if (id === arr[i][j].id) {
          arr[i].splice(j, 1)
        }
      }
    }
    if (list.length == 0) {
      wx.setStorageSync('list_', {})
    } else {
      for (let i in arr) {
        if (arr[i].length == 0) {
          console.log(i)
          delete(arr[i])
        }
      }
      wx.setStorageSync('list_', arr)
    }
  },
  open(e) {
    let index = e.currentTarget.dataset.index;
    let up = "list[" + index + "].open";
    let that = this;
    that.setData({
      [up]: !that.data.list[index].open
    })
  },
  checkboxChange(e) {
    let index = e.currentTarget.dataset.index;
    let val = e.currentTarget.dataset.val;
    let child = e.currentTarget.dataset.child;
    let id = e.currentTarget.dataset.id;
    let that = this;
    let up = "list[" + index + "].list[" + child + "].choose";
    that.setData({
      [up]: !val
    })
    let arr = wx.getStorageSync('list_');
    for (let i in arr) {
      for (let j in arr[i]) {
        if (id === arr[i][j].id) {
          arr[i][j].choose = !val;
        }
      }
    }
    wx.setStorageSync('list_', arr)
  },
  linkGoods: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.setStorageSync('item', e.currentTarget.dataset.item)
    var url = "/pages1/commodityDetail/commodityDetail?id=" + id + '&index=1&index2=2';
    if (self.data.show) {
      url += "&show=1";
    }
    wx.navigateTo({
      url: url
    })
  },
  checkboxall(e) {
    let list = this.data.list
    let arr = wx.getStorageSync('list_');
    if (!e.currentTarget.dataset.val) {
      for (let i in list) {
        for (let j in list[i].list) {
          list[i].list[j].choose = !e.currentTarget.dataset.val;
        }
      }
      for (let i in arr) {
        for (let j in arr[i]) {
          arr[i][j].choose = !e.currentTarget.dataset.val;
        }
      }
    } else {
      for (let i in list) {
        for (let j in list[i].list) {
          list[i].list[j].choose = !e.currentTarget.dataset.val;
        }
      }
      for (let i in arr) {
        for (let j in arr[i]) {
          arr[i][j].choose = !e.currentTarget.dataset.val;
        }
      }
    }
    wx.setStorageSync('list_', arr)
    this.setData({
      choose: !e.currentTarget.dataset.val,
      list: list
    })

  },
  send(e) {
    console.log(e)
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 2];
    let id = curPage.data.userid;
    let obj = {};
    obj.userid = id;
    obj.name = e.currentTarget.dataset.name;
    obj.pic = e.currentTarget.dataset.pic;
    obj.id = e.currentTarget.dataset.id;
    obj.price = e.currentTarget.dataset.price;
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
    promise.then(function(imResponse) {
      // 发送成功
      console.log(imResponse);
      var pages = getCurrentPages();
      var curPage = pages[pages.length - 2];
      wx.navigateBack({
        success() {
          curPage.pageScrollToBottom(11);
        }
      })
    }).catch(function(imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
})