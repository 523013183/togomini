let tim = getApp().globalData.tim;
Page({
  data: {
    style: "风格",
    groupList: '',
    curTop: "",
    curShow: "",
    styleIndex: -1,
    showStyle: false,
    isReShow: false,
    active: 1,
    styleid: '',
    keyword: '',
    is_merchant: '',
    idArr: '',
    idarrtype: 2
  },
  onLoad: function(options) {
    if (options.idarr) {
      if (JSON.parse(options.idarr).length > 0) {
        this.setData({
          idArr: JSON.parse(options.idarr),
          idarrtype: options.idarrtype
        })
      }
    }
    this.setData({
      is_merchant: wx.getStorageSync("is_merchant"),
    })
    if (options.shangjia) {
      this.setData({
        shangjia: options.shangjia,
        is_merchant: wx.getStorageSync("is_merchant"),
        userid: options.userid
      })
    }
    if (options.imtype) {
      this.setData({
        imid: options.id,
        imtype: options.imtype
      })
      wx.setNavigationBarTitle({
        title: '选择套餐'
      })
    }
    if (options.active) {
      this.setData({
        active: options.active
      })
    }

    if (options.shangjia) {
      var _params = {
        type: this.data.active,
        keyword: "",
        style: '',
        user_id: options.userid
      }
    } else {
      var _params = {
        type: this.data.active,
        keyword: "",
        style: '',
      }
    }
    this.getGroupList(_params);
    this.getStyleList();
  },
  onShow: function(options) {
    if (this.data.shangjia) {
      var _params = {
        type: this.data.active,
        keyword: "",
        style: '',
        user_id: this.data.userid
      }
    } else {
      var _params = {
        type: this.data.active,
        keyword: "",
        style: '',
      }
    }
    this.getGroupList(_params);
  },
  getGroupList: function(params) {
    wx.showLoading({
      title: '',
    })
    var self = this;
    //获取套餐列表
    getApp().request({
      url: getApp().api.groupList,
      method: "post",
      data: self.data.imid ? {
        user_id: self.data.imid
      } : params,
      success: function(res) {
        setTimeout(function() {
          wx.hideLoading()
        }, 200)
        if (self.data.idArr != '') {
          for (let i in res.data.list) {
            for (let j in self.data.idArr) {
              if (res.data.list[i].id == self.data.idArr[j]) {
                res.data.list[i].read = true;
              }
            }
          }
          self.setData({
            groupList: res.data.list,
          })
        } else {
          self.setData({
            groupList: res.data.list,
          })
        }
      }
    })
  },
  //删除套餐
  cancleGroup: function(e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    getApp().request({
      url: getApp().api.deleteGroup,
      method: "post",
      data: {
        id: id
      },
      success: function(res) {
        wx.showToast({
          title: "删除成功"
        })
        var _params = {
          type: self.data.active,
          keyword: self.data.keyword,
          style: self.data.styleid
        }
        self.getGroupList(_params);
      }
    })
    return;
  },
  /*跳转到我的套餐*/
  link_group(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if (!self.data.imtype) {
      if (type == 1) {
        wx.navigateTo({
          url: "/pages1/groupDetail/groupDetail?id=" + id + "&type=3"
        })
      } else {
        wx.navigateTo({
          url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + "&type=3"
        })
      }
    } else {
      if (type == 1) {
        wx.navigateTo({
          url: "/pages1/groupDetail/groupDetail?id=" + id
        })
      } else {
        wx.navigateTo({
          url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + "&type=1"
        })
      }
    }
  },
  //设置是否展示
  setShow: function(e) {
    var self = this;
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
    getApp().request({
      url: getApp().api.setShowGroup,
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "post",
      data: {
        id: JSON.stringify(idArr),
        is_show: self.data.curShow
      },
      success: function(res) {
        var _params = {
          type: self.data.active,
          keyword: self.data.keyword,
          style: self.data.styleid
        }
        self.getGroupList(_params);
      }
    })
    return;
  },
  //点击编辑按钮
  modifyMsg: function(e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid
    if (getApp().core.getStorageSync(getApp().const.USER_INFO).id != userid) {
      wx.showToast({
        title: '这不是您的套餐',
        icon: 'none'
      })
    } else {
      wx.navigateTo({
        url: "/pages1/modifyGroup/modifyGroup?id=" + id
      })
    }
    return;
  },
  //获取风格列表
  getStyleList: function() {
    var self = this;
    getApp().request({
      url: getApp().api.styleList,
      method: "post",
      data: {},
      success: function(res) {
        self.setData({
          styleList: res.data.list,
        })
      }
    });
  },
  chooseStyle: function(e) {
    var that = this;
    var name = e.currentTarget.dataset.name;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;

    if (name == '全部') {
      var _params = {
        type: that.data.active,
        keyword: that.data.keyword,
        style: ''
      }
    } else {
      var _params = {
        type: that.data.active,
        keyword: that.data.keyword,
        style: id
      }
    }
    that.getGroupList(_params);
    that.hideTab();
    that.setData({
      styleIndex: index,
      style: name,
      styleid: id
    })
  },
  hideTab: function() {
    this.setData({
      showStyle: false
    })
  },
  showStyle: function() {
    this.setData({
      showStyle: !this.data.showStyle
    })
  },
  //获取关键字
  getkeyword: function(e) {
    var val = e.detail.value;
    this.setData({
      keyword: val
    })
  },
  search: function() {
    let that = this;
    var _params = {
      type: that.data.active,
      keyword: that.data.keyword,
      style: that.data.styleid
    }
    this.getGroupList(_params);
    this.setData({
      keyword: ''
    })
  },
  // 分享
  onShareAppMessage: function(e) {
    if (e.from === 'button') {
      let self = this;
      self.setData({
        zuopin_id: e.target.dataset.id,
        imga: e.target.dataset.src,
        name: e.target.dataset.name
      })
      return {
        path: 'pages1/merchantGroup_detail/merchantGroup_detail?id=' + self.data.zuopin_id + "&type=1", //点击分享消息是打开的页面
        imageUrl: self.data.imga,
        title: self.data.name + '__套餐'
      }
    }
    return;
  },
  avtive(e) {
    let that = this;
    let active = e.currentTarget.dataset.id;
    this.setData({
      active: active
    })
    var _params = {
      type: that.data.active,
      keyword: that.data.keyword,
      style: that.data.styleid
    }
    this.getGroupList(_params);
  },
  addgroup() {
    if (wx.getStorageSync("level_name") != '普通用户') {
      wx.navigateTo({
        url: '/pages1/addGroup/addGroup',
      })
    } else {
      wx.showToast({
        title: '请先认证设计师(联系客服)',
        icon: 'none'
      })
    }
  },
  hide() {
    let that = this;
    that.setData({
      showStyle: !that.data.showStyle
    })
  },
  send(e) {
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 2];
    let id = curPage.data.userid;
    var obj = {
      userid: id,
      type: e.currentTarget.dataset.type,
      name: e.currentTarget.dataset.name,
      pic: e.currentTarget.dataset.src,
      id: e.currentTarget.dataset.id,
      price: e.currentTarget.dataset.price,
      num: e.currentTarget.dataset.num,
    }
    this.msg(obj);
  },
  msg(obj) {
    let that = this;
    var detail = '';
    if (obj.type == 1) {
      detail = '普通套餐';
    } else {
      detail = '海报套餐';
    }
    let message = tim.createCustomMessage({
      to: '' + obj.userid,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        data: "" + obj.id, // 用于标识该消息是骰子类型消息
        description: obj.name + ',' + detail, // 获取骰子点数
        extension: obj.pic + ',' + obj.price + ',' + obj.num //其他
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function(imResponse) {
      // 发送成功
      var pages = getCurrentPages();
      var curPage = pages[pages.length - 2];
      wx.navigateBack({
        success() {
          curPage.pageScrollToBottom(11);
        }
      })
    }).catch(function(imError) {
      // 发送失败
    });
  },
  is_recommend(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let is_recommend = e.currentTarget.dataset.is_recommend;
    let index = e.currentTarget.dataset.index;
    let up = 'groupList[' + index + '].is_recommend';
    let is_recommend2 = '';
    if (is_recommend == 1) {
      is_recommend2 = 0
    } else {
      is_recommend2 = 1
    }
    getApp().request({
      url: getApp().api.setpackagenew,
      method: 'POST',
      data: {
        id: id,
        is_recommend: is_recommend2
      },
      success(res) {
        that.setData({
          [up]: is_recommend2
        })
      }
    })
  },
  addpackage(e) {
    if (e.currentTarget.dataset.type == 2) {
      wx.showToast({
        title: '只能添加普通套餐',
        icon: 'none'
      })
      return;
    }
    let that = this;
    let pages = getCurrentPages(); //获取当前页面信息栈
    let prevPage = pages[pages.length - 2] //获取上一个页面信息
    // idarrtype==2 样板间    1== 户型过来
    getApp().request({
      url: that.data.idarrtype == 2 ? getApp().api.sampleroomaddpackage : getApp().api.housetypepackage,
      method: 'POST',
      data: that.data.idarrtype == 2 ? {
        sampleroom_id: prevPage.data.data.id,
        package_id: e.currentTarget.dataset.id
      } : {
        apartment_id: prevPage.data.data.id,
        package_id: e.currentTarget.dataset.id
      },
      success(res) {
        if (res.code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: res.msg + ',等待审核',
            icon: 'none'
          })
        }
      }
    })
  },
  // 跳转参考套餐
  gotocopy(e) {
    let self = this;
    wx.navigateTo({
      url: "/pages1/merchantGroup/merchantGroup"
    })
  },
})