Page({
  data: {
    shili: 3,
    userName: "",
    job: "",
    job_year: "",
    style: "",
    design_fees: "",
    phoneNumber: null,
    cardCaseArr: [],
    delBtnWidth: 150, //删除按钮宽度单位（rpx）
    moveWidth: 0,
  },
  goDetail: function(e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid;
    var a = '/pages1/postCard/postCard?id=' + id + "&user_id=" + userid; //点击分享消息是打开的页面
    wx.navigateTo({
      url: a,
    })
  },
  /**手指触摸开始*/
  touchS: function(e) {
    //判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        //记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    }
  },

  /**手指触摸滑动**/
  touchM: function(e) {
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
      var list = that.data.cardCaseArr;
      //将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;
      list[index].btnWidth = btnWidth;
      //更新列表的状态
      this.setData({
        cardCaseArr: list
      });
    }
  },

  /**手指触摸结束**/
  touchE: function(e) {
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
      var list = that.data.cardCaseArr;
      list[index].txtStyle = txtStyle;
      list[index].btnWidth = btnWidth;
      //更新列表的状态
      that.setData({
        cardCaseArr: list
      });
    }
  },
  onLoad: function(options) {
    if (options.shili) {
      this.setData({
        shili: options.shili
      })
      wx.setNavigationBarTitle({
        title: '示例名片'
      })
      this.getCardMsg2()
    } else {
      this.getCardMsg();
    }
  },
  // 示例名片
  getCardMsg2() {
    wx.showLoading({
      title: '',
    })
    var self = this;
    getApp().request({
      url: getApp().api.relation_list,
      method: 'POST',
      data: {
        is_example: 1
      },
      success(res) {
        setTimeout(function() {
          wx.hideLoading();
        }, 500)
        for (let i in res.data.list) {
          res.data.list[i].style = JSON.parse(res.data.list[i].style)
        }
        self.setData({
          cardCaseArr: res.data.list,
        })
      }
    })
  },
  //获取名片夹详情
  getCardMsg: function() {
    wx.showLoading({
      title: '',
    })
    var self = this;
    getApp().request({
      url: getApp().api.cardList,
      method: "post",
      success: function(res) {
        console.log(res)
        setTimeout(function() {
          wx.hideLoading();
        }, 500)
        self.setData({
          cardCaseArr: res.data,
        })
      }
    });
  },
  //打电话给设计师
  callDesigner: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  //加设计师微信
  addWechat: function(e) {
    var self = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.wechat,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            wx.showToast({
              title: '复制成功'
            })
          }
        })
      }
    })
  },
  //删除名片
  delCard: function(e) {
    var self = this;
    getApp().request({
      url: getApp().api.delCard,
      method: "post",
      data: {
        card_id: e.currentTarget.dataset.id,
      },
      success: function(e) {
        wx.showToast({
          title: e.msg,
        })
        self.getCardMsg();
      }
    })
  },
})