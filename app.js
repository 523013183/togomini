App({
  globalData: {
    userImg: null,
  },
});
import TIM from './core/tim-wx.js';
import COS from 'cos-wx-sdk-v5'
var platform = null;
"undefined" != typeof wx && (platform = "wx"), "undefined" != typeof my && (platform = "my");
var modules = [{
    name: "helper",
    file: "./utils/helper.js"
  }, {
    name: "util",
    file: "./utils/util.js"
  }, {
    name: "TIM",
    file: "./core/tim-wx.js"
  }, {
    name: "const",
    file: "./core/const.js"
  }, {
    name: "getConfig",
    file: "./core/config.js"
  }, {
    name: "page",
    file: "./core/page.js"
  }, {
    name: "request",
    file: "./core/request.js"
  }, {
    name: "core",
    file: "./core/core.js"
  }, {
    name: "api",
    file: "./core/api.js"
  }, {
    name: "getUser",
    file: "./core/getUser.js"
  }, {
    name: "setUser",
    file: "./core/setUser.js"
  }, {
    name: "login",
    file: "./core/login.js"
  }, {
    name: "trigger",
    file: "./core/trigger.js"
  }, {
    name: "uploader",
    file: "./utils/uploader.js"
  }, {
    name: "orderPay",
    file: "./core/order-pay.js"
  }],
  args = {
    globalData: {
      userImg: null,
      usersig: '',
      tim: '',
      actionStatus: "",
      login: '',
      onConversationListUpdated: '',
      onMessageReceived: [],
      statusBarHeight: ''
    },
    _version: "2.8.9",
    platform: platform,
    query: null,
    get_time_diff(sDate1) {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日
      var sDate2 = year + "-" + (month + 1) + "-" + date;
      var dateSpan,
        tempDate,
        iDays;
      sDate1 = Date.parse(sDate1);
      sDate2 = Date.parse(sDate2);
      dateSpan = sDate2 - sDate1;
      dateSpan = Math.abs(dateSpan);
      iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
      return iDays
    },
    onLaunch: function (e) {
      let that = this;
      if (!wx.getStorageSync('sign_time')) {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日
        var today = year + "-" + (month + 1) + "-" + date;
        wx.setStorageSync('sign_time', today);
      }
      if (that.get_time_diff(wx.getStorageSync('sign_time')) > 1) {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        var month = now.getMonth(); //得到月份
        var date = now.getDate(); //得到日
        var today = year + "-" + (month + 1) + "-" + date;
        wx.setStorageSync('sign_time', today);
      }
      wx.getSystemInfo({
        success: function (res) {
          that.globalData.windowHeight = res.windowHeight
          that.globalData.statusBarHeight = res.statusBarHeight
        }
      })
      // 获取签到（是否弹窗）
      that.request({
        url: that.api.integral.explain,
        method: 'GET',
        data: {
          // today:"2020/2/3"
        },
        success(res) {
          var now = new Date();
          var year = now.getFullYear(); //得到年份
          var month = now.getMonth(); //得到月份
          var date = now.getDate(); //得到日
          var today = year + "/" + (month + 1) + "/" + date;
          if (that.get_time_diff(wx.getStorageSync('sign_time')) > 0) {
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
            //   }
            // })
          }
          wx.setStorageSync('sign_time', today);
        }
      })
      // 获取消息未读消息（动态）
      that.request({
        url: that.api.cardActivity,
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
          if (arr2 != 0) {
            wx.setTabBarBadge({
              index: 1,
              text: 'new'
            })
          }
        }
      })
      // 
      if (!wx.getStorageSync('hide_sever')) {
        wx.setStorageSync('hide_sever', false);
      }
      // 缓存浏览记录处理
      if (!wx.getStorageSync('browsecar')) {
        wx.setStorageSync('browsecar', []); //浏览名片记录
        wx.setStorageSync('browseoups', []); //浏览案例记录
        wx.setStorageSync('browsepage', []); //浏览套餐记录
        wx.setStorageSync('stylist', []); //提醒设计师列表

      } else {
        var time = new Date().getTime(); //毫秒时间戳S
        let browsecar = wx.getStorageSync('browsecar');
        let browseoups = wx.getStorageSync('browseoups');
        let browsepage = wx.getStorageSync('browsepage');
        let stylist = wx.getStorageSync('stylist');
        for (let i in browsecar) {
          let data = time - browsecar[i].time;
          if (data / (24 * 3600 * 1000) > 15) {
            browsecar.splice(i, 1);
          }
        }
        for (let i in browseoups) {
          let data = time - browseoups[i].time;
          if (data / (24 * 3600 * 1000) > 15) {
            browseoups.splice(i, 1);
          }
        }
        for (let i in browsepage) {
          let data = time - browsepage[i].time;
          if (data / (24 * 3600 * 1000) > 15) {
            browsepage.splice(i, 1);
          }
        }
        for (let i in stylist) {
          let data = time - stylist[i].timestamp;
          if (data / (24 * 3600 * 1000) > 1) {
            stylist.splice(i, 1);
          }
        }
        wx.setStorageSync('stylist', stylist);
        wx.setStorageSync('browsecar', browsecar);
        wx.setStorageSync('browseoups', browseoups);
        wx.setStorageSync('browsepage', browsepage);
      }
      wx.showLoading({
        title: '',
        mask: true
      })
      // 更新机制
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          setTimeout(function () {
            wx.hideLoading()
          }, 500)
          console.log("小程序更新", res)
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
              })
            })
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
      // 
      let options = {
        SDKAppID: 1400334108 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
      };
      var tim = TIM.create(options); // SDK 实例通常用 tim 表示
      that.globalData.tim = tim;
      tim.setLogLevel(1);
      tim.registerPlugin({
        'cos-wx-sdk': COS
      });
      that.request({
        url: that.api.usersig,
        method: 'POST',
        data: {
          identifier: "" + wx.getStorageSync("USER_INFO").id
        },
        success(res) {
          console.log(res)
          let promise = tim.login({
            userID: "" + wx.getStorageSync("USER_INFO").id,
            userSig: res
          });
          promise.then(function (imResponse) {}).catch(function (imError) {});
        }
      })
      // SDK_READY
      tim.on(TIM.EVENT.SDK_READY, function (event) {
        // 
        let promise1 = tim.getConversationList();
        promise1.then(function (imResponse) {
          const conversationList = imResponse.data.conversationList; // 会话列表，用该列表覆盖原有的会话列表
        }).catch(function (imError) {});
        // 
        let promise = tim.updateMyProfile({
          nick: wx.getStorageSync("user_name"),
          avatar: wx.getStorageSync("avatar"),
          gender: TIM.TYPES.GENDER_MALE,
          selfSignature: '我的个性签名',
          allowType: TIM.TYPES.ALLOW_TYPE_ALLOW_ANY
        });
        promise.then(function (imResponse) {
          console.log(imResponse.data)
          that.globalData.actionStatus = imResponse.data.actionStatus
        }).catch(function (imError) {});

      })
      // 更新通知
      tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
        console.log(event.data)
        that.globalData.onConversationListUpdated = event.data;
      });
      // 收到的未读新消息
      tim.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
        console.log("更新", event.data)
        wx.setTabBarBadge({
          index: 1,
          text: 'new'
        })
        that.globalData.onMessageReceived = event.data;
      });
      this.getStoreData();
    },
    onShow: function (e) {
      e.scene && (this.onShowData = e), e && e.query && (this.query = e.query);
    },
    onHide: function (e) {
      let that = this;
      that.globalData.login = '';
    },
    is_login: !1,
    login_complete: !1
  };

for (var i in modules) args[modules[i].name] = require("" + modules[i].file);

var _web_root = args.api.index.substr(0, args.api.index.indexOf("/index.php"));

args.webRoot = _web_root, args.getauth = function (t) {
  var o = this;
  o.core.showModal({
    title: "是否打开设置页面重新授权",
    content: t.content,
    confirmText: "去设置",
    success: function (e) {
      e.confirm ? wx.openSetting({
        success: function (e) {
          t.success && t.success(e);
        },
        fail: function (e) {
          t.fail && t.fail(e);
        },
        complete: function (e) {
          t.complete && t.complete(e);
        }
      }) : t.cancel && o.getauth(t);
    }
  });
}, args.getStoreData = function () {
  var o = this,
    e = this.api,
    a = this.core;
  o.request({
    url: e.default.store,
    success: function (t) {
      0 == t.code && (a.setStorageSync(o.const.STORE, t.data.store), a.setStorageSync(o.const.STORE_NAME, t.data.store_name),
        a.setStorageSync(o.const.SHOW_CUSTOMER_SERVICE, t.data.show_customer_service), a.setStorageSync(o.const.CONTACT_TEL, t.data.contact_tel),
        a.setStorageSync(o.const.SHARE_SETTING, t.data.share_setting), o.permission_list = t.data.permission_list,
        a.setStorageSync(o.const.WXAPP_IMG, t.data.wxapp_img), a.setStorageSync(o.const.WX_BAR_TITLE, t.data.wx_bar_title),
        a.setStorageSync(o.const.ALIPAY_MP_CONFIG, t.data.alipay_mp_config), a.setStorageSync(o.const.STORE_CONFIG, t.data),
        setTimeout(function (e) {
          o.config = t.data, o.configReadyCall && o.configReadyCall(t.data);
        }, 1e3));
    },
    complete: function () {}
  });
};
var app = App(args);