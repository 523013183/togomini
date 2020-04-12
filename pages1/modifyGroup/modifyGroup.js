const app = getApp();

Page({
  data: {
    textarea: true,
    description: "",
    cat_id: '',
    replacelist: {},
    replacenum: '',
    replace: false,
    isScroll: true,
    shopimg: true,
    zhe: true,
    copy: 0,
    index_jvshi: '',
    albumpnum: 4, //效果图最大上传图片
    goodsnum: 6, //商品图最大图片数
    roomId: "",
    groupTitle: "", //标题
    totalPrice: "", //价格
    preImgtopfileds: {}, //商品封面
    coverImg: "",
    resultData: {},
    goodsImgtopfileds: {}, //商品
    styleArr: [], //风格
    selectIndex: [],
    roomArr: [], //装载
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
    roomType: [],
    roomItem: "",
    roomItems: [],
    num: -1,
    curIndex: "",
    preImgsAbout: [], // 上传活动相关图片，最多5张；
    preImgsAboutId: [], //上传活动相关图片，最多5张Id；
    newText: "",
  },
  onLoad: function (option) {
    this.data.option = option;
    this.setData({
      option: option,
      shop: option.shop,
      is_merchant: wx.getStorageSync('is_merchant')
    })
    var id = this.data.option.id;
    this.getList(id);
  },
  onShow() {
    var that = this;
    let replacelist = that.data.replacelist;
    let goodsImgtopfileds = that.data.goodsImgtopfileds;
    let roomId = that.data.roomId;
    let replace_index = that.data.replace_index;
    let replacelist1 = wx.getStorageSync('replacelist');
    let arr = [];
    for (let i in replacelist1) {
      arr.push(replacelist1[i]);
    }
    if (goodsImgtopfileds[roomId][replace_index].replace_goods == undefined) {
      goodsImgtopfileds[roomId][replace_index].replace_goods = arr;
    }else{
      for(let i in arr){
        goodsImgtopfileds[roomId][replace_index].replace_goods.push(arr[i]);
      }
    }
    console.log(goodsImgtopfileds, replacelist1)
    that.setData({
      goodsImgtopfileds
    })
    getApp().request({
      url: getApp().api.roomList,
      method: "post",
      success: function (e) {
        if (e.code === 1) {
          var roomArr = that.data.roomArr;
          var newArr = e.data.list;
          if (roomArr.length > 0) {
            for (let i = 0; i < roomArr.length; i++) {
              newArr[i] = roomArr[i]
            }
            that.setData({
              roomArr: newArr,
              roomArrFlag: true
            })
          } else {
            that.setData({
              roomArr: e.data.list,
              roomArrFlag: true
            })
          }
        } else {
          wx.showToast({
            title: '错误!',
          })
        }
      },
      fail: function (e) {
        console.log(e);
      }
    });
  },

  getList: function (id) {
    var _this = this;
    getApp().request({
      url: getApp().api.styleList,
      method: "post",
      success: function (e) {
        console.log("获取styleList的数据 e：", e);
        if (e.code === 1) {
          var styleArr = _this.data.styleArr;
          var newArr = e.data.list;
          if (styleArr.length > 0) {
            _this.setData({
              styleArr: styleArr,
              styleArrFlag: true
            })
          } else {
            _this.setData({
              styleArr: e.data.list,
              styleArrFlag: true
            })
          }
        } else {
          wx.showToast({
            title: '错误!',
          })
        }
      },
      fail: function (e) {
        console.log(e);
      }
    });
    getApp().request({
      url: getApp().api.roomList,
      method: "post",
      success: function (e) {
        console.log("获取roomList的数据 e：", e);
        if (e.code === 1) {
          var roomArr = _this.data.roomArr;
          var newArr = e.data.list;
          if (roomArr.length > 0) {
            for (let i = 0; i < roomArr.length; i++) {
              newArr[i] = roomArr[i]
            }
            _this.setData({
              roomArr: newArr,
              roomArrFlag: true
            })
          } else {
            _this.setData({
              roomArr: e.data.list,
              roomArrFlag: true
            })
          }
        } else {
          wx.showToast({
            title: '错误!',
          })
        }
      },
      fail: function (e) {
        console.log(e);
      }
    });
    var timed = setInterval(function () {
      if (_this.data.styleArrFlag && _this.data.roomArrFlag) {
        _this.getInfo(id);
        clearInterval(timed)
      }
    }, 30)
  },

  getInfo: function (id) {
    var _this = this;
    //获取套餐详情
    getApp().request({
      url: getApp().api.groupDetail,
      method: "post",
      data: {
        id: id
      },
      success: function (res) {
        console.log("获取套餐详情 res：", res);
        var obj = {
          groupTitle: res.name,
          totalPrice: parseInt(res.amount),
          coverImg: res.cover_img,
          styleArr: res.style,
          roomArr: res.room,
          copy: res.has_copy,
          room: res.room,
          description: res.description
        };

        var styleArr = _this.data.styleArr;

        var objstyleArr = obj.styleArr;
        styleArr.forEach(function (v) {
          var id = v.id;
          objstyleArr.forEach(function (v2) {
            if (v2.id === id) {
              v.checked = true;
            }
          })
        });
        obj.styleArr = styleArr;

        var roomArr = _this.data.roomArr;

        var objroomArr = obj.roomArr;
        roomArr.forEach(function (v) {
          var id = v.id;
          objroomArr.forEach(function (v2) {
            if (v2.id === id) {
              v.check = true;
              v.count = v2.count
            }
          })
        });
        obj.roomArr = roomArr;
        var roomType = [];
        roomArr.forEach(function (v, k) {
          if (v.check) {
            var info = {
              id: v.id,
              room: v.name,
              count: v.count,
              user_id: v.user_id
            }
            roomType.push(info);
          }
        })
        // 用户
        var roomType2 = [];
        for (let i of roomType) {
          for (let j = 0; j < objroomArr.length; j++) {
            if (i.id != objroomArr[j].id) {
              var info = {
                id: objroomArr[j].id,
                room: objroomArr[j].name,
                count: objroomArr[j].count,
                user_id: objroomArr[j].user_id
              }
              roomType2.push(info)
            }
          }
        }
        for (let i in roomType2) {
          roomType.push(roomType2[i])
        }
        const objb = {}
        const newObjArr = []
        for (let i = 0; i < roomType.length; i++) {
          if (!objb[roomType[i].id]) {
            newObjArr.push(roomType[i]);
            objb[roomType[i].id] = true
          }
        }
        obj.roomType = newObjArr;
        var preImgtopfileds = _this.data.preImgtopfileds;
        var imglist = res.opus;
        imglist.forEach(function (v) {
          if (!preImgtopfileds[v.room]) {
            preImgtopfileds[v.room] = [];
          }
          var info = {
            preImgtop: v.file_url,
            preImgtopId: v.image_id
          }
          preImgtopfileds[v.room].push(info);
        });
        obj.preImgtopfileds = preImgtopfileds;

        var goodsImgtopfileds = _this.data.goodsImgtopfileds;
        var goodslist = res.goods;
        var arr = [];
        var arr3 = [];
        goodslist.forEach(function (v) {
          if (!goodsImgtopfileds[v.room]) {
            goodsImgtopfileds[v.room] = [];
          }
          // 主商品
          if (v.parent_goods_id == 0) {
            var info = {
              original_price: v.original_price,
              cover_pic: v.cover_pic,
              number: v.number,
              id: v.goods_id ? v.goods_id : v.id,
              goods_id: v.id,
              attr: v.attr_id,
              size: v.size,
              material: v.material,
              cat_id: v.cat_id
            }
            arr3.push(v.id)
            goodsImgtopfileds[v.room].push(info);
          } else {
            // 替换商品
            var info2 = {
              original_price: v.original_price,
              cover_pic: v.cover_pic,
              number: v.number,
              id: v.id,
              attr: v.attr_id,
              size: v.size,
              material: v.material,
              price_type: v.price_type,
              parent_goods_id: v.parent_goods_id,
              replace_price: v.replace_price
            }
            arr.push(info2)
          }
        });
        let replacelist = _this.data.replacelist;
        for (let i in arr3) {
          let arr2 = [];
          let id = '';
          for (let j in arr) {
            if (arr3[i] == arr[j].parent_goods_id) {
              id = arr3[i];
              arr2.push(arr[j]);
            }
          }
          replacelist[id] = arr2;
        }
        let replace_goods = res.replace_goods;
        for (let i in goodsImgtopfileds) {
          goodsImgtopfileds[i].forEach((item, index) => {
            for (let j in replace_goods) {
              console.log(item)
              if (item.goods_id == j) {
                goodsImgtopfileds[i][index].replace_goods = [];
                for(let k in replace_goods[j]){
                  let obj = {
                    price_type:replace_goods[j][k].price_type,
                    replace_price:replace_goods[j][k].replace_price,
                    id:replace_goods[j][k].goods_id,
                    room:replace_goods[j][k].room,
                    attr:replace_goods[j][k].attr_id,
                    material:replace_goods[j][k].material,
                    original_price:replace_goods[j][k].original_price,
                    size:replace_goods[j][k].size,
                    cover_pic:replace_goods[j][k].cover_pic
                  }
                  goodsImgtopfileds[i][index].replace_goods.push(obj);
                }
              }
            }
          })
        }
        obj.replacelist = replacelist;
        obj.goodsImgtopfileds = goodsImgtopfileds;
        obj.groupid = res.id;
        console.log(obj)
        _this.setData(obj);
      }
    })
  },
  //添加自定义选项
  addRoom: function (value) {
    var self = this;
    console.log(value)
    self.setData({
      newText: value
    })
    let pages = getCurrentPages();
    console.log(pages);
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
      console.log(prevPage.data.roomArr)
      console.log(prevPage.data.roomIndex)
    }
  },
  //图片区域
  chooseFirst: function (e) {
    this.setData({
      num: -1,
      replace: false
    })
  },
  chooseRoom: function (e) {
    let that = this;
    console.log(that.data.roomType)
    that.setData({
      roomItem: e.currentTarget.dataset.item.room,
      roomId: e.currentTarget.dataset.roomid,
      num: e.currentTarget.dataset.id,
      curIndex: e.currentTarget.dataset.id,
      user_id: e.currentTarget.dataset.user_id
    })
    let countprice = that.countprice(that.data.goodsImgtopfileds[e.currentTarget.dataset.roomid]);
    that.setData({
      pricenum: Math.floor(countprice.pricenum * 100) / 100,
      numa: countprice.num,
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
    var json = {};
    let that = this;
    that.setData({
      replacenum: 2
    })
    if (this.data.user_id == 0) {
      wx.navigateTo({
        url: "/pages1/productWarehouse1/productWarehouse1?room=" + this.data.roomItem
      })
    } else {
      wx.navigateTo({
        url: "/pages1/productWarehouse1/productWarehouse1?room=空"
      })
    }

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
          count: v.count,
          user_id: v.user_id
        }
        roomType.push(info);
      }
    })

    const obj = {}
    const newObjArr = []
    for (let i = 0; i < roomType.length; i++) {
      if (!obj[roomType[i].id]) {
        newObjArr.push(roomType[i]);
        obj[roomType[i].id] = true
      }
    }
    this.setData({
      roomType: newObjArr,
      roomindex: index
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
    console.log(e)
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
    console.log(this.data.roomChoose, "123456")
    var roomType = [];
    this.data.roomChoose.forEach(function (v, k) {
      var info = {
        id: k,
        room: v
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
        console.log(tempFilePaths);
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
    this.setData({
      zhe: true
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
  /* 图片上传 */
  uploadimgs: function (data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
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
            console.log(this.data.preImgsAbout)
            console.log(this.data.preImgsAboutId)
          } else if (flag == 'cover') {
            coverImg = result.data.url;
            that.setData({
              coverImg: coverImg
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
            console.log(that.data.preImgtopfileds);
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
    var roomChoose = [];
    var roomChooseid = [];
    this.data.roomArr.forEach(function (v) {
      if (v.check) {
        roomChoose.push(v.name);
        roomChooseid.push(v.id);
      }
    });
    let arrid = [];
    for (let i in t.data.roomType) {
      arrid.push(t.data.roomType[i].id)
    }
    for (let j in arrid) {
      if (roomChooseid.indexOf(arrid[j]) == -1) {
        console.log(arrid[j])
        roomChooseid.push(arrid[j])
      }
    }
    var goodsImgtopfileds = this.data.goodsImgtopfileds;
    var preImgtopfileds = this.data.preImgtopfileds;
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
    });
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
          // console.log(v2)
          var newinfo = {
            room: v,
            id: v2.id,
            number: v2.number,
            price: v2.original_price,
            size: v2.size,
            attr: v2.attr,
            replace_goods: v2.replace_goods
          }
          goods.push(newinfo);
        })
      }
    });
    var styleChoose = [];
    this.data.styleArr.forEach(function (v) {
      if (v.checked) {
        styleChoose.push(v.id);
      }
    })

    // var replace_goods = [];
    // for (let i in this.data.replacelist) {
    //   for (let j in this.data.replacelist[i]) {
    //     this.data.replacelist[i][j].price = this.data.replacelist[i][j].original_price
    //     replace_goods.push(this.data.replacelist[i][j])
    //   }
    // }
    // console.log(this.data.replacelist)
    // console.log(replace_goods)
    if (wx.getStorageSync('is_merchant') == 1) {
      var _d = {
        id: this.data.groupid,
        cover_img: this.data.coverImg,
        name: t.data.groupTitle,
        amount: t.data.totalPrice,
        style: JSON.stringify(styleChoose),
        room: JSON.stringify(roomChooseid),
        images: JSON.stringify(images),
        goods: JSON.stringify(goods),
        is_merchant: 1,
        has_copy: t.data.copy,
        // replace_goods: JSON.stringify(replace_goods),
        description: t.data.description
      };
    } else {
      var _d = {
        id: this.data.groupid,
        cover_img: this.data.coverImg,
        name: t.data.groupTitle,
        amount: t.data.totalPrice,
        style: JSON.stringify(styleChoose),
        room: JSON.stringify(roomChooseid),
        images: JSON.stringify(images),
        goods: JSON.stringify(goods),
        // replace_goods: JSON.stringify(replace_goods),
        description: t.data.description
      };
    }
    if (!_d.name) {
      wx.showToast({
        title: '请输入套餐名称',
      })
      return;
    }
    if (!_d.amount) {
      wx.showToast({
        title: '请输入套餐总价',
      })
      return;
    }
    console.log("goods", goods)
    console.log("参数参数参数参数参数参数参数参数参数参数", _d)
    // return;
    getApp().request({
      url: getApp().api.saveGroup,
      method: "post",
      data: _d,
      success: function (e) {
        console.log("获取首页数据 e：", e);
        let pages = getCurrentPages(); //获取当前页面信息栈
        let prevPage = pages[pages.length - 2] //获取上一个页面信息栈
        if (prevPage.data.amount) {
          prevPage.index();
        }
        wx.navigateBack({

        })
      },
      fail: function (e) {
        console.log(e);
      }
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
    var id = e.currentTarget.dataset.id;
    var replacelist = this.data.replacelist;
    for (let i in replacelist) {
      if (i == id) {
        replacelist[i] = [];
        break;
      }
    }
    delete replacelist.id
    goodsImgtopfileds[roomId].splice(index, 1);
    let countprice = this.countprice(goodsImgtopfileds[roomId]);
    this.setData({
      goodsImgtopfileds: goodsImgtopfileds,
      pricenum: Math.floor(countprice.pricenum * 100) / 100,
      numa: countprice.num,
      replacelist
    });
  },
  workspic() { //作品库选择
    wx.navigateTo({
      url: "/pages1/chooseProduct/chooseProduct"
    })

  },
  albumpic(e) { //相册选择
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
  //跳转到商品详情
  linkGoods: function (e) {
    var self = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages1/commodityDetail/commodityDetail?id=" + id
    })
  },
  isChoose4(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    that.setData({
      index_jvshi: id
    })
  },
  // 是否可复制胶囊按钮
  switch2Change(e) {
    console.log(this.data.goodsImgtopfileds)
    let copy = e.detail.value;
    if (copy == true) {
      var copyitem = 1
    } else {
      var copyitem = 0
    }
    console.log(copyitem)
    let that = this;
    that.setData({
      copy: copyitem
    })
  },
  make_self() {
    let that = this;
    var arr = [];
    for (let i = 0; i < that.data.roomArr.length; i++) {
      // console.log(that.data.roomArr[i])
      arr.push(that.data.roomArr[i].name)
    }
    console.log(arr)
    wx.navigateTo({
      url: '/pages1/makeSelfText2/makeSelfText2?roomArr=' + arr,
    })
  },
  del(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id
    console.log(e.currentTarget.dataset.id)
    getApp().request({
      url: getApp().api.delroom,
      method: "post",
      data: {
        id: id
      },
      success: function (res) {
        console.log("删除空间", res);
      },
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
    console.log("aaaaaaaaaaaaaaa", that.data.goodsImgtopfileds)
    var arr = [];
    for (let i in that.data.goodsImgtopfileds) {
      for (let j in that.data.goodsImgtopfileds[i]) {
        var img = '';
        if (that.data.goodsImgtopfileds[i][j].cover_pic == undefined) {
          img = that.data.goodsImgtopfileds[i][j].pic_url;
        } else {
          img = that.data.goodsImgtopfileds[i][j].cover_pic;
        }
        arr.push(img)
      }
    }
    var arr2 = [];
    for (let q in arr) {
      console.log(arr)
      if (arr2.indexOf(arr[q]) == -1) {
        arr2.push(arr[q]);
      }
    }
    that.setData({
      imgarr: arr2,
      shopimg: false,
      zhe: true
    })
    console.log(arr2)
  },
  shopzhe() {
    this.setData({
      shopimg: true
    })
  },
  // 选择商品图做封面图
  chooseimg(e) {
    console.log(e.currentTarget.dataset.img)
    this.setData({
      coverImg: e.currentTarget.dataset.img
    })
  },
  myCatchTouch: function () {
    console.log('stop user scroll it!');
    return;
  },
  del_room(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let roomid = e.currentTarget.dataset.roomid;
    let goodsImgtopfileds = that.data.goodsImgtopfileds;
    let roomType = that.data.roomType;
    let roomArr = that.data.roomArr;
    console.log(roomType)
    if (goodsImgtopfileds[roomid] != undefined) {
      wx.showModal({
        title: '提醒',
        content: '此空间里含有商品，是否删除？',
        success(res) {
          if (res.confirm) {
            for (let i = 0; i < roomArr.length; i++) {
              if (roomArr[i].id == roomid) {
                roomArr[i].check = !roomArr[i].check
              }
            }
            delete goodsImgtopfileds[roomid]
            console.log('用户点击确定', roomArr, goodsImgtopfileds)
            roomType.splice(index, 1)
            that.setData({
              roomType: roomType,
              num: -1,
              roomArr: roomArr,
              goodsImgtopfileds: goodsImgtopfileds
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      roomType.splice(index, 1)
      for (let i = 0; i < roomArr.length; i++) {
        if (roomArr[i].id == roomid) {
          roomArr[i].check = !roomArr[i].check
        }
      }
      that.setData({
        roomType: roomType,
        num: -1,
        roomArr: roomArr
      })
    }
  },
  replace(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      replace: !this.data.replace,
      replace_id: e.currentTarget.dataset.id, //替换的id
      replace_index: e.currentTarget.dataset.index, //替换的index
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
  },
  countprice(obj) {
    let pricenum = 0;
    let num = 0;
    for (let i in obj) {
      pricenum = Number(pricenum) + Number(obj[i].original_price * obj[i].number)
      num = Number(num) + Number(obj[i].number)
    }
    let price = {
      pricenum,
      num
    }
    console.log(price)
    return price;
  }
})