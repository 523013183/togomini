var e = getApp();

Page({
  data: {
    allYears: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    profession: [{ id: 1, name: '设计师' }, { id: 2, name: '设计师助理' }, { id: 3, name: '全案设计师' }, { id: 4, name: '设计总监' }, { id: 5, name: '门店导购' }, { id: 6, name: '培训师' }, { id: 7, name: '店长' }, { id: 8, name: '工长' }, { id: 9, name: '其它' }],
    professionIndex: -1,
    styles: ["工装", "现代简约", "新中式", "北欧", "田园", "地中海", "简欧", "日式", "美式", "混搭", "简美", "后现代"],
    stylesIndex: -1,
    userInfo: {},
    isFirstCreate: true,

  },
  onLoad: function (t) {

  },

  onBackTapped: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  choosePhoto: function () {
    var a = this;
    wx.chooseImage({
      count: 1,
      success: function (s) {
        wx.uploadFile({
          url: "",
          filePath: s.tempFilePaths[0],
          name: "files",
          success: function (t) {

          },
          fail: function () {

          }
        });
      }
    });
  },
  getWeixinId: function (e) {
    this.data.userInfo.weixinId = e.detail.value;
  },
  getName: function (e) {
    this.data.userInfo.name = e.detail.value;
  },
  getProfession: function (e) {
    let index = e.detail.value;
    this.data.userInfo.profession = this.data.profession[index];
    this.setData({
      professionIndex: index,
      userInfo: this.data.userInfo
    })
  },
  getCompanyName: function (e) {
    this.data.userInfo.company = e.detail.value;
  },
  getCompanyAddress: function (e) {
    this.data.userInfo.companyAddress = e.detail.value;
  },
  getStyles: function (e) {
    let index = e.detail.value;
    this.data.userInfo.styles = this.data.styles[index];
    this.setData({
      stylesIndex: index,
      userInfo: this.data.userInfo
    })
  },
  setPhoneNumber: function (e) {
    this.data.userInfo.tel = e, this.setData({
      userInfo: this.data.userInfo
    });
  },

  onPhoneNumberLayoutTapped: function () {
    wx.navigateTo({
      url: '../phone-number/phone-number',
    })
  },
  onProfileLayoutTapped: function (t) {
    wx.navigateTo({
      url: '../intro-input/intro-input?profile=' + (this.data.userInfo.profile ? this.data.userInfo.profile : ''),
    })
  },
  setIntro: function (t) {
    this.data.userInfo.profile = t, this.setData({
      userInfo: this.data.userInfo
    }), wx.showToast({
      title: "设置成功"
    });
  },

  onFormId: function (t) {
    e.addFormId(t.detail.formId);
  },
  confirm: function (t) {
    this.setData({
      confirming: !0
    })
    wx.showLoading({
      title: "正在保存"
    });
    var n = {
      name: this.data.userInfo.name,
      serviceArea: this.data.userInfo.serviceArea,
      profile: this.data.userInfo.profile ? this.data.userInfo.profile.trim() : "",
      avatar: this.data.userInfo.avatar,
      weixinId: this.data.userInfo.weixinId,
      tel: this.data.userInfo.tel
    }
  }

});