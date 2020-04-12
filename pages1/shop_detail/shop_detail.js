// pages1/shop_detail/shop_detail.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: '', //商品的资料
    attr: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.index(options.id)
  },
  index(id) {
    let that = this;
    app.request({
      url: app.api.integral.goods_info,
      method: 'GET',
      data: {
        id
      },
      success(res) {
        console.log(res)
        that.setData({
          data: res.data.goods,
          attr: res.data.attr_group_list
        })
      }
    })
  },
  preview(e) {
    let that = this;
    wx.previewImage({
      urls: that.data.data.goods_pic_list,
      current: that.data.data.goods_pic_list[e.currentTarget.dataset.index]
    })
  },
  buy() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您确定要兑换次商品吗！',
      success(res) {
        if (res.confirm) {
          let goods = that.data.data;
          let attr = that.data.attr;
          let goods_info = {
            "goods_id": goods.id,
            "attr_price": goods.price,
            "attr_integral": goods.integral,
            "attr": goods.attr[0].attr_list
          };
          let attr_ = {
            "attr_group_id": attr[0].attr_group_id,
            "attr_group_name": attr[0].attr_group_name,
            "attr_id": attr[0].attr_list[0].attr_id,
            "attr_name": attr[0].attr_list[0].attr_name
          }
          let attrarr = [];
          attrarr.push(attr_);
          app.request({
            url: app.api.integral.submit,
            method: 'POST',
            data: {
              address_id: 0,
              type: 1,
              offline: 1,
              goods_info: JSON.stringify(goods_info),
              attr: JSON.stringify(attrarr)
            },
            success(res) {
              console.log(res)
              wx.showToast({
                title: res.msg,
                icon: "none"
              })
              if (0 == res.code || "超出购买上限" == res.msg) {
                setTimeout(() => {
                  wx.navigateBack({})
                }, 800);
              }
            }
          })
        }
      }
    })

  }
})