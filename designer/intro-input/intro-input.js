var app = getApp();

Page({
  data: {
    selfPlaceholder: "个人简介，请用100字介绍自己。例如个人职业、获奖证书、经典 / 知名案例、擅长领域、毕业院校、从业年限等。亮眼的经历、良好的文字排版会让业主更喜欢。",
    inputedSize: 0,
    profile: ''
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({
      profile: options.profile ? options.profile : ''
    })
  },
  onBackTapped: function () {
    wx.navigateBack({
      delta: 1
    });
  },
  onInput: function (t) {
    this.data.profile = t.detail.value, this.setData({
      inputedSize: this.data.profile.length
    });
  },
  onFormId: function (e) {
    app.addFormId(e.detail.formId);
  },
  onConfirm: function (e) {
    if (this.data.inputedSize <= 110) {
      var a = getCurrentPages();
      a[a.length - 2].setIntro(this.data.profile);
      wx.navigateBack();
    } else wx.showToast({
      title: "请将个人简介控制在110字内哦～",
    });
  }
});