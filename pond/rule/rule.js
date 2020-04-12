Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        getApp().request({
            url: getApp().api.pond.setting,
            success: function(t) {
              console.log(t)
                0 == t.code && e.setData({
                    rule: t.data.rule
                });
            }
        });
    }
});