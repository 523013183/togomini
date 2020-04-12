// pages1/integral/integral.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    share:false,
    icon:["http://oss.diywoju.com/web/uploads/image/store_1/f32d6031a1f478b1cbbe28ca9c00a4f51edab1e3.png",'http://oss.diywoju.com/web/uploads/image/store_1/87c1cf144ad0ca42e30bc0d23c6408de6abe0751.png','http://oss.diywoju.com/web/uploads/image/store_1/8fe3e05f7ee325f0af7ba3ab18b1de6d86d7dab2.png','http://oss.diywoju.com/web/uploads/image/store_1/1c4589676284542052d161542c089f3359d8f440.png'],
    list:[],//兑换商品列表
    lunbo:[],
  },
  onShow(){
    this.setData({
      share:false,
      shareimg:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.index();
  },
  gotodetail(e){
    wx.navigateTo({
      url: '/pages1/shop_detail/shop_detail?id='+e.currentTarget.dataset.id,
    })
  },
  index(){
    let that = this;
    app.request({
      url:app.api.integral.index,
      method:"GET",
      success(res){
        let list = [];
        res.data.goods_list.forEach((item,index) => {
          item.goods.forEach((item2,index2) =>{
            list.push(item2)
          })
        });
        that.setData({
          list,
          lunbo:res.data.banner_list
        })
      }
    })
  },
  onShareAppMessage: function(e) {
    // if (e.from == 'menu') {
      return {
        title: wx.getStorageSync('user_name') + '邀请您注册!',
        path: '/pages1/login/login?user_id=' + wx.getStorageSync('USER_INFO').id,
        imageUrl: 'http://oss.diywoju.com/web/uploads/image/store_1/34ca4ce9342997592c241f6ed86e02c9ffb845dc.jpg'
      }
    // }
  },
  share(){
    this.setData({
      share:!this.data.share
    })
  },
  // 邀请码
  bg() {
    wx.showLoading({
      title: '',
      icon: 'none'
    })
    let that = this;
    that.setData({
      share:false
    })
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
          shareimg: true
        })
      }
    });
  },
  hideimg(){
    this.setData({
      shareimg:!this.data.shareimg
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
            share: false,
            shareimg:false
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
})