var wxparse = require("../../wxParse/wxParse.js");
Page({
  data: {
    goodsDetail:null,
		detailPic:"",
  },
  //获取商品数据
   onLoad: function (options) {
  	  var self = this;
			var id = options.id;
  	  getApp().request({
  		  url: getApp().api.goodsDetail,
  		  method: "post",
				data:{id:id},
  		  success: function (res) {
  			   console.log("获取首页数据 res：", res);
  				 self.setData({
						 goodsDetail:res.data,
						 detailPic:res.data.detail
  				 })
					 wxparse.wxParse('detailPic', 'html', res.data.detail, self, 5)
  		  }
  	   });
			 
  },
})