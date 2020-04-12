var app = getApp(), api = getApp().api;
var util = require('../../../utils/util.js')

Page({
    data: {},
    onLoad: function(n) {
        getApp().page.onLoad(this, n);
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        util.checkLogin()
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});