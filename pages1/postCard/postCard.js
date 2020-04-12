//获取应用实例
const app = getApp();
var util = require('../../utils/util.js')
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'FB7BZ-IKH6U-DDKV3-4GI45-VC7SZ-WABNQ' //申请的开发者秘钥key
});
let tim = getApp().globalData.tim;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    browse: false,
    fa: true,
    city: '未知',
    access_token: false,
    showprice: true,
    model: true,
    tabid: '',
    bg: 1,
    detail_: true,
    type: '',
    user_id: null,
    toview: "cardPart",
    initTop: 0,
    num: 0,
    hidden: true,
    show: 1,
    height: "",
    userName: "加载中...",
    job: "职务",
    years: "1",
    designPrice: "",
    style: "",
    descript: "",
    mobile: "",
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
    isDesigner: 0,
    isScroll: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  scrollTo: function (e) {

    this.setData({
      toview: e.currentTarget.dataset.toview,
      num: e.currentTarget.dataset.num,
    })


  },

  scroll: function (e) {
    var scrollH = e.detail.scrollTop;

    if (scrollH > 50 && scrollH < 300) {
      this.setData({
        num: 1
      })
    } else if (scrollH >= 300 && scrollH < 870) {
      this.setData({
        num: 2,
        toview: "",
      })
    } else if (scrollH > 870 && scrollH < 1200) {
      this.setData({
        num: 3
      })
    } else if (scrollH > 1200) {
      this.setData({
        num: 4
      })
    }
  },
  showMsg() {
    wx.showModal({
      title: '提示',
      content: '您还没有作品，请先添加作品',
      showCancel: false,
    })
  },
  //复制微信号
  add_wechat() {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.info.wechat,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  /*我的名片*/
  linkBack() {
    wx.reLaunch({
      url: "/pages1/homePage/homePage?share=0"
    });
  },
  hidden_mask() {
    var that = this
    wx.getImageInfo({
      src: that.data.mingpianImg,
      success: function (ret) {
        var path = ret.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            wx.showToast({
              icon: 'none',
              title: '保存成功',
              // content: '',
            })
            that.setData({
              hidden: true,
              share_box: true,
              isScroll: true
            })
          }
        })
      }
    })
  },
  /*跳转到我的活动*/
  linkActiviteDetail: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    var avatarSrc = this.data.avatarSrc;
    wx.navigateTo({
      url: "/pages1/activityDetail/activityDetail?id=" + id + '&isDesigner=' + self.data.isDesigner + '&avatarSrc=' + avatarSrc
    })
  },
  /*跳转到管理作品*/
  linkManagePro(e) {
    let self = this;
    wx.navigateTo({
      url: "/pages1/manageProducts/manageProducts?user=" + self.data.user_id
    })
  },
  /*跳转到我的作品*/
  link_project(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/productDetail/productDetail?id=" + id + "&idid=" + self.data.idid + "&type=1"
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
    wx.navigateTo({
      url: "/pages1/manageGroup/manageGroup?shangjia=1&userid=" + self.data.user_id
    })
  },
  /*跳转到我的套餐*/
  link_groupDetail(e) {
    let self = this;
    var id = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    if (type == 1) {
      wx.navigateTo({
        url: "/pages1/groupDetail/groupDetail?id=" + id + "&idid=" + self.data.idid
      })
    } else {
      wx.navigateTo({
        url: "/pages1/merchantGroup_detail/merchantGroup_detail?id=" + id + "&idid=" + self.data.idid + '&type=1'
      })
    }
  },
  //点击联系客服
  connect_service() {
    let self = this;
    wx.makePhoneCall({
      phoneNumber: self.data.mobile,
    })
  },
  //点击联系设计师
  call_designer() {
    var self = this;
    if (self.data.level_name == '普通用户') {
      wx.makePhoneCall({
        phoneNumber: self.data.mobile,
      })
    } else {
      wx.showActionSheet({
        itemList: ['聊天', '电话'],
        success(res) {
          if (res.tapIndex == 1) {
            wx.makePhoneCall({
              phoneNumber: self.data.mobile,
            })
          } else {
            if (wx.getStorageSync("ACCESS_TOKEN")) {
              if (self.data.user_id == wx.getStorageSync('USER_INFO').id) {
                wx.showToast({
                  title: '不能与自己聊天',
                  icon: "none"
                })
                return;
              }
              self.msg();
            } else {
              util.checkLogin();
            }
          }
        }
      })
    }
  },
  msg() {
    // 
    let that = this;
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      util.checkLogin();
      return;
    }
    if (that.data.user_id == wx.getStorageSync('USER_INFO').id) {
      wx.showToast({
        title: '不能与自己聊天',
        icon: "none"
      })
      return;
    }
    // 
    let list = getApp().globalData.onConversationListUpdated;
    for (let i in list) {
      if (list[i].userProfile.userID == that.data.user_id) {
        wx.navigateTo({
          url: '../im/im?userid=' + that.data.user_id + "&id=" + list[i].conversationID + "&username=" + that.data.userName + "&useravater=" + that.data.avatarSrc,
        })
        return;
      }
    }
    // 2. 发送消息
    let message = tim.createTextMessage({
      to: "" + that.data.user_id,
      conversationType: getApp().TIM.TYPES.CONV_C2C,
      payload: {
        text: '你好!'
      }
    });
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
  //点击套餐产品
  linkProduct(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/productDetail/productDetail?id=" + id
    })
  },
  //收下名片
  receive_card() {
    let self = this;
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (self.data.user_id === wx.getStorageSync('USER_INFO').id) {
        wx.showToast({
          title: '不能对自己操作',
          icon: "none"
        })
        return;
      }
      if (self.data.fansCount == 0) {
        getApp().request({
          url: getApp().api.receiverCard,
          method: "post",
          data: {
            card_id: self.data.mingpianId,
          },
          success: function () {
            self.setData({
              fansCount: 1,
              fans_count: parseInt(self.data.fans_count) + 1
            })
            wx.showToast({
              title: '收下名片成功',
            })
            var info = self.data.info;
            info.in_card = 1;
            self.setData({
              info: info
            })
          }
        })
        getApp().request({
          url: getApp().api.addCardActivity,
          method: "post",
          data: {
            card_id: self.data.user_id,
            type: 102,
          },
        })
      } else if (self.data.fansCount == 1) {
        wx.showToast({
          title: '您已收下名片',
        })
      }
    } else {
      util.checkLogin();
    }
  },
  //点击预约设计
  left_mobile() {
    var self = this;
    self.setData({
      mobileFlag: false
    })
  },
  //名片点赞及取消
  add_praise() {
    let self = this;
    if (wx.getStorageSync('USER_INFO').id === self.data.user_id) {
      wx.showToast({
        title: '不对自己操作',
        icon: 'none'
      })
      return;
    }
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      if (self.data.zan == 0) {
        getApp().request({
          url: getApp().api.star,
          method: "post",
          data: {
            card_id: self.data.user_id,
          },
          success: function (res) {
            if (res.msg != '名片不存在') {
              self.setData({
                zan: 1,
                like_count: Number(Number(self.data.like_count) + 1)
              })
              wx.showToast({
                title: '点赞成功',
              })
            } else {
              wx.showToast({
                title: '名片不存在',
                icon: 'none'
              })
              return;
            }
          }
        })
        getApp().request({
          url: getApp().api.addCardActivity,
          method: "post",
          data: {
            card_id: self.data.user_id,
            type: 103,
          },
          success(res) {}
        })
      } else if (self.data.zan == 1) {
        getApp().request({
          url: getApp().api.delStar,
          method: "post",
          data: {
            card_id: self.data.card_id2,
          },
          success: function (res) {
            self.setData({
              zan: 0,
              like_count: Number(Number(self.data.like_count) - 1)
            })
            wx.showToast({
              title: '取消成功',
            })
          }
        })
      }
    } else {
      util.checkLogin();
    }
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
    wx.showLoading({
      title: '',
      icon: 'none'
    })
    var self = this;
    //获取名片信息
    if (self.data.mingpianId == undefined) {
      if (!self.data.userid) {
        var id = self.data.idid
      } else {
        var id = self.data.userid
      }
    } else {
      var id = self.data.mingpianId
    }
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 1];
    getApp().request({
      url: getApp().api.index1,
      method: "post",
      data: {
        card_id: self.data.idid
      },
      success: function (res) {
        wx.hideLoading()
        if (res.code == 0) {
          // 调用sdk接口
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.data.info.latitude,
              longitude: res.data.info.longitude
            },
            success: function (res) {
              //获取当前地址成功
              if (res.result.address_component.city == undefined) {
                self.setData({
                  city: '未定位',
                })
              } else {
                self.setData({
                  city: res.result.address_component.city,
                })
              }
            },
            fail: function (res) {
              self.setData({
                city: '未定位',
              })
            }
          });
          let info = res.data.info;
          if (info.introduction.length > 33) {
            self.setData({
              look_more:true
            })
          }
          if (info.is_star == 1) {
            self.setData({
              zan: 1
            })
          }
          if (info.job.indexOf("设计") != -1) {
            self.setData({
              showprice: false
            })
          }
          if (wx.getStorageSync('ACCESS_TOKEN')) {
            let obj = {
              avatarSrc: res.data.info.avatar_url,
              card_id: res.data.info.id,
              userName: info.user_name,
              user_id: info.user_id,
            }
            self.browsecar(obj);
          }
          self.setData({
            card_id2: res.data.info.id,
            info: res.data.info,
            user_id: info.user_id,
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
            level_name: res.data.info.level_name
          })
        } else {
          wx.showToast({
            title: '未设置名片信息！',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  //获取作品列表
  getProjectData: function () {
    var self = this;
    getApp().request({
      url: getApp().api.projectList,
      method: "post",
      data: {
        user_id: self.data.user_id
      },
      success: function (res) {
        var arr = res.data.list;
        var arr2 = [];
        var length = arr.length;
        for (var i = 0; i < length; i++) {
          if (arr[i].is_show == 1) {
            arr2.push(arr[i])
          }
        }
        var newarr = arr2.sort(self.creatCompare("is_top"));
        self.setData({
          productList: arr2.sort(self.creatCompare("is_top"))
        })
      }
    })
  },
  //获取套餐列表
  getGroupData: function () {
    var self = this;
    getApp().request({
      url: getApp().api.groupList,
      method: "post",
      data: {
        user_id: self.data.user_id
      },
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
      }
    });
  },
  //获取活动列表
  getActivityData: function () {
    var self = this;
    getApp().request({
      url: getApp().api.activityList,
      method: "post",
      data: {
        user_id: self.data.user_id
      },
      success: function (res) {
        var timestamp = Date.parse(new Date());
        let list = res.data.list;
        let arr = [];
        for (let i in list) {
          let timestamp1 = new Date(list[i].end_time.replace(/-/g, '/')).getTime()
          if (timestamp1 > timestamp) {
            arr.push(list[i])
          }
        }
        self.setData({
          activityList: arr
        })
      }
    });
  },
  //设置置顶页面刷新
  setNewTop: function (value) {
    var self = this;
    if (value) {
      self.setData({
        productNewList: value
      })
    }

  },
  onReady() {
    let btn = wx.getMenuButtonBoundingClientRect()
    console.log(btn.right, btn.left, "11111111111111111111111111")
  },
  onLoad: function (options) {
    let self = this;
    let btn = wx.getMenuButtonBoundingClientRect()
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    console.log(btn.right, btn.left)
    self.setData({
      headavater: wx.getStorageSync('USER_INFO').avatar_url,
      btnleft: wx.getSystemInfoSync().screenWidth - btn.right,
      btntop: btn.top - app.globalData.statusBarHeight,
      btnwidth: btn.width,
      btnheight: btn.height,
      statusBarHeight: app.globalData.statusBarHeight,
      titleheight: windowHeight - (app.globalData.statusBarHeight + 44),
    })
    if (wx.getStorageSync('ACCESS_TOKEN')) {
      self.setData({
        access_token: true
      })
    }
    let myphone = wx.getStorageSync("mobile");
    var pages = getCurrentPages();
    var curPage = pages[pages.length - 1];
    var USER_INFO = getApp().core.getStorageSync(getApp().const.USER_INFO);
    var avatarSrc = wx.getStorageSync('avatarSrc');
    var user_id = "";
    var id = ""; //名片id
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      user_id = this.getSenceParams(scene, "user_id");
      id = this.getSenceParams(scene, "id");
    } else {
      user_id = options.user_id;
      id = options.id;
    }

    self.setData({
      idid: id,
      myphone: myphone,
      user_id: user_id,
      id: id,
      mingpianId: id,
      userid: user_id
    })
    self.getCardData();
    self.getProjectData();
    self.getGroupData();
    self.getActivityData();
    self.setNewTop();
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // util.checkLogin()
    let myphone = wx.getStorageSync("mobile");
    this.setData({
      myphone: myphone
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    let that = this;
    if (options.from === 'button') {
      return {
        title: that.data.userName + '的名片,请查看',
        path: '/pages1/postCard/postCard?user_id=' + that.data.user_id + '&id=' + that.data.id, //点击分享消息是打开的页面
      }
    }
    if (options.from === 'menu') {
      return {
        title: that.data.userName + '的名片,请查看',
        path: '/pages1/postCard/postCard?user_id=' + that.data.user_id + '&id=' + that.data.id, //点击分享消息是打开的页面
      }
    }
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
                      card_id: self.data.user_id,
                      type: 105,
                    },
                    success(res) {
                      console.log(res)
                    }
                  })
                  getApp().request({
                    url: getApp().api.leftMobile,
                    method: "post",
                    data: {
                      card_id: self.data.user_id,
                      mobile: self.data.myphone
                    },
                    success: function (res) {
                      console.log(res, "aaaaaaaaaaaaaaaaa")
                      if (res.code == 0) {
                        wx.showToast({
                          title: '预约成功',
                        })
                        // 发模板消息
                        getApp().request({
                          url: getApp().api.message,
                          method: "POST",
                          data: {
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
      util.checkLogin();
    }
  },
  tab(e) {
    let that = this;
    let tabid = '';
    if (e.currentTarget.dataset.id == 1) {
      tabid = 'cardPart'
    } else if (e.currentTarget.dataset.id == 2) {
      tabid = 'productsPart'
    } else if (e.currentTarget.dataset.id == 3) {
      tabid = 'setPart'
    } else {
      tabid = 'activity'
    }
    that.setData({
      bg: e.currentTarget.dataset.id,
      tabid: tabid
    })
  },
  scroll(e) {
    // console.log(e)
  },
  sureBtn() {
    let self = this;
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      util.checkLogin();
      return;
    }
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
              type: 105,
            },
          })
          // 发模板消息
          getApp().request({
            url: getApp().api.message,
            method: "POST",
            data: {
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
  active() {
    wx.navigateTo({
      url: '/pages1/activity2/activity2?user=' + this.data.user_id,
    })
  },
  scroll2(e) {
    let left = e.detail.scrollLeft
    this.setData({
      left: left
    })
  },
  login() {
    util.checkLogin();
  },
  // 我的浏览
  browsecar(arr) {
    let browsecar = wx.getStorageSync('browsecar');
    let that = this;
    let obj = {};
    for (let i in browsecar) {
      if (browsecar[i].user_id == that.data.user_id) {
        browsecar.splice(i, 1);
      }
    }
    if (that.data.user_id != wx.getStorageSync('USER_INFO').id) {
      let Hours = new Date(new Date().getTime()).getHours() < 10 ? ('0' + new Date(new Date().getTime()).getHours()) : new Date(new Date().getTime()).getHours();
      let minutes = new Date(new Date().getTime()).getMinutes() < 10 ? ('0' + new Date(new Date().getTime()).getMinutes()) : new Date(new Date().getTime()).getMinutes();
      obj.deta = new Date(new Date().getTime()).getMonth() + 1 + '-' + new Date(new Date().getTime()).getDate() + ' ' + Hours + ':' + minutes;
      obj.avatarSrc = arr.avatarSrc;
      obj.user_id = arr.user_id;
      obj.car_id = arr.card_id;
      obj.username = arr.userName;
      obj.time = new Date().getTime();
      browsecar.unshift(obj);
      wx.setStorageSync('browsecar', browsecar);
    }
  },
  browse() {
    if (!wx.getStorageSync('ACCESS_TOKEN')) {
      util.checkLogin();
      return;
    }
    this.setData({
      browsecar: wx.getStorageSync('browsecar'),
      browse: !this.data.browse
    })
  },
  // 设计师详情
  goDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    var userid = e.currentTarget.dataset.userid;
    var a = '/pages1/postCard/postCard?id=' + id + "&user_id=" + userid; //点击分享消息是打开的页面
    wx.redirectTo({
      url: a,
    })
  },
  look_more(){
    this.setData({
      lookmore:!this.data.lookmore
    })
  }
})