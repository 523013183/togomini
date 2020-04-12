module.exports = function(t) {
//   console.log(t)
    t.data || (t.data = {});
    var o = this.core, a = this.core.getStorageSync(this.const.ACCESS_TOKEN);
    a && (t.data.access_token = a), t.data._version = this._version, t.data._platform = this.platform, 
    !this.is_login && this.page.currentPage && (this.is_login = !0, this.login({}));
    var e = this;
    o.request({
        url: t.url,
        header: t.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: t.data || {},
        method: t.method || "GET",
        dataType: t.dataType || "json",
        success: function(a) {
            -1 == a.data.code ? (e.core.hideLoading(), e.page.setUserInfoShow(), e.is_login = !1) : -2 == a.data.code ? o.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : t.success && t.success(a.data);
        },
        fail: function(a) {
            console.warn("--- request fail >>>"), console.warn("--- " + t.url + " ---"), console.warn(a), 
            console.warn("<<< request fail ---");
            var e = getApp();
            e.is_on_launch ? (e.is_on_launch = !1, o.showModal({
                title: "网络请求出错",
                content: a.errMsg || "",
                showCancel: !1,
                success: function(a) {
                    a.confirm && t.fail && t.fail(a);
                }
            })) : (o.showToast({
                title: a.errMsg,
                image: "/images/icon-warning.png"
            }), t.fail && t.fail(a));
        },
        complete: function(e) {
            if (200 != e.statusCode && e.data.code && 500 == e.data.code) {
                var a = e.data.data.message;
                o.showModal({
                    title: "系统错误",
                    content: a + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(a) {
                        a.confirm && o.setClipboardData({
                            data: JSON.stringify({
                                data: e.data.data,
                                object: t
                            })
                        });
                    }
                });
            }
            t.complete && t.complete(e);
        }
    });
};