Page({
  data: {
	  cartList:[],
	  
  },
  //获取下载列表
  onLoad: function (options) {
  	  var self = this;
  	  getApp().request({
  		  url: getApp().api.cartList,
  		  method: "post",
		  data:{snap:1},
  		  success: function (res) {
  			   console.log("获取下载列表数据 res：", res);
           var list = res.data.list;
  				 

          var downloadListId = wx.getStorageSync('downloadListId');
          list.forEach(function(a,b){
            downloadListId.forEach(function (item, index) {
              if(a.id==item.id){
                a.show = 1;
                if(item.price){
                  a.price = item.price
                }
              }
            })
          })
          self.setData({
            cartList: list
          })

  		  }
  	   });
  },
  //跳转到商品详情
  linkGoods:function(e){
  	var self =this;
  	var id = e.currentTarget.dataset.id;
  	wx.navigateTo({
  		 url:"/pages1/commodityDetail/commodityDetail?id="+id
  	})
  },
  clsoe:function(e){
    var that =this;
    var id = e.currentTarget.dataset.id;
    var list = that.data.cartList;
    list.forEach(function(item,index){
      if(item.id==id){
        item.show = 0
      }
    })
    that.setData({
      cartList:list
    })

    var downloadListId = wx.getStorageSync('downloadListId');
    var arr = [];
    downloadListId.forEach(function(item,index){
      if(item.id!=id){
        arr.push(item)
      }
    })
    wx.setStorageSync("downloadListId", arr)


  }
})