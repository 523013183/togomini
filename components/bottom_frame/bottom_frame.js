// pages/postmeal_components/bottom_frame/bottom_frame.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num:String,
    flag:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {}
  },
  attached(){

  },
  /**
   * 组件的方法列表
   */
  methods: {
    showModal: function (e) {
      var that = this;
      that.setData({
        hideModal: false
      })
      var animation = wx.createAnimation({
        duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      setTimeout(function () {
        that.fadeIn();//调用显示动画
      }, 200)
    },

    // 隐藏遮罩层
    hideModal: function () {
      var that = this;
      var animation = wx.createAnimation({
        duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
        timingFunction: 'ease',//动画的效果 默认值是linear
      })
      this.animation = animation
      that.fadeDown();//调用隐藏动画   
      setTimeout(function () {
        that.setData({
          hideModal: true
        })
      }, 720)//先执行下滑动画，再隐藏模块

    },
    //动画集
    fadeIn: function () {
      this.animation.translateY(0).step()
      this.setData({
        animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
      })
    },
    fadeDown: function () {
      this.animation.translateY(300).step()
      this.setData({
        animationData: this.animation.export(),
      })
    },
    workspic(){
      console.log("作品库");
      this.triggerEvent('workspic');
      this.hideModal();
    },
    shopspic() {
      console.log("商品图");
      this.triggerEvent('shopspic');
      this.hideModal();
    },
    albumpic(e){
      console.log("相册库",e)
      var param = e.currentTarget.dataset;
      this.triggerEvent('albumpic', param);
      this.hideModal();
    }
  }
})
