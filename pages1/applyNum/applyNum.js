var util= require("../../utils/util.js");
Page({
  data: {
	  enrollList:"",
	  timeArr:"",
	  id:"",
	  
  },
	onLoad:function(options){
		var self= this;
		self.setData({
			id:options.id,
      form:options.form
		})
		self.getActivityDetail();
	},
  //打电话给设计师
  callDesigner: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.mobile,
    })
  },
	getActivityDetail:function(){
		 var self = this;
		 getApp().request({
		  url: getApp().api.activityDetail,
		  method: "post",
		  data:{id:self.data.id},
		  success: function (res) {
        console.log(res)
        var enrollList = res.data.enroll_list;
        if (enrollList.length == 0) {
          return;
        }
			 var length = res.data.enroll_list.length;
        var navContent = enrollList[0].form_content;
        navContent.forEach(function(item,index){
          item.name = item.key;
        })
        console.log("获取活动详情 11111111111111111", res, navContent);

        enrollList.forEach(function(item,index){
          var curtime = util.formatTimeTwo(res.data.enroll_list[index].addtime, 'Y-M-D' + ' ' + 'h:m');
          item.time = curtime.substring(0,16);
        })
			 
			 self.setData({
				 enrollList:enrollList,
         navContent: navContent
			 })
        console.log(self.data.navContent, self.data.enrollList)
			},
		})	
		},
			 
			 
})