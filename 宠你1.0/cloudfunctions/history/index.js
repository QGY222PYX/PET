'use strict';
const cloud = require('wx-server-sdk');
cloud.init({ env: 'cloud1-9gsrrnz51c89064a' });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  try {
    const { action, userId, recordId, content } = event;

    // 参数验证（4001:用户ID缺失）
    if (!userId) return { code: 4001, msg: '用户ID缺失' };

    switch (action) {
      case 'add':
        if (!content) return { code: 4002, msg: '记录内容缺失' }; // 4002:记录内容缺失
        // 扩展数据模型包含宠物状态识别核心字段
        const addRes = await db.collection('history').add({
          data: {
            userId,
            petId: event.petId || 'pet_'+Math.random().toString(36).substr(2,8), // 示例宠物ID（随机生成）
            emotion: event.emotion || ['开心','焦虑','平静'][Math.floor(Math.random()*3)], // 随机情绪状态
            environment: event.environment || ['舒适的室内','户外草坪','嘈杂的街道'][Math.floor(Math.random()*3)], // 随机环境状态
            imageHash: event.imageHash || 'hash_'+Math.random().toString(36).substr(2,16), // 示例图片哈希
            createTime: db.serverDate()
          }
        });
        return { code: 200, msg: '记录添加成功', data: { recordId: addRes._id } };

      case 'query':
        const { pageNum = 1, pageSize = 10 } = event; // 优化变量名
        if (pageNum < 1 || pageSize < 1) {
          return { code: 4006, msg: '分页参数错误' }; // 4006:分页参数错误
        }
        const totalRes = await db.collection('history').where({ userId }).count();
        const queryRes = await db.collection('history').where({ userId })
          .orderBy('createTime', 'desc')
          .skip((pageNum - 1) * pageSize)
          .limit(pageSize)
          .get();
        return { 
          code: 200, 
          data: {
            list: queryRes.data,
            total: totalRes.total,
            pageNum,
            pageSize
          }
        };

      case 'delete':
        if (!recordId) return { code: 4003, msg: '记录ID缺失' }; // 4003:记录ID缺失
        const deleteRes = await db.collection('history').doc(recordId).remove();
        if (deleteRes.stats.removed === 0) return { code: 4004, msg: '记录不存在' }; // 4004:记录不存在
        return { code: 200, msg: '记录删除成功' };

      default:
        return { code: 4005, msg: '无效操作类型' }; // 4005:无效操作类型
    }
  } catch (err) {
    console.error('历史记录操作失败:', err);
    return { code: 500, msg: '服务器内部错误' };
  }
};