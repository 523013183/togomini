var is_loading = !1, is_no_more = !0, quickNavigation = require("../../components/quick-navigation/quick-navigation.js");

Page({
    data: {
        p: 1,
        naver: "index"
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), quickNavigation.init(this);
    },
    onShow: function() {
        getApp().page.onShow(this), getApp().core.showLoading({
            title: "加载中"
        });
        var o = this;
        getApp().request({
            url: getApp().api.lottery.index,
            success: function(t) {
                0 == t.code && (o.setData(t.data), null != t.data.goods_list && 0 < t.data.goods_list.length && (is_no_more = !1));
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    submit: function(t) {
        var o = t.detail.formId, a = t.currentTarget.dataset.lottery_id;
        getApp().core.navigateTo({
            url: "/lottery/detail/detail?lottery_id=" + a + "&form_id=" + o
        });
    },
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    loadData: function() {
        if (!is_loading) {
            is_loading = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var i = this, e = i.data.p + 1;
            getApp().request({
                url: getApp().api.lottery.index,
                data: {
                    page: e
                },
                success: function(t) {
                    if (0 == t.code) {
                        var o = i.data.goods_list, a = i.data.list;
                        if (null == t.data.goods_list || 0 == t.data.goods_list.length) return void (is_no_more = !0);
                        a.num = a.num.concat(t.data.list.num), a.status = a.status.concat(t.data.list.status), 
                        o = o.concat(t.data.goods_list), i.setData({
                            goods_list: o,
                            list: a,
                            p: e
                        });
                    } else i.showToast({
                        title: t.msg
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading(), is_loading = !1;
                }
            });
        }
    }
});