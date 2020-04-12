Page({
  data: {
		
  },
	onLoad:function(options){
		console.log(options)
		var self = this;
		getApp().request({
      url: getApp().api.enqrcode,
        method: "post",
      data: { activity_id:options.id,},
        success: function (res) {
          console.log("获取首页数据 res：", res);
          
          self.setData({
            url:res.data.pic_url
          })
        }
    });
	},
  //获取报名信息
  getInfo:function(){
    
    
  },
  hidden_mask() {

    var that = this
    // console.log(that.mingpianImgmingpianImg)
    wx.getImageInfo({
      src: that.data.url,
      success: function (ret) {
        var path = ret.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            console.log(result)
            wx.showToast({
              icon: 'none',
              title: '保存成功',
              // content: '',
            })
            
          }
        })
      }
    })
  },
})