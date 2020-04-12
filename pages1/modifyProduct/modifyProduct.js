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
    id: "",
    curName: '',
    curRemark: '',
    curPic: [],
    projectName: '',
    projectRemark: '',
    preImgsAbout: [], // 上传活动相关图片，最多5张；
    preImgsAboutId: [], //上传活动相关图片，最多5张Id；
    curimgArrId: [],
    video: '',
    video2: '',
    is_water: '',
    success: 0, //图片上传成功数
  },
  onLoad: function(options) {
    var self = this;
    self.setData({
      id: options.id,
    })
    if (options.type == "productdetail") {
      var array = JSON.parse(options.pic);
      if (options.pic !== '') {
        self.setData({
          curPic: array,
        })
      }
      if (options.name) {
        self.setData({
          curName: options.name,
          curRemark: options.remarks,
        })
      }
    } else if (options.type == "manageproduct") {
      self.getproductDetail();
    }
    self.getproductDetail();
  },
  //获取作品详情
  getproductDetail: function() {
    var self = this;
    getApp().request({
      url: getApp().api.productDetail,
      method: "post",
      data: {
        id: self.data.id
      },
      success: function(res) {
        var info = res.data.info;
        if (info.video_url == null) {
          self.setData({
            projectName: info.name,
            projectRemark: info.remarks,
            curPic: res.data.pic,
            video: ''
          })
        } else {
          self.setData({
            projectName: info.name,
            projectRemark: info.remarks,
            curPic: res.data.pic,
            video: info.video_url
          })
        }
        var query = wx.createSelectorQuery();
        var nodesRef = query.selectAll(".item");
        nodesRef.fields({
          dataset: true,
          rect: true
        }, (result) => {
          self.setData({
            elements: result
          })
        }).exec()
      }
    })
  },
  //标题
  input1: function(e) {
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
    let num2 = num == 9 ? num - this.data.curPic.length : num;
    let flag = e.currentTarget.dataset.flag;
    let preImgsAbout = this.data.preImgsAbout;
    wx.chooseImage({
      count: num2, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        let tempFilePaths = res.tempFilePaths;
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
      title: '已上传' + success + "/" + data.path.length + "张",
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
            fileIds.push(result.data.id);
            this.setData({
              preImgsAbout: arr
            })
            this.setData({
              preImgsAboutId: fileIds
            })
          }
        } else {
          fail++; //图片上传失败，图片上传失败的变量+1
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
    let curimgArr = this.data.curPic;
    let imgArr = this.data.preImgsAbout;
    let curimgArrId = this.data.curimgArrId;
    if (e.currentTarget.dataset.type == 'noadd') {
      curimgArrId.push(curimgArr[index].id)
      curimgArr.splice(index, 1);
      this.setData({
        curPic: curimgArr,
        curimgArrId: curimgArrId,
      })
    } else {
      imgArr.splice(index, 1);
      this.setData({
        preImgsAbout: imgArr,
      })
    }
  },
  //点击确认修改作品
  saveProjectMsg: function(e) {
    var t = this,
      value;
    // 标题判断
    if (this.data.projectName == "") {
      wx.showToast({
        title: '请输入您的作品标题!',
        icon: "none",
        duration: 1000
      })
      return;
    }
    // 效果图判断
    if (this.data.preImgsAbout == "" && this.data.curPic == "") {
      wx.showToast({
        title: '请上传效果图!',
        icon: "none",
        duration: 1000
      })
      return;
    }
    getApp().core.showLoading({
      title: "正在保存",
      mask: !0
    });
    var curName, curRemark, curPic;
    if (t.data.projectName !== '') {
      curName = t.data.projectName;
    } else {
      curName = t.data.curName;
    }
    if (t.data.projectRemark !== '') {
      curRemark = t.data.projectRemark;
    } else {
      curRemark = t.data.curRemark;
    }
    if (t.data.preImgsAbout.length) {
      var arr = t.data.curPic.concat(t.data.preImgsAbout);
      curPic = arr;
    } else {
      curPic = t.data.curPic;
    }

    // 上传视频
    if (t.data.video2 != '') {
      wx.uploadFile({
        url: getApp().api.uploadvideo,
        filePath: t.data.video2,
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
          let video_url = data.data.url;
          if (data.code == 0) {
            getApp().request({
              url: getApp().api.saveProject,
              method: "post",
              data: {
                id: t.data.id,
                name: curName,
                remarks: curRemark,
                pic: JSON.stringify(curPic),
                delete_images: JSON.stringify(t.data.curimgArrId),
                video_url: video_url
              },
              success: function(e) {
                getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
                  title: "提示",
                  content: e.msg,
                  showCancel: !1,
                  success: function(e) {
                    if (e.confirm) {
                      wx.navigateBack({
                        delta: 1,
                        success: function(e) {
                          let pages = getCurrentPages();
                          let prevPage = pages[pages.length - 2];
                          if (prevPage.getList) {
                            prevPage.getList();
                          } else if (prevPage.getproductDetail) {
                            prevPage.getproductDetail();
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
      getApp().request({
        url: getApp().api.saveProject,
        method: "post",
        data: {
          id: t.data.id,
          name: curName,
          remarks: curRemark,
          pic: JSON.stringify(curPic),
          delete_images: JSON.stringify(t.data.curimgArrId),
          video_url: t.data.video
        },
        success: function(e) {
          getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
            title: "提示",
            content: e.msg,
            showCancel: !1,
            success: function(e) {
              if (e.confirm) {
                wx.navigateBack({
                  delta: 1,
                  success: function(e) {
                    let pages = getCurrentPages();
                    let prevPage = pages[pages.length - 1];
                    if (prevPage.getList) {
                      prevPage.getList();
                    } else if (prevPage.getproductDetail) {
                      prevPage.getproductDetail();
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
        }
      });
    }
  },
  // 选择视频
  uploadvideo() {
    let that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 30,
      camera: 'back',
      success(res) {
        if (res.duration > 30) {
          wx.showToast({
            title: '视频时长不超过30秒',
            icon: "none"
          })
        } else {
          that.setData({
            video2: res.tempFilePath
          })
        }
      }
    })
  },
  // 删除视频
  delvideo() {
    let that = this;
    that.setData({
      video: '',
      video: ''
    })
  },
  // 是否加水印
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
      beginIndex: e.currentTarget.dataset.index
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
    let data = this.data.curPic
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
        this.setData({
          curPic: data
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
    let arr = [];
    for (let i in this.data.curPic) {
      arr.push(this.data.curPic[i].url)
    }
    wx.previewImage({
      current: arr[index],
      urls: arr
    })
  },
})