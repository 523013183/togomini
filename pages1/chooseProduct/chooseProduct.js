Page({
	data: {
		  productList:[],
	},
	onLoad: function (options) {
		   var self = this;
		   self.getList();
	},
	//获取作品列表
	getList:function(){
		  var self = this;
		  getApp().request({
		     url: getApp().api.projectList,
		     method: "post",
		     success: function (res) {
				  console.log("获取作品列表数据 res：", res);
				  self.setData({
					productList:res.data.list,
					
				  })
		       }
		   })
	},
	linkProductpic(e) {
		var id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url:"/pages1/productPic/productPic?id="+id
		})

	},
})
