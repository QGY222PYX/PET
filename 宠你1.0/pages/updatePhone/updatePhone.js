Page({
  data: {
    phone: '',
    code: '',
    phoneError: false,
    phoneErrorMsg: '',
    countdown: 0,
    codeBtnDisabled: false,
    submitDisabled: true
  },

  // 手机号输入处理
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({ 
      phone,
      phoneError: false,
      phoneErrorMsg: ''
    });
    
    // 实时校验手机号格式
    if (phone && phone.length !== 11) {
      this.setData({
        phoneError: true,
        phoneErrorMsg: '手机号格式错误'
      });
    }
    
    this.updateSubmitStatus();
  },

  // 验证码输入处理
  onCodeInput(e) {
    const code = e.detail.value;
    this.setData({ code });
    this.updateSubmitStatus();
  },

  // 发送验证码
  onSendCode() {
    const { phone } = this.data;
    
    // 校验手机号
    if (!phone) {
      this.setData({
        phoneError: true,
        phoneErrorMsg: '请输入手机号'
      });
      return;
    }
    
    if (phone.length !== 11) {
      this.setData({
        phoneError: true,
        phoneErrorMsg: '手机号格式错误'
      });
      return;
    }

    // 开始倒计时
    this.setData({
      countdown: 60,
      codeBtnDisabled: true
    });
    
    this.startCountdown();
    
    wx.showToast({
      title: '验证码已发送',
      icon: 'success'
    });
  },

  // 倒计时处理
  startCountdown() {
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer);
        this.setData({
          countdown: 0,
          codeBtnDisabled: false
        });
      } else {
        this.setData({
          countdown: this.data.countdown - 1
        });
      }
    }, 1000);
  },

  // 提交表单
  onSubmit() {
    const { phone, code } = this.data;
    
    // 校验空值
    if (!phone || !code) {
      wx.showToast({
        title: '手机号或验证码不能为空',
        icon: 'none'
      });
      return;
    }
    
    // 校验手机号格式
    if (phone.length !== 11) {
      this.setData({
        phoneError: true,
        phoneErrorMsg: '手机号格式错误'
      });
      return;
    }

    // 直接更新手机号
    wx.showToast({
      title: '手机号修改成功',
      icon: 'success',
      duration: 2000,
      success: () => {
        // 延迟返回，确保提示显示完整
        setTimeout(() => {
          // 返回上一页并刷新
          const pages = getCurrentPages();
          const prevPage = pages[pages.length - 2];
          prevPage.onLoad();
          wx.navigateBack();
        }, 2000);
      }
    });
  },

  // 更新提交按钮状态
  updateSubmitStatus() {
    const { phone, code, phoneError } = this.data;
    this.setData({
      submitDisabled: !phone || !code || phoneError
    });
  }
}); 