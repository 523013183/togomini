var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk = new QQMapWX({
  key: 'FB7BZ-IKH6U-DDKV3-4GI45-VC7SZ-WABNQ' //申请的开发者秘钥key
});
Page({
  data: {
    hide_sever: false,
    stylediy: true,
    val: '',
    showprice: false,
    avatarSrc: "",
    hidden: true,
    profession: [{
      id: 1,
      name: '设计助理'
    }, {
      id: 2,
      name: '设计师'
    }, {
      id: 8,
      name: '全屋定制'
    }, {
      id: 9,
      name: '家居顾问'
    }, {
      id: 3,
      name: '全案设计师'
    }, {
      id: 4,
      name: '设计总监'
    }, {
      id: 5,
      name: '门店导购'
    }, {
      id: 6,
      name: '店长'
    }, {
      id: 7,
      name: '个人'
    }, {
      id: 11,
      name: '3D建模师'
    }, {
      id: 10,
      name: '其它'
    }],
    job: "设计助理",
    professionIndex: 0,
    userInfo: {},
    styles: [{
        style: "工装"
      },
      {
        style: "现代简约"
      },
      {
        style: "新中式"
      },
      {
        style: "北欧"
      },
      {
        style: "田园"
      },
      {
        style: "地中海"
      },
      {
        style: "简欧"
      },
      {
        style: "日式"
      },
      {
        style: "美式"
      },
      {
        style: "混搭"
      },
      {
        style: "简美"
      },
      {
        style: "后现代"
      },
    ],
    style: "",
    goodAtStyles: [],
    years: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
      "20"
    ],
    yearsIndex: 0,
    year: "",
    descript: "",
    designPrice: "请选择设计费用",
    personaldesc: "TA好像没留下什么",
    longitude: 0,
    latitude: 0,
    wechat: "",
    userName: "",
    mobile: "",
    styleType: null,
    level_name:'普通用户'
  },
  //点击跳转到个人介绍
  linkPersonal: function(e) {
    let before = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: "/pages1/personalDesc/personalDesc?before=" + before
    })
  },
  //修改个人介绍内容
  changeDesc: function(value) {
    if (!value) {
      value = "TA好像没留下什么"
    }
    this.setData({
      personaldesc: value
    })
  },
  //修改设计费用
  changePrice: function(value1, value2) {
    if (value1 == "" || value2 == "") {
      value = "请选择设计费用"
    }
    this.setData({
      designPrice: value1 + '~' + value2
    })
  },
  bindInput1: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  bindInput2: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindInput3: function(e) {
    this.setData({
      wechat: e.detail.value
    })
  },
  onLoad: function(options) {
    var self = this;
    if (wx.getStorageSync('level_name')){
      self.setData({
        level_name: wx.getStorageSync('level_name')
      })
    }
    if (options.img) {
      self.setData({
        avatarSrc: options.img,
        userName: options.nickname,
        mobile: options.mobile
      })
    }
    let info = wx.getStorageSync('user_info')
    if (options.job) {
      if (options.job.indexOf("设计") != -1) {
        self.setData({
          showprice: false
        })
      }
    }
    if (options.descript == 'undefined' || options.descript == undefined) {
      self.setData({
        avatarSrc: info.avatarUrl,
        userName: info.nickName,
        mobile: wx.getStorageSync("mobile"),
      })
    } else {
      var array = JSON.parse(options.style);
      let objarr = [];
      for (let j in self.data.styles) {
        objarr.push(self.data.styles[j].style)
      }
      let styles = self.data.styles;
      for (let j in array) {
        if (objarr.indexOf(array[j]) == -1) {
          let obj = {};
          obj.style = array[j];
          styles.push(obj)
        }
      }
      self.setData({
        hide_sever: wx.getStorageSync('hide_sever'),
        styles: styles,
        tx_img: info.avatarUrl,
        name_: info.nickName,
        phone: wx.getStorageSync("mobile"),
        userName: options.userName,
        job: options.job,
        year: options.years,
        designPrice: options.designPrice,
        style: array,
        personaldesc: options.descript,
        mobile: options.mobile,
        wechat: options.wechat,
        avatarSrc: options.avatarSrc,
      })
      if (self.data.job.indexOf("设计") == -1) {
        self.setData({
          showprice: true
        })
      }
    }
    self.selectStyle();
    //获取地址信息
    wx.getLocation({
        success: function(res) {
          self.setData({
            longitude: res.longitude,
            latitude: res.latitude,
          })
        },
        fail: function(e) {
          getApp().getauth({
            content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
            success: function(t) {
              t && (t.authSetting["scope.userLocation"] ? self.onLoad(options) : getApp().core.showToast({
                title: "您取消了授权",
                image: "none"
              }));
            }
          });
        }
      }),
      //获取微信名
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                self.setData({
                })
              }
            })
          }
        }
      })
    this.getProfessionIndex();
    this.getyearsIndex();
  },
  //上传头像
  change_avatar() {
    var self = this;
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: "上传中..."
        })
        wx.uploadFile({
          url: getApp().api.default.mini_upload_image, // 仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            user: 'test'
          },
          success(res) {
            wx.hideLoading()
            let data = res.data;
            data = JSON.parse(data);
            self.setData({
              avatarSrc: data.data.url
            })
          }
        })
      }
    })
  },
  /*选择职业*/
  getProfession: function(e) {
    let index = e.detail.value;
    this.data.userInfo.profession = this.data.profession[index];
    if (index == 0 || index == 1 || index == 4 || index == 5) {
      this.setData({
        professionIndex: index,
        userInfo: this.data.userInfo,
        showprice: false,
        job: this.data.profession[index].name
      })
    } else {
      this.setData({
        professionIndex: index,
        userInfo: this.data.userInfo,
        showprice: true,
        job: this.data.profession[index].name
      })
    }

  },
  /*选择风格*/
  getStyles: function(e) {
    let index = e.detail.value;
    this.data.userInfo.styles = this.data.styles[index];
    var arr = this.data.goodAtStyles;
    var style1 = this.data.styles[index];
    arr.push(style1)
    this.setData({
      stylesIndex: index,
      userInfo: this.data.userInfo,
      goodAtStyles: arr
    })
  },
  /*选择风格弹窗*/
  choosestyle: function() {
    var self = this;
    self.setData({
      hidden: false
    })
  },
  hidden_mask: function() {
    var self = this;
    self.setData({
      hidden: true
    })
  },
  sure: function() {
    var self = this;
    self.setData({
      hidden: true
    })
  },
  isChoose3: function(e) {
    let index = e.currentTarget.dataset.index;
    let styles = this.data.styles;
    styles[index].check = !(styles[index].check);
    this.setData({
      styles: styles
    });
    var styleType = [];
    styles.forEach(function(v, k) {
      if (v.check) {
        styleType.push(v.style);
      }
    })
    this.setData({
      styleType: styleType
    })
  },
  /*选择年限*/
  getYears: function(e) {
    let index = e.detail.value;
    this.data.userInfo.years = this.data.years[index];
    this.setData({
      yearsIndex: index,
      userInfo: this.data.userInfo
    })
  },
  //点击保存
  saveCardMsg: function() {
    var t = this;
    var curYear, curStyle, curJob, curDescript;
    if (t.data.yearsIndex >= 0 && t.data.years[t.data.yearsIndex] !== t.data.year) {
      curYear = t.data.years[t.data.yearsIndex];
    } else {
      curYear = t.data.year;
    }
    if (t.data.styleType !== null) {
      curStyle = t.data.styleType;
    } else {
      curStyle = t.data.style;
    }
    if (t.data.professionIndex >= 0 && t.data.profession[t.data.professionIndex] !== t.data.job) {
      curJob = t.data.profession[t.data.professionIndex].name;
    } else {
      curJob = t.data.job;
    }
    if (t.data.personaldesc != 'TA好像没留下什么' && t.data.descript != t.data.personaldesc) {
      curDescript = t.data.personaldesc;
    } else {
      curDescript = t.data.personaldesc;
    }
    try {
      var longitude = t.data.longitude.toFixed(2);
      var latitude = t.data.latitude.toFixed(2);
    } catch (e) {}
    if (t.data.userName != "" && t.data.wechat != "" && t.data.mobile != "" && curYear != "" && curDescript != "简介" && t.data.avatarSrc != "" && JSON.stringify(curStyle) != [] && curJob != "") {
      if (t.data.job.indexOf("设计") != -1) {
        if (t.data.designPrice == '请选择设计费用') {
          wx.showToast({
            title: '请完善信息',
            icon: 'none'
          })
          return;
        }
      }
      var reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
      if (t.data.userName.match(reg)) {
        wx.showToast({
          title: "昵称不能含有特殊符号！",
          icon: 'none'
        })
        return;
      }
      getApp().core.showLoading({
        title: "正在保存",
        mask: !0
      });
      let a = {
        user_name: t.data.userName, //姓名
        wechat: t.data.wechat, //微信号
        mobile: t.data.mobile, //手机号
        company_name: "公司名称", //公司名臣
        job_year: curYear, //从业年限
        introduction: curDescript, //简介
        avatar_url: t.data.avatarSrc, //头像
        remarks: "随便一些字",
        longitude: longitude,
        latitude: latitude,
        style: JSON.stringify(curStyle), //擅长风格
        job: curJob, //职业
        design_fees: t.data.designPrice, //设计费用
      }

      getApp().request({
        url: getApp().api.saveCard,
        method: "post",
        data: a,
        success: function(e) {
          if (e.code != 0) {
            wx.showToast({
              title: e.msg,
              icon: "none"
            })
          }
          getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1,
            success: function(e) {
              if (e.confirm) {
                wx.reLaunch({
                  url: "/pages1/homePage/homePage?avatarSrc=" + t.data.avatarSrc
                });
              }
            }
          })
        },
        fail: function(e) {
        }
      });
    } else {
      wx.showToast({
        title: '请完善信息',
        icon: 'none'
      })
      return;
    }
  },
  //获取职业的index
  getProfessionIndex: function() {
    var that = this;
    var profession = that.data.profession;
    var job = that.data.job;

    profession.forEach(function(item, index) {
      if (item.name == job) {
        that.setData({
          professionIndex: index
        })
      }
    })
  },
  //获取从业年限的index
  getyearsIndex: function() {
    var that = this;
    var years = that.data.years;
    var year = that.data.year;
    years.forEach(function(item, index) {
      if (item == year) {
        that.setData({
          yearsIndex: index
        })
      }
    })
  },
  //风格选项
  selectStyle: function() {
    var that = this;
    var styleType = that.data.styleType;
    var style = that.data.style;
    var styles = that.data.styles;
    if (style != '') {
      styles.forEach(function(item, index) {
        style.forEach(function(i, k) {
          if (item.style == i) {
            item.check = 1
          }
        })
      })
    }
    that.setData({
      styles: styles
    })
  },
  diy(e) {
    let obj = {};
    obj.style = e.detail.value
    let styles = this.data.styles;
    if (e.detail.value != '') {
      styles.push(obj)
      this.setData({
        styles,
        val: ""
      })
    }
    if (styles.length > 19) {
      this.setData({
        stylediy: false
      })
    }
  },
  // 隐藏服务
  switch1Change(e) {
    wx.setStorageSync("hide_sever", e.detail.value)
  }
})