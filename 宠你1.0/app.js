const config = {
  development: {
    apiBaseUrl: 'http://localhost:3000',
    cloudEnv: 'cloud1-9gsrrnz51c89064a'
  },
  production: {
    apiBaseUrl: 'http://localhost:3000',
    cloudEnv: 'cloud1-9gsrrnz51c89064a'
  }
};

const ENV = 'development'; // 可以通过构建时配置切换

App({
  globalData: {
    apiBaseUrl: config[ENV].apiBaseUrl,
    userInfo: null,
    isNetworkConnected: true
  },

  onLaunch() {
    this.initCloud();
    this.checkNetworkStatus();
    this.checkLoginStatus();
  },

  initCloud() {
    try {
      wx.cloud.init({
        env: config[ENV].cloudEnv,
        traceUser: true
      });
    } catch (error) {
      console.error('云开发环境初始化失败：', error);
      wx.showToast({
        title: '系统初始化失败',
        icon: 'none'
      });
    }
  },

  checkNetworkStatus() {
    wx.getNetworkType({
      success: (res) => {
        this.globalData.isNetworkConnected = res.networkType !== 'none';
      }
    });

    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      this.globalData.isNetworkConnected = res.isConnected;
      if (!res.isConnected) {
        wx.showToast({
          title: '网络连接已断开',
          icon: 'none'
        });
      }
    });
  },

  checkLoginStatus() {
    try {
      const token = wx.getStorageSync('token');
      if (token) {
        // 验证 token 有效性
        this.validateToken(token).then(valid => {
          if (valid) {
            wx.switchTab({ url: '/pages/index/index' });
          } else {
            this.handleInvalidToken();
          }
        });
      }
    } catch (error) {
      console.error('登录状态检查失败：', error);
      this.handleInvalidToken();
    }
  },

  validateToken(token) {
    // 这里添加验证 token 的逻辑
    return new Promise((resolve) => {
      wx.request({
        url: `${this.globalData.apiBaseUrl}/auth/validate`,
        header: { 'Authorization': `Bearer ${token}` },
        success: (res) => resolve(res.data.valid),
        fail: () => resolve(false)
      });
    });
  },

  handleInvalidToken() {
    wx.removeStorageSync('token');
    wx.redirectTo({ url: '/pages/login/login' });
  }
});