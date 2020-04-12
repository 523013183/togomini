Page({
  data: {
		name:"",
		mobile:"",
		sex:"",
		wechat:"",
		activityid:null,
		is_apply:0,
		form:[],
		enrollInfo:[],
		
		fillInAnswer:[],
  },
  //获取我的报名信息
	getMymessage:function() {
		var self = this;
		getApp().request({
		  url: getApp().api.enrollInfo,
		  method: "post",
		  data:{activity_id:self.data.activityid},
		  success: function (res) {
			   console.log("获取我的报名信息 res：", res);
			   if(res.code==0){
				   if(res.data!==null){
					   var arr = res.data;
					   var arr2 = self.data.fillInAnswer;
					   var length = arr2.length;
					   for(var i=0;i<length;i++){
						   arr2[i]['value']=arr[i].content;
					   }
					   console.log(arr2)
					 self.setData({
						form:arr2
					 }) 
				   }
				   self.setData({
				   	  is_apply:1,
				   }) 
			   }
		    }
		 });
	},	
	onLoad: function (options) {
		var self = this;
		console.log(options)
		var formArr = JSON.parse(options.form);
		 self.setData({
			activityid: options.id,
			form:formArr
		 })
		 self.getMymessage();
		 console.log(self)
		 console.log(self.data.form)
		 var length = self.data.form.length;
		 var valueArr=[];
		for(var i=0;i<length;i++){
			var value = self.data.form[i].key;
			var value2={};
			value2.key=value;
			valueArr.push(value2);
		}
		self.setData({
			fillInAnswer:valueArr
		})
		console.log(self.data.fillInAnswer)
	},
	//获取信息
		input:function(e){
			// console.log(e)
			var self =this;
			var fillInAnswer=self.data.fillInAnswer;
			var value = e.detail.value;
			console.log(value)
			fillInAnswer[e.currentTarget.dataset.index]['value']=value;
			self.setData({
				fillInAnswer:fillInAnswer
			})
			console.log(fillInAnswer)
		},
	//验证手机号是否规范；
  checkMobile: function (mobile, needMobile) {
    if (needMobile==0){
      return true;
    }
	  let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
	  if (!myreg.test(mobile)) {
	    wx.showToast({
	      icon: 'none',
	      title: '手机号不规范',
	    });
	    return false;
	  }
	  return true;
	},
	//保存报名信息
	applyActivity:function(e){
		var self = this;
		var arr = self.data.fillInAnswer;
		var arr2 = self.data.form;
		var length = arr.length;
		var name,mobile;
		for(var i=0;i<length;i++){
			if(arr2[i].require==1&&arr[i].value==undefined){
				wx.showToast({
				  icon: 'none',
				  title: arr[i].key+'不能为空',
				});
				return;	
			}	
      if (arr[i].key == '电话' && arr2[i].require == 1){
			 mobile =arr[i].value;
		  }  
		}
    var needMobile = 0;
		if(mobile!==undefined){
			self.setData({
			  mobile:mobile
			})
      needMobile = 1;
		}
		var mobile = self.data.mobile;
    if (self.checkMobile(mobile, needMobile)) {
			  getApp().request({
			  url: getApp().api.enrollActivity,
			  method: "post",
				data:{
					activity_id:self.data.activityid,
					form_content:JSON.stringify(self.data.fillInAnswer),
				},
				success: function(e) {
					console.log("获取保存报名返回信息 e：", e);
					getApp().core.hideLoading(), 0 == e.code  && getApp().core.showModal({
						title: "提示",
						content: e.msg,
						showCancel: !1,
						success: function(e) {
							self.setData({
								is_apply:1
							})
							if(e.confirm){
								wx.navigateBack({
									delta: 1,
									success: function(e) {
										let pages = getCurrentPages();
										console.log(pages);
										let prevPage = pages[pages.length-1];
										prevPage.changeState('apply_yes');
										prevPage.getActivityDetail();
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
			})
		}
	},
	//查看我的报名凭证
	linkProof:function(e){
		console.log(this)
		var activity_id = this.data.activityid;
		wx.navigateTo({
			url:"/pages1/applyProof/applyProof?id="+activity_id,
		})	
	},
	//取消报名
	cancleApply:function(){
		var self = this;
		getApp().request({
		  url: getApp().api.cancleEnroll,
		  method: "post",
			data:{
				id:self.data.activityid,
			},
		  success: function (e) {
			console.log("获取取消报名信息e：", e);
			getApp().core.hideLoading(), 0 == e.code  && getApp().core.showModal({
				title: "提示",
				content: e.msg,
				showCancel: !1,
				success: function(e) {
					self.setData({
						is_apply:1
					})
					if(e.confirm){
						wx.navigateBack({
							delta: 1,
							success: function(e) {
								let pages = getCurrentPages();
								console.log(pages);
								let prevPage = pages[pages.length-1];
								prevPage.changeState('apply_no');
								prevPage.getActivityDetail();
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
		  }
		})
	
	}
})