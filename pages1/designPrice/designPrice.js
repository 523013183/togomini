var app = getApp();
Page({
  data: {
    lowValue: "",
    heightValue: "",
  },
  onLoad: function(options) {
    let price = options.price;
    if (price) {
      var spl = price.split("~");
      this.setData({
        lowValue: spl[0],
        heightValue: spl[1]
      })
    }
  },
  handleInput1(e) {
    let value = this.validateNumber(e.detail.value)
    this.setData({
      lowValue: value,
    })
  },
  handleInput2(e) {
    let value = this.validateNumber(e.detail.value)
    console.log(e.detail.value)
    this.setData({
      heightValue: value,
    })
  },

  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  setPrice: function(e) {
    let that = this;
    if (that.data.lowValue == '' || that.data.heightValue == '' || that.data.lowValue == undefined || that.data.heightValue == undefined || that.data.lowValue == '请选择设计费用') {
      wx.showToast({
        title: '请输入正确价格',
        icon: 'none'
      })
      return;
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let value = prevPage.data.inputValue;
    prevPage.changePrice(pages[pages.length - 1].data.lowValue, pages[pages.length - 1].data.heightValue)
    wx.navigateBack({
      delta: 1
    });
  },
})