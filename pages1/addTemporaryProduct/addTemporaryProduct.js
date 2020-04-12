Page({
  data: {
		 preImgsAbout: [], // 上传活动相关图片，最多5张；
		 preImgsAboutId: [], //上传活动相关图片，最多5张Id；
		 titleText:"",
		 price:"",
		 description:"",
		 from_url:"",
  },
	//商品名称字数限制
	  	titlelimit: function (e)  {
				var value = e.detail.value;
				var length = parseInt(value.length);
				 if  (length > this.data.noteMaxLen) {
					return;
				 }
					 this.setData({
						 titleText:e.detail.value
					 })
	  	},
			//商品价格
			input1:function(e){
				var value = e.detail.value
				this.setData({
					price:value
				})
			},
			//商品描述
			input2:function(e){
				var value = e.detail.value
				this.setData({
					description:value
				})
			},
			//来源
			input3:function(e){
				var value = e.detail.value
				this.setData({
					from_url:value
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
	/* 图片上传 */
	 uploadImg: function (e) {
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
	     i = data.i ? data.i : 0,//当前上传的哪张图片
	     success = data.success ? data.success : 0,//上传成功的个数
	     fail = data.fail ? data.fail : 0;//上传失败的个数
	   let flag = data.flag;
	 
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
	       let result = resp.data ? JSON.parse(resp.data) : { code: 0 };
	       if (result.code == 0) {
	         success++;//图片上传成功，图片上传成功的变量+1
	         if (flag == 'top') {
	           this.setData({
	             preImgtop: result.data.url
	           })
	           this.setData({
	             preImgtopId: result.data.id
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
	         }
	 
	       } else {	//若图片还没有传完，则继续调用函数
	         data.i = i;
	         data.success = success;
	         data.fail = fail;
	         that.uploadimgs(data);
	       }
	 
	     }
	   })
	 },
	 //点击确认发布
	 saveTemporary: function(e) {
	 	var t = this,value;
	 	console.log(t)
	 	getApp().core.showLoading({
	 		title: "正在保存",
	 		mask: !0
	 	});
	 	// var pages = getCurrentPages();
	 	// var curpage = pages[pages.length - 1];
	 	// console.log(curpage)
	 	// if(curpage.data.projectName==undefined){
	 	// 	value="";
	 	// }else{
	 	// 	value=curpage.data.projectName;
	 	// }
	 	getApp().request({
	 		url: getApp().api.addTemporaryPro,
	 		method: "post",
	 		data: {
	 			name:t.data.titleText,
	 			price:t.data.price,
				description:t.data.description,
	 			pic_url:t.data.preImgsAbout,
				from_url:t.data.from_url,
	 		},
	 		success: function(e) {
	 			console.log("获取首页数据 e：", e);
	 			getApp().core.hideLoading(), 0 == e.code  && getApp().core.showModal({
	 				title: "提示",
	 				content: e.msg,
	 				showCancel: !1,
	 				success: function(e) {
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              prevPage.setData({
                message: true,
              })
	 					if(e.confirm){
	 						wx.navigateBack({
	 							delta: 1,
	 							success: function(e) {
                    var _params ={
                      cat_id:'',
                      keyword:'',
                      page:1,
                      room:'',
                      style:''
                    }
                    prevPage.getGoods(_params);
                    prevPage.setData({
                      roonname : ''
                    })
	 							}
	 						})
	 					}
	 				}
	 			})
	 			e.code==1  && getApp().core.showModal({
	 				title: "提示",
	 				content: e.msg,
	 				showCancel: !1,
	 			})
	 		},
	 		fail: function(e){
	 			console.log(e);
	 		}
	 	});
	 },
})