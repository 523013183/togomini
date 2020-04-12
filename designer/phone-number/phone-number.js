var t = getApp();

Page({
  data: {
    phoneNumber: "",
    verificationCode: "",
    btnDisabled: false,
    btnText: "获取验证码"
  },
  onLoad: function (e) {

  },
  bindPhoneInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  getPhoneNumber: function (e) {
    var a = getCurrentPages();
    a[a.length - 2].setPhoneNumber(this.data.phoneNumber);
    wx.navigateBack()
  },
  getCode: function (t) {
    this.setData({
      verificationCode: t.detail.value,
      confirmBtnAbled: 6 === t.detail.value.length
    });
  },
  sendMessage: function () {
    this.setData({
      btnDisabled: true,
      btnText: "60s",
      isTiming: !0
    })
    this.startTimer(60);
  },
  startTimer: function (t) {
    if (-1 != t) {
      setTimeout(() => {
        t -= 1;
        this.setData({
          btnText: t + "s"
        })
        this.startTimer(t);
      }, 1e3);
    } else {
      this.setData({
        btnDisabled: !1,
        btnText: "重新获取"
      });
    }
  },
  verify: function () {
    this.getPhoneNumber();

  }
});