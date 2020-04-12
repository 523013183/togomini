const app = getApp();

Page({
  data: {
    textarea: true,
    description: '',
    cat_id: '',
    replacelist: {},
    replacenum: '',
    replace: false,
    numa: 0,
    pricenum: 0,
    isScroll: true,
    shopimg: true,
    zhe: true,
    copy: 0,
    jvshi: [{
        id: 1,
        name: "一居室"
      },
      {
        id: 2,
        name: "二居室"
      },
      {
        id: 3,
        name: "三居室"
      },
      {
        id: 4,
        name: "四居室"
      },
      {
        id: 5,
        name: "五居室"
      },
      {
        id: 6,
        name: "六居室"
      }
    ],
    albumpnum: 4, //效果图最大上传图片
    goodsnum: 6, //商品图最大产品数
    roomId: "",
    groupTitle: "",
    totalPrice: "",
    preImgtopfileds: {},
    goodsImgtopfileds: {},
    coverImg: "",
    resultData: {},
    styleArr: [],
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
    roomArr: [],
    roomIndex: [{
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
    styleChoose: [],
    roomChoose: [],
    preImgtop: '', //上传头图预览图;
    preImgtopId: 0, //上传头图id
    roomType: [
      // {room:"玄关",id:0},
    ],
    roomItem: "",
    roomItems: [{
        src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560835375614&di=4e36bf7519e869af3b2e2ff18e4c2b5b&imgtype=0&src=http%3A%2F%2Fimg.daimg.com%2Fuploads%2Fallimg%2F130405%2F3-1304051K544.jpg",
        price: 499
      },
      {
        src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560835375614&di=4e36bf7519e869af3b2e2ff18e4c2b5b&imgtype=0&src=http%3A%2F%2Fimg.daimg.com%2Fuploads%2Fallimg%2F130405%2F3-1304051K544.jpg",
        price: 599
      },
      {
        src: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1560835375614&di=4e36bf7519e869af3b2e2ff18e4c2b5b&imgtype=0&src=http%3A%2F%2Fimg.daimg.com%2Fuploads%2Fallimg%2F130405%2F3-1304051K544.jpg",
        price: 699
      }
    ],
    num: -1,
    curIndex: "",
    preImgsAbout: [], // 上传活动相关图片，最多5张；
    preImgsAboutId: [], //上传活动相关图片，最多5张Id；
    newText: "",
  },

  onLoad: function (option) {
    this.getList();
    if (option.collect) {
      this.setData({
        collect: option.collect
      })
    }
    this.setData({
      merchant: wx.getStorageSync('is_merchant')
    })
    if (wx.getStorageSync('styleArr') || wx.getStorageSync('groupTitle') || wx.getStorageSync('totalPrice') || wx.getStorageSync('preImgtopfileds') || wx.getStorageSync('goodsImgtopfileds') || wx.getStorageSync('roomArr') || wx.getStorageSync('coverImg')) {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '您上次有未完成数据，是否加载',
        success(res) {
          if (res.confirm) {
            that.setData({
              styleArr: wx.getStorageSync('styleArr'),
              groupTitle: wx.getStorageSync('groupTitle'),
              totalPrice: wx.getStorageSync('totalPrice'),
              preImgtopfileds: wx.getStorageSync('preImgtopfileds'),
              goodsImgtopfileds: wx.getStorageSync('goodsImgtopfileds'),
              roomArr: wx.getStorageSync('roomArr'),
              coverImg: wx.getStorageSync('coverImg'),
              roomType: wx.getStorageSync('roomType')
            })
          } else if (res.cancel) {
            wx.removeStorageSync('styleArr')
            wx.removeStorageSync('groupTitle')
            wx.removeStorageSync('totalPrice')
            wx.removeStorageSync('preImgtopfileds')
            wx.removeStorageSync('goodsImgtopfileds')
            wx.removeStorageSync('roomArr')
            wx.removeStorageSync('coverImg')
            wx.removeStorageSync('roomType')
          }
        }
      })
    }
  },
  onShow: function () {
    var self = this;
    let replacelist = self.data.replacelist;
    let replacelist1 = wx.getStorageSync('replacelist');
    let goodsImgtopfileds = self.data.goodsImgtopfileds;
    let roomId = self.data.roomId;
    let replace_index = self.data.replace_index;
    let arrobj = [];
    for (let i in replacelist1) {
      arrobj.push(replacelist1[i]);
    }
    if (goodsImgtopfileds[roomId][replace_index].replace_goods == undefined) {
      goodsImgtopfileds[roomId][replace_index].replace_goods = arrobj;
    } else {
      for (let i in arrobj) {
        goodsImgtopfileds[roomId][replace_index].replace_goods.push(arrobj[i]);
      }
    }
    console.log(goodsImgtopfileds)
    self.setData({
      goodsImgtopfileds
    })
    // let arra = [];
    // for (let i in replacelist1) {
    //   arra.push(replacelist1[i]);
    // }
    // if (replacelist[self.data.replace_id] != undefined) {
    //   for (let i in arra) {
    //     replacelist[self.data.replace_id].push(arra[i]);
    //   }
    // } else {
    //   replacelist[self.data.replace_id] = arra;
    // }
    // delete replacelist.undefined
    // self.setData({
    //   replacelist
    // })
    if (this.data.newText !== "") {
      var arr = self.data.roomArr;
      var text = self.data.newText;
      arr.push(text);
      this.setData({
        roomArr: arr,
      })
    }
    let pricenum = 0;
    let num = 0;
    for (let i in self.data.goodsImgtopfileds[self.data.roomId]) {
      pricenum = Number(pricenum) + Number(self.data.goodsImgtopfileds[self.data.roomId][i].original_price * self.data.goodsImgtopfileds[self.data.roomId][i].number)
      num = Number(num) + Number(self.data.goodsImgtopfileds[self.data.roomId][i].number)
    }
    self.setData({
      pricenum: Math.floor(pricenum * 100) / 100,
      numa: num
    })
    // 
  },
  //跳转到商品详情
  linkGoods: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/commodityDetail/commodityDetail?id=" + id
    })
  },
  getList: function () {
    var _this = this;
    getApp().request({
      url: getApp().api.styleList,
      method: "post",
      success: function (e) {
        if (e.code === 1) {
          var styleArr = _this.data.styleArr;
          var newArr = e.data.list;
          if (styleArr.length > 0) {
            _this.setData({
              styleArr: styleArr
            })
          } else {
            _this.setData({
              styleArr: e.data.list
            })
          }
        } else {
          wx.showToast({
            title: '错误!',
          })
        }
      },
      fail: function (e) {}
    });
    getApp().request({
      url: getApp().api.roomList,
      method: "post",
      success: function (e) {
        if (e.code === 1) {
          var roomArr = _this.data.roomArr;
          var newArr = e.data.list;
          if (roomArr.length > 0) {
            for (let i = 0; i < roomArr.length; i++) {
              newArr[i] = roomArr[i]
            }
            _this.setData({
              roomArr: newArr
            })
          } else {
            _this.setData({
              roomArr: e.data.list
            })
          }
          if (_this.data.collect == 1) {
            let arr = wx.getStorageSync('list_');
            var list = {};
            var arr2 = [];
            for (let i in arr) {
              for (let j in arr[i]) {
                if (arr[i][j].choose == true) {
                  arr2.push(arr[i][j])
                }
              }
              if (arr2.length > 0) {
                list[i] = arr2
                arr2 = [];
              }
            }
            _this.setData({
              goodsImgtopfileds: list
            })
            var roomtype = [];
            for (let i in _this.data.roomArr) {
              for (let j in list) {
                if (j === _this.data.roomArr[i].id) {
                  _this.data.roomArr[i].check = !(_this.data.roomArr[i].check);
                  roomtype.push(_this.data.roomArr[i]);
                }
              }
            }
            var roomType = [];
            roomtype.forEach(function (v, k) {
              if (v.check) {
                var info = {
                  id: v.id,
                  room: v.name,
                  user_id: v.user_id
                }
                roomType.push(info);
              }
            })
            _this.setData({
              roomArr: _this.data.roomArr,
              roomType: roomType
            })
          }
        } else {
          wx.showToast({
            title: '错误!',
          })
        }
      },
      fail: function (e) {}
    });
  },
  //添加自定义选项
  addRoom: function (value) {
    var self = this;
    self.setData({
      newText: value
    })
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if (prevPage.data.newText !== "") {
      var arr = prevPage.data.roomArr;
      var arr2 = prevPage.data.roomIndex;
      var text = prevPage.data.newText;
      var newtext = {
        room: text
      };
      var newsureid = {
        sureid: true
      };
      arr.push(newtext);
      arr2.push(newsureid)
      self.setData({
        roomArr: arr,
        roomIndex: arr2,
      })
    }
  },
  //图片区域
  chooseFirst: function (e) {
    this.setData({
      num: -1,
      roomId: '',
      replace: false
    })
  },
  chooseRoom: function (e) {
    let that = this;
    that.setData({
      roomItem: e.currentTarget.dataset.item.room,
      roomId: e.currentTarget.dataset.roomid,
      num: e.currentTarget.dataset.id,
      curIndex: e.currentTarget.dataset.id,
      user_id: e.currentTarget.dataset.user_id,
    })
    let pricenum = 0;
    let num = 0;
    for (let i in that.data.goodsImgtopfileds[e.currentTarget.dataset.roomid]) {
      pricenum = Number(pricenum) + Number(that.data.goodsImgtopfileds[e.currentTarget.dataset.roomid][i].original_price * that.data.goodsImgtopfileds[e.currentTarget.dataset.roomid][i].number)
      num = Number(num) + Number(that.data.goodsImgtopfileds[e.currentTarget.dataset.roomid][i].number)
    }
    that.setData({
      pricenum: Math.floor(pricenum * 100) / 100,
      numa: num,
      replace: false
    })
  },
  /* 删除已选择的图片 */
  delImg: function (e) {
    let index = e.target.dataset.index;
    let imgArr = this.data.preImgsAbout;
    imgArr.splice(index, 1);
    this.setData({
      preImgsAbout: imgArr
    })
  },
  //标题
  input1: function (e) {
    var value = e.detail.value
    this.setData({
      groupTitle: value
    })
  },
  //总价
  input2: function (e) {
    var value = e.detail.value
    this.setData({
      totalPrice: value
    })
  },
  linkWarehouse: function () {
    var goodsImgtopfileds = this.data.goodsImgtopfileds;
    var roomId = this.data.roomId;
    if (this.data.user_id == 0) {
      wx.navigateTo({
        url: "/pages1/productWarehouse1/productWarehouse1?merchant=" + this.data.merchant + '&room=' + this.data.roomItem
      })
    } else {
      wx.navigateTo({
        url: "/pages1/productWarehouse1/productWarehouse1?merchant=" + this.data.merchant + '&room=空'
      })
    }
    this.setData({
      replacenum: 2
    })
  },
  isChoose3: function (e) {
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    let id = e.currentTarget.dataset.id;
    let roomArr = this.data.roomArr;
    if (name === this.data.roomItem) {
      this.setData({
        num: -1
      })
    }
    if (this.data.goodsImgtopfileds[id] == undefined) {
      roomArr[index].check = !(roomArr[index].check);
      this.setData({
        roomArr: roomArr
      });
    } else {
      if (this.data.goodsImgtopfileds[id].length == 0) {
        roomArr[index].check = !(roomArr[index].check);
        this.setData({
          roomArr: roomArr
        });
      } else {
        wx.showToast({
          title: '空间含有商品',
          icon: 'none'
        })
      }
    }
    var roomType = [];
    roomArr.forEach(function (v, k) {
      if (v.check) {
        var info = {
          id: v.id,
          room: v.name,
          user_id: v.user_id
        }
        roomType.push(info);
      }
    })
    this.setData({
      roomType: roomType,
    })
  },
  //选择风格
  isChoose1: function (e) {
    let index = e.currentTarget.dataset.index;
    var styleArr = this.data.styleArr;
    styleArr[index].checked = !(styleArr[index].checked);
    this.setData({
      styleArr: styleArr
    })
  },
  //选择空间
  isChoose2: function (e) {
    let index = e.currentTarget.dataset.roomindex; //当前点击元素的自定义数据，这个很关键
    let sureid = e.currentTarget.dataset.sureid;
    let roomItem = e.currentTarget.dataset.item;
    let roomIndex = this.data.roomIndex; //取到data里的styleIndex
    roomIndex[index].sureid = !roomIndex[index].sureid; //点击就赋相反的值
    this.setData({
      roomIndex: roomIndex //将已改变属性的json数组更新
    })
    if (sureid == false) {
      let arr = this.data.roomChoose;
      arr.push(roomItem);
      this.setData({
        roomChoose: arr
      })
    } else if (sureid == true) {
      let index = e.currentTarget.dataset.roomindex;
      let imgArr = this.data.roomChoose;
      imgArr.splice(index, 1);
      this.setData({
        roomChoose: imgArr
      })
    }
    var roomType = [];
    this.data.roomChoose.forEach(function (v, k) {
      var info = {
        id: k,
        room: v,
        user_id: v.user_id
      }
      roomType.push(info);
    })
    this.setData({
      roomType: roomType
    })
  },
  /* 图片上传选择作品库 */
  uploadImg1: function (e) {
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
      },
      fail: (res) => {
        wx.navigateTo({
          url: "/pages1/chooseProduct/chooseProduct"
        })
      }
    })
  },
  /* 图片上传 */
  uploadImg: function (e) {
    let that = this;
    that.setData({
      zhe: !that.data.zhe
    })
    let num = e.currentTarget.dataset.num;
    let flag = e.currentTarget.dataset.flag;
    let preImgsAbout = this.data.preImgsAbout;
    var count = num == 5 ? num - preImgsAbout.length : num
    if (flag === 'cover') {
      count = 1;
    }
    wx.chooseImage({
      count: count, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
  uploadimgs: function (data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.showLoading({
      mask: true,
      title: '已上传' + success + "/" + data.path.length + "张",
    })
    let flag = data.flag;
    var preImgtopfileds = that.data.preImgtopfileds;
    var coverImg = that.data.coverImg;
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
        if (result.code == 0) {
          success++; //图片上传成功，图片上传成功的变量+1
          if (flag == 'top') {
            var roomItem = preImgtopfileds[that.data.roomId];
            if (!roomItem) {
              preImgtopfileds[that.data.roomId] = []
              roomItem = preImgtopfileds[that.data.roomId];
            }
            preImgtopfileds[that.data.roomId].push({
              preImgtop: result.data.url,
              preImgtopId: result.data.id
            });
            that.setData({
              preImgtopfileds: preImgtopfileds
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
          } else if (flag == 'cover') {
            coverImg = result.data.url;
            that.setData({
              coverImg: coverImg
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

  //点击确认保存
  saveGroupMsg: function (e) {
    var t = this,
      value;
    var pages = getCurrentPages();
    var curpage = pages[pages.length - 1];
    var roomChooseid = [];
    this.data.roomArr.forEach(function (v) {
      if (v.check) {
        roomChooseid.push(v.id);
      }
    });
    var preImgtopfileds = this.data.preImgtopfileds;
    var goodsImgtopfileds = this.data.goodsImgtopfileds;
    var images = [];
    var goods = [];
    roomChooseid.forEach(function (v) {
      if (preImgtopfileds[v]) {
        preImgtopfileds[v].forEach(function (v2) {
          var newinfo = {
            room: v,
            id: v2.preImgtopId
          }
          images.push(newinfo);
        })
      }
      if (goodsImgtopfileds[v]) {
        goodsImgtopfileds[v].forEach(function (v2) {
          var newinfo = {
            room: v,
            id: v2.id,
            number: v2.number,
            price: v2.original_price,
            attr: v2.attr,
            size: v2.size,
            replace_goods: v2.replace_goods
          }
          goods.push(newinfo);
        })
      }
    });

    var styleChoose = [];
    var styleArr = this.data.styleArr.forEach(function (v) {
      if (v.checked) {
        styleChoose.push(v.id);
      }
    })
    var replace_goods = [];
    for (let i in this.data.replacelist) {
      for (let j in this.data.replacelist[i]) {
        this.data.replacelist[i][j].price = this.data.replacelist[i][j].original_price;
        replace_goods.push(this.data.replacelist[i][j])
      }
    }

    if (t.data.merchant != 1) {
      var _d = {
        description: t.data.description,
        cover_img: t.data.coverImg,
        name: t.data.groupTitle,
        amount: t.data.totalPrice,
        style: JSON.stringify(styleChoose),
        room: JSON.stringify(roomChooseid),
        images: JSON.stringify(images),
        goods: JSON.stringify(goods),
        replace_goods: JSON.stringify(replace_goods)
      };
    } else {
      var _d = {
        description: t.data.description,
        cover_img: t.data.coverImg,
        name: t.data.groupTitle,
        amount: t.data.totalPrice,
        style: JSON.stringify(styleChoose),
        room: JSON.stringify(roomChooseid),
        images: JSON.stringify(images),
        goods: JSON.stringify(goods),
        is_merchant: 1,
        has_copy: t.data.copy,
        replace_goods: JSON.stringify(replace_goods)
      };
    }


    if (t.data.merchant == 1) {
      if (!_d.name) {
        wx.showToast({
          title: '请输入套餐名称',
          icon: "none"
        })
        return;
      }
      if (!_d.amount) {
        wx.showToast({
          title: '请输入套餐总价',
          icon: "none"
        })
        return;
      }
      if (_d.style == "[]") {
        wx.showToast({
          title: '请选择套餐风格',
          icon: "none"
        })
        return;
      }
      if (!_d.cover_img) {
        wx.showToast({
          title: '请上传封面图',
          icon: "none"
        })
        return;
      }

    } else {
      if (!_d.name) {
        wx.showToast({
          title: '请输入套餐名称',
          icon: "none"
        })
        return;
      }
      if (!_d.amount) {
        wx.showToast({
          title: '请输入套餐总价',
          icon: "none"
        })
        return;
      }
      if (_d.style == "[]") {
        wx.showToast({
          title: '请选择套餐风格',
          icon: "none"
        })
        return;
      }
      if (!_d.cover_img) {
        wx.showToast({
          title: '请上传封面图',
          icon: "none"
        })
        return;
      }
    }
    console.log(_d);
    // return;
    getApp().request({
      url: getApp().api.saveGroup,
      method: "post",
      data: _d,
      success: function (e) {
        if (e.code == 1) {
          wx.showToast({
            title: e.msg,
            icon: "none"
          })
          return;
        }
        wx.showToast({
          title: '添加成功',
        })
        wx.removeStorageSync('styleArr')
        wx.removeStorageSync('groupTitle')
        wx.removeStorageSync('totalPrice')
        wx.removeStorageSync('preImgtopfileds')
        wx.removeStorageSync('goodsImgtopfileds')
        wx.removeStorageSync('roomArr')
        wx.removeStorageSync('coverImg')
        wx.removeStorageSync('roomType')
        t.setData({
          styleArr: [],
          coverImg: '',
          roomType: '',
          roomArr: [],
          groupTitle: '',
          totalPrice: '',
          preImgtopfileds: {},
          goodsImgtopfileds: {}
        })
        let obj = wx.getStorageSync('list_')
        var list = {};
        var arr2 = [];
        for (let i in obj) {
          for (let j in obj[i]) {
            if (obj[i][j].choose == false) {
              arr2.push(obj[i][j])
            }
          }
          if (arr2.length > 0) {
            list[i] = arr2
            arr2 = [];
          }
        }
        wx.setStorageSync('list_', list)
        wx.removeStorageSync('roomid')
        setTimeout(function () {
          if (t.data.collect == 1) {
            wx.switchTab({
              url: '/pages1/homePage/homePage',
            })
          } else {
            wx.navigateBack({

            })
          }
        }, 500)


      },
      fail: function (e) {}
    });
  },
  preImgcancel(e) { //效果图片取消
    var preImgtopfileds = this.data.preImgtopfileds;
    var roomId = this.data.roomId;
    var index = e.currentTarget.dataset.index;
    preImgtopfileds[roomId].splice(index, 1);
    this.setData({
      preImgtopfileds: preImgtopfileds
    });
  },
  goodsImgcancel(e) { //产品图片取消
    var goodsImgtopfileds = this.data.goodsImgtopfileds;
    var roomId = this.data.roomId;
    var index = e.currentTarget.dataset.index;
    goodsImgtopfileds[roomId].splice(index, 1);
    let pricenum = 0;
    let num = 0;
    for (let i in goodsImgtopfileds[roomId]) {
      pricenum = Number(pricenum) + Number(goodsImgtopfileds[roomId][i].original_price * goodsImgtopfileds[roomId][i].number)
      num = Number(num) + Number(goodsImgtopfileds[roomId][i].number)
    }
    this.setData({
      goodsImgtopfileds: goodsImgtopfileds,
      pricenum: Math.floor(pricenum * 100) / 100,
      numa: num
    });
  },
  workspic(e) { //作品库选择
    wx.navigateTo({
      url: "/pages1/chooseProduct/chooseProduct"
    })
  },
  albumpic(e) { //相册选择
    console.log(e)
    var param = e.detail;
    let num = parseInt(param.num);
    let flag = param.flag;
    let preImgsAbout = this.data.preImgsAbout;
    let imglist = this.data.preImgtopfileds[this.data.roomId];
    var len = 0;
    if (imglist) {
      len = imglist.length;
    }
    if (len === num) {
      return wx.showToast({
        title: '最多允许' + num + '张'
      })
    }
    wx.chooseImage({
      count: num - len, // 默认num - len张
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
  jvshi(e) {
    let id = e.currentTarget.dataset.index
    this.setData({
      js_index: id,
      room: e.currentTarget.dataset.id
    })
  },
  // 是否可复制胶囊按钮
  switch2Change(e) {
    let that = this;
    let copy = e.detail.value;
    if (copy == true) {
      var copyitem = 1
    } else {
      var copyitem = 0
    }
    that.setData({
      copy: copyitem
    })
  },
  diy() {
    let that = this;
    var arr = [];
    for (let i = 0; i < that.data.roomArr.length; i++) {
      arr.push(that.data.roomArr[i].name)
    }
    wx.navigateTo({
      url: '/pages1/makeSelfText2/makeSelfText2?roomArr=' + arr,
    })
  },
  del(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id
    getApp().request({
      url: getApp().api.delroom,
      method: "post",
      data: {
        id: id
      },
      success: function (res) {},
    });
    var roomlist = _this.data.roomArr;
    for (let i = 0; i < roomlist.length; i++) {
      if (roomlist[i].id == id) {
        roomlist.splice(i, 1)
      }
    }
    _this.setData({
      roomArr: roomlist
    })
  },
  zhe() {
    this.setData({
      zhe: true
    })
  },
  showzhe() {
    this.setData({
      zhe: !this.data.zhe,
    })
  },
  shop() {
    let that = this;
    var arr = [];
    for (let i in that.data.goodsImgtopfileds) {
      for (let j in that.data.goodsImgtopfileds[i]) {
        let img = that.data.goodsImgtopfileds[i][j].pic_url;
        arr.push(img)
      }
    }
    var arr2 = [];
    for (let q in arr) {
      if (arr2.indexOf(arr[q]) == -1) {
        arr2.push(arr[q]);
      }
    }
    that.setData({
      imgarr: arr2,
      shopimg: false,
      zhe: true
    })
  },
  shopzhe() {
    this.setData({
      shopimg: true
    })
  },
  // 选择商品图做封面图
  chooseimg(e) {
    if (this.data.roomId == '') {
      this.setData({
        coverImg: e.currentTarget.dataset.img
      })
    } else {
      let roomid = this.data.roomId;
      let imgarr = this.data.preImgtopfileds[roomid];
    }
  },
  myCatchTouch: function () {
    return;
  },
  onUnload: function () {
    let that = this;
    if (that.data.groupTitle == '' && that.data.totalPrice == '' && that.data.preImgtopfileds.length < 0 && that.data.goodsImgtopfileds.length < 0 && that.data.styleArr.length < 0 && that.data.roomArr.length && that.data.coverImg == '') {
      wx.removeStorageSync('styleArr')
      wx.removeStorageSync('groupTitle')
      wx.removeStorageSync('totalPrice')
      wx.removeStorageSync('preImgtopfileds')
      wx.removeStorageSync('goodsImgtopfileds')
      wx.removeStorageSync('roomArr')
      wx.removeStorageSync('coverImg')
    } else {
      for (let i = 0; i < that.data.styleArr.length; i++) {
        if (that.data.styleArr[i].checked) {
          wx.setStorageSync('styleArr', that.data.styleArr)
          wx.setStorageSync('groupTitle', that.data.groupTitle)
          wx.setStorageSync('totalPrice', that.data.totalPrice)
          wx.setStorageSync('preImgtopfileds', that.data.preImgtopfileds)
          wx.setStorageSync('goodsImgtopfileds', that.data.goodsImgtopfileds)
          wx.setStorageSync('roomArr', that.data.roomArr)
          wx.setStorageSync('coverImg', that.data.coverImg)
          wx.setStorageSync('roomType', that.data.roomType)
          return;
        }
      }
      // 
      for (let i = 0; i < that.data.roomArr.length; i++) {
        if (that.data.roomArr[i].checked) {
          wx.setStorageSync('styleArr', that.data.styleArr)
          wx.setStorageSync('groupTitle', that.data.groupTitle)
          wx.setStorageSync('totalPrice', that.data.totalPrice)
          wx.setStorageSync('preImgtopfileds', that.data.preImgtopfileds)
          wx.setStorageSync('goodsImgtopfileds', that.data.goodsImgtopfileds)
          wx.setStorageSync('roomArr', that.data.roomArr)
          wx.setStorageSync('coverImg', that.data.coverImg)
          wx.setStorageSync('roomType', that.data.roomType)
          return;
        }
      }
    }
  },
  replace(e) {
    this.setData({
      replace: !this.data.replace,
      replace_id: e.currentTarget.dataset.id,
      replace_index: e.currentTarget.dataset.index,
      cat_id: e.currentTarget.dataset.cat_id,
      textarea: !this.data.textarea
    })
  },
  replace_zhe() {
    this.setData({
      replace: !this.data.replace,
      textarea: !this.data.textarea
    })
  },
  linkWarehouse2() {
    let that = this;
    that.setData({
      replacenum: 1
    })
    wx.navigateTo({
      url: "/pages1/productWarehouse1/productWarehouse1?cat_id=" + that.data.cat_id
    })
  },
  replace_del(e) {
    // 
    let that = this;
    let goodsImgtopfileds = that.data.goodsImgtopfileds;
    let roomId = that.data.roomId;
    let replace_index = that.data.replace_index;
    let index = e.currentTarget.dataset.index;
    goodsImgtopfileds[roomId][replace_index].replace_goods.splice(index, 1)
    that.setData({
      goodsImgtopfileds
    })
  },
  textarea(e) {
    this.setData({
      description: e.detail.value
    })
  }
})