var util = require('../../utils/util.js')
const app = getApp();
let tim = getApp().globalData.tim;
Page({
  data: {
    access_token: false,
    like: false,
    phone: '',
    back: true,
    detail_: true,
    hidden: true,
    hidden1: true,
    projectName: '',
    projectRemark: '',
    picArr: [],
    picTitle: "",
    isScroll: true,
    pro_id: "",
    isDesigner: null,
    hiddenShare: true
  },
  linkGrpup: function () {
    wx.navigateTo({
      url: "/pages/groupDetail/groupDetail"
    })
  },
  hideMask: function () {
    this.setData({
      hidden1: true
    })
  },
  // 预览图片
  previewImg: function (e) {
    var index = e.currentTarget.dataset.index;

    var picArr = this.data.picArr;
    var arr = [];
    picArr.forEach(function (item, index) {
      arr.push(item.url);
    })

    wx.previewImage({
      current: arr[index],
      urls: arr
    })
  },
  show_mask: function () {
    var self = this;
    self.setData({
      hiddenShare: false,
    })
  },
  hiddenAd: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.sharePic,
      success(result) {
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
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {
                      console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                    } else {
                      console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                    }
                  },
                  fail(res) {}
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
  //获取作品详情
  getproductDetail: function () {
    wx.showLoading({
      title: '加载中',
    })
    var self = this;
    getApp().request({
      url: getApp().api.productDetail,
      method: "post",
      data: {
        id: self.data.id,
        opus_id: self.data.id,
      },
      success: function (res) {
        wx.hideLoading()
        var info = res.data.info;
        if (res.data.is_like == 1) {
          self.setData({
            like: true
          })
        }
        if (wx.getStorageSync('ACCESS_TOKEN')) {
          let obj = {
            name: info.name,
            card_id: res.data.create_card_id,
            user_id: info.user_id,
            oupsid: res.data.info.id
          }
          self.browsepage(obj)
        }
        self.setData({
          projectName: info.name,
          projectRemark: info.remarks,
          picArr: res.data.pic,
          picTitle: res.data.pic[0].url,
          pro_id: self.data.id,
          isDesigner: self.data.isDesigner || null,
          userId: res.data.info.user_id,
          phone: res.data.phone,
          card_id: res.data.card_id,
          create_card_id: res.data.create_card_id,
          create_user_id: res.data.info.user_id,
          id: res.data.info.id,
          video: res.data.info.video_url,
          opusid: res.data.info.id,
          is_auth: res.data.is_auth
        })
        self.showImg();
      }
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
  onLoad: function (options) {
    var self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      self.setData({
        access_token: true
      })
    }
    let myphone = wx.getStorageSync("mobile")
    self.setData({
      myphone: myphone
    })
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    if (options.type == 1) {
      self.setData({
        back: false
      })
    }
    var id = "";
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      id = this.getSenceParams(scene, "id");
      if (this.getSenceParams(scene, "type") == 1) {
        self.setData({
          back: false
        })
      }
    } else {
      id = options.id;
    }
    self.setData({
      idid: options.idid,
      id: id,
      myId: getApp().core.getStorageSync(getApp().const.USER_INFO).id,
      idid: !wx.getStorageSync("carid") ? options.idid : wx.getStorageSync("carid")
    })
    if (options.isDesigner) {
      self.setData({
        isDesigner: options.isDesigner
      })
    }
    self.getproductDetail();
  },
  onShow() {

  },
  //分享给好友
  onShareAppMessage: function (options) {
    var self = this;
    // 来自页面内转发按钮
    var projectName = self.data.projectName
    var userName = getApp().core.getStorageSync(getApp().const.USER_INFO).nickname;
    return {
      title: userName + '分享的"' + projectName + '"作品,请查看',
      path: 'pages1/productDetail/productDetail?id=' + self.data.pro_id + "&type=1" + "&idid=" + self.data.create_card_id, //点击分享消息是打开的页面
    }
  },
  cartShare: function () {
    var self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      wx.showLoading({
        title: '',
        mask: true
      })
      self.qrcode();
    } else {
      util.checkLogin();
    }
  },
  //点击编辑按钮
  modifyMsg: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var remarks = e.currentTarget.dataset.remarks;
    var pic = JSON.stringify(e.currentTarget.dataset.pic);
    var video = e.currentTarget.dataset.video;
    var type = 'productdetail';
    wx.navigateTo({
      url: "/pages1/modifyProduct/modifyProduct?id=" + id + '&name=' + name +
        '&remarks=' + remarks + '&pic=' + pic + '&type=' + type + '&video=' + video
    })
  },

  //隐藏转发蒙版
  hiddenMasking1() {
    this.setData({
      hiddenShare: true
    })
  },
  /*弹窗*/
  send_card1() {
    this.setData({
      hiddenShare: false
    })
  },
  // 弹窗
  detail(e) {
    let that = this;
    that.setData({
      detail_: false,
      detail_two: e.currentTarget.dataset.detail
    })
  },
  hide() {
    let that = this;
    that.setData({
      detail_: true
    })
  },
  backindex() {
    let that = this;
    if (that.data.card_id == that.data.create_card_id) {
      var carid = that.data.card_id;
      var userid = that.data.userId
    } else {
      var carid = that.data.create_card_id;
      var userid = that.data.create_user_id
    }
    wx.reLaunch({
      url: '/pages1/postCard/postCard?user_id=' + userid + "&id=" + carid,
    })
  },
  haibao() {
    wx.showLoading({
      title: '',
      icon: 'none'
    })
    let self = this;
    getApp().request({
      url: getApp().api.shareOpus,
      method: "post",
      data: {
        opus_id: self.data.id
      },
      success: function (e) {
        wx.hideLoading()
        if (e.code == 1) {
          wx.showToast({
            title: '该作品没有图片无法生成分享海报，请先上传图片',
            icon: "none",
            duration: 1000
          })
        } else {
          self.setData({
            hidden1: false,
            sharePic: e.data.pic_url
          })
        }

      }
    })
  },
  getPhoneNumber(e) {
    let self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        wx.login({
          success(res) {
            app.request({
              url: getApp().api.empower,
              method: 'POST',
              data: {
                iv: e.detail.iv,
                encryptedData: e.detail.encryptedData,
                code: res.code,
              },
              success: function (res) {
                let myphone = res.data.dataObj;
                if (res.code == 0) {
                  wx.setStorageSync("mobile", res.data.dataObj);
                  self.setData({
                    myphone: res.data.dataObj
                  })

                  // 发送号码
                  getApp().request({
                    url: getApp().api.addCardActivity,
                    method: "post",
                    data: {
                      card_id: self.data.userId,
                      type: 113,
                      relation_id: self.data.id,
                      mobile: myphone
                    },
                  })
                  getApp().request({
                    url: getApp().api.leftMobile,
                    method: "post",
                    data: {
                      card_id: self.data.userId,
                      mobile: myphone
                    },
                    success: function (res) {
                      if (res.code == 0) {
                        wx.showToast({
                          title: '预约成功',
                        })
                        // 发模板消息
                        getApp().request({
                          url: getApp().api.message,
                          method: "POST",
                          data: {
                            receive_user_id: self.data.userId,
                            wx_page: '/pages1/cardActivity/cardActivity?user_id=' + self.data.userId,
                          },
                          success(res) {
                            console.log("模板消息", res)
                          }
                        })
                      } else {
                        wx.showToast({
                          title: res.msg,
                          icon: "none"
                        })
                      }
                    },
                  })
                }
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: '您取消了授权',
          icon: "none"
        })
      }
    } else {
      util.checkLogin();
    }
  },
  yuyue() {
    let self = this;
    getApp().request({
      url: getApp().api.leftMobile,
      method: "post",
      data: {
        card_id: self.data.userId,
        mobile: self.data.myphone
      },
      success: function (res) {
        if (res.code == 0) {
          wx.showToast({
            title: '预约成功',
          })
          getApp().request({
            url: getApp().api.addCardActivity,
            method: "post",
            data: {
              card_id: self.data.userId,
              type: 113,
              relation_id: self.data.id,
              mobile: self.data.myphone
            },
          })
          // 发模板消息
          getApp().request({
            url: getApp().api.message,
            method: "POST",
            data: {
              receive_user_id: self.data.userId,
              wx_page: '/pages1/cardActivity/cardActivity?user_id=' + self.data.userId,
            },
            success(res) {
              console.log("模板消息", res)
            }
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: "none"
          })
        }
      },
    })
  },
  phone() {
    let that = this;
    if (that.data.is_auth == 1) {
      wx.showActionSheet({
        itemList: ['聊天', '电话'],
        success(res) {
          if (res.tapIndex == 0) {
            if (wx.getStorageSync('ACCESS_TOKEN')) {
              if (that.data.userId == wx.getStorageSync('USER_INFO').id) {
                wx.showToast({
                  title: '自己与自己不能聊天',
                  icon: "none"
                })
                return;
              }
              that.msg();

            } else {
              util.checkLogin();
            }
          } else {
            wx.makePhoneCall({
              phoneNumber: that.data.phone,
            })
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: that.data.phone,
      })
    }
  },
  msg() {
    let that = this;
    // 示例：利用自定义消息实现投骰子功能
    // 1. 定义随机函数
    // function random(min, max) {
    //   return Math.floor(Math.random() * (max - min + 1) + min);
    // }
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createCustomMessage({
      to: '' + that.data.userId,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        data: "" + that.data.id, // 用于标识该消息是骰子类型消息
        description: that.data.projectName + ',案例', // 获取骰子点数
        extension: that.data.picTitle + ',' + that.data.projectRemark //其他
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      let message = imResponse.data.message;
      // 查询用户信息
      let promise = tim.getUserProfile({
        userIDList: ["" + that.data.userId] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      });
      promise.then(function (imResponse) {
        wx.navigateTo({
          url: '../im/im?im=im&id=' + message.conversationID + "&userid=" + that.data.userId + '&useravater=' + imResponse.data[0].avatar + '&username=' + imResponse.data[0].nick,
        })
      }).catch(function (imError) {
        console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
      });
    }).catch(function (imError) {
      // 发送失败
      console.warn('sendMessage error:', imError);
      getApp().request({
        url: getApp().api.msgnotice,
        method: 'POST',
        data: {
          uid: that.data.userId
        },
        success(res) {
          wx.showToast({
            title: '该用户暂未开通聊天功能，已短信通知',
            icon: 'none',
            duration: 2000
          })
        }
      })
    });
  },
  like() {
    let self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (self.data.card_id == self.data.create_card_id) {
        var carid = self.data.card_id;
        var userid = self.data.userId
      } else {
        var carid = self.data.create_card_id;
        var userid = self.data.create_user_id
      }
      if (self.data.like == false) {
        getApp().request({
          url: getApp().api.likeopus,
          method: "post",
          data: {
            id: self.data.id,
          },
          success: function (res) {
            self.setData({
              like: true
            })
          }
        })
      } else {
        wx.showToast({
          title: '你已经喜欢过此作品',
          icon: "none"
        })
      }
    } else {
      util.checkLogin();
    }
  },
  qrcode() {
    let that = this;
    getApp().request({
      url: getApp().api.opuscode,
      method: 'POST',
      data: {
        opus_id: that.data.opusid
      },
      success(res) {
        wx.downloadFile({
          url: res.data.pic_url,
          success(res) {
            that.avatar(res.tempFilePath);
          }
        })
      }
    })
  },
  avatar(img) {
    let that = this;
    if (wx.getStorageSync('avatar')) {
      var Expression = /(https):\/\/([\w.]+\/?)\S*/;
      var objExp = new RegExp(Expression);
      if (objExp.test(wx.getStorageSync('avatar'))) {
        wx.downloadFile({
          url: wx.getStorageSync('avatar'),
          success(res) {
            that.bgimg(img, res.tempFilePath);
          }
        })
      } else {
        wx.downloadFile({
          url: wx.getStorageSync('avatar').replace('http', 'https'),
          success(res) {
            that.bgimg(img, res.tempFilePath);
          }
        })
      }
    } else {
      wx.downloadFile({
        url: wx.getStorageSync('user_info').avatarUrl,
        success(res) {
          that.bgimg(img, res.tempFilePath);
        }
      })
    }

  },
  bgimg(img1, img2) {
    let that = this;
    var Expression = /(https):\/\/([\w.]+\/?)\S*/;
    var objExp = new RegExp(Expression);
    if (objExp.test(that.data.picTitle)) {
      wx.downloadFile({
        url: that.data.picTitle,
        success(res) {
          that.canvas(img1, img2, res.tempFilePath)
        }
      })
    } else {
      wx.downloadFile({
        url: that.data.picTitle.replace('http', 'https'),
        success(res) {
          that.canvas(img1, img2, res.tempFilePath)
        }
      })
    }
  },
  // 开始画图
  canvas(code, tx, bg) {
    let that = this;
    const ctx = wx.createCanvasContext('canvas'); //创建画布
    wx.createSelectorQuery().select('#canvas2').boundingClientRect(function (rect) {
      var height = rect.height;
      var width = rect.width;
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
      ctx.fillText('分享您一个装修案例', 60, 45);
      if (bg) {
        ctx.drawImage(bg, 8, 70, 300, 160);
        ctx.setFontSize(30);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }
      if (that.data.projectName) {
        ctx.setFontSize(14);
        ctx.setFillStyle('#666666');
        ctx.fillText(that.data.projectName, 10, 250);
      }
      if (that.data.projectRemark) {
        const CONTENT_ROW_LENGTH = 43; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = that.textByteLength(that.data.projectRemark, CONTENT_ROW_LENGTH);
        ctx.setFontSize(14);
        ctx.setFillStyle('#666666');
        let contentHh = 22 * 1;
        if (contentArray.length < 5) {
          for (let m = 0; m < contentArray.length; m++) {
            ctx.fillText(contentArray[m], (width - ctx.measureText(contentArray[m]).width) / 2, 290 + contentHh * m);
          }
        } else {
          for (let m = 0; m < 5; m++) {
            ctx.fillText(contentArray[m], (width - ctx.measureText(contentArray[m]).width) / 2, 290 + contentHh * m);
          }
        }
      }
      if (code) {
        ctx.drawImage(code, 123, 360, 70, 70);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
        ctx.setFontSize(12);
        let click_width = ctx.measureText('扫码了解更多').width;
        let w_width2 = (width - click_width) / 2
        ctx.setFillStyle('#666666');
        ctx.fillText('扫码了解更多', w_width2, 450);
      }
      if (bg) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(158, 395, 15, 0, Math.PI * 2, false);
        ctx.clip();
        ctx.drawImage(bg, 143, 380, 30, 30);
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
        wx.hideLoading();
        that.setData({
          sharePic: res.tempFilePath,
          hidden1: false,
        })
      }
    });
  },
  /**
   * 多行文字处理，每行显示数量
   * @param text 为传入的文本
   * @param num  为单行显示的字节长度
   */
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
  login() {
    util.checkLogin();
  },
  // 我的浏览
  browsepage(arr) {
    let browseoups = wx.getStorageSync('browseoups');
    let that = this;
    let obj = {};
    if (arr.user_id == wx.getStorageSync('USER_INFO').id) {
      return;
    }

    for (let i in browseoups) {
      if (browseoups[i].oupsid == arr.oupsid) {
        // return;
        browseoups.splice(i, 1)
      }
    }
    obj.time = new Date().getTime();
    let Hours = new Date(new Date().getTime()).getHours() < 10 ? ('0' + new Date(new Date().getTime()).getHours()) : new Date(new Date().getTime()).getHours();
    let minutes = new Date(new Date().getTime()).getMinutes() < 10 ? ('0' + new Date(new Date().getTime()).getMinutes()) : new Date(new Date().getTime()).getMinutes();
    obj.deta = new Date(new Date().getTime()).getMonth() + 1 + '-' + new Date(new Date().getTime()).getDate() + ' ' + Hours + ':' + minutes;
    obj.user_id = arr.user_id;
    obj.car_id = arr.card_id;
    obj.name = arr.name;
    obj.oupsid = arr.oupsid;
    browseoups.unshift(obj);
    wx.setStorageSync('browseoups', browseoups);
  },
  // 懒加载处理
  showImg() {
    let that = this;
    let picArr = that.data.picArr
    let height = app.globalData.windowHeight // 页面的可视高度
    wx.createSelectorQuery().selectAll('.pic_group').boundingClientRect((ret) => {
      console.log(ret, height)
      ret.forEach((item, index) => {
        if (item.top <= height) {
          // 判断是否在显示范围内
          picArr[index].show = true // 根据下标改变状态
        }
      })
      that.setData({
        picArr
      })
    }).exec()
  },
  onPageScroll() { // 滚动事件
    this.showImg()
  }
})