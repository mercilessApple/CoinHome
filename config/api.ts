const http = (uni as any).$u.http

// 注册
export const registered = (params: any) => http.post('/api/user/registered', params)

// 注册发送短信或者邮箱验证码
export const verificationCode = (params: any) => http.post('/api/user/registered/send/verification-code', params)

// 查询国家区号
export const querytheCountryCode = (params: any) => http.post('/api/user/list', params)

// 登录
export const userLogin = (params: any) => http.post('/api/user/login', params)

// 找回密码手机或者邮箱发送验证码
export const findPwdVerificationCode = (params: any) => http.post('/api/user/find/Password/send/verification-code', params)

// 设置修改登录密码
export const updateLoginPassword = (params: any) => http.post('/api/user/update/login-password', params)

// Banner列表
export const banners = (params: any) => http.post('/api/user/banners', params)

// 公告--App公告列表
export const announcements = (params: any) => http.post('/api/user/announcements', params)

// 自选---获取自选交易对行情
export const getOptionalMarket = (params: any) => http.post('/api/market/get/optional', params)

// 币币--根据分区名称获取交易对
export const getTickerByPartitionMarket = (params: any) => http.post('/api/market/ticker-by-partition', params)

// 查询用户信息
export const userInfo = (params: any) => http.post('/api/user/info', params)

// 查询账户总资产总数
export const queryAccountSum = (params: any) => http.post('/api/account/query/sum', params)

// 查询账户总资产
export const queryAccountInfo = (params: any) => http.post('/api/account/query/info', params)

// 获取热门币种
export const queryHotCoins = (params: any) => http.post('/api/account/query/hot/coins', params)

// 查询充币币种信息
export const queryDepositPayCoin = (params: any) => http.post('/api/account/pay/query/deposit/coin', params)

// 查询交易记录
export const queryAccountTransfer = (params: any) => http.post('/api/account/query/transfer', params)

// 查询提币币种信息
export const queryWithdrawCoin= (params: any) => http.post('/api/account/pay/query/withdraw/coin', params)

// 提币
export const withdraw= (params: any) => http.post('/api/account/pay/withdraw', params)

// 用户--修改昵称
export const updateNickName= (params: any) => http.post('/api/user/update/info', params)

// 退出登录
export const signOut= (params: any) => http.post('/api/user/sign-out', params)

// 获取随机用户昵称
export const getNickName= (params: any) => http.post('/api/user/get/nickName', params)

export const updatePhone = (params: any) => http.post('/api/user/update/phone-or-email', params)