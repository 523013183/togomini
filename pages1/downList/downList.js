Page({
  data: {
	  cartList:[],
	  
  },
  onLoad: function (options) {
  	  var self = this;
  	  self.getcartList();
  },
  //获取下载列表
  getcartList:function(){
		var self = this;
		getApp().request({
			url: getApp().api.cartList,
			method: "post",
			success: function (res) {
				 console.log("获取首页数据 res：", res);
				 self.setData({
					cartList:res.data.list
				 })
			}
		});  
  },
  //删除商品
  canclePro: function (e) {
	var self = this;
	getApp().request({
	  url: getApp().api.delTemporaryPro,
	  method: "post",
	  data:{id:e.currentTarget.dataset.id},
	  success: function (res) {
		  console.log(res)
		  getApp().core.showModal({
		    title: "提示",
		    content: res.msg,
		    showCancel: !1,
		  }),
		   self.getcartList();
	  }
	});  
  },
  
  
})