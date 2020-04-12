// pages1/im/im.js
// 创建 SDK 实例，TIM.create() 方法对于同一个 SDKAppID 只会返回同一份实例
let tim = getApp().globalData.tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: false,
    nextReqMessageID: '',
    imlist: [],
    val: '',
    emojiChar: ["😁", "😋", "😜", "😉", "😌", "😅", "😳", "😊", "😝", "😰", "😠", "😩", "😲", "😞", "😭", "😍", "😖", "😱", "😡", "😚", "😤"],
    emoji: true,
    more: true,
    shade: true,
    scrollTop: 0,
    typename: false,
    height:''
  },
  onPageScroll: function (e) {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.showLoading({
      title: '',
    })
    let that = this;
    this.setData({
      msg_id:e.id
    })
    var query = wx.createSelectorQuery();
    query.select('#j_page').boundingClientRect();
    query.exec(function (res) {
      var windowHeight = wx.getSystemInfoSync().windowHeight;
      that.setData({
        height:windowHeight - res[0].height
      })
    })
    if (e.userid) {
      that.setData({
        id: e.id,
        userid: e.userid,
        me: wx.getStorageSync('avatar'),
        her: e.useravater,
      })
    }
    wx.setNavigationBarTitle({
      title: e.username
    })
    let promisea = tim.getMessageList({
      conversationID: e.id,
      count: 15
    });
    // 获取消息
    promisea.then(function (imResponse) {
      tim.setMessageRead({
        conversationID: e.id
      });
      let msglist = imResponse.data.messageList;
      let timestamp = new Date().getTime() / 1000 - msglist[msglist.length - 1].time;
      let heid = msglist[msglist.length - 1].from;
      let stylist = wx.getStorageSync('stylist');
      var typename = true;
      for (let i in stylist) {
        if (stylist[i].id == e.id) {
          typename = false;
          break;
        }
      }
      if (timestamp > 1800 && heid == wx.getStorageSync('USER_INFO').id && typename) {
        that.setData({
          typename: true
        })
      }
      let promise_a = tim.getMessageList({
        conversationID: e.id,
        count: 15
      });
      promise_a.then(function (e) {})
      that.pageScrollToBottom(11);
      const messageList = imResponse.data.messageList; // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      let list = imResponse.data.messageList;
      for (let i in list) {
        if (list[i].type == 'TIMCustomElem') {
          if (typeof (list[i].payload.description) == "string") {
            var arr = list[i].payload.description.split(",");
            list[i].payload.description = arr;
            var arr2 = list[i].payload.extension.split(",");
            list[i].payload.extension = arr2;
          }
        }
      }
      that.setData({
        imlist: list,
        nextReqMessageID: nextReqMessageID
      })
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    });
    // 收到的未读新消息
    tim.on(getApp().TIM.EVENT.MESSAGE_RECEIVED, function (event) {
      let promisea = tim.getMessageList({
        conversationID: e.id,
        count: 15
      });
      promisea.then(function (e) {})
      let list = that.data.imlist;
      for (let i in event.data) {
        if (event.data[i].conversationID == that.data.id) {
          if (event.data[i].type == 'TIMCustomElem') {
            if (typeof (event.data[i].payload.description) == "string") {
              var arr = event.data[i].payload.description.split(",");
              event.data[i].payload.description = arr;
              var arr2 = event.data[i].payload.extension.split(",");
              event.data[i].payload.extension = arr2;
              list.push(event.data[i])
            } else {}
          } else {
            list.push(event.data[i])
          }
        }
      }
      that.setData({
        imlist: list
      })
      that.pageScrollToBottom();
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let promisea = tim.getMessageList({
      conversationID: that.data.id,
      count: 15
    });
    // 获取消息
    promisea.then(function (imResponse) {
      tim.setMessageRead({
        conversationID: that.data.id
      });
      const messageList = imResponse.data.messageList; // 消息列表。
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。
      let list = imResponse.data.messageList;
      for (let i in list) {
        if (list[i].type == 'TIMCustomElem') {
          if (typeof (list[i].payload.description) == "string") {
            var arr = list[i].payload.description.split(",");
            list[i].payload.description = arr;
            var arr2 = list[i].payload.extension.split(",");
            list[i].payload.extension = arr2;
          }
        }
      }
      that.setData({
        imlist: list,
        nextReqMessageID: nextReqMessageID
      })
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      setTimeout(function () {
        wx.hideLoading()
      }, 500)
    });
  },
  msg() {
    let that = this;
    if (that.data.val == "") {
      wx.showToast({
        title: '消息不能为空！',
        icon: 'none'
      })
    }
    // 2. 发送消息
    let message = tim.createTextMessage({
      to: that.data.userid,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        text: that.data.val
      }
    });
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      let imlist = that.data.imlist;
      imlist.push(imResponse.data.message);
      that.setData({
        imlist,
        val: '',
        emoji: true,
        more: true,
        focus: true,
        typename: false
      })
      that.pageScrollToBottom();
    }).catch(function (imError) {
      // 发送失败
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '',
    })
    let that = this;
    let promise = tim.getMessageList({
      conversationID: that.data.id,
      nextReqMessageID: that.data.nextReqMessageID,
      count: 10
    });
    promise.then(function (imResponse) {
      wx.stopPullDownRefresh()
      wx.hideLoading()
      wx.showToast({
        title: '加载成功',
        icon: 'none'
      })
      const messageList = imResponse.data.messageList; // 消息列表。
      for (let i in messageList) {
        if (messageList[i].type == 'TIMCustomElem') {
          if (typeof (messageList[i].payload.description) == "string") {
            var arr = messageList[i].payload.description.split(",");
            messageList[i].payload.description = arr;
          }
        }
      }
      let list = that.data.imlist;
      var dd = [...messageList, ...list];
      const nextReqMessageID = imResponse.data.nextReqMessageID; // 用于续拉，分页续拉时需传入该字段。  
      if (nextReqMessageID === that.data.nextReqMessageID) {
        wx.showToast({
          title: '没有更多了',
          icon: 'none'
        })
        return;
      }
      that.setData({
        nextReqMessageID,
        imlist: dd
      })
      const isCompleted = imResponse.data.isCompleted; // 表示是否已经拉完所有消息。
      wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
        // 使页面滚动到底部
        var top = parseInt(rect.height - that.data.scrollTop)
        wx.pageScrollTo({
          scrollTop: top
        })
        that.setData({
          scrollTop: rect.height
        })
      }).exec()
    });
  },
  input(e) {
    this.setData({
      val: e.detail.value
    })
  },
  pageScrollToBottom: function (obj) {
    let that = this;
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      var top = parseInt(rect.height - that.data.scrollTop)
      if (obj != 11) {
        wx.pageScrollTo({
          scrollTop: rect.height + 50
        })
      } else {
        wx.pageScrollTo({
          scrollTop: 9999999
        })
      }
      that.setData({
        scrollTop: rect.height + 50
      })
    }).exec()
  },
  img(e) {
    let img = e.currentTarget.dataset.img;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  more() {
    let that = this;
    that.setData({
      more: !that.data.more,
      emoji: true,
    })
  },
  // TA套餐
  linkpackage(e) {
    if (e) {
      wx.navigateTo({
        url: '/pages1/manageGroup/manageGroup?id=' + e + '&imtype=聊天',
      })
    } else {
      wx.navigateTo({
        url: '/pages1/manageGroup/manageGroup?imtype=聊天',
      })
    }
  },
  // TA案例
  linkManagePro(e) {
    let self = this;
    if (e) {
      wx.navigateTo({
        url: "/pages1/manageProducts/manageProducts?user=" + e + '&imtype=聊天'
      })
    } else {
      wx.navigateTo({
        url: "/pages1/manageProducts/manageProducts?imtype=我的聊天"
      })
    }
  },
  sendimg() {
    let that = this;
    wx.chooseImage({
      sourceType: ['album', 'camera'], // 从相册选择
      count: 1, // 只选一张，目前 SDK 不支持一次发送多张图片
      success: function (res) {
        // 2. 创建消息实例，接口返回的实例可以上屏
        let message = tim.createImageMessage({
          to: that.data.userid,
          conversationType: getApp().TIM.TYPES.CONV_C2C,
          payload: {
            file: res
          },
          onProgress: function (event) {
            wx.showLoading({
              title: '',
            })
          }
        });
        // 3. 发送图片
        let promise = tim.sendMessage(message);
        promise.then(function (imResponse) {
          // 发送成功
          let imlist = that.data.imlist;
          imlist.push(imResponse.data.message);
          that.setData({
            imlist,
            more: !that.data.more
          })
          that.pageScrollToBottom();
          setTimeout(function () {
            wx.hideLoading();
          }, 500)
        }).catch(function (imError) {
          setTimeout(function () {
            wx.hideLoading();
            wx.showToast({
              title: '发送失败，稍后重试！',
              icon: 'none'
            })
          }, 500)
          // 发送失败
        });
      }
    })
  },
  onUnload() {
    var pages = getCurrentPages();
    var Page = pages[pages.length - 2]; //当前页
    Page.data.id = this.data.id;
  },
  sendemoji() {
    this.setData({
      emoji: !this.data.emoji,
      more: true,
    })
  },
  emojiimg(e) {
    let emoji = e.currentTarget.dataset.emoji;
    this.setData({
      val: this.data.val += emoji
    })
  },
  detail(e) {
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    if (type == '案例') {
      wx.navigateTo({
        url: "/pages1/productDetail/productDetail?id=" + id + "&type=1"
      })
    } else if (type == '普通套餐') {
      wx.navigateTo({
        url: "/pages1/groupDetail/groupDetail?id=" + id
      })
    } else if (type == '海报套餐') {
      wx.navigateTo({
        url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + '&type=1'
      })
    } else {
      wx.navigateTo({
        url: "/pages1/commodityDetail/commodityDetail?id=" + id,
      })
    }
  },
  // 套餐
  taocan() {
    let that = this;
    wx.showActionSheet({
      itemList: ['TA的套餐', '我的套餐'],
      success(res) {
        that.setData({
          more: !that.data.more
        })
        if (res.tapIndex == 0) {
          that.linkpackage(that.data.userid);
        } else {
          that.linkpackage();
        }
      }
    })
  },
  // 案例
  anli() {
    let that = this;
    wx.showActionSheet({
      itemList: ['TA的案例', '我的案例'],
      success(res) {
        that.setData({
          more: !that.data.more
        })
        if (res.tapIndex == 0) {
          that.linkManagePro(that.data.userid);
        } else {
          that.linkManagePro();
        }
      }
    })
  },
  // 产品
  chanpin() {
    let that = this;
    that.setData({
      more: !that.data.more
    })
    wx.navigateTo({
      url: '/pages1/productWarehouse/productWarehouse?imtype=聊天',
    })
  },
  // 图片
  tupian() {
    let that = this;
    that.sendimg();
  },
  // 防穿透
  doNotMove: function () {
    return;
  },
  collect() {
    let that = this;
    that.setData({
      more: !that.data.more
    })
    wx.navigateTo({
      url: '/pages1/collectlist/collectlist?imtype=聊天',
    })
  },
  remind() {
    let that = this;
    let stylist = wx.getStorageSync('stylist');
    getApp().request({
      url: getApp().api.msgnotice,
      method: 'POST',
      data: {
        uid: that.data.userid
      },
      success(res) {
        if (res.code == 0) {
          that.setData({
            typename: false
          })
          let obj = {
            id: that.data.id,
            timestamp: new Date().getTime()
          }
          stylist.push(obj);
          wx.setStorageSync('stylist', stylist);
          wx.showToast({
            title: '已通知到该设计师',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  onUnload(){
    // let that = this;
    // tim.setMessageRead({
    //   conversationID: that.data.msg_id
    // });
  }
})