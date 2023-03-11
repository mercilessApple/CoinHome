import {
    checkVersion,
} from "@/config/api"

// 小数位数解析（不四舍五入）
export const decimal = (num, digit) => {
    let temp = Math.pow(10, digit)
    return Math.floor(num * temp) / temp
}

// 客服url
export const serviceURL = 'http://192.168.2.24:8046/customer/service/chat?u=' + uni.getStorageSync('userInfo').uid

// 帮助中心
export const helpCenterURL = 'https://coinhome-1.gitbook.io/coinhome-bang-zhu-zhong-xin/'

// 关于我们
export const aboutUsURL = 'https://coinhome-1.gitbook.io/coinhome-bang-zhu-zhong-xin/coinhome-bang-zhu-zhong-xin/guan-yu-coinhome'

// 模糊搜索
export const fuzzyQuery = (list, keyWord, val) => {
    var arr = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i][val].toUpperCase().indexOf(keyWord.toUpperCase()) >= 0) {
            arr.push(list[i]);
        }
    }
    return arr;
}

// 检测app更新
let status = false
export const checkUpdate = (self, isToast = false) => {
    // #ifdef APP-PLUS
    plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
        if (isToast) {
            uni.showLoading({
                title: self.$t('正在检查...'),
                mask: true
            })
        }
        checkVersion({}, {
            header: {
                version: widgetInfo.version,
                deviceType: 2,
            }
        }).then(result => {
            if (result.needUpdate && result.downloadUrl) {
                uni.hideLoading()
				if(status){		//	不需要再次弹起窗口
					return
				}
				status = true
                uni.showModal({
                    title: self.$t('发现新版本'),
                    content: result.detail,
                    showCancel: result.forceUpdate != 1,
                    confirmText: self.$t('立即更新'),
                    cancelText: self.$t('暂不更新'),
                    success: (event) => {
                        if (event.confirm) {
                            uni.showLoading({
                                mask: true
                            })
                            uni.downloadFile({
                                url: result.downloadUrl,
                                success: (downloadResult) => {
                                    if (downloadResult.statusCode ===
                                        200) {
                                        uni.hideLoading()
                                        plus.runtime.install(downloadResult
                                                .tempFilePath, {
                                                force: false
                                            },
                                            function () {
                                                console.log(
                                                    'install success...'
                                                );
                                                plus.runtime.restart();
                                            },
                                            function (e) {
                                                console.error(
                                                    'install fail...'
                                                );
                                                uni.showToast({
                                                    title: JSON
                                                        .stringify(
                                                            e),
                                                    icon: 'error'
                                                })
                                            });
                                    } else {
                                        uni.showToast({
                                            title: JSON
                                                .stringify(
                                                    downloadResult
                                                ),
                                            icon: 'error'
                                        })
                                    }
                                },
                                fail: (e) => {
                                    uni.showToast({
                                        title: JSON
                                            .stringify(
                                                e),
                                        icon: 'error'
                                    })
                                }
                            });
                        }
                    }
                })
            } else {
                if (isToast) {
                    uni.showToast({
                        title: self.$t('已是最新版'),
                        icon: 'none'
                    })
                }
            }
        })
    });
    // #endif
}

// 密码正则表达式
export const pwdREG = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]])[A-Za-z\d`~!@#$%^&*()_+<>?:"{},.\/\\;'[\]]{8,}$/

export const emailREG = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/