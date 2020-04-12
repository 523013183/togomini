Page({
  data: {
    textLength: 0,
    inputValue: "",
  },
  calcLength(e) {
    let length = e.detail.value.length;
    if (length > 100) {
      wx.showToast({
        title: "字数超过了哦~",
        icon: 'none'
      });
      return;
    }
    this.setData({
      inputValue: e.detail.value,
      textLength: length
    })

  },
  onConfirm: function(e) {
    if (this.data.textLength <= 100) {
      // if (this.data.inputValue == '') {
      //   wx.showToast({
      //     title: "简介不能为空！",
      //     icon: 'none'
      //   });
      //   return;
      // }
      let pages = getCurrentPages();
      console.log(pages);
      let prevPage = pages[pages.length - 2];
      let value = prevPage.data.inputValue;
      prevPage.changeDesc(pages[pages.length - 1].data.inputValue)
      wx.navigateBack({
        delta: 1
      });
    } else wx.showToast({
      title: "请将个人简介控制在100字内哦～",
      icon: 'none'
    });
  },
  onLoad: function(options) {
    console.log(options)
    let beforeMsg = options.before;
    if (beforeMsg !== "TA好像没留下什么") {
      this.setData({
        inputValue: beforeMsg,
        textLength: beforeMsg.length
      })
    }
  },
})