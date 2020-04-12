const app = getApp()
Page({
  data: {
    scroll: true,
    hidden2: true,
    flag: false,
    x: 0,
    y: 0,
    disabled: true,
    hidden: true,
    curName: null,
    curRemark: null,
    curPic: [],
    projectName: '',
    projectRemark: '',
    preImgsAbout: [], // 上传活动相关图片，最多5张；
    preImgsAboutId: [], //上传活动相关图片，最多5张Id；
    is_water: '',
    video: ''
  },
  onLoad: function(options) {
    var self = this;
    if (wx.getStorageSync('preImgsAbout') || wx.getStorageSync('video')) {
      wx.showModal({
        title: '提示',
        content: '您上次有未完成数据，是否加载',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            self.setData({
              projectName: wx.getStorageSync('projectName'),
              projectRemark: wx.getStorageSync('projectRemark'),
              preImgsAbout: wx.getStorageSync('preImgsAbout'),
              video: wx.getStorageSync('video')
            })
          } else if (res.cancel) {
            wx.removeStorageSync('projectName')
            wx.removeStorageSync('projectRemark')
            wx.removeStorageSync('preImgsAbout')
          }
        }
      })

    }
    if (options.name) {
      self.setData({
        curName: options.name,
        curRemark: options.remarks,
        curPic: options.pic,
      })
    }
  },
  //标题
  input1: function(e) {
    // console.log(e)
    var value = e.detail.value
    this.setData({
      projectName: value
    })
  },
  //备注
  input2: function(e) {
    var value = e.detail.value
    this.setData({
      projectRemark: value
    })
  },
  /* 图片上传 */
  uploadImg: function(e) {
    let num = e.currentTarget.dataset.num;
    let flag = e.currentTarget.dataset.flag;
    let preImgsAbout = this.data.preImgsAbout;
    let num2 = num == 9 ? num - preImgsAbout.length : num;
    wx.chooseImage({
      count: num2, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
        console.log(res)
        // return;
        this.uploadimgs({
          url: getApp().api.default.mini_upload_image,
          path: tempFilePaths,
          flag: flag,
        })

      },
    })
  },
  /* 图片上传 */
  uploadimgs: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    let flag = data.flag;
    wx.showLoading({
      mask: true,
      title: '已上传' + success + "/" + data.path.length + '张',
    })
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      header: {
        'Content-Type': 'multipart/form-data',
        'WX-Token': wx.getStorageSync('TOKEN'),
      },
      name: 'file', //这里根据自己的实际情况改
      formData: { //这里是上传图片时一起上传的数据
        minapp: 'weixinminapp',
        is_water: that.data.is_water,
        water_text: wx.getStorageSync('user_name')
      },
      success: (resp) => {
        let result = resp.data ? JSON.parse(resp.data) : {
          code: 0
        };
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
            let arr = this.data.preImgsAbout;
            let fileIds = this.data.preImgsAboutId;
            arr.push(result.data.url);
            console.log("aa", arr)
            fileIds.push(result.data.id);
            this.setData({
              preImgsAbout: arr
            })
            this.setData({
              preImgsAboutId: fileIds
            })
          }
          var query = wx.createSelectorQuery();
          var nodesRef = query.selectAll(".item");
          nodesRef.fields({
            dataset: true,
            rect: true
          }, (result) => {
            console.log(result)
            this.setData({
              elements: result
            })
          }).exec()
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
  /* 删除已选择的图片 */
  delImg: function(e) {
    let index = e.target.dataset.index;
    let imgArr = this.data.preImgsAbout;
    imgArr.splice(index, 1);
    this.setData({
      preImgsAbout: imgArr
    })
  },
  //点击确认保存
  saveProjectMsg: function(e) {
    var pages = getCurrentPages();
    var curpage = pages[pages.length - 1];
    console.log(curpage)
    if (curpage.data.projectName == undefined) {
      value = "";
    } else {
      value = curpage.data.projectName;
    }
    if (this.data.preImgsAbout.length == 0) {
      wx.showToast({
        title: '请上传效果图',
        icon: 'none'
      })
      return;
    }
    var t = this,
      value;
    console.log(e, this.data.preImgsAbout)
    getApp().core.showLoading({
      title: "正在保存",
      mask: !0
    });
    if (t.data.video != '') {
      // 上传视频
      wx.uploadFile({
        url: getApp().api.uploadvideo,
        filePath: t.data.video,
        header: {
          'Content-Type': 'multipart/form-data',
          'WX-Token': wx.getStorageSync('ACCESS_TOKEN'),
        },
        name: 'file', //这里根据自己的实际情况改
        formData: {
          //这里是上传图片时一起上传的数据
        },
        success(res) {
          var data = JSON.parse(res.data)
          // console.log(data.data.url)
          if (data.code == 0) {
            // 保存案例
            getApp().request({
              url: getApp().api.saveProject,
              method: "post",
              data: {
                name: value,
                remarks: curpage.data.projectRemark,
                pic: JSON.stringify(curpage.data.preImgsAbout),
                video_url: data.data.url
              },
              success: function(e) {
                if (e.code == 0) {
                  wx.removeStorageSync('projectName')
                  wx.removeStorageSync('projectRemark')
                  wx.removeStorageSync('preImgsAbout')
                  wx.removeStorageSync('video')
                  t.setData({
                    projectName: '',
                    projectRemark: '',
                    preImgsAbout: [],
                    video: ''
                  })
                }
                console.log("获取首页数据 e：", e);
                getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
                  title: "提示",
                  content: e.msg,
                  showCancel: !1,
                  success: function(e) {
                    if (e.confirm) {
                      wx.navigateBack({
                        delta: 1,
                        success: function(e) {
                          var pages = getCurrentPages();
                          console.log(pages);
                          var prevPage = pages[pages.length - 1];
                          if (pages.length == 1) {
                            prevPage.getProjectData();
                          } else if (pages.length == 2) {
                            prevPage.getList();
                          }
                        }
                      })
                    }
                  }
                })
                e.code == 1 && getApp().core.showModal({
                  title: "提示",
                  content: e.msg,
                  showCancel: !1,
                })
              },
              fail: function(e) {
                console.log(e);
              }
            });
          } else {
            wx.showToast({
              title: '上传失败，请重试',
              icon: 'none'
            })
          }
        }
      })
    } else {
      // 保存案例
      getApp().request({
        url: getApp().api.saveProject,
        method: "post",
        data: {
          name: value,
          remarks: curpage.data.projectRemark,
          pic: JSON.stringify(curpage.data.preImgsAbout),
          video_url: ''
        },
        success: function(e) {
          if (e.code == 0) {
            wx.removeStorageSync('projectName')
            wx.removeStorageSync('projectRemark')
            wx.removeStorageSync('preImgsAbout')
            wx.removeStorageSync('video')
            t.setData({
              projectName: '',
              projectRemark: '',
              preImgsAbout: [],
              video: ''
            })
          }
          console.log("获取首页数据 e：", e);
          getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1,
            success: function(e) {
              if (e.confirm) {
                wx.navigateBack({
                  delta: 1,
                  success: function(e) {
                    var pages = getCurrentPages();
                    console.log(pages);
                    var prevPage = pages[pages.length - 1];
                    if (pages.length == 1) {
                      prevPage.getProjectData();
                    } else if (pages.length == 2) {
                      prevPage.getList();
                    }
                  }
                })
              }
            }
          })
          e.code == 1 && getApp().core.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1,
          })
        },
        fail: function(e) {
          console.log(e);
        }
      });
    }
  },
  onUnload: function() {
    let that = this;
    if (that.data.preImgsAbout.length == 0 && that.data.video == '') {
      wx.removeStorageSync('projectName')
      wx.removeStorageSync('projectRemark')
      wx.removeStorageSync('preImgsAbout')
      wx.removeStorageSync('video')
    } else {
      wx.setStorageSync('preImgsAbout', that.data.preImgsAbout)
      wx.setStorageSync('video', that.data.video)
      wx.setStorageSync('projectRemark', that.data.projectRemark)
      wx.setStorageSync('projectName', that.data.projectName)
    }
  },
  switcha(e) {
    let that = this;
    if (e.detail.value == true) {
      that.setData({
        is_water: 1
      })
    } else {
      that.setData({
        is_water: ''
      })
    }
  },
  uploadvideo() {
    let that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res)
        if (res.duration > 31) {
          wx.showToast({
            title: '视频时长不超过30秒',
            icon: "none"
          })
        } else {
          that.setData({
            video: res.tempFilePath
          })
        }
      }
    })
  },
  // 删除视频
  delvideo() {
    console.log("shanchu")
    let that = this;
    that.setData({
      video: ''
    })
  },
  //长按
  _longtap: function(e) {
    var maskImg = e.currentTarget.dataset.img
    this.setData({
      maskImg: maskImg
    })
    const detail = e.detail;
    this.setData({
      x: e.currentTarget.offsetLeft,
      y: e.currentTarget.offsetTop
    })
    this.setData({
      hidden: false,
      flag: true,
      scroll: false
    })
  },
  //触摸开始
  touchs: function(e) {
    this.setData({
      beginIndex: e.currentTarget.dataset.index,
    })
  },
  //触摸结束
  touchend: function(e) {
    if (!this.data.flag) {
      return;
    }
    const x = e.changedTouches[0].pageX
    const y = e.changedTouches[0].pageY
    const list = this.data.elements;
    let data = this.data.preImgsAbout
    for (var j = 0; j < list.length; j++) {
      const item = list[j];
      if (x > item.left && x < item.right && y > item.top && y < item.bottom) {

        const endIndex = item.dataset.index;
        const beginIndex = this.data.beginIndex;
        //临时保存移动的目标数据
        let tem = data[beginIndex];
        //将移动目标的下标值替换为被移动目标的下标值
        data[beginIndex] = data[endIndex]
        //将被移动目标的下标值替换为beginIndex
        data[endIndex] = tem;
        console.log(data)
        this.setData({
          preImgsAbout: data
        })
      }
    }
    this.setData({
      hidden: true,
      flag: false,
      scroll: true
    })
  },
  //滑动
  touchm: function(e) {
    // console.log(e)
    let x = e.changedTouches[0].clientX
    let y = e.changedTouches[0].clientY
    // **//请着重 好好的 看看这里 朋友们 拖拽会不会出bug 就看这里了**
    //===============================>
    this.setData({
      x: x - 75,
      y: y - 350
    })
  },
  // 预览图片
  previewImg: function(e) {
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.preImgsAbout[index],
      urls: this.data.preImgsAbout
    })
  },
})