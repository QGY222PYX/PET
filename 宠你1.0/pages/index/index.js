const app = getApp();

Page({
  data: {
    imagePath: '',
    imageValid: false,
    resultText: ''
  },

  // 选择图片（拍照/相册）
  chooseImage(e) {
    const sourceType = e.currentTarget.dataset.source;
    wx.chooseImage({
      count: 1,
      sourceType: [sourceType],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({ imagePath: tempFilePaths[0] }, () => this.validateImage());
      }
    });
  },

  // 图片验证（格式/大小/清晰度）
  validateImage() {
    const { imagePath } = this.data;
    if (!imagePath) return;

    // 格式验证
    const ext = imagePath.split('.').pop().toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(ext)) {
      wx.showToast({ title: '仅支持 PNG、JPG 格式图片', icon: 'none' });
      this.setData({ imageValid: false });
      return;
    }

    // 大小验证
    wx.getFileSystemManager().getFileInfo({
      filePath: imagePath,
      success: (res) => {
        if (res.size > 4 * 1024 * 1024) {
          wx.showToast({ title: '图片大小不能超过 4MB', icon: 'none' });
          this.setData({ imageValid: false });
          return;
        }

        // 清晰度验证
        wx.getImageInfo({
          src: imagePath,
          success: (imgRes) => {
            if (imgRes.width < 800 || imgRes.height < 600) {
              wx.showToast({ title: '请上传清晰度较高的图片', icon: 'none' });
              this.setData({ imageValid: false });
              return;
            }
            this.setData({ imageValid: true });
          }
        });
      }
    });
  },

  // 提交识别
  submitImage() {
    if (!this.data.imageValid) return;

    wx.showLoading({ title: '识别中...' });
    wx.uploadFile({
      url: app.globalData.baseUrl + '/analyze/pet',
      filePath: this.data.imagePath,
      name: 'image',
      formData: { token: wx.getStorageSync('token') },
      success: (res) => {
        const data = JSON.parse(res.data);
        if (data.code === 200) {
          this.setData({ resultText: `您的宠物处于${data.data.emotion}状态，环境${data.data.environment}` });
        } else {
          wx.showToast({ title: '识别失败，请重试', icon: 'none' });
        }
      },
      complete: () => wx.hideLoading()
    });
  }
});