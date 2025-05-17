'use strict';
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs'); // 引入bcrypt统一密码哈希方式
cloud.init({ env: 'cloud1-9gsrrnz51c89064a' });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const { action, userId, username, password } = event;

    // 参数验证（4001:用户ID缺失）
    if (!userId) return { code: 4001, msg: '用户ID缺失' };

    switch (action) {
      case 'get':
        const userRes = await db.collection('users').doc(userId).get();
        if (!userRes.data) return { code: 4002, msg: '用户不存在' };
        // 过滤敏感信息（移除密码字段）
        const { password: _, ...userInfo } = userRes.data;
        return { code: 200, data: userInfo };

      case 'update':
        const updateData = {};
        if (username) {
          const trimmedUsername = username.trim();
          if (!trimmedUsername) return { code: 4003, msg: '用户名不能为空' };
          // 检查用户名唯一性（排除当前用户）
          const usernameCheck = await db.collection('users').where({
            username: trimmedUsername,
            _id: _.neq(userId)
          }).get();
          if (usernameCheck.data.length > 0) {
            return { code: 4003, msg: '用户名已存在' };
          }
          updateData.username = trimmedUsername;
        }
        if (password) {
          if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/.test(password)) {
            return { code: 4004, msg: '密码需8-12位，包含数字和大小写字母' };
          }
          // 使用bcrypt进行密码哈希（与注册逻辑统一）
          updateData.password = await bcrypt.hash(password, 10);
        }
        if (Object.keys(updateData).length === 0) {
          return { code: 4005, msg: '无更新内容' };
        }
        const updateRes = await db.collection('users').doc(userId).update({
          data: updateData
        });
        if (updateRes.stats.updated === 0) return { code: 4006, msg: '用户不存在或无更新' };
        return { code: 200, msg: '信息更新成功' };

      default:
        return { code: 4007, msg: '无效操作类型' };
    }
  } catch (err) {
    console.error('用户信息操作失败:', err);
    return { code: 500, msg: '服务器内部错误' };
  }
};