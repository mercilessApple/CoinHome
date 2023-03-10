const http = uni.$u.http

// 注册
export const registered = (params) => http.post('/api/user/registered', params)

// 注册发送短信或者邮箱验证码
export const verificationCode = (params) => http.post('/api/user/registered/send/verification-code', params)

// 查询国家区号
export const querytheCountryCode = (params) => http.post('/api/user/list', params)

// 登录
export const userLogin = (params) => http.post('/api/user/login', params)

// 找回密码手机或者邮箱发送验证码
export const findPwdVerificationCode = (params) => http.post('/api/user/find/Password/send/verification-code', params)

// 设置修改登录密码
export const updateLoginPassword = (params) => http.post('/api/user/update/login-password', params)

// Banner列表
export const banners = (params) => http.post('/api/user/banners', params)

// 公告--App公告列表
export const announcements = (params) => http.post('/api/user/announcements', params)

// 自选---获取自选交易对行情
export const getOptionalMarket = (params) => http.post('/api/market/get/optional', params)

// 币币--根据分区名称获取交易对
export const getTickerByPartitionMarket = (params) => http.post('/api/market/ticker-by-partition', params)

// 查询用户信息
export const userInfo = (params) => http.post('/api/user/info', params)

// 查询账户总资产总数
export const queryAccountSum = (params) => http.post('/api/account/query/sum', params)

// 查询账户总资产
export const queryAccountInfo = (params) => http.post('/api/account/query/info', params)

// 获取热门币种
export const queryHotCoins = (params) => http.post('/api/account/query/hot/coins', params)

// 查询充币币种信息
export const queryDepositPayCoin = (params) => http.post('/api/account/query/deposit/coin', params)

// 查询交易记录
export const queryAccountTransfer = (params) => http.post('/api/account/query/transfer', params)

// 查询提币币种信息
export const queryWithdrawCoin = (params) => http.post('/api/account/query/withdraw/coin', params)

// 提币
export const withdraw = (params) => http.post('/api/account/pay/withdraw', params)

// 用户--修改昵称
export const updateNickName = (params) => http.post('/api/user/update/info', params)

// 退出登录
export const signOut = (params) => http.post('/api/user/sign-out', params)

// 获取随机用户昵称
export const getNickName = (params) => http.post('/api/user/get/nickName', params)

export const updatePhone = (params) => http.post('/api/user/update/phone-or-email', params)

// 用戶委托单列表查询
export const getUserEntrustList = (params) => http.post('/api/order/user-entrust-list', params)

// 登录发送手机或者邮箱验证码
export const sendVerificationCode = (params) => http.post('/api/user/send/verification-code', params)

// 校验短信或者邮箱验证码
export const checkVerificationCode = (params) => http.post('/api/user/check/verification-code', params)

// 用户修改登录密码（已登录状态)
export const editUserPassword = (params) => http.post('/api/user/edit/password', params)

// 设置修改资金密码
export const updateFundsPassword = (params) => http.post('/api/user/update/funds-password', params)

// 委托单--历史记录
export const getEntrustHistory = (params) => http.post('/api/order/entrust-history-pagination', params)

// 币币/合约--获取盘口
export const getMarketDeeps = (params) => http.post('/api/market/deeps', params)

// 币币/合约--获取k线
export const getMarketKline = (params) => http.post('/api/market/kLine', params)

// 币币/合约--获取深度图
export const getMarketDepth = (params) => http.post('/api/market/depth', params)

export const queryCoinIntroduction = (params) => http.post('/api/account/query/coin-introduction', params)

// 客户下单
export const addUserEntrustOrder = (params) => http.post('/api/order/add/user-entrust', params)

// 自选---添加自选
export const addOptionalMarket = (params) => http.post('/api/market/add/optional', params)

// 币币/合约--获取行情【指定交易对】
export const getTickerMarket = (params) => http.post('/api/market/ticker', params)

// 自选---删除自选
export const deleteOptionalMarket = (params) => http.post('/api/market/delete/optional', params)

// 单个委托单--成交明细
export const getOrderEntrustDetail = (params) => http.post('/api/order/entrust-detail-page', params)

// 撤单
export const cancelEntrustOrder = (params) => http.post('/api/order/cancel/entrust', params)

// 查询国家区号和支持的证件类型
export const queryCountryCode = (params) => http.post('/api/user/query/country-code', params)

// 初级身份实名验证
export const userPrimaryVerified = (params) => http.post('/api/user/primary-verified', params)

// 上传文件
export const uploadFile = (params) => http.upload('/api/user/file/upload-file', params)

// 身份实名验证
export const userVerified = (params) => http.post('/api/user/verified', params)

// 检测版本更新
export const checkVersion = (params, config) => http.post('/api/user/version', params, config)

// 币种列表信息
export const coinSimple = (params, config) => http.post('/api/admin/account/coin/simple', params, config)

// 查询币种基础信息
export const coinInfo = (params, config) => http.post('/api/account/query/basis/coin-info', params, config)

// 币币--获取交易对分区
export const queryMarketPartition = (params, config) => http.post('/api/market/partition', params, config)

export const invite = (params, config) => http.post('/api/admin/user/pay/invite/url', params, config)

// 公告--获取维护公告和弹窗公告
export const popupNotice = (params, config) => http.post('/api/user/announcements/windows', params, config)

// 谷歌--获取新的谷歌秘钥
export const getNewOne = (params, config) => http.post('/api/user/google/getNewOne', params, config)

// 谷歌--绑定/开启/关闭/解绑
export const googleUpdate = (params, config) => http.post('/api/user/google/update', params, config)


export const phoneOrEmailCode = (params, config) => http.post('/api/user/phone-or-email/code', params, config)


export const noviceGiftPack = (params, config) => http.post('/api/account/gift/state/novice-gift-pack', params, config)

export const marketTrade = (params, config) => http.post('/api/market/trade', params, config)

