const app = getApp()
import TIM from '../../core/tim-wx.js';
let options = {
  SDKAppID: 1400334108 // 接入时需要将0替换为您的即时通信应用的 SDKAppID
};
var tim = TIM.create(options); // SDK 实例通常用 tim 表示
Page({
  data: {
    can_getuserinfo: 0,
    accesstoken: "",
    user_id: '',
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function (o) {
    if (o.detail.errMsg != "getUserInfo:ok") {
      wx.showToast({
        title: '请授权登录',
        icon: "none"
      })
    }
    wx.setStorageSync('user_info', o.detail.userInfo)
    var n = this;
    "getUserInfo:ok" == o.detail.errMsg && getApp().core.login({
      success: function (e) {
        wx.setStorage({
          key: 'can_getuserinfo',
          data: 1,
        })
        getApp().core.setStorageSync(getApp().const.USER_INFO, o.detail.rawData);
        var t = e.code;
        n.unionLogin({
          code: t,
          user_info: o.detail.rawData,
          encrypted_data: o.detail.encryptedData,
          iv: o.detail.iv,
          signature: o.detail.signature
        });
      },
      fail: function (e) {}
    });
  },
  myLogin: function () {
    var t = this;
    "my" === getApp().platform && my.getAuthCode({
      scopes: "auth_user",
      success: function (e) {
        console.log(e)
        t.unionLogin({
          code: e.authCode
        });
      }
    });
  },
  unionLogin: function (e) {
    console.log("denglu请求参数", e)
    var self = this;
    getApp().core.showLoading({
      title: "正在登录.......",
      mask: !0
    }), getApp().request({
      url: getApp().api.passport.login,
      method: "POST",
      data: e,
      success: function (e) {
        console.log("登录成功返回", e)
        if (0 == e.code) {
          // 
          getApp().setUser(e.data),
            getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token),
            getApp().trigger.run(getApp().trigger.events.login);
          self.getcar();
          // 不需要IM
          // IM登录
          app.request({
            url: app.api.usersig,
            method: 'POST',
            data: {
              identifier: "" + wx.getStorageSync("USER_INFO").id
            },
            success(res) {
              app.globalData.is_sign = "去签到";
              // IM
              let promise = tim.login({
                userID: "" + wx.getStorageSync("USER_INFO").id,
                userSig: res
              });
              promise.then(function (imResponse) {
                console.log(imResponse.data); // 登录成功
                getApp().core.hideLoading();
                // 
                if (self.data.options) {
                  var options = JSON.parse(self.data.options.obj)
                  if (options != {}) {
                    var _str = "";
                    for (var o in options) {
                      _str += o + "=" + options[o] + "&";
                    }
                    var _str = _str.substring(0, _str.length - 1);
                    wx.reLaunch({
                      url: '/' + self.data.options.url + '?' + _str,
                    })
                  } else {
                    wx.reLaunch({
                      url: '/' + self.data.options.url
                    })
                  }
                } else {
                  if (self.data.user_id) {
                    getApp().request({
                      url: getApp().api.relation,
                      method: 'GET',
                      data: {
                        parent_id: self.data.user_id,
                        condition: 0
                      },
                      success(res) {
                        console.log(res,'绑定上下级的关系，邀请送积分')
                        // 
                        if (res.code == 0) {
                          var t = getApp().core.getStorageSync(getApp().const.LOGIN_PRE_PAGE);
                          t && t.route ? getApp().core.redirectTo({
                              url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                            }) :
                            getApp().core.redirectTo({
                              url: "/pages/index/index?imgSrc=" + e.data.avatar_url +
                                '&nickname=' + e.data.nickname + '&mobile=' + e.data.binding,

                            });
                        } else {
                          wx.showToast({
                            title: res.msg,
                            icon: 'none'
                          })
                        }

                      }
                    })
                  } else {
                    var t = getApp().core.getStorageSync(getApp().const.LOGIN_PRE_PAGE);
                    t && t.route ? getApp().core.redirectTo({
                        url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                      }) :
                      getApp().core.redirectTo({
                        url: "/pages/index/index?imgSrc=" + e.data.avatar_url +
                          '&nickname=' + e.data.nickname + '&mobile=' + e.data.binding,

                      });
                  }
                }
              }).catch(function (imError) {
                console.warn('login error:', imError); // 登录失败的相关信息
              });
            }
          })
        } else {
          getApp().core.hideLoading();
        }
      },
      complete: function () {
        // getApp().core.hideLoading();
      }
    });
  },

  onLoad: function (options) {
    console.log(options)
    if (options.url) {
      this.setData({
        options: options
      })
    }
    var self = this;
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      let user_id = self.getSenceParams(scene, "user_id")
      console.log(user_id)
      self.setData({
        user_id
      })
    }
    if (options.user_id) {
      self.setData({
        user_id: options.user_id
      })
    }
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.setStorage({
            key: 'can_getuserinfo',
            data: 1,
          })
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              wx.request({
                url: "https://www.diywoju.com/web/index.php?store_id=1&r=api/passport/login",
                method: "POST",
                params: {},
                success: function (e) {
                  console.log(e)
                  if (0 == e.code) {
                    getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token),
                      getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.LOGIN_PRE_PAGE);
                    t && t.route ? getApp().core.redirectTo({
                      url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                    }) : getApp().core.redirectTo({
                      url: "/pages1/honmePage/honmePage",
                    });
                  }
                },
                complete: function () {
                  // getApp().core.hideLoading();
                }
              });
              //用户已经授权过
            }
          })
        } else {
          wx.setStorage({
            key: 'can_getuserinfo',
            data: 0,
          })
        }
      }
    })

    wx.getStorage({
      key: 'can_getuserinfo',
      success: function (res) {
        console.log(res.data);
        self.setData({
          can_getuserinfo: res.data
        })
        if (res.data == 1) {
          wx.reLaunch({
            url: "/pages1/homePage/homePage",
          })
        }
      },
      fail: function () {
        self.setData({
          can_getuserinfo: 0
        })
      }
    })
  },
  getcar() {
    getApp().request({
      url: getApp().api.index1,
      success(res) {
        console.log(res)
        wx.setStorageSync('msg', res.msg)
        if (res.code == 0) {
          wx.setStorageSync('is_merchant', res.data.info.is_merchant)
          wx.setStorageSync('level_name', res.data.info.level_name)
          wx.setStorageSync('user_name', res.data.info.user_name)
          wx.setStorageSync('wechat', res.data.info.wechat)
          wx.setStorageSync('mobile', res.data.info.mobile)
          wx.setStorageSync('avatar', res.data.info.avatar_url)
        }
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
})