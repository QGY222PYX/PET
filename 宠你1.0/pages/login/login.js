Page({
  data: {
    isAgreed: true,
    showAuthModal: false,
    usingOtherPhone: false,
    phoneNumber: '135****2908',
    verifyCode: '',
    inputPhone: '',
    countdown: 0
  },

  onLoad() {
    // 页面加载时初始化
  },

  // 协议勾选状态变化
  onAgreeChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    })
  },

  // 显示授权弹窗
  showAuthModal() {
    if (!this.data.isAgreed) {
      wx.showToast({
        title: '请先同意用户协议和隐私政策',
        icon: 'none'
      })
      return
    }
    this.setData({
      showAuthModal: true,
      usingOtherPhone: false
    })
  },

  // 切换到其他手机号登录
  switchToOtherPhone() {
    this.setData({
      usingOtherPhone: true
    })
  },

  // 输入手机号
  onPhoneInput(e) {
    this.setData({
      inputPhone: e.detail.value
    })
  },

  // 获取验证码
  getVerifyCode() {
    const { inputPhone, countdown } = this.data
    if (countdown > 0) return
    if (!/^1[3-9]\d{9}$/.test(inputPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    // 发送验证码请求
    console.log('发送验证码到:', inputPhone)
    
    // 倒计时
    let countdownNum = 60
    this.setData({
      countdown: countdownNum
    })
    
    const timer = setInterval(() => {
      countdownNum--
      this.setData({
        countdown: countdownNum
      })
      if (countdownNum <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  },

  // 输入验证码
  onVerifyCodeInput(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  // 手机号验证码登录
  phoneLogin() {
    const { inputPhone, verifyCode } = this.data
    if (!/^1[3-9]\d{9}$/.test(inputPhone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }
    
    if (verifyCode.length !== 6) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: 'none'
      })
      return
    }
    
    // 调用后端接口验证
    console.log('手机号登录:', inputPhone, verifyCode)
    this.loginSuccess()
  },

  // 微信授权获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 先获取登录凭证code
      wx.login({ 
        success: (loginRes) => {
          const code = loginRes.code;
          const encryptedData = e.detail.encryptedData;
          const iv = e.detail.iv;
          
          // 调用后端接口
          this.loginByWechat(code, encryptedData, iv);
        },
        fail: () => {
          wx.showToast({ title: '获取登录凭证失败', icon: 'none' });
        }
      });
    } else {
      wx.showToast({ title: '授权登录失败，请重试', icon: 'none' });
    }
  },

  // 微信登录请求后端
  loginByWechat(code, encryptedData, iv) {
    const app = getApp();
    wx.request({ 
      url: app.globalData.baseUrl + '/login/wechat',
      method: 'POST',
      data: { code, encryptedData, iv },
      success: (res) => {
        if (res.data.code === 200) {
          // 存储token
          wx.setStorageSync('token', res.data.data.token);
          this.loginSuccess();
        } else {
          wx.showToast({ title: res.data.msg || '登录失败', icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络请求失败', icon: 'none' });
      }
    });
  },

  // 登录成功处理
  loginSuccess() {
    this.setData({
      showAuthModal: false
    })
    
    wx.showToast({
      title: '登录成功',
      icon: 'success'
    })
    
    // 存储登录状态和token
    wx.setStorageSync('isLoggedIn', true);
    // token已在loginByWechat中存储
    
    // 跳转到首页
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }, 1500)
  },

  // 关闭授权弹窗
  closeAuthModal() {
    this.setData({
      showAuthModal: false,
      usingOtherPhone: false
    })
  }
})