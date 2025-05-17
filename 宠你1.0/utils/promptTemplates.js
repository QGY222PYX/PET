const { EmotionalStates, SceneTypes, LightingConditions } = require('../mock/data');

// 图像分析提示词模板
const imageAnalysisTemplate = {
    sceneAnalysis: (imageContext) => `
分析以下场景中的宠物环境：
- 场景类型：识别是否为 ${Object.values(SceneTypes).join(', ')} 中的场景
- 光线条件：判断是否为 ${Object.values(LightingConditions).join(', ')} 中的光线
- 环境要素：识别场景中的主要物品和环境特征
- 安全隐患：评估环境中可能存在的安全风险

请以JSON格式输出分析结果。
`,

    postureAnalysis: () => `
分析宠物的姿态表现：
- 身体姿势：站立、坐卧、趴伏等
- 肢体语言：尾巴、耳朵、眼神等状态
- 运动状态：静止、行走、奔跑等
- 与环境互动：与物品或其他生物的互动方式

请以JSON格式输出分析结果。
`,

    emotionalAnalysis: () => `
分析宠物的情绪状态：
- 情绪类型：识别是否为 ${Object.values(EmotionalStates).join(', ')} 中的情绪
- 面部表情：眼睛、嘴部、耳朵等部位表现
- 行为特征：与当前情绪相关的行为表现
- 情绪强度：评估情绪表现的程度

请以JSON格式输出分析结果。
`
};

// 文本分析提示词模板
const textAnalysisTemplate = {
    sceneDescription: (text) => `
分析以下文本描述中的场景信息：
"${text}"

请提取以下要素：
- 场景类型和特征
- 环境条件描述
- 时间和光线信息
- 场景中的关键物品

请以JSON格式输出分析结果。
`,

    emotionalDescription: (text) => `
分析以下文本描述中的情绪信息：
"${text}"

请提取以下要素：
- 情绪状态判断
- 情绪变化过程
- 引发情绪的原因
- 情绪表现方式

请以JSON格式输出分析结果。
`
};

// 特征对齐分析模板
const featureAlignmentTemplate = {
    breedCharacteristics: (breed, observation) => `
分析以下观察结果与品种特征的匹配度：
品种特征：${JSON.stringify(breed, null, 2)}
观察结果：${JSON.stringify(observation, null, 2)}

请评估：
- 行为表现与品种特征的一致性
- 异常行为的识别和原因分析
- 环境适应性评估
- 个性化特征分析

请以JSON格式输出分析结果。
`
};

// 标准化输出结构
const outputStructure = {
    imageAnalysis: {
        scene: {
            type: null,
            lighting: null,
            elements: [],
            safetyIssues: []
        },
        posture: {
            bodyPosition: null,
            bodyLanguage: {},
            movementState: null,
            interaction: null
        },
        emotion: {
            type: null,
            facialExpression: {},
            behavioralTraits: [],
            intensity: null
        }
    },
    textAnalysis: {
        scene: {
            type: null,
            characteristics: [],
            conditions: null,
            timeAndLighting: null,
            keyObjects: []
        },
        emotion: {
            state: null,
            progression: [],
            triggers: [],
            expressions: []
        }
    },
    featureAlignment: {
        breedConsistency: null,
        abnormalBehaviors: [],
        environmentalAdaptation: null,
        personalityTraits: []
    }
};

module.exports = {
    imageAnalysisTemplate,
    textAnalysisTemplate,
    featureAlignmentTemplate,
    outputStructure
}; 