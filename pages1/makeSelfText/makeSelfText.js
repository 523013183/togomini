Page({
  data: {
    textvalue: ""
  },
  //字数限制
  desclimit: function(e) {
    console.log(e)
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }
    this.setData({
      textvalue: e.detail.value
    })
  },

  setText: function(e) {
    let pages = getCurrentPages();
    console.log(pages);
    let prevPage = pages[pages.length - 2];
    let value = pages[pages.length - 1].data.textvalue;
    console.log(value)
    prevPage.addText(value)
    wx.navigateBack({
      delta: 1
    });
  },
})