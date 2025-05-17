const app = getApp();
const { wxPromise } = require('../../utils/util.js');

Page({
  data: {
    phone: '',
    code: '',
    username: '',
    password: '',
    phoneValid: false,
    codeValid: false,
    usernameValid: false,
    passwordValid: false,
    formValid: false,
    countdown: 0
  },

  // 手机号输入验证
  checkPhone(e) {
    const phone = e.detail.value;
    const reg = /^1[3-9]\d{9}$/;
    const valid = reg.test(phone);
    this.setData({ phone, phoneValid: valid }, this.checkFormValid);
    if (!valid && phone) wx.showToast({ title: '请输入正确的11位手机号', icon: 'none' });
  },

  // 获取验证码
  getCode() {
    if (!this.data.phoneValid) {
      wx.showToast({ title: '请先输入正确的手机号', icon: 'none' });
      return;
    }
    if (this.data.countdown > 0) return;
    this.setData({ countdown: 60 });
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: this.data.countdown - 1 });
      }
    }, 1000);
    // 调用短信接口发送验证码（模拟）
    this.wxPromise(wx.request, {
      url: app.globalData.apiBaseUrl + '/user/sendCode',
      method: 'POST',
      data: { phone: this.data.phone }
    }).then(res => {
      if (res.data.code !== 200) {
        wx.showToast({ title: '验证码发送失败', icon: 'none' });
      }
    });
  },

  // 验证码输入验证
  checkCode(e) {
    const code = e.detail.value;
    this.setData({ code, codeValid: code.length === 6 }, this.checkFormValid);
  },

  // 用户名输入验证
  checkUsername(e) {
    const username = e.detail.value;
    this.setData({ username, usernameValid: username.trim() !== '' }, this.checkFormValid);
    if (!username.trim()) wx.showToast({ title: '用户名不能为空', icon: 'none' });
  },

  // 密码输入验证
  checkPassword(e) {
    const password = e.detail.value;
    const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/;
    const valid = reg.test(password);
    this.setData({ password, passwordValid: valid }, this.checkFormValid);
    if (!valid && password) wx.showToast({ title: '密码需8-12位，包含数字和大小写字母', icon: 'none' });
  },

  // 表单整体有效性验证
  checkFormValid() {
    const { phoneValid, codeValid, usernameValid, passwordValid } = this.data;
    this.setData({ formValid: phoneValid && codeValid && usernameValid && passwordValid });
  },

  // 提交注册
  handleRegister() {
    if (!this.data.formValid) return;
    this.wxPromise(wx.request, {
      url: app.globalData.apiBaseUrl + '/user/register',
      method: 'POST',
      data: {
        phone: this.data.phone,
        code: this.data.code,
        username: this.data.username,
        password: this.data.password
      }
    }).then(res => {
      if (res.data.code === 200) {
        wx.showToast({ title: '注册成功，跳转至登录页面', duration: 3000 });
        setTimeout(() => wx.navigateBack(), 3000);
      } else {
        wx.showToast({ title: '注册失败，请检查信息并重试', icon: 'none' });
      }
    });
  }
});