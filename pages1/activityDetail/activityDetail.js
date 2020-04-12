var util = require("../../utils/util.js");
Page({
  data: {
    state: "apply_no",
    activityData: "",
    enrollList: "",
    hidden1: true,
    isScroll: true,
    avatarSrc: null,
    active_id: "",
    startDate1: null,
    startDate2: null,
    endDate1: null,
    endDate2: null,
    startTime: "",
    endTime: "",
    timeArr: null,
    // isApply:0,
    id: null,
    form: null,
    isDesigner: null,
    applyState: null, //活动状态值，及判断是否能报名
    otherPicUrl: "",
    sharePic: "",
    share_box: true,
    statenum: "",
    isReshow: false,
    hiddenShare: true
  },
  hiddenAd: function() {
    var that = this
    console.log(that.data.sharePic)
        wx.saveImageToPhotosAlbum({
          filePath: that.data.sharePic,
          success(result) {
            console.log(result)
            wx.showToast({
              icon: 'none',
              title: '保存成功',
              // content: '',
            })
            that.setData({
              hidden1: true,
              isScroll: true
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
              console.log("用户一开始拒绝了，我们想再次发起授权")
              console.log('打开设置窗口')
              wx.showModal({
                title: '提示',
                content: '授权才能保存海报图哦~',
                confirmText: '授权',
                success(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success(settingdata) {
                        console.log(settingdata)
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                        } else {
                          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                        }
                      },
                      fail(res) {
                        console.log(res)
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
            }
          }
        })
    //   }
    // })

  },
  showmask() {
    this.setData({
      share_box: false,
      isScroll: true
    })
  },
  hideCart: function() {
    this.setData({
      hidden1: true
    })
  },
  hideMask() {
    this.setData({
      share_box: true,
    })
  },
  hidden_mask() {
    this.setData({
      hidden: true,
      share_box: true,
      isScroll: true
    })
  },
  onShow() {
    // util.checkLogin();
    console.log("reshow", this.data.isReshow);
    if (this.data.isReshow) {
      this.getActivityDetail();
      this.getMymessage();
    }
    this.data.isReshow = true;
    console.log(this.data.myid, "aaa", this.data.user_Id)
  },
  //获取活动详情
  getActivityDetail: function() {
    var self = this;
    getApp().request({
      url: getApp().api.activityDetail,
      method: "post",
      data: {
        id: self.data.id
      },
      success: function(res) {
        console.log("获取活动详情 res：", res);
        self.setData({
          user_Id: res.data.info.user_id,
          card_Id: res.data.info.create_card_id,
          has_copy: res.data.info.has_copy,
          activityid: res.data.info.id
        })
        var length = res.data.enroll_list.length;
        if (length > 0) {
          for (var i = 0; i < length; i++) {
            var curtime = util.formatTimeTwo(res.data.enroll_list[i].addtime, 'Y-M-D' + ' ' + 'h:m:s');
            var arr = [];
            arr.push(curtime);
          }
        }

        // console.log(self.data.timeArr)
        var otherPicUrl;
        if (res.data.info.other_pic_url !== '') {
          otherPicUrl = res.data.info.other_pic_url
        }
        self.setData({
          activityData: res.data.info,
          title: res.data.info.title,
          enrollList: res.data.enroll_list,
          startTime: res.data.info.start_time,
          active_id: self.data.id,
          isDesigner: self.data.isDesigner || null,
          form: res.data.info.form,
          otherPicUrl: otherPicUrl || ''
        })
        var time = res.data.info.start_time; //["2019-06-10", "00:00:00"]
        var endtime = res.data.info.end_time; //["2019-07-10", "23:59:00"]
        // console.log(time)
        var date1 = time[0],
          date2 = time[1],
          date3 = endtime[0],
          date4 = endtime[1];
        var new1 = date1.substring(5, 10),
          new_1 = new1.replace('-', '/'),
          new2 = date2.substring(0, 5),
          new3 = date3.substring(5, 10),
          new_3 = new3.replace('-', '/'),
          new4 = date4.substring(0, 5);
        self.setData({
          startDate1: date1,
          startDate2: date2,
          endDate1: date3,
          endDate2: date4,
        })
        //计算能否报名	
        var statenum;
        var curDate = util.formatTime(new Date());
        console.log("计算能否报名", curDate)
        var curDatetime = new Date(curDate).getTime(); //系统当前时间
        var startDatetime = new Date(time.join(' ').replace(/-/g, "/")).getTime(); //活动开始时间
        var endDatetime = new Date(endtime.join(' ').replace(/-/g, "/")).getTime(); //活动结束时间
        if (curDatetime >= startDatetime && curDatetime <= endDatetime) {
          statenum = 1; //进行中
        } else if (curDatetime < startDatetime) {
          statenum = 0; //未开始
        } else if (curDatetime > endDatetime) {
          statenum = 2; //已结束
        }
        self.setData({
          applyState: statenum
        })
        console.log(curDatetime)
        console.log(startDatetime)
        console.log(endDatetime)
        console.log(self.data.applyState)
      }
    });
  },
  //获取我的报名信息-判断是否已经报名
  getMymessage: function() {
    var self = this;
    getApp().request({
      url: getApp().api.enrollInfo,
      method: "post",
      data: {
        activity_id: self.data.id
      },
      success: function(res) {
        console.log("获取我的报名信息 res：", res);
        if (res.code == 0) {
          self.setData({
            state: "apply_yes"
          })
        }
      },
      fail: function(res) {
        console.log("获取我的报名信息 res：", res);
        self.setData({

        })
      },
    });
  },
  onLoad: function(options) {
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    var self = this;
    var id = "";
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      id = this.getSenceParams(scene, "id");
      console.log(scene, "id", id);
    } else {
      id = options.id;
    }

    if (options.isDesigner) {
      self.setData({
        isDesigner: options.isDesigner,
      })
    }
    self.setData({
      id: id,
      myid: wx.getStorageSync("USER_INFO").id,
      level_name: wx.getStorageSync('level_name')
    })
    console.log(self)
    self.getActivityDetail();
    self.getMymessage();
    self.changeState();
  },
  //分享给好友
  onShareAppMessage: function(options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      console.log(options.target)
    }
    var self = this;
    var path = 'pages1/activityDetail/activityDetail?id=' + self.data.active_id;
    console.log(path, "分享的链接");

    return {
      title: wx.getStorageSync('user_name') + ",邀请您参加“" + self.data.title + "”活动",
      path: path, //点击分享消息是打开的页面
    }
  },
  cartShare: function() {
    var self = this;
    self.setData({
      hiddenShare: false
    })
  },
  //点击地图导航
  toMap: function(e) {
    console.log(e.currentTarget.dataset.latitude, e.currentTarget.dataset.longitude)
    wx.openLocation({
      latitude: parseInt(e.currentTarget.dataset.latitude),
      longitude: parseInt(e.currentTarget.dataset.longitude),
      scale: 18,
      name: e.currentTarget.dataset.name
    })
  },
  //打电话给设计师
  callDesigner: function(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
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
  //跳转到首页
  linkHomepage: function(e) {
    console.log(e)
    var id = e.currentTarget.dataset.id;

    wx.switchTab({
      url: '/pages1/homePage/homePage',
    })
  },
  //跳转到报名页
  apply: function(e) {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      console.log(e)
      var activity_id = e.currentTarget.dataset.activityid;
      var statenum = parseInt(e.currentTarget.dataset.state);
      var formArr = JSON.stringify(e.currentTarget.dataset.form);
      console.log(formArr)
      console.log(statenum)
      this.setData({
        statenum: statenum
      })
      if (statenum == 0) {
        wx.showModal({
          title: '提示',
          content: '报名时间未到',
          showCancel: !1,
        })
      } else if (statenum == 2) {
        wx.showModal({
          title: '提示',
          content: '已超过报名时间',
          showCancel: !1,
        })
      } else {
        wx.navigateTo({
          url: "/pages1/applyMessage/applyMessage?id=" + activity_id + '&form=' + formArr
        })
      }
    } else {
      util.checkLogin();
    }
  },
  changeState: function(value) {
    // console.log(value)
    if (value !== undefined) {
      this.setData({
        state: value
      })
    }
  },
  //活动分享海报图
  show_mask: function(e) {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      util.checkLogin();
      return;
    }
    wx.showLoading({
      title: '',
    })
    var self = this;
    self.avatar();
  },

  //编辑活动
  modifyctivity: function(e) {
    var id = e.currentTarget.dataset.id;
    var userId = e.currentTarget.dataset.index;
    console.log(userId)
    if (getApp().core.getStorageSync(getApp().const.USER_INFO).id == userId) {
      wx.navigateTo({
        url: "/pages1/modifyActivity/modifyActivity?id=" + id
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '这不是您发起的活动',
      })
    }

  },
  copy(e) {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      var id = e.currentTarget.dataset.id;
      getApp().request({
        url: getApp().api.copyactive,
        method: "post",
        data: {
          id: id
        },
        success(res) {
          console.log(res)
          if (res.code == 0) {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
            setTimeout(function() {
              wx.navigateBack({
                
              })
            }, 500)
          } else {
            wx.showToast({
              title: res.msg,
              icon: 'none'
            })
          }
        }
      })
    } else {
      util.checkLogin();
    }
  },
  //删除活动
  cancleActivity: function(e) {
    getApp().request({
      url: getApp().api.delActivity,
      method: "post",
      data: {
        id: e.currentTarget.dataset.id
      },
      success: function(e) {
        console.log("获取删除活动返回的数据 e：", e);
        getApp().core.hideLoading(),
          0 == e.code && getApp().core.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1,
            success: function(e) {
              if (e.confirm) {
                wx.navigateBack({
                  delta: 1,
                  success: function(e) {
                    let pages = getCurrentPages();
                    console.log(pages);
                    let prevPage = pages[pages.length - 1];
                    prevPage.getactivityList();
                  }
                })
              }
            }
          })
        e.code == 1 && getApp().core.showModal({
          title: "提示",
          content: e.msg,
          showCancel: !1,
        })

      }
    })
  },
  linkApplyNum: function(e) {
    var id = e.currentTarget.dataset.id;
    var f = JSON.stringify(e.currentTarget.dataset.form)
    wx.navigateTo({
      url: "/pages1/applyNum/applyNum?id=" + id + "&form=" + f
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
  //隐藏转发蒙版
  hiddenMasking1() {
    this.setData({
      hiddenShare: true
    })
    // this.show_cardCode()
  },
  /*弹窗*/
  send_card1() {
    this.setData({
      hiddenShare: false
    })
  },
  godetail() {
    let that = this;
    wx.navigateTo({
      url: '/pages1/postCard/postCard?id=' + that.data.card_Id + "&user_id=" + that.data.user_Id,
    })
  },
  previewImage(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: that.data.otherPicUrl[index], // 当前显示图片的http链接
      urls: that.data.otherPicUrl // 需要预览的图片http链接列表
    })
  },
  // 下载头像
  avatar() {
    let that = this;
    if (wx.getStorageSync('avatar')) {
      var Expression = /(https):\/\/([\w.]+\/?)\S*/;
      var objExp = new RegExp(Expression);
      if (objExp.test(wx.getStorageSync('avatar'))) {
        wx.downloadFile({
          url: wx.getStorageSync('avatar'),
          success(res) {
            that.bgimg(res.tempFilePath);
          }
        })
      } else {
        wx.downloadFile({
          url: wx.getStorageSync('avatar').replace('http', 'https'),
          success(res) {
            that.bgimg(res.tempFilePath);
          }
        })
      }
    } else {
      wx.downloadFile({
        url: wx.getStorageSync('user_info').avatarUrl,
        success(res) {
          that.bgimg(res.tempFilePath);
        }
      })
    }
  },
  // 头图
  bgimg(img) {
    let that = this;
    wx.downloadFile({
      url: that.data.activityData.head_pic_url.replace('http', 'https'),
      success(res) {
        that.qrcode(res.tempFilePath, img)
      }
    })
  },
  qrcode(img1, img2) {
    let that = this;
    getApp().request({
      url: getApp().api.activitycode,
      method: 'POST',
      data: {
        activity_id: that.data.activityid
      },
      success(res) {
        wx.downloadFile({
          url: res.data.pic_url,
          success(res) {
            that.canvas(res.tempFilePath, img1, img2)
          }
        })
      }
    })
  },
  // 开始画图
  canvas(code, bg, tx) {
    let that = this;
    const ctx = wx.createCanvasContext('canvas'); //创建画布
    wx.createSelectorQuery().select('#canvas2').boundingClientRect(function(rect) {
      console.log(rect)
      var height = rect.height;
      var width = rect.width;
      // ctx.setFillStyle('#ccc');
      ctx.fillRect(0, 0, width, height);
      // ctx.font = 'normal bold 18px sans-serif';

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
      var x = 4
      var y = 4
      var w = width - 8
      var h = height - 8
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
      // ctx.clip()
      ctx.restore();
      ctx.save();


      // //姓名
      if (wx.getStorageSync('user_name')) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#00CC33');
        ctx.fillText(wx.getStorageSync('user_name'), 60, 25);
      } else {
        ctx.setFontSize(14);
        ctx.setFillStyle('#00CC33');
        ctx.fillText(wx.getStorageSync('user_info').nickName, 60, 25);
      }
      ctx.setFontSize(12);
      ctx.setFillStyle('#666666');
      ctx.fillText('邀请您参加活动', 60, 45);
      if (bg) {
        ctx.drawImage(bg, 8, 70, 300, 160);
        ctx.setFontSize(30);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }
      if (that.data.activityData.title) {
        ctx.setFontSize(15);
        ctx.setFillStyle('#666666');
        ctx.fillText(that.data.activityData.title, 10, 260);
      }
      if (that.data.endDate2) {
        ctx.setFontSize(13);
        ctx.setFillStyle('#666666');
        ctx.fillText('活动时间：' + that.data.startDate1 + ' ' + that.data.startDate2 + '-' + that.data.endDate1 + ' ' + that.data.endDate2, 10, 285);
      }
      if (that.data.activityData.show_times) {
        ctx.setFontSize(13);
        ctx.setFillStyle('#666666');
        ctx.fillText('活动热度：' + that.data.activityData.show_times + '↑', 10, 305);
      }
      if (that.data.activityData.show_times) {
        ctx.setFontSize(13);
        ctx.setFillStyle('#666666');
        if (that.data.activityData.max_number < 0) {
          ctx.fillText('可报名人数：' + that.data.activityData.max_number, 10, 325);
        } else {
          ctx.fillText('可报名人数：不限', 10, 325);
        }
      }
      if (code) {
        ctx.drawImage(code, 123, 340, 70, 70);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.setFontSize(12);
        let click_width = ctx.measureText('扫码了解更多').width;
        let w_width2 = (width - click_width) / 2
        ctx.setFillStyle('#666666');
        ctx.fillText('扫码了解更多', w_width2, 430);
      }
      if (bg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(158, 375, 15, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(bg, 143, 360, 30, 30);
        ctx.restore();
      }
      // 头像为正方形
      if (tx) {
        ctx.beginPath();
        ctx.setFillStyle('#000');
        ctx.arc(30, 30, 20, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(tx, 10, 10, 40, 40);
        ctx.restore();
        ctx.save();
      }


    }).exec()

    setTimeout(function() {
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
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          sharePic: res.tempFilePath,
          hidden1: false,
          hiddenShare: true
        })
      }
    });
  },
})