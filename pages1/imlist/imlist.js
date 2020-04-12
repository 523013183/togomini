var util = require("../../utils/util.js");
let tim = getApp().globalData.tim;
let time = '';
Page({
  data: {
    delBtnWidth: 150, //删除按钮宽度单位（rpx）
    moveWidth: 0,
    list: [],
    activityArr: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let promise = tim.getConversationList();
    promise.then(function (imResponse) {
      const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
      that.setData({
        list: conversationList
      })
    }).catch(function (imError) {
      console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
    });
    wx.removeTabBarBadge({
      index: 1,
    })
    let that = this;
    that.getCardMsg();
  },
  msg(e) {
    let userid = e.currentTarget.dataset.userid;
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let avater = e.currentTarget.dataset.avater;
    wx.navigateTo({
      url: '../im/im?userid=' + userid + "&id=" + id + "&username=" + name + "&useravater=" + avater,
    })
  },
  onShow(e) {
    // 
    let promise = tim.getConversationList();
          promise.then(function (imResponse) {
            const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
            that.setData({
              list: conversationList
            })
          }).catch(function (imError) {
            console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
          });
    // 
    wx.removeTabBarBadge({
      index: 1,
    })
    let that = this;
    that.getCardMsg();
    that.setData({
      time: setInterval(function () {
        if (getApp().globalData.onMessageReceived.length > 0) {
          let promise = tim.getConversationList();
          promise.then(function (imResponse) {
            const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
            that.setData({
              list: conversationList
            })
            getApp().globalData.onMessageReceived = [];
          }).catch(function (imError) {
            console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
          });
        }
      }, 500)
    })

    // let msg = getApp().globalData.onConversationListUpdated;
    // for (let i in msg) {
    //   if (msg[i].conversationID == that.data.id) {
    //     msg[i].unreadCount = 0;
    //   }
    // }
    // that.setData({
    //   list: msg
    // })
  },
  onUnload() {},
  del(e) {
    wx.showLoading({
      title: '',
    })
    let id = e.currentTarget.dataset.id;
    let promise = tim.deleteConversation(id);
    promise.then(function (imResponse) {
      console.log(imResponse)
      setTimeout(function () {
        wx.hideLoading()
      }, 5000)
      //删除成功。
      const {
        conversationID
      } = imResponse.data; // 被删除的会话 ID
    }).catch(function (imError) {
      wx.hideLoading()
    });
  },

  onHide() {
    clearInterval(this.data.time)
  },

  /**手指触摸开始*/
  touchS: function (e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },

  /**手指触摸滑动**/
  touchM: function (e) {
    var that = this;
    if (e.touches.length == 1) {
      //记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      //计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      that.setData({
        moveWidth: disX
      })
      //delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      var btnWidth = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0rpx";
        btnWidth = "width:0rpx";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "rpx";
        btnWidth = "width:" + disX + "rpx";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "rpx";
          btnWidth = "width:" + delBtnWidth + "rpx";
        }
      }
      //获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.list;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      list[index].btnWidth = btnWidth;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  /**手指触摸结束**/
  touchE: function (e) {
    var that = this;
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";
      var btnWidth = disX > delBtnWidth / 2 ? "width:" + delBtnWidth + "rpx" : "width:0rpx";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.list;
      list[index].txtStyle = txtStyle;
      list[index].btnWidth = btnWidth;
      //更新列表的状态
      that.setData({
        list: list
      });
    }
  },
  //获取名片动态数据
  getCardMsg: function () {
    var self = this;
    getApp().request({
      url: getApp().api.cardActivity,
      method: "post",
      data: {
        card_id: wx.getStorageSync('USER_INFO').id
      },
      success: function (res) {
        let arr = [];
        for (let i in res.data) {
          if (res.data[i].type == '105' || res.data[i].type == '113' || res.data[i].type == '112' || res.data[i].type == '120') {
            arr.push(res.data[i])
          }
        }
        let arr2 = 0;
        for (let i in arr) {
          if (arr[i].is_read == 0 && arr[i].mobile != '') {
            arr2++
          }
        }
        if (arr2 === 0) {
          wx.removeTabBarBadge({
            index: 1,
          })
        } else {
          wx.setTabBarBadge({
            index: 1,
            text: 'new'
          })
        }
        self.setData({
          activityArr: arr,
        })
      }
    })
  },
  isread(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    getApp().request({
      url: getApp().api.readmsg,
      method: 'POST',
      data: {
        id,
        card_id: wx.getStorageSync('carid')
      },
      success(res) {
        that.getCardMsg();
      }
    })
  },
  callphone(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
})