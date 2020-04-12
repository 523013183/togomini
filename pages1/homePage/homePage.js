//获取应用实例
var util = require('../../utils/util.js')
const app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'FB7BZ-IKH6U-DDKV3-4GI45-VC7SZ-WABNQ' //申请的开发者秘钥key
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    heightauto: false,
    datastyle: '1',
    animationData: {},
    animation_box: false,
    access_token: false,
    city: '未知',
    showprice: true,
    user_id: null,
    toview: "cardPart",
    initTop: 0,
    num: 0,
    hiddenShare: true,
    hidden: true,
    show: 0,
    height: "",
    avatarSrc: "",
    tx_img:'http://oss.diywoju.com/web/uploads/image/store_1/26da69061d3f1e5ea0bdd72e02ea7ef0d2711e4e.png',
    info: [],
    userName: "未登录",
    job: "职务",
    years: "1",
    designPrice: "0~0",
    style: "",
    descript: "",
    mobile: "",
    wechat: "",
    click: 0,
    like_count: 0,
    fans_count: 0,
    productList: [],
    productNewList: null,
    packagelist: [],
    activityList: [],
    zan: 0,
    fansCount: 0,
    mobileFlag: true,
    phoneNum: "",
    share_box: "true",
    isScroll: true,
    hasproduct: 0,
    hasGroup: 0,
    listimg2: '',
    listimg: '',
    listname: '',
    listname2: '',
    is_merchant: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  showMsg() {
    wx.showModal({
      title: '提示',
      content: '您还没有作品，请先添加作品',
      showCancel: false,
    })
  },
  /*名片码弹窗*/
  show_cardCode() {
    var that = this;
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
        this.mptx();
      }
    } else {
      util.checkLogin();
    }
  },

  /*递名片*/
  send_card() {
    wx.navigateTo({
      url: "/pages1/postCard/postCard"
    });
  },
  /*递名片弹窗*/
  send_card1(e) {
    let that = this;
    // 判断名片信息是否完善
    if (this.data.designPrice != '' && this.data.years != '' && this.data.job != '' && this.data.descript != '' && this.data.style != '') {
      wx.showLoading({
        title: '',
        mask: true,
      })
      that.getAvaterInfo()
    } else {
      if (wx.getStorageSync('ACCESS_TOKEN')) {
        wx.showToast({
          title: '请先完善名片再递名片！',
          icon: "none",
        })
      } else {
        util.checkLogin();
      }
    }
  },
  hidden_mask() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.mpimg,
      success(result) {
        wx.showToast({
          icon: 'none',
          title: '保存成功',
          // content: '',
        })
        that.setData({
          hidden: true,
          share_box: true,
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

  },
  /*我的名片*/
  my_card() {
    wx.showTabBar({
      animation: true,
    });
    this.setData({
      show: 0
    })
  },
  //隐藏转发蒙版
  hiddenMasking1() {
    this.setData({
      hiddenShare: true
    })
  },
  hiddenMasking() {
    this.setData({
      hiddenShare: true
    })
    this.show_cardCode()
  },
  /*跳转到编辑名片*/
  linkMCard(e) {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      this.login();
      return;
    }
    var self = this;
    var id = e.currentTarget.dataset.id,
      userName = e.currentTarget.dataset.username,
      job = e.currentTarget.dataset.job,
      years = e.currentTarget.dataset.years,
      designPrice = e.currentTarget.dataset.designprice,
      style = JSON.stringify(e.currentTarget.dataset.style),
      descript = e.currentTarget.dataset.descript,
      mobile = e.currentTarget.dataset.mobile,
      wechat = e.currentTarget.dataset.wechat,
      avatarSrc = e.currentTarget.dataset.avatarsrc;
    if (wx.getStorageSync('msg') == '名片不存在') {
      wx.navigateTo({
        url: "/pages1/modifyCard/modifyCard?userName=" + wx.getStorageSync('USER_INFO').nickname + '&mobile=' + wx.getStorageSync('USER_INFO').binding + '&avatarSrc=' + wx.getStorageSync('USER_INFO').avatar_url
      })
    } else {
      wx.navigateTo({
        url: "/pages1/modifyCard/modifyCard?id=" + id + '&userName=' + userName + '&job=' + job + '&years=' + years + '&designPrice=' + designPrice +
          '&style=' + style + '&descript=' + descript + '&mobile=' + mobile + '&wechat=' + wechat + '&avatarSrc=' + avatarSrc
      })
    }
  },
  /*跳转到我的动态*/
  link_cardActivity(e) {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      var id = this.data.user_id;
      wx.navigateTo({
        url: "/pages1/cardActivity/cardActivity?user_id=" + id
      })
    } else {
      util.checkLogin()
    }
  },
  /*跳转到管理作品*/
  linkManagePro(e) {
    let self = this;
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
        wx.navigateTo({
          url: '/pages1/manageProducts/manageProducts',
        })
      }
    } else {
      util.checkLogin()
    }
  },
  /*跳转到我的作品*/
  link_project(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/productDetail/productDetail?id=" + id + "&type=2"
    })
    getApp().request({
      url: getApp().api.addCardActivity,
      method: "post",
      data: {
        card_id: self.data.user_id,
        type: 106,
        relation_id: e.currentTarget.dataset.id

      },
    })
  },
  /*跳转到管理套餐*/
  linkManageGro(e) {
    let self = this;
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
        wx.navigateTo({
          url: '/pages1/manageGroup/manageGroup',
        })
      }
    } else {
      util.checkLogin()
    }
  },
  // 跳转参考套餐
  linkManageGro1(e) {
    let self = this;
    wx.navigateTo({
      url: "/pages1/merchantGroup/merchantGroup"
    })
  },
  /*跳转到我的套餐*/
  link_groupDetail(e) {
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: "/pages1/groupDetail/groupDetail?id=" + id + "&type=2"
      })
    } else {
      wx.navigateTo({
        url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + "&type=2"
      })
    }
  },
  //点击联系客服
  connect_service() {
    wx.makePhoneCall({
      phoneNumber: "18206072787",
    })
  },
  //点击联系设计师
  call_designer() {
    var self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.mobile,
    })
  },
  //点击套餐产品
  linkProduct(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/commodityDetail/commodityDetail?id=" + id
    })
  },
  //数组排序
  creatCompare: function (propertyName) {
    return function (obj1, obj2) {
      var value1 = obj1[propertyName];
      var value2 = obj2[propertyName];
      return value2 - value1;
    }
  },
  getCardData: function () {
    //获取名片信息
    var self = this;
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 1];
    getApp().request({
      url: getApp().api.index1,
      method: "post",
      params: {
        card_id: curPage.data.user_id
      },
      success: function (res) {
        wx.setStorageSync('msg', res.msg)
        if (res.code == 0) {
          let info = res.data.info;
          if (info.mobile == '') {
            self.setData({
              mobile: wx.getStorageSync('phone')
            })
          }
          wx.setStorageSync('addtime', res.data.info.addtime)
          if (info.job.indexOf("设计") != -1) {
            self.setData({
              showprice: false
            })
          }
          wx.setStorageSync("carid", info.id)
          if (info.id == undefined) {
            wx.navigateTo({
              url: 'pages1/modifyCard/modifyCard'
            })
          } else {
            let USER_INFO = wx.getStorageSync('USER_INFO');
            USER_INFO.avatar_url = res.data.info.avatar_url;
            wx.setStorageSync('USER_INFO', USER_INFO)
            wx.setStorageSync('is_merchant', res.data.info.is_merchant)
            wx.setStorageSync('level_name', res.data.info.level_name)
            wx.setStorageSync('user_name', res.data.info.user_name)
            wx.setStorageSync('wechat', res.data.info.wechat)
            wx.setStorageSync('mobile', res.data.info.mobile)
            wx.setStorageSync('avatar', res.data.info.avatar_url)
            wx.setStorageSync('msg', '')
            self.setData({
              msg: '',
              info_: info,
              phone_: info.mobile,
              info: res.data.info,
              user_id: info.user_id,
              id: info.id,
              userName: info.user_name,
              job: info.job,
              years: info.job_year,
              designPrice: info.design_fees,
              style: info.style,
              descript: info.introduction,
              mobile: info.mobile,
              click: info.click,
              like_count: res.data.like_count,
              fans_count: res.data.fans_count,
              avatarSrc: res.data.info.avatar_url,
              is_merchant: info.is_merchant
            })
          }
          // 调用sdk接口
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.data.info.latitude,
              longitude: res.data.info.longitude
            },
            success: function (res) {
              //获取当前地址成功
              self.setData({
                city: res.result.address_component.city,
              })
            },
            fail: function (res) {
              self.setData({
                city: '未定位',
              })
            }
          });
        } else {
          self.setData({
            msg: res.msg
          })
        }
      }
    })
  },
  //获取作品列表
  getProjectData: function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    var self = this;
    getApp().request({
      url: getApp().api.projectList,
      method: "post",
      success: function (res) {
        if (!wx.getStorageSync('qrcode')) {
          self.qrcode();
        } else {
          wx.hideLoading()
        }
        var arr = res.data.list;
        if (arr.length > 0) {
          self.setData({
            hasProduct: 1,
          })
        }
        var arr2 = [];
        var length = arr.length;
        for (var i = 0; i < length; i++) {
          if (arr[i].is_show == 1) {
            arr2.push(arr[i])
          }
        }
        self.setData({
          productList: arr2.sort(self.creatCompare("is_top"))
        })
        if (arr2.sort(self.creatCompare("is_top")).length < 1) {
          self.setData({
            listimg2: '',
            listname2: '',
            listimg: '',
            listname: '',
          })
        }
        if (arr2.sort(self.creatCompare("is_top")).length > 0) {
          if (arr2.sort(self.creatCompare("is_top")).length > 1) {
            self.setData({
              listimg2: arr2.sort(self.creatCompare("is_top"))[1].pic,
              listname2: arr2.sort(self.creatCompare("is_top"))[1].name
            })
          }
          self.setData({
            listimg: arr2.sort(self.creatCompare("is_top"))[0].pic,
            listname: arr2.sort(self.creatCompare("is_top"))[0].name
          })
        }
      }
    })
  },
  //获取套餐列表
  getGroupData: function () {
    var self = this;
    getApp().request({
      url: getApp().api.groupList,
      method: "post",
      success: function (res) {
        var arr = res.data.list;
        var arr2 = [];
        var length = arr.length;
        for (var i = 0; i < length; i++) {
          if (arr[i].is_show == 1) {
            arr2.push(arr[i])
          }
        }
        self.setData({
          packagelist: arr2
        })
        if (res.data.list.length != 0) {
          self.setData({
            hasGroup: 1
          })
        }
      }
    });
  },
  //保存名片二维码
  savePic: function () {
    wx.showLoading({
      title: '',
    })
    var self = this;
    getApp().request({
      url: getApp().api.savePic,
      method: "post",
      success: function (res) {
        wx.hideLoading()
        if (res.code == 0) {
          self.setData({
            mingpianImg: res.data.pic_url,
            hidden: false
          })
        }
      }
    });
  },
  //获取活动列表
  getActivityData: function () {
    var self = this;
    getApp().request({
      url: getApp().api.activityList,
      method: "post",
      success: function (res) {
        self.setData({
          activityList: res.data.list
        })
      }
    });
  },
  onLoad: function (options) {
    // 第一登录来首页去签到
    this.setData({
      msh:wx.getStorageSync('msg')
    })
    if (app.globalData.is_sign == "去签到") {
      // wx.showModal({
      //   title: '提示',
      //   content: '签到提醒！',
      //   confirmText: '去签到',
      //   success(res) {
      //     if (res.confirm) {
      //       wx.navigateTo({
      //         url: '/pages1/sign/sign',
      //       })
      //     }
      //     app.globalData.is_sign == ""
      //   }
      // })
    }
    if (wx.getStorageSync('datastyle')) {
      this.setData({
        datastyle: wx.getStorageSync('datastyle')
      })
    }
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      this.setData({
        access_token: true
      })
    }
    if (options.share == true) {
      if (this.data.id == undefined) {
        wx.navigateTo({
          url: '/pages1/modifyCard/modifyCard',
        })
      }
    }
    let info = wx.getStorageSync('user_info')
    wx.showTabBar({
      animation: true,
    });
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 1];
    var USER_INFO = getApp().core.getStorageSync(getApp().const.USER_INFO);
    this.setData({
      phone: wx.getStorageSync("mobile"),
      tx_img: info.avatarUrl,
      name_: info.nickName,
      user_id: curPage.data.user_id,
      msg: wx.getStorageSync('msg')
    })
    if (options.avatarSrc) {
      this.setData({
        avatarSrc: options.avatarSrc
      })
    }
  },
  onShow() {
    let that = this;
    wx.setStorageSync('user_name', wx.getStorageSync('USER_INFO').nickname)
    if(!wx.getStorageSync('mobile')){
      wx.setStorageSync('mobile', wx.getStorageSync('USER_INFO').binding)
    }
    wx.setStorageSync('avatar', wx.getStorageSync('USER_INFO').avatar_url)
    that.getCardData();
    that.getProjectData();
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      that.getGroupData();
    }
    that.getGroup();
  },
  //分享给好友
  onShareAppMessage: function (options) {
    if (options.from === 'button') {
      // 来自页面内转发按钮
      var id = this.data.id;
      this.setData({
        hiddenShare: true
      })
      return {
        title: '你好，我是' + this.data.userName + '，这是我的电子名片',
        path: '/pages1/postCard/postCard?id=' + id + "&user_id=" + this.data.user_id, //点击分享消息是打开的页面
        imageUrl: this.data.imgimg
      }
    }
    if (options.from === 'menu') {
      var id = this.data.id;
      return {
        title: '你好，我是' + this.data.userName + '，这是我的电子名片',
        path: '/pages1/postCard/postCard?id=' + id + "&user_id=" + this.data.user_id, //点击分享消息是打开的页面
        imageUrl: this.data.imgimg
      }
    }
  },
  //点击编辑按钮
  modifyMsg: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    var remarks = e.currentTarget.dataset.remarks;
    var pic = JSON.stringify(e.currentTarget.dataset.pic);
    wx.navigateTo({
      url: "/pages1/modifyProduct/modifyProduct?id=" + id + '&name=' + name + '&remarks=' + remarks + '&pic=' + pic
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  hideBox: function () {
    var that = this;
    that.setData({
      hidden: true
    })
  },
  getPhoneNumber(e) {
    let that = this;
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
                code: res.code
              },
              success: function (res) {
                if (res.code == 0) {
                  wx.setStorageSync("mobile", res.data.dataObj)
                  that.setData({
                    phone: res.data.dataObj
                  })
                  let id = that.data.info.id;
                  let userName = that.data.info.user_name;
                  let job = that.data.info.job;
                  let years = that.data.info.job_year;
                  let designPrice = that.data.info.design_fees;
                  let style = JSON.stringify(that.data.info.style);
                  let descript = that.data.info.introduction;
                  let mobile = that.data.info.mobile
                  let wechat = that.data.info.wechat
                  let avatarSrc = that.data.avatarSrc;
                  wx.navigateTo({
                    url: "/pages1/modifyCard/modifyCard?userName=" + wx.getStorageSync('USER_INFO').nickname + '&mobile=' + res.data.dataObj + '&avatarSrc=' + wx.getStorageSync('USER_INFO').avatar_url
                  })
                }
              }
            })
          }
        })
      } else {
        wx.showToast({
          title: '请先获取手机号码',
          icon: "none"
        })
      }
    } else {
      util.checkLogin()
    }
  },
  scroll2(e) {
    let left = e.detail.scrollLeft
    this.setData({
      left: left
    })
  },
  // 画转发的名片截图
  getAvaterInfo: function () {
    var that = this;
    var Expression = /(https):\/\/([\w.]+\/?)\S*/;
    var objExp = new RegExp(Expression);
    var tximg = '';
    if (objExp.test(that.data.avatarSrc)) {
      tximg = that.data.avatarSrc;
    } else {
      tximg = that.data.avatarSrc.replace('http', 'https')
    }
    wx.downloadFile({
      url: tximg, //头像图片路径
      success: function (res) {
        let img = res.tempFilePath;
        wx.downloadFile({
          url: 'https://oss.diywoju.com/web/uploads/image/store_1/19bfb96955a8c37b1d74e348d1bfd3a0d5633b83.jpg', //背景图片路径
          success: function (res) {
            let img2 = res.tempFilePath
            let image = '';
            if (that.data.listimg) {
              image = that.data.listimg.replace('http', 'https')
            } else {
              image = 'https://oss.diywoju.com/web/uploads/image/store_1/65a3abe5ce6d8b8ea32633b9c4cf854c48e60802.png'
            }
            wx.downloadFile({
              url: image, //图片路径
              success: function (res) {
                let img3 = res.tempFilePath
                let image = '';
                if (that.data.listimg2) {
                  image = that.data.listimg2.replace('http', 'https')
                } else {
                  image = 'https://oss.diywoju.com/web/uploads/image/store_1/b910305b1b2824f120c5f9225b128ccafdfd5226.png'
                }
                wx.downloadFile({
                  url: image, //图片路径
                  success: function (res) {
                    let img4 = res.tempFilePath
                    // 画图
                    that.sharePosteCanvas(img, img2, img3, img4)
                  }
                })
              }
            })

          }
        })
      }
    })
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
  // ==================================================
  sharePosteCanvas: function (avaterSrc, img2, img3, img4) {
    console.log(avaterSrc, img2, img3, img4)
    var that = this;
    const ctx = wx.createCanvasContext('canvas'); //创建画布
    ctx.setFillStyle('blue');
    // wx.createSelectorQuery().select('#canvas_').boundingClientRect(function (rect) {
    var height = 400;
    var right = 500;
    var width = 500;
    var left = 5;
    ctx.setFillStyle('blue');
    ctx.fillRect(0, 0, width, height);
    ctx.save();
    // 背景图
    if (img2) {
      ctx.drawImage(img2, 0, 0, width, height);
      ctx.setFontSize(14);
    }
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
    var x = 10
    var y = 10
    var w = width - 20
    var h = height - 20
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
    ctx.fill()
    ctx.closePath()
    // 剪切
    ctx.clip()
    // ctx.save();
    ctx.restore();
    // //姓名
    if (that.data.userName) {
      ctx.setFontSize(24);
      ctx.setFillStyle('#666666');
      ctx.fillText(that.data.userName, width / 3.3, width / 10);
    }
    // //标签
    if (that.data.years) {
      ctx.setFontSize(23);
      ctx.fillStyle = "#666666";
      ctx.fillText(that.data.years + "年经验-" + that.data.job, width / 3.3, width / 5.3);
      const metrics = ctx.measureText(that.data.years); //测量文本信息
      ctx.rect(width / 3.3, width / 7.2, 55, 17);
    }
    if (wx.getStorageSync('level_name') == "设计师") {
      ctx.setFontSize(23);
      ctx.fillStyle = "#fdd611";
      var width_2 = ctx.measureText("V平台认证").width;
      ctx.fillText("V平台认证", width - (width_2 + 18), width / 5.3);
      ctx.font = 'normal bold 30px sans-serif';
      const metrics = ctx.measureText(that.data.years); //测量文本信息
      ctx.rect(width / 3.3, width / 7.2, 55, 17);
    }
    // //风格
    // if (that.data.style) {
    //   ctx.setFontSize(24);
    //   ctx.setFillStyle('#666666');
    //   var obj = "个人标签-" + that.data.style.join(" ");
    //   ctx.fillText(that.fittingString(ctx, obj, 330), width / 3.3, width / 3.8, );
    // }
    // //电话
    if (that.data.mobile) {
      ctx.setFontSize(24);
      ctx.setFillStyle('#666666');
      ctx.fillText("联系电话-" + that.data.mobile, width / 3.3, width / 3.8, width / 2);
    }
    // 作品图吧
    if (img3) {
      ctx.drawImage(img3, 20, 200, 220, 150);
    }
    if (img4) {
      ctx.drawImage(img4, 260, 200, 220, 150);
    }
    // 头像为正方形
    if (avaterSrc) {
      ctx.beginPath();
      ctx.arc(width / 6, width / 6, width / 9, 0, Math.PI * 2, false);
      ctx.clip();
      ctx.drawImage(avaterSrc, width / 18, width / 18, width / 4.5, width / 4.5);
    }
    // }).exec()
    ctx.draw(true, () => {
      that.saveShareImg();
    })
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
  //点击保存到相册
  saveShareImg: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      destWidth: 500,
      destHeight: 400,
      success: function (res) {
        wx.hideLoading();
        that.setData({
          imgimg: res.tempFilePath,
          hiddenShare: false
        })
      }
    });
  },
  submitForm(e) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    if (e.detail.formId == 'the formId is a mock one') {
      return;
    }
    getApp().request({
      url: getApp().api.addformid,
      method: "post",
      data: {
        formid: e.detail.formId,
        timestamp: timestamp
      },
      success: function (res) {},
    })
  },
  // 跳转名片夹
  mpj() {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      wx.navigateTo({
        url: '/pages1/cardCase/cardCase',
      })
    } else {
      util.checkLogin()
    }
  },
  // 跳转产品库
  toproduct() {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      wx.navigateTo({
        url: '/pages1/productindex/productindex',
      })
    } else {
      util.checkLogin()
    }
  },
  v() {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      wx.showToast({
        title: '请联系客服完成认证',
        icon: 'none',
        duration: 1500
      })
    }
  },
  upload() {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (wx.getStorageSync('msg') == '名片不存在') {
        wx.showModal({
          title: '提示',
          content: '完善名片才能操作，是否前往完善',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: "/pages/index/index?imgSrc=" + wx.getStorageSync('USER_INFO').avatar_url +
                  '&nickname=' + wx.getStorageSync('USER_INFO').nickname + '&mobile=' + wx.getStorageSync('USER_INFO').binding,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/pages1/addProduct/addProduct',
        })
      }
    } else {
      util.checkLogin()
    }
  },
  upload2() {
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (wx.getStorageSync('msg') == '名片不存在') {
        wx.showModal({
          title: '提示',
          content: '完善名片才能操作，是否前往完善',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.navigateTo({
                url: "/pages/index/index?imgSrc=" + wx.getStorageSync('USER_INFO').avatar_url +
                  '&nickname=' + wx.getStorageSync('USER_INFO').nickname + '&mobile=' + wx.getStorageSync('USER_INFO').binding,
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        if (wx.getStorageSync('level_name') != '普通用户') {
          wx.navigateTo({
            url: '/pages1/addGroup/addGroup',
          })
        } else {
          wx.showToast({
            title: '请先认证设计师(联系客服)',
            icon: 'none',
          })
        }
      }
    } else {
      util.checkLogin()
    }
  },
  // 下载头像
  mptx() {
    wx.showLoading({
      title: '',
      icon: 'none',
      mask: true
    })
    let that = this;
    var Expression = /(https):\/\/([\w.]+\/?)\S*/;
    var objExp = new RegExp(Expression);
    var tximg = '';
    if (objExp.test(that.data.avatarSrc)) {
      tximg = that.data.avatarSrc;
    } else {
      tximg = that.data.avatarSrc.replace('http', 'https')
    }
    wx.downloadFile({
      url: tximg,
      success(res) {
        that.mpwork(res.tempFilePath)
      }
    })
  },
  // 下载作品
  mpwork(img) {
    let that = this;
    var imga = '';
    if (that.data.listimg) {
      imga = that.data.listimg.replace('http', 'https')
    } else {
      imga = 'https://oss.diywoju.com/web/uploads/image/store_1/65a3abe5ce6d8b8ea32633b9c4cf854c48e60802.png';
    }
    wx.downloadFile({
      url: imga,
      success(res) {
        that.mpqrcode(img, res.tempFilePath);
      }
    })
  },
  // 下载二维码
  mpqrcode(img1, img2) {
    let that = this;
    wx.downloadFile({
      url: wx.getStorageSync('qrcode'),
      success(res) {
        that.mpwork2(img1, img2, res.tempFilePath)
      }
    })
  },
  // 作品图2
  mpwork2(img1, img2, img3) {
    let that = this;
    var imgb = '';
    if (that.data.listimg2) {
      imgb = that.data.listimg2.replace('http', 'https')
    } else {
      imgb = 'https://oss.diywoju.com/web/uploads/image/store_1/b910305b1b2824f120c5f9225b128ccafdfd5226.png';
    }
    wx.downloadFile({
      url: imgb,
      success(res) {
        that.mpcode(img1, img2, img3, res.tempFilePath)
      }
    })
  },
  // 名片码
  mpcode(photo, works, qrcode, works2) {
    var that = this;
    that.setData({
      hidden: false
    })
    const ctx2 = wx.createCanvasContext('canvas_'); //创建画布
    wx.createSelectorQuery().select('#canvas2').boundingClientRect(function (rect) {
      var height = rect.height;
      var width = rect.width;
      ctx2.fillRect(0, 0, width, height);
      ctx2.save();
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
      var r = 20
      ctx2.beginPath()
      // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
      // 这里是使用 fill 还是 stroke都可以，二选一即可
      ctx2.setFillStyle('#fff')
      ctx2.setStrokeStyle('#fff')
      // 左上角
      ctx2.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
      // border-top
      ctx2.moveTo(x + r, y)
      ctx2.lineTo(x + w - r, y)
      ctx2.lineTo(x + w, y + r)
      // 右上角
      ctx2.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
      // border-right
      ctx2.lineTo(x + w, y + h - r)
      ctx2.lineTo(x + w - r, y + h)
      // 右下角
      ctx2.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
      // border-bottom
      ctx2.lineTo(x + r, y + h)
      ctx2.lineTo(x, y + h - r)
      // 左下角
      ctx2.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
      // border-left
      ctx2.lineTo(x, y + r)
      ctx2.lineTo(x + r, y)
      // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
      ctx2.stroke()
      ctx2.closePath()
      ctx2.fill()
      // 剪切
      ctx2.clip()
      ctx2.stroke();
      ctx2.restore();
      ctx2.save();
      // //姓名
      if (that.data.userName) {
        ctx2.setFontSize(30);
        ctx2.setFillStyle('#000');
        ctx2.fillText(that.data.userName, 170, 70);
      }
      // //工作
      if (that.data.job) {
        ctx2.setFontSize(30);
        ctx2.setFillStyle('#666666');
        ctx2.fillText(that.data.job + '-' + that.data.years + '年', 170, 120);
      }
      // 认证
      if (wx.getStorageSync('level_name') != '普通用户') {
        ctx2.setFontSize(25);
        ctx2.setFillStyle('#f9e15c');
        ctx2.fillText('V平台认证', 365, 120);
      }
      if (wx.getStorageSync('mobile')) {
        ctx2.setFontSize(28);
        ctx2.setFillStyle('#666666');
        ctx2.fillText("联系方式：" + wx.getStorageSync('mobile'), 170, 155);
      }
      // 点赞
      if (that.data.like_count) {
        let fans_width = ctx2.measureText(that.data.like_count).width;
        let fans_width2 = ctx2.measureText('点赞').width;
        if (fans_width > fans_width2) {
          var fans = 40 - ((fans_width - fans_width2) / 2)
        } else {
          var fans = 40 + ((fans_width2 - fans_width) / 2)
        }
        ctx2.setFontSize(32);
        ctx2.setFillStyle('#000');
        ctx2.fillText(that.data.like_count, fans, 200);
      }
      if (that.data.like_count) {
        ctx2.setFontSize(30);
        ctx2.setFillStyle('#666666');
        ctx2.fillText('点赞', 40, 240);
      }
      // 粉丝
      if (that.data.fans_count) {
        let fans_width = ctx2.measureText(that.data.fans_count).width;
        console.log(fans_width)
        let widtha = (width - fans_width) / 2;
        ctx2.setFontSize(32);
        ctx2.setFillStyle('#000');
        ctx2.fillText(that.data.fans_count, widtha, 200);
      }
      if (that.data.fans_count) {
        let fans_width = ctx2.measureText('粉丝').width;
        let widtha = (width - fans_width) / 2;
        ctx2.setFontSize(30);
        ctx2.setFillStyle('#666666');
        ctx2.fillText('粉丝', widtha, 240);
      }

      // 人气
      if (that.data.click) {
        let clicknum = "" + that.data.click
        let click_width = ctx2.measureText(clicknum).width;
        let fans_width = ctx2.measureText('人气').width;
        let widtha = width - fans_width - 40;
        if (click_width > fans_width) {
          var click = widtha - ((click_width - fans_width) / 2)
        } else {
          var click = widtha + ((fans_width - click_width) / 2)
        }
        ctx2.setFontSize(32);
        ctx2.setFillStyle('#000');
        ctx2.fillText(clicknum, click, 200);
      }
      if (that.data.click) {
        let fans_width = ctx2.measureText('人气').width;
        let widtha = width - fans_width - 40;
        ctx2.setFontSize(30);
        ctx2.setFillStyle('#666666');
        ctx2.fillText('人气', widtha, 240);
      }

      // 设计理念
      let titlewidth1 = ctx2.measureText('设计理念').width;
      let titlewidth1_1 = (width - titlewidth1) / 2;
      ctx2.setFontSize(30);
      ctx2.fillStyle = "#666666";
      ctx2.fillText('设计理念', titlewidth1_1, 295);
      let strokewidth = (width - 60) / 2;
      ctx2.setFillStyle('yellow');
      ctx2.fillRect(strokewidth, 305, 60, 5)
      // 设计理念内容
      if (that.data.descript) {
        const CONTENT_ROW_LENGTH = 48; // 正文 单行显示字符长度
        let [contentLeng, contentArray, contentRows] = that.textByteLength(that.data.descript, CONTENT_ROW_LENGTH);
        ctx2.setFontSize(24);
        ctx2.setFillStyle('#000');
        let contentHh = 22 * 1.7;
        // if (contentArray.length < 3){
        for (let m = 0; m < contentArray.length; m++) {
          ctx2.fillText(contentArray[m], (width - ctx2.measureText(contentArray[m]).width) / 2, 360 + contentHh * m);
        }
      }

      // 我的作品
      ctx2.setFontSize(30);
      ctx2.setFillStyle('#666666');
      ctx2.fillText('我的案例', titlewidth1_1, 500);
      ctx2.setFillStyle('yellow');
      ctx2.fillRect(strokewidth, 510, 60, 5)

      // 作品图
      if (works) {
        let w_width = (width - 300) / 2;
        ctx2.drawImage(works, 9.25, 540, 300, 150);
        ctx2.setFontSize(14);
        ctx2.setFillStyle('#fff');
        ctx2.setTextAlign('left');
      }
      if (that.data.listname) {
        ctx2.setFontSize(20);
        ctx2.setFillStyle('#666666');
        ctx2.fillText(that.fittingString(ctx2, that.data.listname, 300), 9.25, 720);
      } else {
        ctx2.setFontSize(20);
        ctx2.setFillStyle('#666666');
        ctx2.fillText('我的案例一', 9.25, 720);
      }
      if (works2) {
        let w_width = (width - 300) / 2;
        ctx2.drawImage(works2, 325, 540, 300, 150);
        ctx2.setFontSize(14);
        ctx2.setFillStyle('#fff');
        ctx2.setTextAlign('left');
      }
      if (that.data.listname2) {
        ctx2.setFontSize(20);
        ctx2.setFillStyle('#666666');
        ctx2.fillText(that.fittingString(ctx2, that.data.listname2, 300), 325, 720);
      } else {
        ctx2.setFontSize(20);
        ctx2.setFillStyle('#666666');
        ctx2.fillText('我的案例二', 325, 720);
      }
      // 二维码
      if (qrcode) {
        let w_width = (width - 130) / 2;
        ctx2.drawImage(qrcode, w_width, 760, 130, 130);
        ctx2.setFontSize(20);
        ctx2.setFillStyle('#fff');
        ctx2.setTextAlign('left');
        let click_width = ctx2.measureText('扫码了解更全面的我').width;
        let w_width2 = (width - click_width) / 2
        ctx2.setFillStyle('#666666');
        ctx2.fillText('扫码了解更全面的我', w_width2, 930);
      }
      if (photo) {
        ctx2.beginPath();
        ctx2.setFillStyle('#000');
        ctx2.arc(90, 80, 60, 0, Math.PI * 2, false);
        ctx2.clip();
        ctx2.drawImage(photo, 30, 20, 120, 120);
        ctx2.restore();
        ctx2.save();
      }
    }).exec()
    setTimeout(function () {
      ctx2.draw(true, () => {
        that.savemp();
      })
    }, 500)
  },
  // 保存名片码
  savemp() {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas_',
      destWidth: 637,
      destHeight: 900,
      success: function (res) {
        wx.hideLoading();
        that.setData({
          mpimg: res.tempFilePath
        })
      }
    });
  },
  // 获取二维码
  qrcode() {
    let that = this;
    getApp().request({
      url: getApp().api.qrcode,
      method: "post",
      data: {
        is_hyaline: 0
      },
      success: function (res) {
        wx.hideLoading()
        if (res.code == 0) {
          wx.setStorageSync('qrcode', res.data.pic_url)
          getApp().request({
            url: getApp().api.qrcode,
            method: "post",
            data: {
              is_hyaline: 1
            },
            success: function (res) {
              wx.hideLoading()
              if (res.code == 0) {
                wx.setStorageSync('qrcode2', res.data.pic_url)
              }
            },
          })
        }
      },
    })
  },
  // 管理
  regulate(e) {
    wx.navigateTo({
      url: '/pages1/regulate/regulate',
    })
  },
  login() {
    util.checkLogin();
  },
  // 获取列表
  getGroup: function (params) {
    var self = this;
    //获取套餐列表
    getApp().request({
      url: getApp().api.groupList,
      method: "post",
      data: {
        is_merchant: 1
      },
      success: function (res) {
        if (res.data.list.length > 0) {
          self.setData({
            is_merchant2: 1
          })
        }
      }
    })
  },
  link_Activity() {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: '/pages1/activity/activity',
    })
  },
  link_sever() {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      this.login();
      return;
    }
    wx.navigateTo({
      url: '/pages1/serve/serve',
    })
  },
  clickPup: function () {
    // 用that取代this，防止不必要的情况发生
    var that = this;
    if (!that.data.animation_box) {
      let animation = wx.createAnimation({
        delay: 0,
        duration: 500,
        timingFunction: "linear",
      })
      that.setData({
        animation_box: true
      })
      animation.height(120).step();
      setTimeout(() => {
        that.setData({
          animationData: animation.export()
        })
      }, 20);
    } else {
      let animation = wx.createAnimation({
        delay: 0,
        duration: 500,
        timingFunction: "linear",
      })
      animation.height(0).step();
      that.setData({
        animationData: animation.export()
      })
      setTimeout(() => {
        that.setData({
          animation_box: false
        })
      }, 500);
    }
  },
  autoheight() {
    this.setData({
      heightauto: !this.data.heightauto
    })
  },
  style_tab() {
    if (this.data.datastyle == 0) {
      this.setData({
        datastyle: 1
      })
      wx.setStorageSync("datastyle", '1')
    } else {
      this.setData({
        datastyle: 0
      })
      wx.setStorageSync("datastyle", '0')
    }
  }
})