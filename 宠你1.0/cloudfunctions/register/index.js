'use strict';
const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-9gsrrnz51c89064a' });
const db = cloud.database();
const _ = db.command;

// 密码哈希库（bcrypt支持更安全的密码哈希）
const bcrypt = require('bcryptjs');

exports.main = async (event, context) => {
  try {
    // 参数验证
    const { phone, code, username, password } = event;
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { code: 4001, msg: '手机号格式错误' };
    }
    if (code.length !== 6) {
      return { code: 4002, msg: '验证码需为6位数字' }; // 明确格式要求
    }
    if (!username.trim()) {
      return { code: 4003, msg: '用户名不能为空或全空格' }; // 明确空值类型
    }
    if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,12}$/.test(password)) {
      return { code: 4004, msg: '密码需8-12位，包含数字和大小写字母' };
    }

    // 验证验证码（从缓存获取，键名格式：sms_code_+手机号）
    const cacheRes = await cloud.callFunction({
      name: 'getCache',
      data: { key: `sms_code_${phone}` }
    });
    if (cacheRes.result.code !== 200 || cacheRes.result.data !== code) {
      return { code: 4005, msg: '验证码错误或已过期' };
    }

    // 检查用户名唯一性（区分大小写）
    const userRes = await db.collection('users').where({ username }).get();
    if (userRes.data.length > 0) {
      return { code: 4006, msg: '该用户名已被注册' }; // 明确提示类型
    }

    // 密码哈希处理（盐值复杂度10）
    const hash = await bcrypt.hash(password, 10);

    // 插入用户数据（自动生成创建时间）
    const insertRes = await db.collection('users').add({
      data: {
        phone,
        username,
        password: hash,
        createTime: db.serverDate()
      }
    });

    return { code: 200, msg: '注册成功', data: { userId: insertRes._id } };
  } catch (err) {
    console.error('注册失败:', err);
    return { code: 500, msg: '服务器内部错误' };
  }
};