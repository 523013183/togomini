// pages1/serve/serve.js
// let page = 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword:'',
    page:1,
    classname:"全部",
    hide:true,
    list:[],
    type:"",
    name:"上拉加载更多",
    classify: [
      {
        id: 0,
        name: '全部'
      },
      {
        id:1,
        name:'建模服务'
      },
      {
        id: 2,
        name: '安配服务'
      },
      {
        id: 3,
        name: '售后服务'
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        type:options.type,
        classname:'安配服务'
      })
    }
    this.list(this.data.page);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      list:[]
    })
    this.list(1);
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    that.setData({ 
      name:"加载中..."
    })
    that.data.page++;
    that.list(that.data.page);
  },

  // 获取列表
  list(pg) {
    wx.showLoading({
      title: '',
    })
    let that = this;
    getApp().request({
      url: getApp().api.servelist,
      method: "post",
      data:{
        type:that.data.type,
        keyword:that.data.keyword,
        page: pg
      },
      success(res){
        console.log(res)
        setTimeout(function(){
          wx.hideLoading();
        },300)
        if(res.list.length > 0){
          var arr = [];
          for (let i in that.data.list){
            arr.push(that.data.list[i])
          }
          for(let i=0; i<res.list.length; i++){
            arr.push(res.list[i]);
          }
          that.setData({
            list: arr,
            name: "上拉加载更多",
            keyword: "",
          })
        }else{
          wx.showToast({
            title: '暂无更多数据',
            icon:'none'
          })
          setTimeout(function(){
            that.setData({
              name: "暂无更多数据",
              keyword: "",
            })
          },300)
        }
      }
    })
  },
  godetail(e){
    wx.navigateTo({
      url: '/pages1/servedetail/servedetail?id=' + e.currentTarget.dataset.id,
    })
  },
  show(){
    this.setData({
      hide:!this.data.hide
    })
  },
  choose(e){
    let that = this;
    console.log(e)
    var type = '';
    if (e.currentTarget.dataset.id == 0){
      type = '';
    }else{
      type = e.currentTarget.dataset.id
    }
    that.setData({
      type:type,
      classname: e.currentTarget.dataset.name,
      hide:!that.data.hide,
      page:1,
      list:''
    })
    that.list(that.data.page);
  },
  input(e){
    this.setData({
      keyword: e.detail.value
    })
  },
  search() {
    this.list(this.data.page);
    this.setData({
      list:[],
      page:1
    })
  },
  phone(e){
    let phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }
})