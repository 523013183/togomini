const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data: '',
    index: '',
    length: '',
    progress:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.index(options.id);
  },
  open(e) {
    let index = e.currentTarget.dataset.index;
    let list = this.data.data;
    list.log[index].open = !list.log[index].open;
    this.setData({
      data: list
    })
  },
  index(id) {
    let that = this;
    app.request({
      url: app.api.orderdetail,
      method: 'POST',
      data: {
        id
      },
      success(res) {
        console.log(res)
        if (res.code == 0) {
          let length = [];
          for (let i in res.data.info.status_list) {
            length.push(i)
          }
          that.setData({
            length,
            index: res.data.info.status,
            data: res.data
          })
        } else {
          wx.showToast({
            title: '系统出错',
            icon: 'none'
          })
        }
      }
    })
  },
  pdf(e) {
    let that = this;
    const downloadTask = wx.downloadFile({
      url: e.currentTarget.dataset.pdf.replace('http', 'https'),
      success: function (res) {
        console.log(res)
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          success: function (res) {
            wx.hideLoading({})
            console.log('打开成功');
          }
        })
      },
      fail: function (res) {
        console.log(res);
      }
    })
    downloadTask.onProgressUpdate((res) =>{
      console.log(res)
      wx.showLoading({
        title: ""+res.progress+"%",
        mask:true
      })
    })
  },
  choosestatus(e) {
    let id = e.currentTarget.dataset.id;
    this.setData({
      index: id
    })
  },
  packagedetail(e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages1/groupDetail/groupDetail?type=11&roomtypeid=' + id,
    })
  },
  sever() {
    wx.navigateTo({
      url: '/pages1/serve/serve?type=2',
    })
  },
  //预览图片
  previewImage(e) {
    wx.previewImage({
      current: e.currentTarget.dataset.img, // 当前显示图片的http链接  
      urls: [e.currentTarget.dataset.img] // 需要预览的图片http链接列表  
    })
  },
  call_phone(){
    wx.makePhoneCall({
      phoneNumber: '15859255780',
    })
  }
})