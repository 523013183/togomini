// pages1/demo/demo.js
var i = -1 //定义一个全局的抽奖的序号
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示九宫格抽奖
    ishowPrizesView: true,
    // 奖品数组
    prizesArray: ['升级书_0', '1.5倍经验卡_1', '200金币_2', '100金币_3',
      '金库碎片_4', '补位_5', '补位_6', '100经验_7',
      '2倍经验卡_8', '补位_9', '补位_10', '升级书_11',
      '2倍金币卡_12', '1.5倍金币卡_13', '200经验_14', '100金币_15'],
    // 九宫格抽奖滚动的下标顺序数组(按照这个顺序进行滚动)
    prizesflowArray: [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.pond_index();
  },
  // 点击抽奖按钮
  clickPrizesStartBtn: function () {
    getApp().request({
      url: getApp().api.pond.lottery,
      method:'GET',
      success(res){
        console.log(res)
      }
    })
    // 随机出奖品的下标位置
    var prizesNo = parseInt(11 * Math.random()); //0-11之间整数
    var prizesIndex = this.data.prizesflowArray[prizesNo]
    var prizesName = this.data.prizesArray[prizesIndex]
    console.log('开始抽奖========' + prizesName + '=====' + prizesIndex)
    //抽奖动画
    var that = this
    var timer1 = setInterval(function () {
      that.animatedPrizesfind(false)
    }, 80)
    var timer2
    setTimeout(function () {
      clearInterval(timer1)
      timer2 = setInterval(function () {
        that.animatedPrizesfind(false)
      }, 30)
    }, 500)
    var timer3
    setTimeout(function () {
      clearInterval(timer2)
      timer3 = setInterval(function () {
        that.animatedPrizesfind(false)
      }, 100)
    }, 2000)
    var timer4
    setTimeout(function () {
      clearInterval(timer3)
      timer4 = setInterval(function () {
        that.animatedPrizesfind(false)
      }, 300)
    }, 4000)
    var timer5
    setTimeout(function () {
      clearInterval(timer4)
      timer5 = setInterval(function () {
        that.animatedPrizesfind(true, function (e) {
          if (e === prizesIndex) {
            clearInterval(timer5)
            console.log('找到指定奖品==' + e)
            var prizesPar = {}
            prizesPar['animateType' + e] = 'animated tada'
            that.setData(prizesPar)
            setTimeout(function () {
              wx.showModal({
                title: '中奖啦',
                content: '恭喜获得【' + prizesName + '】',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定,领取抽到的奖品')
                    // that.setData({
                    //   ishowPrizesView: false
                    // })
                  }
                }
              })
            }, 1000)

          }
        })
      }, 600)
    }, 5000)
  },
  animatedPrizesfind: function (isFindPrizes, callback) {
    // var that = this
    var lastprizesIndex
    if (i === -1) {
      lastprizesIndex = this.data.prizesflowArray[this.data.prizesflowArray.length - 1]
    } else {
      lastprizesIndex = this.data.prizesflowArray[i]
    }

    i++
    var prizesIndex = this.data.prizesflowArray[i]
    var par = {}
    par['prizesborderW' + prizesIndex] = 10
    par['prizesborderW' + lastprizesIndex] = 0
    this.setData(par)
    if (i === this.data.prizesflowArray.length - 1) {
      i = -1
    }

    if (isFindPrizes) {
      callback(prizesIndex)
    }

  },
  // 奖品
  pond_index(){
    let that = this;
    getApp().request({
      url:getApp().api.pond.index,
      method:"GET",
      success(res){
        console.log(res)
        that.setData({
          list:res.data.list
        })
      }
    })
  }
})