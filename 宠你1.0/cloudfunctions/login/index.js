'use strict';
const cloud = require('wx-server-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
cloud.init({ env: 'cloud1-9gsrrnz51c89064a' });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // 参数校验 --------
    const { phone, password } = event;
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      return { code: 400, msg: '手机号格式错误' };
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,16}$/.test(password)) {
      return { code: 400, msg: '密码需8-16位且包含字母和数字' };
    }

    // 用户查询 --------
    const { data: users } = await db.collection('users')
      .where({ phone })
      .limit(1)
      .get();
      
    if (users.length === 0) {
      return { code: 404, msg: '用户不存在' }; // 明确区分用户不存在
    }

    // 密码验证 --------（bcrypt.compare可能抛出的错误已被外层catch捕获）
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { code: 401, msg: '密码错误' }; // 明确区分密码错误
    }

    // Token生成 --------
    const token = jwt.sign(
      { 
        userId: user._id,
        role: user.role || 'user' 
      },
      process.env.JWT_SECRET, // 从环境变量获取密钥
      { expiresIn: '2h' }
    );

    return {
      code: 200,
      data: {
        token,
        userId: user._id,
        expiresIn: 7200 // 有效期秒数
      }
    };

  } catch (err) {
    console.error('Login Error:', {
      code: err.code,
      message: err.message,
      stack: err.stack,
      input: event
    });
    
    // 特殊错误处理
    if (err.code === 'ECONNREFUSED') {
      return { code: 503, msg: '服务暂时不可用' };
    }
    
    return { code: 500, msg: '系统服务异常' };
  }
};