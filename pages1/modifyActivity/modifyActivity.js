var app = getApp();
Page({
  data: {
    active_address: '',
    dataObj: [],
    dateRes: { //活动时间；
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      startDateEntry: '',
      startTimeEntry: '',
      endDateEntry: '',
      endTimeEntry: '',
    },
    rangePermission: [{
      value: 1,
      info: '仅创建者可见'
    }, {
      value: 2,
      info: '所有人可见'
    }], //报名数据选择权限列表
    rangePermissionIndex: 0,
    preImgtop: '', //上传头图预览图;
    preImgtopId: 0, //上传头图id
    preImgQrcode: '', //上传二维码预览图；
    preImgQrcodeId: 0, //上传二维码id
    preImgsAbout: [], // 上传活动相关图片，最多5张；
    preImgsAboutId: [], //上传活动相关图片，最多5张Id；
    showMoreOption: false, //显示更多高级选项；
    isShowJoinNum: 1,
    mobile: '', //手机号
    groupNumber: "", //成团人数
    hasCode: false,
    second: 60,
    titleText: "",
    descText: "",
    applyItem: [ //报名必填的项目
      {
        type: "姓名"
      },
      {
        type: "电话"
      },
      // {type:"性别"},
      // {type:"QQ号"},
      // {type:"微信号"},
      // {type:"爱好"},
      // {type:"爱好"},
    ],
    selectIndex: [{
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
      {
        sureid: false
      },
    ],
    newText: "",
    applyArr: [],
    id: "",
    detail: "",
    curform: "",
  },
  //获取活动详情
  getActivityDetail: function() {
    var self = this;

  },
  onLoad: function(options) {
    var self = this;
    console.log(options.id)
    self.setData({
      id: options.id,
      isCopy: options.copy,
      mobile: wx.getStorageSync("USER_INFO").binding
    })

    getApp().request({
      url: getApp().api.activityDetail,
      method: "post",
      data: {
        id: self.data.id
      },
      success: function(res) {
        console.log("获取活动详情 res：", res);
        var detail = res.data.info;
        var obj = {};
        obj.author_name = detail.author_name;
        obj.author_wechat = detail.author_wechat;
        var curform = detail.form;
        var curIndex = self.data.selectIndex;
        for (var i = 0; i < curform.length; i++) {
          if (curform[i].require == 1) {
            curIndex[i].sureid = true;
          }
        }
        var dateRes = {};
        var start_time = detail.start_time;
        dateRes.startDateEntry = start_time[0];
        dateRes.startTimeEntry = start_time[1];
        var end_time = detail.end_time;
        dateRes.endDateEntry = end_time[0];
        dateRes.endTimeEntry = end_time[1];
        //头像
        var preImgtop, preImgtopId;
        if (detail.head_pic_url !== '') {
          preImgtop = detail.head_pic_url;
        }
        if (detail.head_pic !== '') {
          preImgtopId = detail.head_pic;
        }
        //活动图片
        var preImgsAbout, preImgsAboutId;
        if (detail.other_pic_url !== '') {
          preImgsAbout = detail.other_pic_url;
        }else{
          preImgsAbout = [];
        }
        if (detail.other_pic !== '') {
          preImgsAboutId = detail.other_pic;
        }else{
          preImgsAboutId = [];
        }

        self.setData({
          preImgtop: preImgtop,
          preImgtopId: preImgtopId,
          titleText: detail.title,
          curform: detail.form,
          groupNumber: detail.max_number,
          active_address: detail.address,
          descText: detail.content,
          preImgsAbout: preImgsAbout || [],
          preImgsAboutId: preImgsAboutId || [],
          dataObj: obj,
          active_lat: detail.latitude,
          active_lon: detail.longitude,
          selectIndex: curIndex,
          dateRes: dateRes,
        })
        console.log(obj)
      }
    });
    if (this.data.newText !== "") {
      var arr = self.data.applyItem;
      var text = self.data.newText;
      arr.push(text);
      this.setData({
        applyItem: arr,
      })
      console.log(applyItem)
    }
    self.getActivityDetail();
  },
  //添加自定义选项
  linkAddSelf: function() {
    wx.navigateTo({
      url: "/pages1/makeSelfText/makeSelfText"
    })
  },
  addText: function(value) {
    var self = this;
    console.log(value)
    self.setData({
      newText: value
    })
    let pages = getCurrentPages();
    console.log(pages);
    let prevPage = pages[pages.length - 2];
    if (prevPage.data.newText !== "") {
      var arr = prevPage.data.applyItem;
      var text = prevPage.data.newText;
      var newtext = {
        type: text
      }
      arr.push(newtext);
      self.setData({
        applyItem: arr
      })
      console.log(prevPage.data.applyItem)
    }
  },
  //选择活动必填项
  isChoose1: function(e) {
    console.log(e)
    var self = this;
    let index = e.currentTarget.dataset.selectindex; //当前点击元素的自定义数据，这个很关键
    let sureid = e.currentTarget.dataset.sureid;
    let styleItem = e.currentTarget.dataset.item;
    let selectIndex = this.data.selectIndex; //取到data里的selectIndex
    selectIndex[index].sureid = !selectIndex[index].sureid; //点击就赋相反的值
    this.setData({
      selectIndex: selectIndex //将已改变属性的json数组更新
    })
    var arr = self.data.applyArr;
    if (selectIndex[index].sureid == true) {
      arr.push(self.data.applyItem[index].type);
    } else if (selectIndex[index].sureid == false) {
      arr.splice(index, 1);
    }
    self.setData({
      applyArr: arr
    })
    console.log(self.data.applyArr)
  },

  //活动标题字数限制
  titlelimit: function(e) {
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }
    this.setData({
      titleText: e.detail.value
    })
  },
  //活动描述字数限制
  desclimit: function(e) {
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }
    this.setData({
      descText: e.detail.value
    })
  },
  //报名人数
  setNumber(e) {
    let groupNumber = this.validateNumber(e.detail.value)
    this.setData({
      groupNumber: groupNumber
    })
  },
  /* 报名时间选择事件 */
  selectTime: function(e) {
    let which = e.currentTarget.dataset.time;
    let val = e.detail.value;
    let dateRes = this.data.dateRes;
    dateRes[which] = val;
    if (which == 'startDateEntry' && !dateRes.startTimeEntry) {
      dateRes.startTimeEntry = '00:00';
    }
    if (which == 'endDateEntry' && !dateRes.endTimeEntry) {
      dateRes.endTimeEntry = '23:59'
    }
    this.setData({
      dateRes,
    })
  },
  /* 图片上传 */
  uploadImg: function(e) {
    let num = e.currentTarget.dataset.num;
    let flag = e.currentTarget.dataset.flag;
    let preImgsAbout = this.data.preImgsAbout;
    wx.chooseImage({
      count: num == 5 ? num - preImgsAbout.length : num, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        wx.showLoading({
          mask: true,
          title: '正在上传...',
        })
        this.uploadimgs({
          url: getApp().api.default.mini_upload_image,
          path: tempFilePaths,
          flag: flag,
        })

      },
    })
  },

  /* 删除已选择的图片 */
  delImg: function(e) {
    let index = e.target.dataset.index;
    let imgArr = this.data.preImgsAbout;
    let preImgsAboutId = this.data.preImgsAboutId;
    imgArr.splice(index, 1);
    preImgsAboutId.splice(index, 1);
    console.log(preImgsAboutId, imgArr)
    this.setData({
      preImgsAbout: imgArr,
      preImgsAboutId: preImgsAboutId
    })
  },

  /* 点击显示更多选项 */
  showMoreOption: function() {
    this.setData({
      showMoreOption: !this.data.showMoreOption
    })
  },

  /* 显示报名人数 */
  showJoinNum: function(e) {
    let val = e.detail.value;
    this.setData({
      isShowJoinNum: val ? 0 : 1,
    })
  },

  /* 报名数据权限选择 */
  selectPermission: function(e) {
    let val = e.detail.value;
    this.setData({
      rangePermissionIndex: val
    })
  },

  /* 提交创建活动表单 */
  subActivity: function(e) {
    e.addFormId(t.detail.formId);
  },

  /* 删除活动 */
  delActivity: function() {
    wx.showModal({
      title: '删除提示',
      content: '确定要删除吗',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除...',
            success: () => {

            }
          })
        }
      }
    })
  },

  /* 图片上传 */
  uploadimgs: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    let flag = data.flag;

    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
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
        console.log(result)
        if (result.code == 0) {
          success++; //图片上传成功，图片上传成功的变量+1
          if (flag == 'top') {
            this.setData({
              preImgtop: result.data.url
            })
            this.setData({
              preImgtopId: result.data.id
            })
          } else if (flag == 'qrcode') {
            this.setData({
              preImgQrcode: result.data.url
            })
            this.setData({
              preImgQrcodeId: result.data.id
            })
          } else if (flag == 'about') {
            if (this.data.preImgsAbout !== '') {
              let arr = this.data.preImgsAbout;
              arr.push(result.data.url);
              this.setData({
                preImgsAbout: arr
              })
            }else{
              let arr = this.data.preImgsAbout;
              console.log(arr)
              arr.push(result.data.url);
              this.setData({
                preImgsAbout: arr
              })
            }
            let fileIds = this.data.preImgsAboutId;
            console.log(fileIds)
            fileIds.push(result.data.id);
            this.setData({
              preImgsAboutId: fileIds
            })
          }
        } else {
          fail++; //图片上传失败，图片上传失败的变量+1
          console.log('fail:' + i + "fail:" + fail);
        }

      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
      },
      complete: () => {
        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用
          wx.hideLoading();
          if (fail > 0) {
            wx.showToast({
              icon: 'none',
              title: '成功' + success + '张，失败' + fail + '张',
            });
          } else {
            wx.showToast({
              title: '图片上传完成',
            })
          }

        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimgs(data);
        }

      }
    });
  },

  //输入的手机号；
  setPhone(e) {
    let mobile = this.validateNumber(e.detail.value)
    this.setData({
      mobile: mobile
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  //通过手机号获取验证码；
  getCode: function() {
    let mobile = this.data.mobile;
    if (!mobile) {
      wx.showToast({
        icon: 'none',
        title: '手机号不能为空',
      });
      return;
    }
    if (!this.checkMobile(mobile)) {
      return;
    }
    getApp().request({
      url: getApp().api.empower,
      method: "post",
      data: {
        iv: 'MdSLXz0y5EKOaub2T9Ampw ==',
        encryptedData: '3FUBaClSLlXII / zRUvrc2Psl0wO39DY9eG8hIzxcD1 / utsgURzXfv7ZRzrYfKe5zLTdcDN + AUJu / YX56mVQEbQYf / wd2LqqfbbwrvKUWD59A / IAGg2AcLRDIDhmAeCghZeqbQLVE57WDM3iTgmc2TkXD9VB8Ew9NiF2WaD0O0i + CUsQ9FPXfI2E / xddRchJeis5jgYtVXzk / VX / g4rLnig ==',
        code: '021vSwKn1JHgBp0WhfLn1cqWKn1vSwKj'
      },
      success: function(e) {
        console.log(e)
      }
    });

    // wx.showLoading({
    //   title: '正在请求验证码',
    //   success: () => {
    //     this.setSecond();// 倒计时
    //   }
    // })
    // 发送 验证码请求


  },

  //验证手机号；
  checkMobile: function(mobile) {
    let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        icon: 'none',
        title: '手机号不规范',
      });
      return false;
    }
    return true;
  },

  //倒计时；
  setSecond: function() {
    // let second = app.globalData.second;
    this.setData({
      hasCode: true,
      second: second
    })
    var t = setInterval(() => {
      if (second <= 0) {
        clearInterval(t); //清除定时器；
        this.setData({
          hasCode: false,
          second: second
        })
      }
      this.setData({
        second: --second
      })
    }, 1000);
  },

  /* 获取并设置活动地址 */
  getActiveAddress: function() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        var longitude = res.latitude.toFixed(2);
        var latitude = res.longitude.toFixed(2);
        this.setData({
          active_address: res.address,
          active_lat: latitude,
          active_lon: longitude,
        })
      },
    })
  },
  inputBlur: function(e) {
    var t = '{"' + e.currentTarget.dataset.name + '":"' + e.detail.value + '"}';
    this.setData(JSON.parse(t));
  },
  //创建活动
  create_activity: function() {
    var t = this;
    console.log(t)
    getApp().core.showLoading({
      title: "正在保存",
      mask: !0
    });
    //报名活动表单
    var form = [];
    var Alength = t.data.applyItem.length;
    for (var i = 0; i < Alength; i++) {
      var form_key = {};
      form_key.key = t.data.applyItem[i].type;
      if (t.data.selectIndex[i].sureid == true) {
        form_key.require = 1
      } else {
        form_key.require = 0
      }
      form_key.type = 1;
      form_key.str_count = 50;
      form.push(form_key);
    }
    // if (t.data.preImgsAbout == []) {
    //   wx.showToast({
    //     icon: 'none',
    //     title: '请添加活动相关图片',
    //   });
    // } else 
    if (t.data.dataObj.author_name == undefined) {
      wx.showToast({
        icon: 'none',
        title: '发起人署名不能为空',
      });
    } else if (t.data.dataObj.author_wechat == undefined) {
      wx.showToast({
        icon: 'none',
        title: '发起人微信号不能为空',
      });
    } else if (t.data.mobile == '') {
      wx.showToast({
        icon: 'none',
        title: '发起人手机号不能为空',
      });
    } else if (t.checkMobile(t.data.mobile)) {
      if (t.data.isCopy == 1) {
        var formData1 = {
          title: t.data.titleText,
          content: t.data.descText,
          start_time: t.data.dateRes.startDateEntry + ' ' + t.data.dateRes.startTimeEntry,
          end_time: t.data.dateRes.endDateEntry + ' ' + t.data.dateRes.endTimeEntry,
          head_pic: t.data.preImgtopId,
          other_pic: t.data.preImgsAboutId,
          max_number: t.data.groupNumber || '0',
          longitude: t.data.active_lon,
          latitude: t.data.active_lat,
          address: t.data.active_address,
          show_enroll: 1,
          author_name: t.data.dataObj.author_name,
          author_wechat: t.data.dataObj.author_wechat,
          author_phone: t.data.mobile,
          form: JSON.stringify(form),
        }
      } else {
        var formData1 = {
          title: t.data.titleText,
          content: t.data.descText,
          start_time: t.data.dateRes.startDateEntry + ' ' + t.data.dateRes.startTimeEntry,
          end_time: t.data.dateRes.endDateEntry + ' ' + t.data.dateRes.endTimeEntry,
          head_pic: t.data.preImgtopId,
          other_pic: t.data.preImgsAboutId,
          max_number: t.data.groupNumber || '0',
          longitude: t.data.active_lon,
          latitude: t.data.active_lat,
          address: t.data.active_address,
          show_enroll: 1,
          author_name: t.data.dataObj.author_name,
          author_wechat: t.data.dataObj.author_wechat,
          author_phone: t.data.mobile,
          id: parseInt(t.data.id),
          form: JSON.stringify(form),
        }
      }
      getApp().request({
        url: getApp().api.saveActivity,
        method: "post",
        data: formData1,
        success: function(e) {
          console.log("获取首页数据 e：", e);
          getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
              title: "提示",
              content: e.msg,
              showCancel: !1,
              success: function(e) {
                e.confirm && getApp().core.navigateBack({
                  delta: 2,
                });
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 3];
                prevPage.getactivityList();
              }
            }),
            1 == e.code && getApp().core.showModal({
              title: "提示",
              content: e.msg,
              showCancel: !1,
            })
        }
      });
    }


  },

})