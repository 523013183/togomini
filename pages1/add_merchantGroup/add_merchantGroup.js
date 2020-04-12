// pages1/add_merchantGroup/add_merchantGroup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 上传图容量切换
  chooseFirst(e){
    let id = e.currentTarget.dataset.id;
    console.log(e)
    let that = this;
    that.setData({
      num:id
    })
  },
  /* 图片上传 */
  uploadImg: function (e) {
    let type = e.currentTarget.dataset.type;
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
          type:type
        })

      },
    })
  },
  /* 图片上传 */
  uploadimgs: function (data) {
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
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
      name: 'file',//这里根据自己的实际情况改
      formData: {	//这里是上传图片时一起上传的数据
        minapp: 'weixinminapp'
      },
      success: (resp) => {
        console.log("上传的图片0",resp)
        let result = resp.data ? JSON.parse(resp.data) : { code: 0 };
        if (result.code == 0) {
          success++;//图片上传成功，图片上传成功的变量+1
          if (flag == 'top') {
            //  this.setData({
            //    preImgtop: result.data.url
            //  })
            //  this.setData({
            //    preImgtopId: result.data.id
            //  });
            var roomItem = preImgtopfileds[that.data.roomId];
            if (!roomItem) {
              preImgtopfileds[that.data.roomId] = []
              roomItem = preImgtopfileds[that.data.roomId];
            }
            //var roomItem = that.data.roomItem;
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
            if(data.type == 1){
              that.setData({
                coverImg: coverImg
              })
            }else{
              that.setData({
                coverImg2: coverImg
              })
            }
          }
        } else {
          fail++; //图片上传失败，图片上传失败的变量+1
          console.log('fail:' + i + "fail:" + fail);
        }
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
      },
      complete: () => {
        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用
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

        } else {	//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimgs(data);
        }

      }
    });
  },
})