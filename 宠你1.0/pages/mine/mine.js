// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {
            nickname: '用户昵称',
            gender: '女',
            phone: '150****9230',
            email: 'user@example.com',
            wechat: 'wechat_id',
            avatarUrl: '',
            nickName: ''
        },
        emotion: '', // 情绪分析结果
        environment: '' // 环境状态结果
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取用户信息
        this.getUserInfo();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    // 铅笔图标点击跳转编辑页
    editNickname() {
        wx.navigateTo({ url: '/pages/edit/nickname' });
    },

    editGender() {
        wx.navigateTo({ url: '/pages/edit/gender' });
    },

    editEmail() {
        wx.navigateTo({ url: '/pages/edit/email' });
    },

    editWechat() {
        wx.navigateTo({ url: '/pages/edit/wechat' });
    },

    // 修改手机号
    navigateToModifyPhone() {
        wx.navigateTo({ url: '/pages/modify-phone/modify-phone' });
    },

    // 退出登录
    handleLogout() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success: (res) => {
                if (res.confirm) {
                    // 清除登录状态
                    wx.clearStorage();
                    // 重置用户信息
                    this.setData({
                        userInfo: {
                            avatarUrl: '',
                            nickName: '',
                            phone: ''
                        }
                    });
                    // 可以选择跳转到登录页
                    // wx.redirectTo({
                    //   url: '/pages/login/login'
                    // });
                }
            }
        });
    },

    // 选择宠物图片并上传识别
    choosePetImage() {
        const that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                // 调用云函数recognize
                wx.cloud.callFunction({
                    name: 'recognize',
                    data: {
                        imagePath: tempFilePaths[0]
                    },
                    success: res => {
                        that.setData({
                            emotion: res.result.emotion,
                            environment: res.result.environment
                        });
                        wx.showToast({ title: '分析完成' });
                    },
                    fail: err => {
                        wx.showToast({ title: '分析失败', icon: 'none' });
                        console.error('云函数调用失败', err);
                    }
                });
            }
        });
    },

    onShareAppMessage() {

    },

    // 获取用户信息
    getUserInfo() {
        // 这里应该调用获取用户信息的接口
        // 暂时使用模拟数据
        this.setData({
            userInfo: {
                avatarUrl: '/images/default-avatar.png',
                nickName: '测试用户',
                phone: '13800138000',
                nickname: '测试用户',
                gender: '未设置',
                email: 'example@email.com',
                wechat: '未设置'
            }
        });
    },

    // 跳转到修改手机号页面
    onUpdatePhone() {
        wx.navigateTo({
            url: '/pages/updatePhone/updatePhone'
        });
    }
})