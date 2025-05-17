const { PetMood, SceneType, LightCondition, PetBreedTraits } = require('../mock/data');

// 基础提示词模板
const basePromptTemplates = {
  // 场景分析提示词
  scene: `分析图像中的场景特征:
- 场景类型: {具体位置是什么？例如：客厅、卧室、草地等}
- 场景特征: {场景中的主要物体和环境特征}
- 光线条件: {光线的类型和强度如何？是自然光还是人工光？}
请根据以上特征，判断场景类型: ${Object.values(SceneType).join(', ')}
光线条件: ${Object.values(LightCondition).join(', ')}`,

  // 宠物情绪分析提示词
  mood: `分析宠物的情绪状态表现:
- 身体姿态: {姿势是放松还是紧张? 尾巴、耳朵位置如何?}
- 面部表情: {眼睛、嘴部表情如何?}
- 活动状态: {是否在运动? 动作幅度如何?}
请根据以上特征，判断情绪类型: ${Object.values(PetMood).join(', ')}`,

  // 品种特征分析提示词
  breed: `识别宠物的品种特征:
- 体型特征: {体型大小、体型比例}
- 毛发特征: {毛色、毛长、毛质}
- 面部特征: {脸型、耳朵、眼睛特征}
- 肢体特征: {四肢长度、尾巴特征}
请判断具体品种，并列出关键识别特征。`
};

// 生成完整的图像分析提示词
const generateImageAnalysisPrompt = (petType) => {
  const breedOptions = Object.keys(PetBreedTraits[petType])
    .map(breed => PetBreedTraits[petType][breed].name)
    .join('、');

  return `请分析这张宠物图片，生成结构化描述：

1. 品种识别
${basePromptTemplates.breed}
可能的品种包括：${breedOptions}

2. 场景识别
${basePromptTemplates.scene}

3. 情绪状态
${basePromptTemplates.mood}

请以JSON格式输出分析结果：
{
  "breed": {
    "identified_breed": "品种名称",
    "confidence": "识别可信度(0-1)",
    "key_features": ["关键特征1", "关键特征2"]
  },
  "scene": {
    "type": "场景类型(SceneType中的值)",
    "light_condition": "光线条件(LightCondition中的值)",
    "scene_objects": ["场景中的主要物体1", "物体2"],
    "confidence": "场景判断可信度(0-1)"
  },
  "mood": {
    "current_mood": "情绪状态",
    "confidence": "情绪判断可信度(0-1)",
    "indicators": {
      "body_posture": "身体姿态描述",
      "facial_expression": "面部表情描述",
      "activity_level": "活动状态描述"
    }
  }
}`;
};

// 生成文本分析提示词
const generateTextAnalysisPrompt = () => {
  return `分析以下文本描述，提取宠物状态相关信息：

请识别以下关键信息：
1. 场景描述中的具体特征
2. 光线条件描述
3. 宠物的情绪表现特征
4. 可能的品种特征

请以JSON格式输出分析结果：
{
  "text_features": {
    "scene_mentions": ["提到的场景特征1", "特征2"],
    "light_mentions": ["提到的光线特征1", "特征2"],
    "mood_indicators": ["情绪指标1", "指标2"],
    "breed_hints": ["品种特征1", "特征2"]
  },
  "derived_status": {
    "scene": {
      "type": "场景类型",
      "light_condition": "光线条件",
      "confidence": "可信度"
    },
    "mood": {
      "type": "情绪类型",
      "confidence": "可信度"
    }
  }
}`;
};

// 生成特征对齐验证提示词
const generateFeatureAlignmentPrompt = (imageFeatures, textFeatures) => {
  return `请对比以下图像特征和文本描述的一致性：

图像分析结果：
${JSON.stringify(imageFeatures, null, 2)}

文本描述特征：
${JSON.stringify(textFeatures, null, 2)}

请分析：
1. 特征一致性
2. 可能的冲突点
3. 综合判断建议

输出格式：
{
  "alignment": {
    "consistent_features": ["一致的特征1", "特征2"],
    "conflicts": ["冲突点1", "冲突点2"],
    "confidence_score": "特征对齐可信度(0-1)"
  },
  "final_judgment": {
    "scene": {
      "type": "最终场景判断",
      "light_condition": "最终光线判断"
    },
    "mood": "最终情绪判断",
    "confidence": "综合判断可信度"
  },
  "suggestions": ["建议1", "建议2"]
}`;
};

// 生成品种特定的行为分析提示词
const generateBreedSpecificPrompt = (breed, type) => {
  const breedInfo = PetBreedTraits[type][breed];
  
  return `基于${breedInfo.name}的品种特征进行行为分析：

品种特征：
- 性格特点：${breedInfo.personality.join('、')}
- 偏好场景：${breedInfo.preferred_scenes.join('、')}

请分析当前表现是否符合品种特征：
1. 性格表现符合度
2. 场景偏好符合度
3. 行为是否符合品种特点

输出格式：
{
  "breed_trait_alignment": {
    "personality_match": "性格符合度(0-1)",
    "scene_preference_match": "场景偏好符合度(0-1)",
    "behavior_consistency": "行为符合度(0-1)"
  },
  "observations": {
    "matching_traits": ["符合的特征1", "特征2"],
    "unusual_behaviors": ["异常行为1", "行为2"]
  },
  "recommendations": ["建议1", "建议2"]
}`;
};

module.exports = {
  generateImageAnalysisPrompt,
  generateTextAnalysisPrompt,
  generateFeatureAlignmentPrompt,
  generateBreedSpecificPrompt
}; 