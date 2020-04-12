var utiphone = require('../../utils/util.js')
const app = getApp();
let tim = getApp().globalData.tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    access_token: false,
    type: '',
    like: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      that.setData({
        access_token: true
      })
    }
    wx.getSystemInfo({
      success: function(res) {
        let bili = 750 / res.screenWidth;
        that.setData({
          bili: bili
        })
      },
    })
    let myphone = wx.getStorageSync("mobile")
    that.setData({
      myphone: myphone,
      id: options.id,
      shop: options.shop,
      type: options.type,
    })
    that.index();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let self = this;
    if (self.data.create_card_id > 0) {
      return {
        path: 'pages1/merchantGroup_detail/merchantGroup_detail?id=' + self.data.id + "&type=1", //点击分享消息是打开的页面
        title: self.data.name + "__套餐"
      }
    } else {
      return {
        path: 'pages1/merchantGroup_detail/merchantGroup_detail?id=' + self.data.id + "&type=3&shop=1", //点击分享消息是打开的页面
        title: self.data.name + "__套餐"
      }
    }
  },
  index() {
    wx.showLoading({
      title: '',
      icon: 'none',
      mask: true
    })
    let self = this;
    getApp().request({
      url: getApp().api.groupDetail,
      method: "post",
      data: {
        id: self.data.id
      },
      success: function(res) {
        if (res.is_like == 1) {
          self.setData({
            like: true
          })
        }
        if (wx.getStorageSync('ACCESS_TOKEN')) {
          let obj = {
            amount: res.amount,
            name: res.name,
            user_id: res.user_id,
            card_id: res.card_id,
            pageid: res.id
          }
          self.browsepage(obj);
        }
        self.setData({
          font: res.font,
          img: res.poster_img,
          phone: res.phone,
          user_id: res.user_id,
          card_id: res.card_id,
          id: res.id,
          name: res.name,
          card_id: res.card_id,
          create_card_id: res.create_card_id,
          openid: res.wechat_open_id,
          x: res.coordinate_x,
          y: res.coordinate_y,
          is_copy: res.is_copy,
          is_auth: res.is_auth,
          amount: res.amount
        })
        if (self.data.shop == 1) {
          wx.getImageInfo({
            src: res.poster_img.replace('http', 'https'),
            success: function(res) {
              wx.hideLoading()
              self.setData({
                imgwidth: res.width,
                imgheight: res.height,
              })
            }
          })
        } else {
          wx.hideLoading()
        }
      }
    })
  },
  // 复制套餐
  copy() {
    let self = this;
    // 上传图片
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (wx.getStorageSync('msg') == '名片不存在') {
        wx.showModal({
          title: '提示',
          content: '完善名片才能操作，是否前往完善',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/index/index?imgSrc=" + wx.getStorageSync('USER_INFO').avatar_url +
                  '&nickname=' + wx.getStorageSync('USER_INFO').nickname + '&mobile=' + wx.getStorageSync('USER_INFO').binding,
              })
            } else if (res.cancel) {}
          }
        })
      } else {
        if (wx.getStorageSync('level_name') != '普通用户') {
          if (self.data.is_copy == 0) {
            wx.showLoading({
              title: '生成中请稍等...',
              mask: true
            })
            self.getAvaterInfo();
          } else {
            wx.showToast({
              title: '您已经复制过此套餐，请勿重复操作',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请先认证设计师(联系客服)',
            icon: 'none'
          })
        }
      }
    } else {
      utiphone.checkLogin()
    }
  },
  phone() {
    let that = this;
    if (that.data.is_auth == 1) {
      wx.showActionSheet({
        itemList: ['聊天', '电话'],
        success(res) {
          if (res.tapIndex == 0) {
            if (wx.getStorageSync('ACCESS_TOKEN')) {
              if (that.data.user_id == wx.getStorageSync('USER_INFO').id) {
                wx.showToast({
                  title: '自己与自己不能聊天',
                  icon: "none"
                })
                return;
              }
              that.msg();
            } else {
              utiphone.checkLogin();
            }
          } else {
            wx.makePhoneCall({
              phoneNumber: that.data.phone,
            })
          }
        },
        fail(res) {}
      })
    } else {
      wx.makePhoneCall({
        phoneNumber: that.data.phone,
      })
    }

  },
  msg() {
    let that = this;
    // 2. 创建消息实例，接口返回的实例可以上屏
    let message = tim.createCustomMessage({
      to: '' + that.data.user_id,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        data: "" + that.data.id, // 用于标识该消息是骰子类型消息
        description: that.data.name + ',海报套餐', // 获取骰子点数
        extension: that.data.img + "," + that.data.amount //其他
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function(imResponse) {
      // 发送成功
      let message = imResponse.data.message;
      // 查询用户信息
      let promise = tim.getUserProfile({
        userIDList: ["" + that.data.user_id] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      });
      promise.then(function(imResponse) {
        wx.navigateTo({
          url: '../im/im?im=im&id=' + message.conversationID + "&userid=" + that.data.user_id + '&useravater=' + imResponse.data[0].avatar + '&username=' + imResponse.data[0].nick,
        })
      }).catch(function(imError) {});
    }).catch(function(imError) {
      // 发送失败
      getApp().request({
        url: getApp().api.msgnotice,
        method: 'POST',
        data: {
          uid: that.data.user_id
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
      if (self.data.like == false) {
        getApp().request({
          url: getApp().api.likepackage,
          method: "post",
          data: {
            id: self.data.id,
          },
          success: function(res) {
            self.setData({
              like: true
            })
          }
        })
      } else {
        wx.showToast({
          title: '你已经喜欢过此套餐',
          icon: "none"
        })
      }
    } else {
      utiphone.checkLogin();
    }
  },
  yuyue() {
    let self = this;
    getApp().request({
      url: getApp().api.leftMobile,
      method: "post",
      data: {
        card_id: self.data.user_id,
        mobile: self.data.myphone
      },
      success: function(res) {
        if (res.code == 0) {
          wx.showToast({
            title: '预约成功',
          })
          getApp().request({
            url: getApp().api.addCardActivity,
            method: "post",
            data: {
              card_id: self.data.user_id,
              type: 112,
              relation_id: self.data.id,
              mobile: self.data.myphone
            },
          })
          // 发模板消息
          getApp().request({
            url: getApp().api.message,
            method: "POST",
            data: {
              formid: res.data,
              receive_user_id: self.data.user_id,
              wx_page: '/pages1/cardActivity/cardActivity?user_id=' + self.data.user_id,
            },
            success(res) {}
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
  backindex() {
    let that = this;
    wx.reLaunch({
      url: '/pages1/postCard/postCard?user_id=' + that.data.user_id + "&id=" + that.data.create_card_id,
    })
  },
  qrcode() {
    let that = this;
    getApp().request({
      url: getApp().api.packagecode,
      method: "post",
      data: {
        package_id: that.data.id
      },
      success: function(res) {
        wx.hideLoading()
        if (res.code == 0) {
          that.setData({
            qrcode: res.data.pic_url
          })
        }
      },
    })
  },
  /**
   * 先下载头像图片
   */
  getAvaterInfo: function() {
    var that = this;
    wx.downloadFile({
      url: that.data.img.replace('http', 'https'), //头像图片路径
      success: function(res) {
        var avaterSrc = res.tempFilePath; //下载成功返回结果
        wx.getImageInfo({
          src: avaterSrc,
          success(res) {
            that.setData({
              width: res.width,
              height: res.height
            })
          }
        })
        that.getQrCode(avaterSrc); //继续下载二维码图片
      }
    })
  },

  /**
   * 下载二维码图片
   */
  getQrCode: function(avaterSrc) {
    var that = this;
    wx.downloadFile({
      url: wx.getStorageSync('qrcode'), //二维码路径
      success: function(res) {
        var codeSrc = res.tempFilePath;
        // return;
        that.sharePosteCanvas(avaterSrc, codeSrc);
      }
    })
  },
  // 画图
  sharePosteCanvas: function(avaterSrc, codeSrc) {
    var that = this;
    var cardInfo = that.data.cardInfo; //需要绘制的数据集合
    const ctx = wx.createCanvasContext('myCanvas'); //创建画布
    wx.createSelectorQuery().select('#canvas-container').boundingClientRect(function(rect) {
      var height = rect.height;
      var right = rect.right;
      var width = rect.width;
      var left = rect.left + 5;
      ctx.setFillStyle('#fff');
      ctx.fillRect(0, 0, width, height);

      //大图
      if (avaterSrc) {
        ctx.drawImage(avaterSrc, 0, 0, width, height);
        ctx.setFontSize(14);
        ctx.setFillStyle('#fff');
        ctx.setTextAlign('left');
      }
      //  绘制二维码
      if (codeSrc) {
        var x = that.data.x / that.data.bili;
        var y = that.data.y / that.data.bili;
        ctx.drawImage(codeSrc, x, y, 70, 70);
      }
      if (wx.getStorageSync("user_name")) {
        var x = that.data.x / that.data.bili;
        var y = that.data.y / that.data.bili;
        if (that.data.font == 2) {
          ctx.setFillStyle('#000');
        } else {
          ctx.setFillStyle('#fff');
        }
        ctx.setFontSize(14);
        ctx.fillText('联系人：' + wx.getStorageSync("user_name"), x + 80, y + 30);
      }
      if (wx.getStorageSync("USER_INFO").binding) {
        var x = that.data.x / that.data.bili;
        var y = that.data.y / that.data.bili;
        if (that.data.font == 2) {
          ctx.setFillStyle('#000');
        } else {
          ctx.setFillStyle('#fff');
        }
        ctx.setFontSize(14);
        ctx.fillText('联系方式：' + wx.getStorageSync("USER_INFO").binding, x + 80, y + 50);
      }
    }).exec()
    setTimeout(function() {
      ctx.draw(true, () => {
        that.saveShareImg();
      })
    }, 500)
  },
  saveShareImg: function() {
    var that = this;
    wx.canvasToTempFilePath({
      destWidth: that.data.imgwidth,
      destHeight: that.data.imgheight,
      fileType: 'jpg',
      canvasId: 'myCanvas',
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        wx.uploadFile({
          url: getApp().api.default.mini_upload_image,
          filePath: tempFilePath,
          header: {
            'Content-Type': 'multipart/form-data',
            'WX-Token': wx.getStorageSync('TOKEN'),
          },
          name: 'file', //这里根据自己的实际情况改
          formData: { //这里是上传图片时一起上传的数据
            minapp: 'weixinminapp'
          },
          success: (resp) => {
            let result = resp.data ? JSON.parse(resp.data) : {
              code: 0
            };
            if (result.code == 0) {
              let image = JSON.parse(resp.data).data.url
              // 生成套餐
              getApp().request({
                url: getApp().api.copy,
                method: "post",
                data: {
                  package_id: that.data.id,
                  poster_img: image
                },
                success(res) {
                  wx.hideLoading()
                  if (res.code == 0) {
                    wx.showToast({
                      title: '已为您生成新的套餐',
                      icon: "none"
                    })
                    wx.saveImageToPhotosAlbum({
                      filePath: tempFilePath,
                      success(res) {
                        if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                          wx.showModal({
                            title: '提示',
                            content: '您的推广海报已存入手机相册，赶快分享给好友吧',
                            showCancel: false,
                            success: modalSuccess => { //确定
                              // wx.navigateBack({

                              // })
                              wx.navigateTo({
                                url: '/pages1/manageGroup/manageGroup?active=2',
                              })
                            }
                          })
                        } else {
                          wx.showToast({
                            title: '保存失败',
                            icon: "none"
                          })
                        }
                      },
                      fail: function(err) {
                        wx.showToast({
                          title: '图片保存失败',
                          icon: 'none',
                        })
                        if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
                          // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
                          wx.showModal({
                            title: '提示',
                            content: '需要您授权保存相册',
                            showCancel: false,
                            success: modalSuccess => {
                              wx.openSetting({
                                success(settingdata) {
                                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                    wx.saveImageToPhotosAlbum({
                                      filePath: tempFilePath,
                                      success(res) {
                                        if (res.errMsg == "saveImageToPhotosAlbum:ok") {
                                          wx.hideLoading()
                                          wx.showModal({
                                            title: '提示',
                                            content: '您的推广海报已存入手机相册，赶快分享给好友吧',
                                            showCancel: false,
                                            success: modalSuccess => { //确定
                                              // wx.navigateBack({

                                              // })
                                              wx.navigateTo({
                                                url: '/pages1/manageGroup/manageGroup?active=2',
                                              })
                                            }
                                          })
                                        } else {
                                          wx.showToast({
                                            title: '保存失败',
                                            icon: "none"
                                          })
                                        }
                                      }
                                    })
                                  } else {
                                    wx.showModal({
                                      title: '提示',
                                      content: '获取权限失败，将无法保存到相册哦~',
                                      showCancel: false,
                                    })
                                  }
                                },
                                fail(failData) {},
                                complete(finishData) {}
                              })
                            }
                          })
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: res.msg,
                      icon: "none"
                    })
                  }
                }
              })
            } else {
              wx.showToast({
                title: '稍后重试！',
                icon: "none"
              })
            }
          }
        })

      }
    });
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
              success: function(res) {
                let myphone = res.data.dataObj;
                if (res.code == 0) {
                  wx.setStorageSync("mobile", res.data.dataObj);
                  self.setData({
                    myphone: res.data.dataObj
                  })

                  // 发送号码
                  getApp().request({
                    url: getApp().api.leftMobile,
                    method: "post",
                    data: {
                      card_id: self.data.user_id,
                      mobile: self.data.myphone
                    },
                    success: function(res) {
                      if (res.code == 0) {
                        wx.showToast({
                          title: '预约成功',
                        })
                        getApp().request({
                          url: getApp().api.addCardActivity,
                          method: "post",
                          data: {
                            card_id: self.data.user_id,
                            type: 112,
                            relation_id: self.data.id,
                            mobile: myphone
                          },
                        })
                        // 发模板消息
                        getApp().request({
                          url: getApp().api.message,
                          method: "POST",
                          data: {
                            formid: res.data,
                            receive_user_id: self.data.user_id,
                            wx_page: '/pages1/cardActivity/cardActivity?user_id=' + self.data.user_id,
                          },
                          success(res) {}
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
      utiphone.checkLogin();
    }
  },
  login() {
    utiphone.checkLogin();
  },
  // 我的浏览
  browsepage(arr) {
    let browsepage = wx.getStorageSync('browsepage');
    let that = this;
    let obj = {};
    if (arr.user_id == wx.getStorageSync('USER_INFO').id) {
      return;
    }

    for (let i in browsepage) {
      if (browsepage[i].pageid == arr.pageid) {
        return;
      }
    }
    obj.time = new Date().getTime();
    let Hours = new Date(new Date().getTime()).getHours() < 10 ? ('0' + new Date(new Date().getTime()).getHours()) : new Date(new Date().getTime()).getHours();
    let minutes = new Date(new Date().getTime()).getMinutes() < 10 ? ('0' + new Date(new Date().getTime()).getMinutes()) : new Date(new Date().getTime()).getMinutes();
    obj.deta = new Date(new Date().getTime()).getMonth() + 1 + '-' + new Date(new Date().getTime()).getDate() + ' ' + Hours + ':' + minutes;
    obj.amount = arr.amount;
    obj.user_id = arr.user_id;
    obj.car_id = arr.card_id;
    obj.name = arr.name;
    obj.pageid = arr.pageid;
    obj.type = 2;
    browsepage.push(obj);
    wx.setStorageSync('browsepage', browsepage);
  }
})