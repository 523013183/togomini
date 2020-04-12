var siteinfo = require("../siteinfo.js"),
  _api_root = "",
  _default_root = "";

if (-1 != siteinfo.acid) {
  var siteroot = siteinfo.siteroot.substr(0, siteinfo.siteroot.indexOf("app/index.php"));
  _api_root = _api_root = siteroot + "web/index.php?_acid=" + siteinfo.acid + "&r=api/";
} else _api_root = siteinfo.apiroot;
_default_root = siteinfo.defaultroot;
var api = {
  // 获取商品的二维码
  shop_ewm: _api_root + "designer/index/goods-qrcode",
  // 订单
  orderlist: _api_root + "designer/order/lists",//订单列表
  orderdetail: _api_root + "designer/order/info",//订单详情
  // 户型
  housetypeapply: _api_root + "designer/apartment/apply-sampleroom",//户型申请
  housetypelist: _api_root + "designer/apartment/lists",//户型列表
  housetypedetail: _api_root + "designer/apartment/info",//户型详情
  housetypepackage: _api_root + "designer/apartment/add-package",//户型套餐加入
  housetypepackagelist: _api_root + "designer/apartment/package-lists",//户型套餐列表
  sethousetypepackage: _api_root + "designer/apartment/check-package",//审核户型套餐
  // 样板间
  sampleroompackagedetail: _api_root + "designer/package/copy-info", //样板间设计师套餐详情 
  removepackage: _api_root + "designer/sampleroom/del-package", //样板间设计师套餐移除 
  looksampleroom: _api_root + "designer/sampleroom/sampleroom-look", //预约参观样板间 
  sampleroomlist: _api_root + "designer/sampleroom/lists", //样板间列表 
  sampleroominfo: _api_root + "designer/sampleroom/info", //样板间详情 
  sampleroomadd: _api_root + "designer/sampleroom/add-designer", //样板间设计师加入 
  sampleroomaddpackage: _api_root + "designer/sampleroom/add-package", //样板间设计师套餐加入 
  sampleroompackagelist: _api_root + "designer/sampleroom/package-lists", //样板间设计师套餐列表 
  sampleroomdesignerlists: _api_root + "designer/sampleroom/designer-lists", //样板间设计师列表 
  setshareroomdesigner: _api_root + "designer/sampleroom/check-designer", //审核样板间的设计师 
  setshareroompackage: _api_root + "designer/sampleroom/check-package", //审核样板间的套餐
  // 
  readmsg: _api_root + "designer/timeline/read", //设置消息已读 
  setopusnew: _api_root + "designer/opus/set-recommend", //设置案例推荐、最新 
  setpackagenew: _api_root + "designer/package/set-recommend", //设置套餐推荐、最新 
  msgnotice: _api_root + "designer/index/msg-notice", //短信接口 
  activitycode: _api_root + "designer/activity/qrcode-img", //活动详情二维码 
  usersig: _api_root + "designer/index/get-user-sig", //usersig 
  opuscode: _api_root + "designer/opus/qrcode-img", //作品详情二维码 
  packagecode: _api_root + "designer/package/qrcode-img", //套餐详情二维码 
  levelchange: _api_root + "designer/index/set-user-level", //修改会员角色
  levellist: _api_root + "designer/index/level", //获取会员角色
  sharecode: _api_root + "designer/index/share-qrcode", //获取分享二维码
  relation_list: _api_root + "designer/index/lists", //绑定上下级关系列表
  relation: _api_root + "share/bind-parent", //绑定上下级关系
  uploadvideo: _default_root + "upload/video", //上传视频
  copyactive: _api_root + "designer/activity/copy", //复制活动
  likeopus: _api_root + "designer/opus/like", //喜欢作品
  likepackage: _api_root + "designer/package/like", //喜欢套餐
  adbanner: _api_root + "designer/index/banner", //广告轮播
  servelist: _api_root + "designer/service/lists", //服务列表
  servedetail: _api_root + "designer/service/info", //服务详情
  delroom: _api_root + "designer/opus/del-room", //空间删除
  copy: _api_root + "designer/package/copy", //复制套餐
  message: _api_root + "designer/index/appointment-notice", //模板消息
  qrcode: _api_root + "designer/index/card-qrcode", //获取名片码
  addformid: _api_root + "designer/index/add-formid", //保存formid
  getformid: _api_root + "designer/index/get-formid", //获取formid
  saveGoodPrice: _api_root + "designer/goods-snap/save-price", //保存商品价格
  saveCard: _api_root + "designer/index/register", //保存名片卡信息
  index1: _api_root + "designer/index/info", //首页详情
  addCardActivity: _api_root + "designer/timeline/save", //名片动态添加
  receiverCard: _api_root + "designer/index/add-card", //收下名片
  star: _api_root + "designer/index/star", //名片点赞
  delStar: _api_root + "designer/index/del-star", //名片点赞取消
  leftMobile: _api_root + "designer/index/contact-me", //预约(留下电话号码)
  cancleSettop: _api_root + "designer/timeline/cancel-top", //动态取消置顶
  shareOpus: _api_root + "designer/opus/qrcode", //作品海报分享
  sharePackage: _api_root + "designer/package/qrcode", //作品海报分享

  productList: _api_root + "default/cat-list", //产品库-商品分类列表

  cardList: _api_root + "designer/index/card-lists", //我的名片夹
  delCard: _api_root + "designer/index/del-card", //我的名片夹
  cardActivity: _api_root + "designer/timeline/lists", //名片动态列表
  cartList: _api_root + "designer/index/goods-lists", //系统商品列表

  savePic: _api_root + "designer/index/qrcode", //保存名片二维码
  saveProject: _api_root + "designer/opus/save", //添加作品
  projectList: _api_root + "designer/opus/lists", //用户作品列表
  setShow: _api_root + "designer/opus/set-show", //作品设置展示
  setTop: _api_root + "designer/opus/set-top", //作品设置置顶
  productDetail: _api_root + "designer/opus/info", //作品详情	
  styleList: _api_root + "designer/opus/style", //风格列表 

  roomList: _api_root + "designer/opus/room", //空间列表 
  addRoom: _api_root + "designer/opus/add-room", //新增空间
  enqrcode: _api_root + "designer/activity/enroll-qrcode", //报名海报

  saveGroup: _api_root + "designer/package/save", //添加套餐
  groupList: _api_root + "designer/package/lists", //用户套餐列表	
  groupDetail: _api_root + "designer/package/info", //用户套餐详情	
  setShowGroup: _api_root + "designer/package/set-show", //套餐设置展示
  deleteGroup: _api_root + "designer/package/delete", //删除套餐

  addTemporaryPro: _api_root + "designer/goods-snap/save", //新增临时商品
  delTemporaryPro: _api_root + "designer/goods-snap/del", //删除临时商品
  goodsDetail: _api_root + "designer/goods-snap/info", //商品详情

  saveActivity: _api_root + "designer/activity/save", //保存活动
  delActivity: _api_root + "designer/activity/delete", //删除活动
  activityList: _api_root + "designer/activity/lists", //用户活动列表
  activityDetail: _api_root + "designer/activity/info", //用户活动详情
  enrollActivity: _api_root + "designer/activity/enroll", //活动报名
  enrollList: _api_root + "designer/activity/enroll-list", //活动报名列表
  cancleEnroll: _api_root + "designer/activity/enroll-delete", //取消我的报名
  enrollInfo: _api_root + "designer/activity/enroll-info", //活动我的报名信息

  empower: _api_root + "user/user-binding", //手机授权

  shareActivity: _api_root + "designer/activity/qrcode", //活动分享海报



  index: _api_root + "default/index",
  default: {
    store: _api_root + "default/store",
    index: _api_root + "default/index",
    goods_list: _api_root + "default/goods-list",
    cat_list: _api_root + "default/cat-list",
    goods: _api_root + "default/goods",
    district: _api_root + "default/district",
    goods_attr_info: _api_root + "default/goods-attr-info",
    upload_image: _api_root + "default/upload-image",
    comment_list: _api_root + "default/comment-list",
    article_list: _api_root + "default/article-list",
    article_detail: _api_root + "default/article-detail",
    video_list: _api_root + "default/video-list",
    goods_qrcode: _api_root + "default/goods-qrcode",
    coupon_list: _api_root + "default/coupon-list",
    topic_list: _api_root + "default/topic-list",
    topic: _api_root + "default/topic",
    navbar: _api_root + "default/navbar",
    navigation_bar_color: _api_root + "default/navigation-bar-color",
    shop_list: _api_root + "default/shop-list",
    shop_detail: _api_root + "default/shop-detail",
    topic_type: _api_root + "default/topic-type",
    buy_data: _api_root + "default/buy-data",
    goods_recommend: _api_root + "default/goods-recommend",
    search: _api_root + "default/search",
    cats: _api_root + "default/cats",
    topic_qrcode: _api_root + "default/topic-qrcode",
    mini_upload_image: _default_root + "upload/mini-file"
  },
  cart: {
    list: _api_root + "cart/list",
    add_cart: _api_root + "cart/add-cart",
    delete: _api_root + "cart/delete",
    cart_edit: _api_root + "cart/cart-edit"
  },
  passport: {
    login: _api_root + "passport/login",
    on_login: _api_root + "passport/on-login"
  },
  order: {
    submit_preview: _api_root + "order/submit-preview",
    submit: _api_root + "order/submit",
    pay_data: _api_root + "order/pay-data",
    list: _api_root + "order/list",
    revoke: _api_root + "order/revoke",
    confirm: _api_root + "order/confirm",
    count_data: _api_root + "order/count-data",
    detail: _api_root + "order/detail",
    refund_preview: _api_root + "order/refund-preview",
    refund: _api_root + "order/refund",
    refund_detail: _api_root + "order/refund-detail",
    comment_preview: _api_root + "order/comment-preview",
    comment: _api_root + "order/comment",
    express_detail: _api_root + "order/express-detail",
    clerk: _api_root + "order/clerk",
    clerk_detail: _api_root + "order/clerk-detail",
    get_qrcode: _api_root + "order/get-qrcode",
    location: _api_root + "order/location",
    refund_send: _api_root + "order/refund-send",
    new_submit_preview: _api_root + "order/new-submit-preview",
    new_submit: _api_root + "order/new-submit"
  },
  user: {
    address_list: _api_root + "user/address-list",
    address_detail: _api_root + "user/address-detail",
    address_save: _api_root + "user/address-save",
    address_set_default: _api_root + "user/address-set-default",
    address_delete: _api_root + "user/address-delete",
    save_form_id: _api_root + "user/save-form-id",
    favorite_add: _api_root + "user/favorite-add",
    favorite_remove: _api_root + "user/favorite-remove",
    favorite_list: _api_root + "user/favorite-list",
    index: _api_root + "user/index",
    wechat_district: _api_root + "user/wechat-district",
    add_wechat_address: _api_root + "user/add-wechat-address",
    topic_favorite: _api_root + "user/topic-favorite",
    topic_favorite_list: _api_root + "user/topic-favorite-list",
    member: _api_root + "user/member",
    card: _api_root + "user/card",
    card_qrcode: _api_root + "user/card-qrcode",
    card_clerk: _api_root + "user/card-clerk",
    web_login: _api_root + "user/web-login",
    submit_member: _api_root + "user/submit-member",
    user_binding: _api_root + "user/user-binding",
    user_hand_binding: _api_root + "user/user-hand-binding",
    user_empower: _api_root + "user/user-empower",
    sms_setting: _api_root + "user/sms-setting",
    authorization_bind: _api_root + "user/authorization-bind",
    check_bind: _api_root + "user/check-bind",
    card_detail: _api_root + "user/card-detail"
  },
  share: {
    join: _api_root + "share/join",
    check: _api_root + "share/check",
    get_info: _api_root + "share/get-info",
    get_price: _api_root + "share/get-price",
    apply: _api_root + "share/apply",
    cash_detail: _api_root + "share/cash-detail",
    get_qrcode: _api_root + "share/get-qrcode",
    shop_share: _api_root + "share/shop-share",
    bind_parent: _api_root + "share/bind-parent",
    get_team: _api_root + "share/get-team",
    get_order: _api_root + "share/get-order",
    index: _api_root + "share/index"
  },
  coupon: {
    index: _api_root + "coupon/index",
    share_send: _api_root + "coupon/share-send",
    receive: _api_root + "coupon/receive",
    coupon_detail: _api_root + "coupon/detail"
  },
  miaosha: {
    list: _api_root + "miaosha/list",
    goods_list: _api_root + "miaosha/goods-list",
    details: _api_root + "miaosha/details",
    submit_preview: _api_root + "miaosha/submit-preview",
    submit: _api_root + "miaosha/submit",
    pay_data: _api_root + "miaosha/pay-data",
    order_list: _api_root + "miaosha/order-list",
    order_details: _api_root + "miaosha/order-details",
    order_revoke: _api_root + "miaosha/revoke",
    express_detail: _api_root + "miaosha/express-detail",
    confirm: _api_root + "miaosha/confirm",
    comment_preview: _api_root + "miaosha/comment-preview",
    comment: _api_root + "miaosha/comment",
    refund_preview: _api_root + "miaosha/refund-preview",
    refund: _api_root + "miaosha/refund",
    refund_detail: _api_root + "miaosha/refund-detail",
    comment_list: _api_root + "miaosha/comment-list",
    goods_qrcode: _api_root + "miaosha/goods-qrcode"
  },
  group: {
    index: _api_root + "group/index/index",
    list: _api_root + "group/index/good-list",
    details: _api_root + "group/index/good-details",
    goods_attr_info: _api_root + "group/index/goods-attr-info",
    submit_preview: _api_root + "group/order/submit-preview",
    submit: _api_root + "group/order/submit",
    pay_data: _api_root + "group/order/pay-data",
    order: {
      list: _api_root + "group/order/list",
      detail: _api_root + "group/order/detail",
      express_detail: _api_root + "group/order/express-detail",
      comment_preview: _api_root + "group/order/comment-preview",
      comment: _api_root + "group/order/comment",
      confirm: _api_root + "group/order/confirm",
      goods_qrcode: _api_root + "group/order/goods-qrcode",
      get_qrcode: _api_root + "group/order/get-qrcode",
      clerk: _api_root + "group/order/clerk",
      clerk_order_details: _api_root + "group/order/clerk-order-details",
      revoke: _api_root + "group/order/revoke",
      refund_preview: _api_root + "group/order/refund-preview",
      refund: _api_root + "group/order/refund",
      refund_detail: _api_root + "group/order/refund-detail"
    },
    group_info: _api_root + "group/order/group",
    comment: _api_root + "group/index/goods-comment",
    goods_qrcode: _api_root + "group/index/goods-qrcode",
    search: _api_root + "group/index/search"
  },
  book: {
    index: _api_root + "book/index/index",
    list: _api_root + "book/index/good-list",
    details: _api_root + "book/index/good-details",
    submit_preview: _api_root + "book/order/submit-preview",
    submit: _api_root + "book/order/submit",
    order_list: _api_root + "book/order/list",
    order_cancel: _api_root + "book/order/cancel",
    order_pay: _api_root + "book/order/pay-data",
    order_details: _api_root + "book/order/order-details",
    shop_list: _api_root + "book/index/shop-list",
    get_qrcode: _api_root + "book/order/get-qrcode",
    clerk: _api_root + "book/order/clerk",
    apply_refund: _api_root + "book/order/apply-refund",
    comment_preview: _api_root + "book/order/comment-preview",
    submit_comment: _api_root + "book/order/comment",
    goods_comment: _api_root + "book/index/goods-comment",
    goods_qrcode: _api_root + "book/index/goods-qrcode",
    clerk_order_details: _api_root + "book/order/clerk-order-details",
    goods_attr_info: _api_root + "book/index/goods-attr-info"
  },
  quick: {
    quick: _api_root + "quick/quick/quick",
    quick_goods: _api_root + "quick/quick/quick-goods",
    quick_car: _api_root + "quick/quick/quick-car"
  },
  fxhb: {
    open: _api_root + "fxhb/index/open",
    open_submit: _api_root + "fxhb/index/open-submit",
    detail: _api_root + "fxhb/index/detail",
    detail_submit: _api_root + "fxhb/index/detail-submit"
  },
  recharge: {
    index: _api_root + "recharge/index",
    list: _api_root + "recharge/list",
    submit: _api_root + "recharge/submit",
    record: _api_root + "recharge/record",
    detail: _api_root + "recharge/detail"
  },
  mch: {
    apply: _api_root + "mch/index/apply",
    apply_submit: _api_root + "mch/index/apply-submit",
    shop: _api_root + "mch/index/shop",
    shop_list: _api_root + "mch/index/shop-list",
    shop_cat: _api_root + "mch/index/shop-cat",
    user: {
      myshop: _api_root + "mch/user/myshop",
      setting: _api_root + "mch/user/setting",
      setting_submit: _api_root + "mch/user/setting-submit",
      shop_qrcode: _api_root + "mch/user/shop-qrcode",
      account: _api_root + "mch/user/account",
      cash: _api_root + "mch/user/cash",
      account_log: _api_root + "mch/user/account-log",
      cash_log: _api_root + "mch/user/cash-log",
      tongji_year_list: _api_root + "mch/user/tongji-year-list",
      tongji_month_data: _api_root + "mch/user/tongji-month-data",
      cash_preview: _api_root + "mch/user/cash-preview",
      settle_log: _api_root + "mch/user/settle-log"
    },
    goods: {
      list: _api_root + "mch/goods/list",
      set_status: _api_root + "mch/goods/set-status",
      delete: _api_root + "mch/goods/delete"
    },
    order: {
      list: _api_root + "mch/order/list",
      detail: _api_root + "mch/order/detail",
      send: _api_root + "mch/order/send",
      refund: _api_root + "mch/order/refund",
      edit_price: _api_root + "mch/order/edit-price",
      refund_detail: _api_root + "mch/order/refund-detail"
    }
  },
  integral: {
    index: _api_root + "integralmall/integralmall/index",
    coupon_info: _api_root + "integralmall/integralmall/coupon-info",
    exchange_coupon: _api_root + "integralmall/integralmall/exchange-coupon",
    integral_pay: _api_root + "integralmall/integralmall/integral-pay",
    goods_info: _api_root + "integralmall/integralmall/goods-info",
    submit_preview: _api_root + "integralmall/integralmall/submit-preview",
    submit: _api_root + "integralmall/integralmall/submit",
    list: _api_root + "integralmall/integralmall/list",
    revoke: _api_root + "integralmall/integralmall/revoke",
    order_submit: _api_root + "integralmall/integralmall/order-submit",
    confirm: _api_root + "integralmall/integralmall/confirm",
    get_qrcode: _api_root + "integralmall/integralmall/get-qrcode",
    clerk_order_details: _api_root + "integralmall/integralmall/clerk-order-details",
    clerk: _api_root + "integralmall/integralmall/clerk",
    explain: _api_root + "integralmall/integralmall/explain",
    exchange: _api_root + "integralmall/integralmall/exchange",
    register: _api_root + "integralmall/integralmall/register",
    integral_detail: _api_root + "integralmall/integralmall/integral-detail"
  },
  pond: {
    index: _api_root + "pond/pond/index",
    lottery: _api_root + "pond/pond/lottery",
    prize: _api_root + "pond/pond/prize",
    send: _api_root + "pond/pond/send",
    setting: _api_root + "pond/pond/setting",
    submit: _api_root + "pond/pond/submit",
    qrcode: _api_root + "pond/pond/qrcode"
  },
  bargain: {
    index: _api_root + "bargain/default/index",
    goods: _api_root + "bargain/default/goods",
    bargain_submit: _api_root + "bargain/order/bargain-submit",
    activity: _api_root + "bargain/order/activity",
    bargain: _api_root + "bargain/order/bargain",
    order_list: _api_root + "bargain/order/order-list",
    setting: _api_root + "bargain/default/setting",
    goods_user: _api_root + "bargain/default/goods-user",
    qrcode: _api_root + "bargain/default/qrcode"
  },
  scratch: {
    index: _api_root + "scratch/scratch/index",
    receive: _api_root + "scratch/scratch/receive",
    setting: _api_root + "scratch/scratch/setting",
    prize: _api_root + "scratch/scratch/prize",
    submit: _api_root + "scratch/scratch/submit",
    log: _api_root + "scratch/scratch/log",
    qrcode: _api_root + "scratch/scratch/qrcode"
  },
  lottery: {
    index: _api_root + "lottery/default/index",
    prize: _api_root + "lottery/default/prize",
    detail: _api_root + "lottery/default/detail",
    goods: _api_root + "lottery/default/goods",
    submit: _api_root + "lottery/default/submit",
    qrcode: _api_root + "lottery/default/qrcode"
  },
  activity: {
    create: _api_root + "designer/activity/save",
    info: _api_root + "designer/activity/info"
  }
};

module.exports = api;