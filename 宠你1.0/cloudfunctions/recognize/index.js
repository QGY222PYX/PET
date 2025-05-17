'use strict';
const cloud = require('wx-server-sdk');
const axios = require('axios');
cloud.init({ env: 'cloud1-9gsrrnz51c89064a' });

const GEMINI_API_KEY = process.env.GEMINI_KEY; // 从云环境变量获取API密钥

exports.main = async (event, context) => {
  try {
    const { image } = event;
    if (!image) {
      return { code: 4001, msg: '图片数据缺失' };
    }
    if (!image.startsWith('data:image/')) { // 简单验证图片base64格式
      return { code: 4002, msg: '图片格式无效' };
    }

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent',
      {
        model: 'gemini-pro-vision',
        content: [{
          role: 'user',
          parts: [{
            image: { imageBytes: image }
          }, {
            text: '分析宠物情绪及环境状态，输出格式：情绪：[结果]；环境状态：[结果]'
          }]
        }]
      },
      {
        headers: {
          'Authorization': `Bearer ${GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!response.data.candidates || response.data.candidates.length === 0) {
        return { code: 400, msg: 'Gemini API未返回有效结果' };
    }
    const resultText = response.data.candidates[0].content.parts[0].text;
    const emotionMatch = resultText.match(/情绪：(.*?)；/);
    const environmentMatch = resultText.match(/环境状态：(.*?)$/);

    if (!emotionMatch || !environmentMatch) {
      return { code: 4003, msg: '结果解析失败，请检查输出格式' };
    }

    return {
      code: 200,
      data: {
        emotion: emotionMatch[1],
        environment: environmentMatch[1]
      }
    };
  } catch (err) {
    console.error('图片分析失败:', err);
    return { code: 500, msg: '服务器内部错误' };
  }
};