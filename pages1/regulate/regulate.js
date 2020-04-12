// pages1/regulate/regulate.js
const app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareroom: true,
    tabindex: '1',
    rolename: '',
    active: '-1',
    level: '',
    share: false,
    pic_url: '',
    levellist: '',
    datename: '日期筛选',
    v: false,
    show2: false,
    show: false,
    cardCaseArr: [],
    start_time: '',
    end_time: '',
    keyword: '',
    date: [{
        id: '0',
        name: '全部'
      },
      {
        id: '1',
        name: '一周内'
      },
      {
        id: '2',
        name: '一个月内'
      },
      {
        id: '3',
        name: '三个月内'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    // wx.hideShareMenu();
    var obj = {};
    obj.is_auth = 1;
    obj.level = that.data.level;
    obj.keyword = that.data.keyword;
    obj.start_time = that.data.start_time;
    obj.end_time = that.data.end_time;
    that.list(obj);
    that.levellist();
    that.shareroomdesignerlists();
    that.shareroompackagelists();
    that.roomtypepackagelists();
  },
  levellist() {
    let that = this;
    app.request({
      url: app.api.levellist,
      method: "POST",
      success(res) {
        that.setData({
          levellist: res
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    // if (e.from == 'menu') {
      return {
        title: wx.getStorageSync('user_name') + '邀请您注册!',
        path: '/pages1/login/login?user_id=' + wx.getStorageSync('USER_INFO').id,
        imageUrl: 'http://oss.diywoju.com/web/uploads/image/store_1/34ca4ce9342997592c241f6ed86e02c9ffb845dc.jpg'
      }
    // }
  },
  regulate(e) {
    let that = this;
    let userid = e.currentTarget.dataset.userid;
    that.setData({
      show: !that.data.show,
      sub_userid: userid
    })
  },
  hidelist() {
    let that = this;
    that.setData({
      show: !that.data.show
    })
  },
  date() {
    let that = this;
    that.setData({
      show2: !that.data.show2,
      show3: false
    })
  },
  role() {
    let that = this;
    that.setData({
      show3: !that.data.show3,
      show2: false
    })
  },
  v() {
    let that = this;
    that.setData({
      v: !that.data.v,
      show2: false,
      show3: false,
    })
    var obj = {};
    if (that.data.v) {
      obj.is_auth = 2;
    } else {
      obj.is_auth = 1;
    }
    obj.keyword = that.data.keyword;
    obj.start_time = that.data.start_time;
    obj.end_time = that.data.end_time;
    obj.level = that.data.level;
    that.list(obj)
  },
  hidechoose() {
    let that = this;
    that.setData({
      show2: !that.data.show2,
      show3: false
    })
  },
  hidechoose1() {
    let that = this;
    that.setData({
      show3: !that.data.show3,
      show2: false
    })
  },
  //获取列表
  list(obj) {
    wx.showLoading({
      title: '',
    })
    let that = this;
    app.request({
      url: app.api.relation_list,
      method: 'POST',
      data: obj,
      success(res) {
        setTimeout(function() {
          wx,
          wx.hideLoading()
        }, 400)
        console.log(res)
        if (res.msg != '权限不足，请联系管理员') {
          that.setData({
            cardCaseArr: res.data.list
          })
        }
      }
    })
  },
  //打电话给设计师
  callPhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
  //加设计师微信
  callWx: function(e) {
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
  goDetail(e) {
    let id = e.currentTarget.dataset.id;
    let userid = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '/pages1/postCard/postCard?id=' + id + "&user_id=" + userid,
    })
  },
  share() {
    let that = this;
    that.bg();
    return;
    if (!that.data.pic_url) {
      wx.showLoading({
        title: '',
      })
      app.request({
        url: app.api.sharecode,
        method: "POST",
        data: {
          is_hyaline: 0
        },
        success(res) {
          setTimeout(function() {
            wx.hideLoading()
            if (res.code == 0) {
              that.setData({
                pic_url: res.data.pic_url,
                share: true
              })
            }
          }, 500)
        }
      })
    } else {
      that.setData({
        share: true
      })
    }
  },
  getKeyword(e) {
    let that = this;
    that.setData({
      keyword: e.detail.value
    })
  },
  search() {
    let that = this;
    if (that.data.tabindex == 1) {
      var obj = {};
      if (that.data.v) {
        obj.is_auth = 2;
      } else {
        obj.is_auth = 1;
      }
      obj.keyword = that.data.keyword;
      obj.start_time = that.data.start_time;
      obj.end_time = that.data.end_time;
      obj.level = that.data.level;
      that.list(obj);
      that.setData({
        keyword: ''
      })
    } else if (that.data.tabindex == 2) {

    } else if (that.data.tabindex == 3) {

    } else {

    }
  },
  choosedate(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    if (id > 0) {
      var name = e.currentTarget.dataset.name;
    } else {
      var name = '日期筛选';
    }
    var start_time = '';
    var end_time = '';
    if (id == 0) {
      end_time = '';
      start_time;
      '';
    } else if (id == 1) {
      var timestamp = Date.parse(new Date());
      var time = util.transformTime(timestamp)
      var time2 = util.transformTime(timestamp - (7 * 86400000))
      console.log(time, time2)
      start_time = time2;
      end_time = time
    } else if (id == 2) {
      var timestamp = Date.parse(new Date());
      var time = util.transformTime(timestamp)
      var time2 = util.transformTime(timestamp - (30 * 86400000))
      console.log(time, time2)
      start_time = time2;
      end_time = time
    } else {
      var timestamp = Date.parse(new Date());
      var time = util.transformTime(timestamp)
      var time2 = util.transformTime(timestamp - (90 * 86400000))
      console.log(time, time2)
      start_time = time2;
      end_time = time
    }
    that.setData({
      datename: name,
      start_time,
      end_time,
      show2: !that.data.show2
    })
    var obj = {};
    if (that.data.v) {
      obj.is_auth = 2;
    } else {
      obj.is_auth = 1;
    }
    obj.keyword = that.data.keyword;
    obj.start_time = that.data.start_time;
    obj.end_time = that.data.end_time;
    obj.level = that.data.level;
    that.list(obj);
  },
  // 跳转动态
  dontai(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages1/cardActivity/cardActivity?userid=' + id,
    })
  },
  // 分配角色
  allot(e) {
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let that = this;
    that.setData({
      active: index,
      allotid: id
    })
  },
  // 分配角色确认
  btn() {
    let that = this;
    app.request({
      url: app.api.levelchange,
      data: {
        action_user_id: that.data.sub_userid,
        level: that.data.allotid
      },
      method: 'POST',
      success(res) {
        console.log(res)
        if (res.code == 0) {
          that.setData({
            show: !that.data.show
          })
          wx.showToast({
            title: '设置成功！',
            icon: 'none'
          })
          var obj = {};
          if (that.data.v) {
            obj.is_auth = 2;
          } else {
            obj.is_auth = 1;
          }
          obj.keyword = that.data.keyword;
          obj.start_time = that.data.start_time;
          obj.end_time = that.data.end_time;
          obj.level = that.data.level;
          that.list(obj);
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  hide() {
    this.setData({
      share: !this.data.share
    })
  },
  save() {
    let that = this;
    //图片保存到本地
    wx.saveImageToPhotosAlbum({
      filePath: that.data.mpimg,
      success: function(data) {
        console.log(data);
        if (data.errMsg == 'saveImageToPhotosAlbum:ok') {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          that.setData({
            share: !that.data.share
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      },
      fail: function(err) {
        console.log(err);
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          console.log("用户一开始拒绝了，我们想再次发起授权")
          console.log('打开设置窗口')
          wx.showModal({
            title: '提示',
            content: '授权才能保存邀请码',
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
  },
  // 角色筛选
  rolea(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    let level = e.currentTarget.dataset.level;
    let that = this;
    var obj = {};
    if (that.data.v) {
      obj.is_auth = 2;
    } else {
      obj.is_auth = 1;
    }
    obj.keyword = that.data.keyword;
    obj.start_time = that.data.start_time;
    obj.end_time = that.data.end_time;
    if (id == -1) {
      obj.level = '';
      that.setData({
        level: id,
        show3: !that.data.show3,
        rolename: '角色筛选'
      })
    } else {
      obj.level = id;
      that.setData({
        level: id,
        show3: !that.data.show3,
        rolename: name
      })
    }
    that.list(obj);
  },
  // 邀请码
  bg() {
    wx.showLoading({
      title: '',
      icon: 'none'
    })
    let that = this;
    wx.downloadFile({
      url: "https://oss.diywoju.com/web/uploads/image/store_1/93f15874f035db6bb05f037c11bd10a496bf37b4.jpg",
      success(res) {
        console.log(res.tempFilePath)
        that.code(res.tempFilePath)
      }
    })
  },
  code(bg) {
    let that = this;
    app.request({
      url: app.api.sharecode,
      method: "POST",
      data: {
        is_hyaline: 1
      },
      success(res) {
        console.log(res)
        if (res.code == 0) {
          wx.downloadFile({
            url: res.data.pic_url,
            success(res) {
              that.mpcode(bg, res.tempFilePath)
            }
          })
        }
      }
    })
  },
  mpcode(bg, qrcode) {
    console.log(bg, qrcode)
    var that = this;
    const ctx = wx.createCanvasContext('canvas'); //创建画布
    wx.createSelectorQuery().select('#canvas_').boundingClientRect(function(rect) {
      console.log(rect)
      var height = rect.height;
      var width = rect.width;
      ctx.fillRect(0, 0, width, height);
      // 背景图
      if (bg) {
        ctx.drawImage(bg, 0, 0, width, height);
      }
      // 二维码x
      if (qrcode) {
        ctx.drawImage(qrcode, (width - 150) / 2, height - 270, 150, 150);
      }
    }).exec()
    setTimeout(function() {
      ctx.draw(true, () => {
        that.savemp();
      })
    }, 500)
  },
  savemp() {
    let that = this;
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      destWidth: 750,
      destHeight: 1334,
      success: function(res) {
        wx.hideLoading();
        console.log(res)
        that.setData({
          mpimg: res.tempFilePath,
          share: true
        })
      }
    });
  },
  tabtop(e) {
    let that = this;
    that.setData({
      tabindex: e.currentTarget.dataset.index
    })
  },
  // 户型套餐
  roomtypepackagelists() {
    let that = this;
    getApp().request({
      url: getApp().api.housetypepackagelist,
      method: 'POST',
      data: {
        is_check: 1,
      },
      success(res) {
        console.log("户型未审核的套餐", res)
        that.setData({
          roomtypepackagelists: res.data
        })
      }
    })
  },
  // 样板间套餐
  shareroompackagelists() {
    let that = this;
    getApp().request({
      url: getApp().api.sampleroompackagelist,
      method: 'POST',
      data: {
        is_check: 1,
      },
      success(res) {
        console.log("样板间未审核的套餐", res)
        that.setData({
          shareroompackagelists: res.data
        })
      }
    })
  },
  // 样板间
  shareroomdesignerlists() {
    let that = this;
    getApp().request({
      url: getApp().api.sampleroomdesignerlists,
      method: 'POST',
      data: {
        is_check: 1,
      },
      success(res) {
        console.log("样板间未审核的设计师", res)
        that.setData({
          shareroomdesignerlists: res.data
        })
      }
    })
  },
  setshareroomdesigner(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否通过设计师加入样板间',
      showCancel: true,
      cancelText: '拒绝',
      success: function(res) {
        if (res.confirm) {
          getApp().request({
            url: e.currentTarget.dataset.id2 ? getApp().api.setshareroomdesigner : getApp().api.sethousetypepackage,
            method: 'POST',
            data: {
              id: e.currentTarget.dataset.id2 ? e.currentTarget.dataset.id2 : e.currentTarget.dataset.id,
              status: 1
            },
            success(res) {
              console.log("审核设计师", res)
              wx.showToast({
                title: "通过" + res.msg,
                icon: 'none'
              })
            }
          })
        } else {
          getApp().request({
            url: e.currentTarget.dataset.id2 ? getApp().api.setshareroomdesigner : getApp().api.sethousetypepackage,
            method: 'POST',
            data: {
              id: e.currentTarget.dataset.id2 ? e.currentTarget.dataset.id2 : e.currentTarget.dataset.id,
              status: 3
            },
            success(res) {
              console.log("审核设计师", res)
              wx.showToast({
                title: "拒绝" + res.msg,
                icon: 'none'
              })
            }
          })
        }
        e.currentTarget.dataset.id2 ? that.shareroomdesignerlists() : that.roomtypepackagelists()
      },
      fail: function(res) {},
    })
  },
  // 是否样板间套餐
  packges() {
    let shareroom = this.data.shareroom;
    let tabindex = '';
    if (shareroom) {
      tabindex = 4
    } else {
      tabindex = 3
    }
    console.log(tabindex)
    this.setData({
      shareroom: !shareroom,
      tabindex
    })
  },
  // 审核套餐
  setpackages(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    if (that.data.tabindex == 3) {
      wx.showModal({
        title: '提示',
        content: '是否通过设计师加入套餐',
        showCancel: true,
        cancelText: '拒绝',
        success(res) {
          if (res.confirm) {
            getApp().request({
              url: getApp().api.setshareroompackage,
              method: 'POST',
              data: {
                id,
                status: 1
              },
              success(res) {
                console.log(res)
                wx.showToast({
                  title: "通过" + res.msg,
                  icon: 'none'
                })
                that.shareroompackagelists();
              }
            })
          } else {
            getApp().request({
              url: getApp().api.setshareroompackage,
              method: 'POST',
              data: {
                id,
                status: 3
              },
              success(res) {
                console.log(res)
                wx.showToast({
                  title: "拒绝" + res.msg,
                  icon: 'none'
                })
                that.shareroompackagelists();
              }
            })
          }
        }
      })
    }
    if (that.data.tabindex == 4) {
      wx.showModal({
        title: '提示',
        content: '是否通过设计师加入套餐',
        showCancel: true,
        cancelText: '拒绝',
        success(res) {
          if (res.confirm) {
            getApp().request({
              url: getApp().api.sethousetypepackage,
              method: 'POST',
              data: {
                id,
                status: 1
              },
              success(res) {
                console.log(res)
                wx.showToast({
                  title: "通过" + res.msg,
                  icon: 'none'
                })
                that.roomtypepackagelists();
              }
            })
          } else {
            getApp().request({
              url: getApp().api.sethousetypepackage,
              method: 'POST',
              data: {
                id,
                status: 3
              },
              success(res) {
                console.log(res)
                wx.showToast({
                  title: "拒绝" + res.msg,
                  icon: 'none'
                })
                that.roomtypepackagelists();
              }
            })
          }
        }
      })
    }
  },
  packagedetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/groupDetail/groupDetail?idid=" + id
    })
  }
})