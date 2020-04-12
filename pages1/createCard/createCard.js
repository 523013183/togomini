Page({
	data: {
		avatarSrc: "",
		hidden:true,
		profession: [{
			id: 1,
			name: '设计助理'
		}, {
			id: 2,
			name: '设计师'
		}, {
			id: 3,
			name: '全案设计师'
		}, {
			id: 4,
			name: '设计总监'
		}, {
			id: 5,
			name: '门店导购'
		}, {
			id: 6,
			name: '店长'
		}, {
			id: 7,
			name: '店长'
		}, {
			id: 8,
			name: '个人'
		}, {
			id: 9,
			name: '其它'
		}],
		professionIndex: -1,
		userInfo: {},
		// styles: [工装, 现代简约", "新中式", "北欧", "田园", "地中海", "简欧", "日式", "美式", "混搭", "简美", "后现代"],
		// stylesIndex: -1,
		styles:[
		  { style:"工装"},
		  { style: "现代简约"},
		  { style: "新中式"},
		  { style: "北欧"},
		  { style : "田园"},
		  { style: "地中海"},
		  { style: "简欧" },  
		  { style: "日式"},
		  { style: "美式"},
		  { style: "混搭" },  
		  { style: "简美"},
		  { style: "后现代"},
		],
		goodAtStyles:[],
		years: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
			"20"
		],
		yearsIndex: -1,
		designPrice: "请选择设计费用",
		personaldesc: "未定义",
		longitude:0,
		latitude:0,
		wechat:"",
		userName:"",
		mobile:"",
		nickName:"",
		styleType:[],
		
	},
	//点击跳转到个人介绍
	linkPersonal: function(e) {
		console.log(e)
		let before = e.currentTarget.dataset.text;
		console.log(before)
		wx.navigateTo({
			url: "/pages1/personalDesc/personalDesc?before=" + before
		})

	},
	//修改个人介绍内容
	changeDesc: function(value) {
		console.log(value)
		if (value == "") {
			value = "未定义"
		}
		this.setData({
			personaldesc: value
		})
	},
	//修改设计费用
	changePrice: function(value1, value2) {
		// console.log(value1,value2)
		if (value1 == "" || value2 == "") {
			value = "请选择设计费用"
		}
		this.setData({
			designPrice: value1 + '~' + value2
		})
	},
	bindInput1:function(e){
		this.setData({
		  userName:e.detail.value
		})
	},
	bindInput2:function(e){
		this.setData({
		  mobile:e.detail.value
		})
	},
	bindInput3:function(e){
		this.setData({
		  wechat:e.detail.value
		})
	},
	onLoad: function(options) {
		//获取地址信息
		var self =this;
		console.log(options)
		wx.getLocation({
		  success: function (res) {
			console.log(res)
		//保存到data里面的location里面
			self.setData({
				longitude: res.longitude,  
				latitude: res.latitude,
			})
		  }
		})
    if(options.mobile){
      self.setData({
        avatarSrc: options.img,
        userName: options.nickname,
        mobile: options.mobile,
      })
    }else{
      self.setData({
        avatarSrc: options.img,
        userName: options.nickname,
        mobile: this.data.mobile,
      })
    }
		
		//获取微信名
		 wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                // this.globalData.userInfo = res.userInfo
      console.log(res)
      self.setData({
        nickName:res.userInfo.nickName
      })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                // if (this.userInfoReadyCallback) {
                //   this.userInfoReadyCallback(res)
                // }
              }
            })
          }
        }
      })
		
    //获取用户的手机号码

	},
	//上传头像
	change_avatar() {
		var self = this;
		wx.chooseImage({
			success(res) {
				console.log(res)
				const tempFilePaths = res.tempFilePaths
					wx.uploadFile({
					  url: getApp().api.default.mini_upload_image, // 仅为示例，非真实的接口地址
					  filePath: tempFilePaths[0],
					  name: 'file',
					  formData: {
						user: 'test'
					  },
					  success(res) {
              let data = res.data;
              data = JSON.parse(data);
              self.setData({
                avatarSrc: data.data.url
              })
              console.log(data, "111");
					  }
					})
			}
		})
	},
	/*选择职业*/
	getProfession: function(e) {
		console.log(e)
		let index = e.detail.value;
		this.data.userInfo.profession = this.data.profession[index];
		this.setData({
			professionIndex: index,
			userInfo: this.data.userInfo
		})
	},
	/*选择风格*/
	getStyles: function(e) {
		console.log(this)
		let index = e.detail.value;
		this.data.userInfo.styles = this.data.styles[index];
		var arr = this.data.goodAtStyles;
		var style1 = this.data.styles[index];
		arr.push(style1)
		console.log(style1)
		console.log(arr)
		// if(arr.length>1){
		// 	for(var i=0;i<=arr.length;i++){
		// 		if(style1==arr[i]){
		// 			arr.splice(i,1);
		// 		}
		// 	}
		// }
		this.setData({
			stylesIndex: index,
			userInfo: this.data.userInfo,
			goodAtStyles:arr
		})
	},
	/*选择风格弹窗*/
	choosestyle:function(){
		var self = this;
		self.setData({
			hidden:false
		})
	},
	hidden_mask:function(){
		var self = this;
		self.setData({
			hidden:true
		})
	},
	sure:function(){
		var self = this;
		self.setData({
			hidden:true
		})
	},
	isChoose3:function(e){
	  let index = e.currentTarget.dataset.index;
	  let styles = this.data.styles;
	  styles[index].check = !(styles[index].check);
	  this.setData({
	    styles: styles
	  });
	  var styleType = [];
	  styles.forEach(function (v, k) {
	    if(v.check){
	      styleType.push(v.style);
	    }
	  })
	  this.setData({
	    styleType: styleType
	  })
	console.log(styleType)
	},
	/*选择年限*/
	getYears: function(e) {
		let index = e.detail.value;
		this.data.userInfo.years = this.data.years[index];
		this.setData({
			yearsIndex: index,
			userInfo: this.data.userInfo
		})
	},
	handleInput(e) {
      let mobile = this.validateNumber(e.detail.value)
      this.setData({
        mobile:mobile
      })
    },
	validateNumber(val) {
		  return val.replace(/\D/g, '')
		},
	//验证手机号是否规范；
	checkMobile: function (mobile) {
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
	//点击保存
	saveCardMsg: function() {
		var t = this;
		console.log(t)
		var mobile = t.data.mobile;
		if(t.data.userName==""){
			wx.showToast({
			  icon: 'none',
			  title: '姓名不能为空',
			});
		}else if(t.data.mobile==""){
			wx.showToast({
			  icon: 'none',
			  title: '手机号码不能为空',
			});
		}else if(t.data.wechat==""){
			wx.showToast({
			  icon: 'none',
			  title: '微信号不能为空',
			});
		}else if(t.data.professionIndex<0){
			wx.showToast({
			  icon: 'none',
			  title: '职业不能为空',
			});
		}else if(t.data.yearsIndex<0){
			wx.showToast({
			  icon: 'none',
			  title: '年限不能为空',
			});
		}else if(t.data.designPrice=='请选择设计费用'||t.data.designPrice==''){
			wx.showToast({
			  icon: 'none',
			  title: '设计费用不能为空',
			});
		}else if(t.data.stylesIndex<0){
			wx.showToast({
			  icon: 'none',
			  title: '风格不能为空',
			});
		}else if(t.checkMobile(mobile)){
			getApp().core.showLoading({
				title: "正在保存",
				mask: !0
			});
      try{
        var longitude = t.data.longitude.toFixed(2);
        var latitude = t.data.latitude.toFixed(2);
      }catch(e){}
		
			getApp().request({
				url: getApp().api.saveCard,
				method: "post",
				data: {
					wechat:t.data.wechat,
					mobile:t.data.mobile,
					company_name: "这个字段没用",
					job_year: t.data.years[t.data.yearsIndex],
					introduction: t.data.personaldesc,
					avatar_url: t.data.avatarSrc,
					remarks: "这个字段没用",
					longitude: longitude,
					latitude: latitude,
					style: JSON.stringify(t.data.styleType),
					user_name: t.data.userName,
					job: t.data.profession[t.data.professionIndex].name,
					design_fees:t.data.designPrice ,
				},
				success: function(e) {
					// console.log(t.data.avatarSrc)
					// var Arr =[];
					// Arr.push(t.data.avatarSrc);
					// getApp().core.setStorageSync(getApp().const.USER_AVATAR, Arr);
					 wx.setStorageSync('avatarSrc',t.data.avatarSrc);
					console.log("获取首页数据 e：", e);
					getApp().core.hideLoading(), 0 == e.code && getApp().core.showModal({
						title: "提示",
						content: e.msg,
						showCancel: !1,
						success: function(e) {
							e.confirm && wx.reLaunch({
								url:"/pages1/homePage/homePage?avatarSrc="+t.data.avatarSrc
							});
						}
					})
				},
				fail: function(e){
					console.log(e);
				}
			});
		}
		
		
		
	},
})
