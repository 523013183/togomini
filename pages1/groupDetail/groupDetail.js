var utiphone = require('../../utils/util.js');
const app = getApp();
let tim = getApp().globalData.tim;
Page({
  data: {
    spread: false,
    priceobj: {},
    underline2: true,
    access_token: false,
    replace_id: '',
    replace_goods: [],
    changeIndex: '',
    fatherIndex1: false,
    currentIndex1: false,
    replaceshow: true,
    replace: true,
    like: false,
    phone: '',
    back: true,
    scroll: true,
    groupDetail: {},
    hidden: true,
    hidden1: true,
    projectName: "",
    projectAmount: "",
    size: "",
    color: "",
    material: "",
    price: "",
    isScroll: true,
    gro_id: "",
    goods: "",
    roomArr: "",
    styleArr: "",
    opus_goods: "",
    currentIndex: 0,
    hiddenShare: true,
    num1: 0,
    num2: 0,
    num3: 0
  },
  choosePic(e) {
    let index = e.currentTarget.dataset.index;
    let father = e.currentTarget.dataset.father;
    let id = e.currentTarget.dataset.id2;
    let up = "goods[" + father + "].currentIndex";
    let up2 = "goods[" + father + "].check";
    this.setData({
      [up]: index,
      replace_id: id,
      fatherIndex: father,
      currentIndex: index
    })
    if (this.data.replace_goods[id] != undefined) {
      let opus_goods = this.data.goods;
      for (let i in opus_goods) {
        if (i != father) {
          opus_goods[i].check = false;
        } else {
          opus_goods[i].check = true;
        }
      }
      this.setData({
        [up2]: true,
        goods: opus_goods
      })
    } else {
      let opus_goods = this.data.goods;
      for (let i in opus_goods) {
        if (i != father) {
          opus_goods[i].check = false;
        } else {
          opus_goods[i].check = false;
        }
      }
      this.setData({
        goods: opus_goods
      })
    }
  },
  modifyMsg() {
    var id = this.data.options.id
    if (this.data.shop) {
      wx.navigateTo({
        url: "/pages1/modifyGroup/modifyGroup?id=" + id + "&shop=" + this.data.shop
      })
    } else {
      wx.navigateTo({
        url: "/pages1/modifyGroup/modifyGroup?id=" + id
      })
    }
  },
  onShow() {
    this.setData({
      saveimg:false
    })
  },
  hideMask: function () {
    this.setData({
      hidden1: true
    })
  },
  show_mask: function () {
    var self = this;
    self.setData({
      hiddenShare: !self.data.hiddenShare
    })
    return;
    getApp().request({
      url: getApp().api.sharePackage,
      method: "post",
      data: {
        package_id: self.data.id
      },
      success: function (e) {
        wx.hideLoading()
        if (e.code == 1) {
          wx.showToast({
            icon: "none",
            title: e.msg,
          })
          return;
        }
        self.send_card1();
        self.setData({
          sharePic: e.data.pic_url,
        })

      }
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
          wx.showModal({
            title: '提示',
            content: '授权才能保存海报图哦~',
            confirmText: '授权',
            success(res) {
              if (res.confirm) {
                wx.openSetting({
                  success(settingdata) {
                    if (settingdata.authSetting['scope.writePhotosAlbum']) {} else {}
                  },
                  fail(res) {}
                })
              } else if (res.cancel) {}
            }
          })
        }
      }
    })
    //   }
    // })
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
    let myphone = wx.getStorageSync("mobile");
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      this.setData({
        access_token: true
      })
    }
    this.setData({
      myphone: myphone
    })
    wx.showShareMenu({
      // 要求小程序返回分享目标信息
      withShareTicket: true
    });
    if (!options.type) {
      this.setData({
        back: false
      })
    }
    var id = "";
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      id = this.getSenceParams(scene, "package_id");
    } else {
      id = options.id;
    }
    if (options.shop) {
      this.setData({
        shop: options.shop
      })
    }
    this.setData({
      myId: getApp().core.getStorageSync(getApp().const.USER_INFO).id,
      options: options,
      id: id,
    })
    let self = this;
    //获取套餐详情
    self.index();
  },
  // 获取套餐详情
  index() {
    wx.showLoading({
      title: '加载中',
    })
    let self = this;
    getApp().request({
      url: self.data.options.roomtypeid ? getApp().api.sampleroompackagedetail : getApp().api.groupDetail,
      method: "post",
      data: {
        id: self.data.options.roomtypeid ? self.data.options.roomtypeid : self.data.id
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        if (res.code == 1) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 800)
          return;
        }
        if (res.is_like == 1) {
          self.setData({
            like: true
          })
        }
        for (let i in res.opus_goods) {
          res.opus_goods[i].check = false;
          for (let j in res.opus_goods[i].goods) {
            res.opus_goods[i].goods[j].id2 = res.opus_goods[i].goods[j].id;
            for (let a in res.replace_goods) {
              if (res.opus_goods[i].goods[j].id == a) {
                res.replace_goods[a].push(res.opus_goods[i].goods[j])
              }
            }
          }
        }
        for (let i in res.replace_goods) {
          for (let j in res.replace_goods[i]) {
            res.replace_goods[i][j].checked = false;
            res.replace_goods[i][j].id2 = i;
          }
        }
        var legth = 0;
        var totalnum = 0;
        var totalnum2 = 0;
        for (let i in res.opus_goods) {
          for (let j in res.opus_goods[i].goods) {
            legth += parseInt(res.opus_goods[i].goods[j].number)
            totalnum += parseInt(res.opus_goods[i].goods[j].number * res.opus_goods[i].goods[j].original_price)
            totalnum2 += parseInt(res.opus_goods[i].goods[j].number * res.opus_goods[i].goods[j].price)
          }
        }
        if (wx.getStorageSync("ACCESS_TOKEN")) {
          let obj = {
            amount: res.amount,
            name: res.name,
            user_id: res.user_id,
            card_id: res.card_id,
            pageid: res.id
          }
          self.browsepage(obj);
        }
        // 画图数据
        let length1 = res.opus_goods.length;
        let height = 0;
        if (length1 < 3) {
          height = 400 * (length1 + 1) + 250;
          if (length1 > 1) {
            if (res.opus_goods[1].goods.length > 3) {
              height = height + 300
            }
          }
          if (length1 > 2) {
            if (res.opus_goods[2].goods.length > 3) {
              height = height + 300
            }
          }
        } else {
          height = 400 * 4 + 200;
          if (res.opus_goods[1].goods.length > 3) {
            height = height + 300
          }
          if (res.opus_goods[2].goods.length > 3) {
            height = height + 300
          }
        }
        let num1 = self.data.num1;
        let num2 = self.data.num2;
        let num3 = self.data.num3;
        if (length1 > 0) {
          num1 = res.opus_goods[0].goods.length;
        }
        if (length1 > 1) {
          num2 = res.opus_goods[1].goods.length;
        }
        if (length1 > 2) {
          num3 = res.opus_goods[2].goods.length;
        }
        self.setData({
          cover_img: res.cover_img,
          length1,
          height,
          num1,
          num2,
          num3,
          hide_sever: wx.getStorageSync('hide_sever'),
          totalnum: totalnum,
          totalnum2: totalnum2,
          legth: legth,
          amount: res.amount,
          name: res.name,
          amount2: res.amount,
          groupDetail: res,
          room: res.room,
          goods: res.opus_goods,
          opus_goods: res.opus_goods,
          user_id: res.user_id,
          phone: res.phone,
          create_job_year: res.create_job_year,
          package_id: res.id,
          card_id: res.card_id,
          create_card_id: res.create_card_id,
          has_copy: res.has_copy,
          is_copy: res.is_copy,
          id: res.id,
          replace_goods: res.replace_goods,
          is_auth: res.is_auth
        })
      }
    })
  },
  //分享给好友
  onShareAppMessage: function (options) {
    var that = this;
    if (that.data.card_id = that.data.create_card_id) {
      var carid = that.data.card_id;
      var userid = that.data.user_id
    } else {
      var carid = that.data.create_card_id;
      var userid = that.data.user_id
    }
    if (that.data.shop) {
      return {
        title: that.data.groupDetail.name + "(" + that.data.legth + "件套)",
        path: 'pages1/groupDetail/groupDetail?id=' + that.data.id + "&idid=" + carid + "&type=3" + "&shop=3", //点击分享消息是打开的页面
      }
    } else {
      return {
        title: that.data.groupDetail.name + "(" + that.data.legth + "件套)",
        path: 'pages1/groupDetail/groupDetail?id=' + that.data.id + "&idid=" + carid, //点击分享消息是打开的页面
      }
    }
  },
  cartShare: function () {
    var self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      wx.showLoading({
        title: '',
        mask: true
      })
      self.downloadtx();
    } else {
      utiphone.checkLogin();
    }
  },
  goToDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    if (!id) {
      return
    }
    var url = "/pages1/commodityDetail/commodityDetail?id=" + id + "&type=1";
    wx.navigateTo({
      url: url,
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
  backindex() {
    let that = this;
    if (that.data.card_id = that.data.create_card_id) {
      var carid = that.data.card_id;
      var userid = that.data.user_id
    } else {
      var carid = that.data.create_card_id;
      var userid = that.data.user_id
    }
    wx.reLaunch({
      url: '/pages1/postCard/postCard?user_id=' + userid + "&id=" + carid,
    })
  },
  getPhoneNumber(e) {
    let self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
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
                    url: getApp().api.leftMobile,
                    method: "post",
                    data: {
                      card_id: self.data.user_id,
                      mobile: myphone
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
                            card_id: self.data.user_id,
                            type: 112,
                            relation_id: self.data.id,
                            mobile: myphone
                          },
                        })
                        // 模板消息
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
          icon: 'none'
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
      success: function (res) {
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
          // 模板消息
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
    let message = tim.createCustomMessage({
      to: '' + that.data.user_id,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        data: "" + that.data.id, // 用于标识该消息是骰子类型消息
        description: that.data.groupDetail.name + ',普通套餐', // 获取骰子点数
        extension: that.data.groupDetail.cover_img + ',' + that.data.groupDetail.amount + "," + that.data.goods.length //其他
      }
    });
    // 3. 发送消息
    let promise = tim.sendMessage(message);
    promise.then(function (imResponse) {
      // 发送成功
      let message = imResponse.data.message;
      // 查询用户信息
      let promise = tim.getUserProfile({
        userIDList: ["" + that.data.user_id] // 请注意：即使只拉取一个用户的资料，也需要用数组类型，例如：userIDList: ['user1']
      });
      promise.then(function (imResponse) {
        wx.navigateTo({
          url: '../im/im?im=im&id=' + message.conversationID + "&userid=" + that.data.user_id + '&useravater=' + imResponse.data[0].avatar + '&username=' + imResponse.data[0].nick,
        })
      }).catch(function (imError) {});
    }).catch(function (imError) {
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
      if (self.data.card_id = self.data.create_card_id) {
        var carid = self.data.card_id;
        var userid = self.data.user_id
      } else {
        var carid = self.data.create_card_id;
        var userid = self.data.user_id
      }
      if (self.data.like == false) {
        getApp().request({
          url: getApp().api.likepackage,
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
          title: '你已经喜欢过此套餐',
          icon: "none"
        })
      }
    } else {
      utiphone.checkLogin();
    }
  },
  // 复制套餐
  copy() {
    let self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (wx.getStorageSync('level_name') != '普通用户') {
        getApp().request({
          url: getApp().api.copy,
          method: "post",
          data: {
            package_id: self.data.package_id
          },
          success(res) {
            if (res.code == 0) {
              wx.showToast({
                title: '已为您生成新的套餐',
                icon: "none"
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages1/manageGroup/manageGroup?active=1',
                })
              }, 500)
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
          title: '请先认证设计师(联系客服)',
          icon: 'none'
        })
      }
    } else {
      utiphone.checkLogin()
    }
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
  replace_close() {
    let that = this;
    that.setData({
      replace: !that.data.replace,
      fatherIndex1: false,
      currentIndex1: false,
      changeIndex: ''
    })
  },
  replace(e) {
    let that = this;
    if (e.currentTarget.dataset.check) {
      that.setData({
        replace: !that.data.replace
      })
    } else {
      wx.showToast({
        title: '该产品暂无可替换项',
        icon: 'none'
      })
    }
  },
  radio_group(e) {
    let index = e.detail.value;
    this.setData({
      changeIndex: index
    })
  },
  replace_zhe() {
    let that = this;
    let priceobj = that.data.priceobj;
    let faterindex = that.data.fatherIndex;
    let currindex = that.data.currentIndex;
    let changeIndex = that.data.changeIndex;
    let item = that.data.replace_goods[that.data.replace_id][changeIndex];
    if (item == undefined) {
      wx.showToast({
        title: '请选择替换产品！',
        icon: 'none'
      })
      return;
    }
    if (item.price_type == 1) {
      priceobj[item.id2] = item.replace_price;
    } else {
      priceobj[item.id2] = "-" + item.replace_price;
    }
    let opus_goods = that.data.goods;
    opus_goods[that.data.fatherIndex].goods[that.data.currentIndex] = item;
    let up = 'goods[' + that.data.fatherIndex + '].goods[' + that.data.currentIndex + ']';
    let up2 = 'goods[' + that.data.fatherIndex + '].check';
    let price = that.data.amount2;
    let num = 0;
    for (let i in priceobj) {
      num += Number(priceobj[i])
    }
    var totalnum = 0;
    var totalnum2 = 0;
    var legth = 0;
    for (let i in opus_goods) {
      for (let j in opus_goods[i].goods) {
        legth += parseInt(opus_goods[i].goods[j].number)
        totalnum += parseInt(opus_goods[i].goods[j].number * opus_goods[i].goods[j].original_price)
        totalnum2 += parseInt(opus_goods[i].goods[j].number * opus_goods[i].goods[j].price)
      }
    }
    that.setData({
      priceobj,
      changeIndex: '',
      goods: opus_goods,
      amount: Number(Number(price) + num),
      fatherIndex1: false,
      currentIndex1: false,
      replace: !that.data.replace,
      [up2]: true,
      totalnum,
      totalnum2,
      legth
    })
  },
  replace2() {
    this.index();
  },
  login() {
    utiphone.checkLogin();
  },
  // radio反选
  radio(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let checked = e.currentTarget.dataset.checked;
    let up = "replace_goods[" + that.data.replace_id + "][" + index + "].checked";
    that.setData({
      [up]: !that.data.replace_goods[that.data.replace_id][index].checked
    })
  },
  underline2() {
    let that = this;
    that.setData({
      underline2: !that.data.underline2
    })
    setTimeout(function () {
      that.setData({
        underline2: !that.data.underline2
      })
    }, 1000)
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
  //canvas单行文本自动省略
  fittingString(_ctx, str, maxWidth) {
    let strWidth = _ctx.measureText(str).width;
    const ellipsis = '…';
    const ellipsisWidth = _ctx.measureText(ellipsis).width;
    if (strWidth <= maxWidth || maxWidth <= ellipsisWidth) {
      return str;
    } else {
      var len = str.length;
      while (strWidth >= maxWidth - ellipsisWidth && len-- > 0) {
        str = str.slice(0, len);
        strWidth = _ctx.measureText(str).width;
      }
      return str + ellipsis;
    }
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
        browsepage.splice(i, 1)
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
    obj.type = 1;
    browsepage.unshift(obj);
    wx.setStorageSync('browsepage', browsepage);
  },
  // 画图
  // 画图
  canvas(imgUrl) {
    let that = this;
    var rpx;
    const ctx = wx.createCanvasContext('myCanvas');
    ctx.setFillStyle('#fff');
    ctx.fillRect(0, 0, 750, that.data.height)
    // 头图
    ctx.drawImage(imgUrl[0], 0, 0, 750, 350);
    // 标题
    ctx.setFillStyle('gray');
    ctx.setFontSize(30);
    ctx.fillText(that.data.name, 20, 400);
    // 价格
    ctx.setFillStyle('red');
    ctx.setFontSize(34);
    ctx.fillText("￥" + that.data.amount, (730 - ctx.measureText("￥" + that.data.amount).width), 395);
    // 款数
    ctx.setFillStyle('gray');
    ctx.setFontSize(24);
    ctx.fillText("共" + that.data.legth + '件商品', (730 - ctx.measureText("共" + that.data.legth + '件商品').width), 435);
    // 开始话1
    if (that.data.length1 > 0) {
      // 文字
      ctx.setFillStyle('#000');
      ctx.setFontSize(30);
      // 标题居中
      ctx.fillText(that.data.opus_goods[0].name, (750 - ctx.measureText(that.data.opus_goods[0].name).width) / 2, 470);
      ctx.setStrokeStyle('#000')
      ctx.strokeRect(20, 480, 750 - 40, 0.5);
      if (that.data.num1 > 0) {
        // 产品
        ctx.drawImage(imgUrl[1], 25, 500, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中fittingString
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[0].goods[0].cat_name + 'x' + that.data.opus_goods[0].goods[0].number, 190), 25, 720);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[0].goods[0].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[0].goods[0].size, 190), 25, 745);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[0].goods[0].material, 190), 25, 770);
      }
      if (that.data.num1 > 1) {
        // 产品
        ctx.drawImage(imgUrl[2], 275, 500, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[0].goods[1].cat_name + 'x' + that.data.opus_goods[0].goods[1].number, 190), 275, 720);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[0].goods[1].size == "" ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[0].goods[1].size, 190), 275, 745);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[0].goods[1].material, 190), 275, 770);
      }
      if (that.data.num1 > 2) {
        // 产品
        ctx.drawImage(imgUrl[3], 525, 500, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[0].goods[2].cat_name + 'x' + that.data.opus_goods[0].goods[2].number, 190), 525, 720);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[0].goods[2].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[0].goods[2].size, 190), 525, 745);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[0].goods[2].material, 190), 525, 770);
      }
    }
    //空间2
    if (that.data.length1 > 1) {
      // 文字
      ctx.setFillStyle('#000');
      ctx.setFontSize(30);
      // 标题居中
      ctx.fillText(that.data.opus_goods[1].name, (750 - ctx.measureText(that.data.opus_goods[1].name).width) / 2, 825);
      ctx.setStrokeStyle('#000')
      ctx.strokeRect(20, 835, 750 - 40, 0.5);
      if (that.data.num2 > 0) {
        // 产品
        ctx.drawImage(imgUrl[4], 25, 855, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[1].goods[0].cat_name + 'x' + that.data.opus_goods[1].goods[0].number, 190), 25, 1075);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[1].goods[0].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[1].goods[0].size, 190), 25, 1100);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[1].goods[0].material, 190), 25, 1125);
      }
      if (that.data.num2 > 1) {
        // 产品
        ctx.drawImage(imgUrl[5], 275, 855, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[1].goods[1].cat_name + 'x' + that.data.opus_goods[1].goods[1].number, 190), 275, 1075);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[1].goods[1].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[1].goods[1].size, 190), 275, 1100);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[1].goods[1].material, 190), 275, 1125);
      }
      if (that.data.num2 > 2) {
        // 产品
        ctx.drawImage(imgUrl[6], 525, 855, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[1].goods[2].cat_name + 'x' + that.data.opus_goods[1].goods[2].number, 190), 525, 1075);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[1].goods[2].size == "" ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[1].goods[2].size, 190), 525, 1100);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[1].goods[2].material, 190), 525, 1125);
      }
      if (that.data.num2 > 3) {
        // 产品
        ctx.drawImage(imgUrl[7], 25, 1160, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[1].goods[3].cat_name + 'x' + that.data.opus_goods[1].goods[3].number, 190), 25, 1380);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[1].goods[3].size == "" ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[1].goods[3].size, 190), 25, 1405);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[1].goods[3].material, 190), 25, 1430);
      }
      if (that.data.num2 > 4) {
        // 产品
        ctx.drawImage(imgUrl[8], 275, 1160, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[1].goods[4].cat_name + 'x' + that.data.opus_goods[1].goods[4].number, 190), 275, 1380);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[1].goods[4].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[1].goods[4].size, 190), 275, 1405);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[1].goods[4].material, 190), 275, 1430);
      }
      if (that.data.num2 > 5) {
        // 产品
        ctx.drawImage(imgUrl[9], 525, 1160, 200, 200);
        ctx.setFillStyle('#000');
        ctx.setFontSize(18);
        // 标题居中
        ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[1].goods[5].cat_name + 'x' + that.data.opus_goods[1].goods[5].number, 190), 525, 1380);
        ctx.fillText(that.fittingString(ctx, that.data.opus_goods[1].goods[5].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[1].goods[5].size, 190), 525, 1405);
        ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[1].goods[5].material, 190), 525, 1430);
      }
    }
    //空间3
    if (that.data.length1 > 2) {
      if (that.data.opus_goods[1].goods.length > 3) {
        // 文字
        ctx.setFillStyle('#000');
        ctx.setFontSize(30);
        // 标题居中
        ctx.fillText(that.data.opus_goods[2].name, (750 - ctx.measureText(that.data.opus_goods[1].name).width) / 2, 1485);
        ctx.setStrokeStyle('#000')
        ctx.strokeRect(20, 1495, 750 - 40, 0.5);
        if (that.data.num3 > 0) {
          // 产品
          ctx.drawImage(imgUrl[10], 25, 1515, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[0].cat_name + 'x' + that.data.opus_goods[2].goods[0].number, 190), 25, 1735);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[0].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[0].size, 190), 25, 1760);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[0].material, 190), 25, 1785);
        }
        if (that.data.num3 > 1) {
          // 产品
          ctx.drawImage(imgUrl[11], 275, 1515, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[1].cat_name + 'x' + that.data.opus_goods[2].goods[1].number, 190), 275, 1735);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[1].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[1].size, 190), 275, 1760);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[1].material, 190), 275, 1785);
        }
        if (that.data.num3 > 2) {
          // 产品
          ctx.drawImage(imgUrl[12], 525, 1515, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[2].cat_name + 'x' + that.data.opus_goods[2].goods[2].number, 190), 525, 1735);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[2].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[2].size, 190), 525, 1760);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[2].material, 190), 525, 1785);
        }
        if (that.data.num3 > 3) {
          // 产品
          ctx.drawImage(imgUrl[13], 25, 1820, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[3].cat_name + 'x' + that.data.opus_goods[2].goods[3].number, 190), 25, 2040);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[3].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[3].size, 190), 25, 2065);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[3].material, 190), 25, 2090);
        }
        if (that.data.num3 > 4) {
          // 产品
          ctx.drawImage(imgUrl[14], 275, 1820, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[4].cat_name + 'x' + that.data.opus_goods[2].goods[4].number, 190), 275, 2040);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[4].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[4].size, 190), 275, 2065);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[4].material, 190), 275, 2090);
        }
        if (that.data.num3 > 5) {
          // 产品
          ctx.drawImage(imgUrl[15], 525, 1820, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[5].cat_name + 'x' + that.data.opus_goods[2].goods[5].number, 190), 525, 2040);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[5].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[5].size, 190), 525, 2065);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[5].material, 190), 525, 2090);
        }
      } else {
        //  空间一排时
        // 文字
        ctx.setFillStyle('#000');
        ctx.setFontSize(30);
        // 标题居中
        ctx.fillText(that.data.opus_goods[2].name, (750 - ctx.measureText(that.data.opus_goods[1].name).width) / 2, 1180);
        ctx.setStrokeStyle('#000')
        ctx.strokeRect(20, 1190, 750 - 40, 0.5);
        if (that.data.num3 > 0) {
          // 产品
          ctx.drawImage(imgUrl[10], 25, 1210, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[0].cat_name + 'x' + that.data.opus_goods[2].goods[0].number, 190), 25, 1430);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[0].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[0].size, 190), 25, 1455);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[0].material, 190), 25, 1480);
        }
        if (that.data.num3 > 1) {
          // 产品
          ctx.drawImage(imgUrl[11], 275, 1210, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[1].cat_name + 'x' + that.data.opus_goods[2].goods[1].number, 190), 275, 1430);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[1].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[1].size, 190), 275, 1455);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[1].material, 190), 275, 1480);
        }
        if (that.data.num3 > 2) {
          // 产品
          ctx.drawImage(imgUrl[12], 525, 1210, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[2].cat_name + 'x' + that.data.opus_goods[2].goods[2].number, 190), 525, 1430);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[2].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[2].size, 190), 525, 1455);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[2].material, 190), 525, 1480);
        }
        if (that.data.num3 > 3) {
          // 产品
          ctx.drawImage(imgUrl[13], 25, 1515, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[3].cat_name + 'x' + that.data.opus_goods[2].goods[3].number, 190), 25, 1735);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[3].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[3].size, 190), 25, 1760);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[3].material, 190), 25, 1785);
        }
        if (that.data.num3 > 4) {
          // 产品
          ctx.drawImage(imgUrl[14], 275, 1515, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[4].cat_name + 'x' + that.data.opus_goods[2].goods[4].number, 190), 275, 1735);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[4].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[4].size, 190), 275, 1760);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[4].material, 190), 275, 1785);
        }
        if (that.data.num3 > 5) {
          // 产品
          ctx.drawImage(imgUrl[15], 525, 1515, 200, 200);
          ctx.setFillStyle('#000');
          ctx.setFontSize(18);
          // 标题居中
          ctx.fillText(that.fittingString(ctx, "品名：" + that.data.opus_goods[2].goods[5].cat_name + 'x' + that.data.opus_goods[2].goods[5].number, 190), 525, 1735);
          ctx.fillText(that.fittingString(ctx, that.data.opus_goods[2].goods[5].size == '' ? '尺寸：暂无' : "尺寸：" + that.data.opus_goods[2].goods[5].size, 190), 525, 1760);
          ctx.fillText(that.fittingString(ctx, "材质：" + that.data.opus_goods[2].goods[5].material, 190), 525, 1785);
        }
      }
    }
    // 二维码
    if (imgUrl[17]) {
      ctx.setFillStyle('gray');
      ctx.setFontSize(24);
      ctx.fillText('扫码查看更多空间详情', (750 - ctx.measureText('扫码查看更多空间详情').width) / 2, (that.data.height - 250));
      ctx.fillText(that.fittingString(ctx, that.data.groupDetail.create_user_name, 290), 190, (that.data.height - 190));
      ctx.fillText(that.fittingString(ctx, that.data.groupDetail.create_job + '-' + that.data.create_job_year + '年', 290), 190, (that.data.height - 140));
      ctx.fillText(that.fittingString(ctx, that.data.phone, 290), 190, (that.data.height - 90));
      ctx.save();
      ctx.beginPath();
      ctx.arc(100, (that.data.height - 150), 80, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(imgUrl[17], 20, (that.data.height - 230), 160, 160);
      ctx.restore();
    }
    if (imgUrl[16]) {
      ctx.setStrokeStyle('#000')
      console.log(ctx.measureText('扫码查看更多空间详情').width)
      ctx.strokeRect(20, (that.data.height - 260), 215, 0.5);
      ctx.strokeRect(515, (that.data.height - 260), 215, 0.5);
      ctx.drawImage(imgUrl[16], 500, (that.data.height - 250), 200, 200);
      ctx.setFillStyle('#ccc');
      ctx.setFontSize(26);
      // 标题居中
      ctx.fillText('扫码查看更多空间详情', 500 - (ctx.measureText('扫码查看更多空间详情').width - 220), (that.data.height - 20));
      ctx.fillText('本设计师创建', 25, (that.data.height - 20));
    }
    if (imgUrl[0]) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(600, (that.data.height - 150), 45, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(imgUrl[0], 555, (that.data.height - 195), 90, 90);
      ctx.restore();
    }
    // 第三步：画图
    ctx.draw(true, () => {
      that.save();
    })
  },
  save() {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      destWidth: 750,
      destHeight: that.data.height,
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.setData({
          tempFilePath
        })
        // wx.previewImage({
        //   current: tempFilePath,
        //   urls: [tempFilePath],
        // })
        wx.hideLoading();
      },
    });
  },
  spread() {
    this.setData({
      spread: !this.data.spread
    })
  },
  bg() {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      utiphone.checkLogin();
      return;
    }
    let that = this;
    that.hiddenMasking1();
    wx.showLoading({
      title: '图片下载中',
      mask: true
    })
    var img1 = new Promise((resolve, reject) => {
      wx.downloadFile({
        url: that.data.cover_img.replace('http', 'https'),
        success(res) {
          resolve(res.tempFilePath)
        }
      })
    })
    var img2 = new Promise((resolve, reject) => {
      if (that.data.length1 > 0 && that.data.num1 > 0) {
        wx.downloadFile({
          url: that.data.opus_goods[0].goods[0].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img3 = new Promise((resolve, reject) => {
      if (that.data.length1 > 0 && that.data.num1 > 1) {
        wx.downloadFile({
          url: that.data.opus_goods[0].goods[1].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img4 = new Promise((resolve, reject) => {
      if (that.data.length1 > 0 && that.data.num1 > 2) {
        wx.downloadFile({
          url: that.data.opus_goods[0].goods[2].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img5 = new Promise((resolve, reject) => {
      if (that.data.length1 > 1 && that.data.num2 > 0) {
        wx.downloadFile({
          url: that.data.opus_goods[1].goods[0].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img6 = new Promise((resolve, reject) => {
      if (that.data.length1 > 1 && that.data.num2 > 1) {
        wx.downloadFile({
          url: that.data.opus_goods[1].goods[1].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img7 = new Promise((resolve, reject) => {
      if (that.data.length1 > 1 && that.data.num2 > 2) {
        wx.downloadFile({
          url: that.data.opus_goods[1].goods[2].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img8 = new Promise((resolve, reject) => {
      if (that.data.length1 > 1 && that.data.num2 > 3) {
        wx.downloadFile({
          url: that.data.opus_goods[1].goods[3].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img9 = new Promise((resolve, reject) => {
      if (that.data.length1 > 1 && that.data.num2 > 4) {
        wx.downloadFile({
          url: that.data.opus_goods[1].goods[4].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img10 = new Promise((resolve, reject) => {
      if (that.data.length1 > 1 && that.data.num2 > 5) {
        wx.downloadFile({
          url: that.data.opus_goods[1].goods[5].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img11 = new Promise((resolve, reject) => {
      if (that.data.length1 > 2 && that.data.num3 > 0) {
        wx.downloadFile({
          url: that.data.opus_goods[2].goods[0].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img12 = new Promise((resolve, reject) => {
      if (that.data.length1 > 2 && that.data.num3 > 1) {
        wx.downloadFile({
          url: that.data.opus_goods[2].goods[1].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img13 = new Promise((resolve, reject) => {
      if (that.data.length1 > 2 && that.data.num3 > 2) {
        wx.downloadFile({
          url: that.data.opus_goods[2].goods[2].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img14 = new Promise((resolve, reject) => {
      if (that.data.length1 > 2 && that.data.num3 > 3) {
        wx.downloadFile({
          url: that.data.opus_goods[2].goods[3].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img15 = new Promise((resolve, reject) => {
      if (that.data.length1 > 2 && that.data.num3 > 4) {
        wx.downloadFile({
          url: that.data.opus_goods[2].goods[4].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img16 = new Promise((resolve, reject) => {
      if (that.data.length1 > 2 && that.data.num3 > 5) {
        wx.downloadFile({
          url: that.data.opus_goods[2].goods[5].cover_pic.replace('http', 'https'),
          success(res) {
            resolve(res.tempFilePath)
          }
        })
      } else {
        resolve(null)
      }
    })
    var img17 = new Promise((resolve, reject) => {
      getApp().request({
        url: getApp().api.packagecode,
        method: 'POST',
        data: {
          package_id: that.data.groupDetail.id
        },
        success(res) {
          console.log(res,"套餐的二维码")
          wx.downloadFile({
            url: res.data.pic_url,
            success(res) {
              resolve(res.tempFilePath)
            }
          })
        }
      })
    })
    var img18 = new Promise((resolve, reject) => {
      let tximg = '';
      var Expression = /(https):\/\/([\w.]+\/?)\S*/;
      var objExp = new RegExp(Expression);
      if (objExp.test(that.data.groupDetail.create_avatar)) {
        tximg = that.data.groupDetail.create_avatar;
      } else {
        tximg = that.data.groupDetail.create_avatar.replace('http', 'https');
      }
      wx.downloadFile({
        url: tximg,
        success(res) {
          resolve(res.tempFilePath)
        }
      })
    })
    Promise.all([img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18]).then(function (results) {
      // console.log(results); // 获得一个Array: ['P1', 'P2']
      let arr = results;
      that.canvas(results)
    });
  },
  closeposter() {
    this.setData({
      tempFilePath: false
    })
  },
  saveposter() {
    let that = this;
    if(that.data.saveimg){
      wx.showToast({
        title:'已保存到相册',
        icon:'none'
      })
      return;
    }
    wx.saveImageToPhotosAlbum({
      filePath: that.data.tempFilePath, //这个只是测试路径，没有效果
      success(res) {
        console.log("success");
        wx.showToast({
          title:'保存成功，请到相册查看',
          icon:'none'
        })
        that.setData({
          saveimg:true,
          tempFilePath: false
        })
      },
      fail: function (res) {
        console.log(res);
        if (res.errMsg == 'saveImageToPhotosAlbum:fail auth deny') {
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
  }
})