var util = require('../../utils/util.js')
let tim = getApp().globalData.tim;
Page({
  data: {
    height:'',
    productList: [],
    newTopArr: [],
    curTop: "",
    curShow: "",
    topIndex: {},
    keyword: "", //搜索关键字
    is_merchant: '',
    productList2:[]
  },
  onLoad: function(options) {
    let self = this;
    wx.createSelectorQuery().selectAll('.add_new').boundingClientRect(function (rect) {
      self.setData({
        height: wx.getSystemInfoSync().windowHeight - rect[0].height
      })
    }).exec();
    self.setData({
      is_merchant: wx.getStorageSync('is_merchant')
    })
    if (options.user) {
      self.setData({
        user_id: options.user,
      })
      wx.setNavigationBarTitle({
        title: 'TA的案例'
      })
    }
    if (options.imtype) {
      self.setData({
        imtype: options.imtype
      })
    }
  },
  onShow() {
    var self = this;
    if (self.data.user_id) {
      var obj = {
        user_id: self.data.user_id
      }
      self.getList(obj);
    } else {
      self.getList();
    }
  },
  getKeyword: function(e) {
    var val = e.detail.value;
    this.setData({
      keyword: val
    })
  },
  search: function() {
    var obj = {};
    if (this.data.user_id) {
      obj.keyword = this.data.keyword;
      obj.user_id = this.data.user_id;
      this.getList(obj);
    } else {
      obj.keyword = this.data.keyword;
      this.getList(obj);
    }
  },
  //获取作品列表
  getList: function(params) {
    var self = this;
    getApp().request({
      url: getApp().api.projectList,
      method: "post",
      data: params,
      success: function(res) {
        var arr = [];
        for (let i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].is_show == 1) {
            arr.push(res.data.list[i])
          }
        }
        self.setData({
          productList: res.data.list,
          productList2: arr
        })
      }
    })
  },
  /*跳转到我的作品*/
  link_project(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid
    if (self.data.user_id) {
      wx.navigateTo({
        url: "/pages1/productDetail/productDetail?id=" + id + '&type=1'
      })
    } else {
      wx.navigateTo({
        url: "/pages1/productDetail/productDetail?id=" + id
      })
    }
    getApp().request({
      url: getApp().api.addCardActivity,
      method: "post",
      data: {
        card_id: userid,
        type: 106,
        relation_id: e.currentTarget.dataset.id

      },
    })
  },
  //数组排序
  creatCompare: function(propertyName) {
    return function(obj1, obj2) {
      var value1 = obj1[propertyName];
      var value2 = obj2[propertyName];
      return value2 - value1;
    }
  },
  //设置是否置顶
  setTop: function(e) {
    var self = this;
    var is_show = e.currentTarget.dataset.show;
    if (is_show == 1) {
      var topValue = e.currentTarget.dataset.top;
      if (topValue == 0) {
        self.setData({
          curTop: 1
        })
      } else if (topValue == 1) {
        self.setData({
          curTop: 0
        })
      }
      var productId = e.currentTarget.dataset.id;
      getApp().request({
        url: getApp().api.setTop,
        method: "post",
        data: {
          id: productId,
          is_top: self.data.curTop
        },
        success: function(res) {
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];
          prevPage.getProjectData();
          self.getList();
          self.setnewT();
        }
      })
    } else {
      getApp().core.showModal({
        title: "提示",
        content: "作品尚未展示，请先设置展示",
        showCancel: !1,
      })
    }
  },
  setnewT: function() {
    var self = this;
    var setNewT = setTimeout(function() {
      var arr = self.data.productList;
      var arr2 = [];
      var length = arr.length;
      for (var i = 0; i < length; i++) {
        if (arr[i].is_show == 1) {
          arr2.push(arr[i])
        }
      }
      var newarr = arr2.sort(self.creatCompare("is_top"));
      self.setData({
        newTopArr: arr2.sort(self.creatCompare("is_top"))
      })
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.getProjectData();
      prevPage.setNewTop(self.data.newTopArr);
    }, 500)
    self.setData({
      timer: setTimeout
    })
  },
  //设置是否展示
  setShow: function(e) {
    var self = this;
    var is_top = e.currentTarget.dataset.top;
    if (is_top == 0) {
      var showValue = e.currentTarget.dataset.show;
      if (showValue == 0) {
        self.setData({
          curShow: 1
        })
      } else if (showValue == 1) {
        self.setData({
          curShow: 0
        })
      }
      var idArr = [];
      var productId = e.currentTarget.dataset.id;
      idArr.push(productId);
      if (self.data.curShow == 1) {
        getApp().request({
          url: getApp().api.setShow,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: "post",
          data: {
            id: JSON.stringify(idArr),
            is_show: self.data.curShow
          },
          success: function(res) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.getProjectData();
            self.getList();
          }
        })
        // }
      } else {
        getApp().request({
          url: getApp().api.setShow,
          header: {
            'content-type': 'application/x-www-form-urlencoded',
          },
          method: "post",
          data: {
            id: JSON.stringify(idArr),
            is_show: self.data.curShow
          },
          success: function(res) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.getProjectData();
            self.getList();
          }
        })
      }
    } else {
      wx.showToast({
        title: '请先取消顶置',
        icon: 'none'
      })
    }
  },
  //点击编辑按钮
  //点击编辑按钮
  modifyMsg: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var remarks = e.currentTarget.dataset.remarks;
    var pic = e.currentTarget.dataset.pic;
    var type = 'manageproduct';
    var userid = e.currentTarget.dataset.userid
    if (getApp().core.getStorageSync(getApp().const.USER_INFO).id != userid) {
      wx.showToast({
        title: '这不是您的作品',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: "/pages1/modifyProduct/modifyProduct?id=" + id +
          '&name=' + name + '&remarks=' + remarks + '&pic=' + pic + '&type=' + type
      })
    }

  },
  onUnload: function() {

  },
  sendproduct(e) {
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 2];
    let id = curPage.data.userid;
    let obj = {};
    obj.userid = id;
    obj.name = e.currentTarget.dataset.name;
    obj.pic = e.currentTarget.dataset.pic;
    obj.id = e.currentTarget.dataset.id;
    obj.detail = e.currentTarget.dataset.detail;
    this.msg(obj);
  },
  msg(obj) {
    let that = this;
    // 示例：利用自定义消息实现投骰子功能
    // 1. 定义随机函数
    // function random(min, max) {
    //   return Math.floor(Math.random() * (max - min + 1) + min);
    // }
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createCustomMessage({
      to: '' + obj.userid,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        data: "" + obj.id, // 用于标识该消息是骰子类型消息
        description: obj.name + ',案例', // 获取骰子点数
        extension: obj.pic + ',' + obj.detail //其他
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function(imResponse) {
      // 发送成功
      var pages = getCurrentPages();
      var curPage = pages[pages.length - 2];
      wx.navigateBack({
        success(){
          curPage.pageScrollToBottom(11);
        }
      })
    }).catch(function(imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
    });
  },
  // 推荐
  recommend(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let is_recommend = e.currentTarget.dataset.is_recommend;
    let up = 'productList[' + index + '].is_recommend';
    let is_recommend2 = '';
    if (is_recommend == 1) {
      is_recommend2 = 0
    } else {
      is_recommend2 = 1
    }
    getApp().request({
      url: getApp().api.setopusnew,
      method: 'POST',
      data: {
        is_recommend: is_recommend2,
        id: id
      },
      success(res) {
        that.setData({
          [up]: is_recommend2
        })
      }
    })
  }
})