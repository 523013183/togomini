Page({
  data: {
    textvalue: "",
    textLength: "",
  },
  //字数限制
  desclimit: function(e) {
    var value = e.detail.value;
    var length = parseInt(value.length);
    if (length > this.data.noteMaxLen) {
      return;
    }
    this.setData({
      textvalue: e.detail.value,
      textLength: length
    })
  },
  //点击保存
  setText: function(e) {
    var name = this.data.textvalue
    console.log(name)
    if (name == ''){
      wx.showToast({
        title: '名称不能为空！',
        icon: 'none'
      })
      return;
    }
    if (name.length > 4) {
      wx.showToast({
        title: '字符长度不超过4',
        icon:'none'
      })
      return;
    } else {
      if (this.data.roomArr.indexOf(name) > 0){
          wx.showToast({
            title: '装载空间名已存在！',
            icon:"none"
          })
          return;
      }
      getApp().request({
        url: getApp().api.addRoom,
        method: "post",
        data: {
          name: name
        },
        success: function(res) {
          console.log(res)
          wx.navigateBack({
            success(){
              
            }
          })
        }
      })
      let pages = getCurrentPages();
      let prevPage = pages[pages.length-2];
      prevPage.getList();
    }

  },
  onLoad: function(optinos) {
    var a = optinos.roomArr.split(',');
    this.setData({
      roomArr: a
    })
  }
})