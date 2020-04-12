Page({
  data: {
		picArr:[],
		chooseArr:[],
		id:"",
		selectIndex: [
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		   { sureid: false },
		  ],
		  serial:"",//选择图片的顺序
		  
  },
  //获取作品详情
  getproductDetail:function(){
  	var self =this;-
  	getApp().request({
  		url: getApp().api.productDetail,
  		method: "post",
  		data: {id:self.data.id},
  		success: function (res) {
  		  console.log("获取作品详情数据 res：", res);
  		  var info = res.data.info;
  		  self.setData({
  			  picArr:res.data.pic,
          info:info
  		  })
  		}
  	})  
  },	  
   onLoad: function (options) {
	   var self = this;
	   self.setData({
		   id:options.id
	   })
	   self.getproductDetail();
   },
  confirm(){
    var chooseArr = this.data.chooseArr;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 3];
			console.log(pages)
    var roomId = prevPage.data.roomId;
    var preImgtopfileds = prevPage.data.preImgtopfileds;
    if (!preImgtopfileds[roomId]){
      preImgtopfileds[roomId] = [];
    }
    var maxnum = prevPage.data.albumpnum;
    var len = maxnum -preImgtopfileds[roomId].length;

    for (var i = 0; i < len;i++){
      if (chooseArr[i]){
        var info = {
          preImgtopId: chooseArr[i].id,
          preImgtop: chooseArr[i].url
        }
        preImgtopfileds[roomId].push(info);
      }
    }
    prevPage.setData({
      preImgtopfileds: preImgtopfileds
    });
    wx.navigateBack({
      delta: 2  // 返回上一级页面。
    })
  },
   //选择图片
   isChoose:function(e){
   	  console.log(e)
   		var self = this;
   	  let index = e.currentTarget.dataset.selectindex; //当前点击元素的自定义数据，这个很关键
   	  let sureid = e.currentTarget.dataset.sureid;
   	  let styleItem = e.currentTarget.dataset.item;
   	  let selectIndex = this.data.selectIndex;  //取到data里的selectIndex
   	  selectIndex[index].sureid = !selectIndex[index].sureid;  //点击就赋相反的值
   	  this.setData({
   	   selectIndex: selectIndex  //将已改变属性的json数组更新
   	  })
   		var arr =self.data.chooseArr;
   		if(selectIndex[index].sureid==true){
   			arr.push(self.data.picArr[index]);
   		}else if(selectIndex[index].sureid==false){
   			arr.splice(index, 1);
   		}
		
		var serial = parseInt(arr.indexOf(self.data.picArr[index]))+1;
		
	  console.log(serial)
   		self.setData({
   				chooseArr:arr,
				serial:serial,
				
   			})
   		console.log(self.data.chooseArr)
   	},  
})