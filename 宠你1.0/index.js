const PetAnalyzer = require('./utils/analyzer');
const { EmotionalStates, SceneTypes, LightingConditions } = require('./mock/data');

// 创建分析器实例
const analyzer = new PetAnalyzer();

// 示例：分析宠物图像
async function analyzePetImage(imagePath, context = {}) {
    try {
        console.log('开始分析宠物图像...');
        const imageData = await loadImage(imagePath);
        const analysis = await analyzer.analyzeImage(imageData, context);
        console.log('图像分析结果:', JSON.stringify(analysis, null, 2));
        return analysis;
    } catch (error) {
        console.error('图像分析失败:', error.message);
        throw error;
    }
}

// 示例：分析文本描述
async function analyzePetDescription(text) {
    try {
        console.log('开始分析文本描述...');
        const analysis = await analyzer.analyzeText(text);
        console.log('文本分析结果:', JSON.stringify(analysis, null, 2));
        return analysis;
    } catch (error) {
        console.error('文本分析失败:', error.message);
        throw error;
    }
}

// 示例：特征对齐分析
async function analyzeFeatureAlignment(petType, breed, observation) {
    try {
        console.log('开始特征对齐分析...');
        const analysis = await analyzer.analyzeFeatureAlignment(petType, breed, observation);
        console.log('特征对齐分析结果:', JSON.stringify(analysis, null, 2));
        return analysis;
    } catch (error) {
        console.error('特征对齐分析失败:', error.message);
        throw error;
    }
}

// 示例：生成综合报告
async function generateComprehensiveReport(imageAnalysis, textAnalysis, alignmentAnalysis) {
    try {
        console.log('开始生成综合报告...');
        const report = await analyzer.generateReport(imageAnalysis, textAnalysis, alignmentAnalysis);
        console.log('综合报告:', JSON.stringify(report, null, 2));
        return report;
    } catch (error) {
        console.error('报告生成失败:', error.message);
        throw error;
    }
}

// 辅助函数：加载图像
async function loadImage(imagePath) {
    // 这里应该实现实际的图像加载逻辑
    return {
        path: imagePath,
        data: Buffer.from('模拟图像数据')
    };
}

// 使用示例
async function runExample() {
    try {
        // 1. 分析图像
        const imageAnalysis = await analyzePetImage('path/to/pet/image.jpg', {
            time: new Date().toISOString(),
            location: 'indoor'
        });

        // 2. 分析文本描述
        const textAnalysis = await analyzePetDescription(
            '金毛正安静地趴在客厅的沙发上，阳光透过窗户洒在它的身上，看起来很享受这温暖的时光。'
        );

        // 3. 特征对齐分析
        const alignmentAnalysis = await analyzeFeatureAlignment(
            'DOG',
            'GOLDEN_RETRIEVER',
            {
                behavior: 'calm and relaxed',
                environment: 'comfortable indoor setting',
                interaction: 'passive but content'
            }
        );

        // 4. 生成综合报告
        const report = await generateComprehensiveReport(
            imageAnalysis,
            textAnalysis,
            alignmentAnalysis
        );

        return report;
    } catch (error) {
        console.error('示例运行失败:', error.message);
        throw error;
    }
}

// 导出功能函数
module.exports = {
    analyzePetImage,
    analyzePetDescription,
    analyzeFeatureAlignment,
    generateComprehensiveReport,
    runExample
};

// 如果直接运行此文件
if (require.main === module) {
    runExample()
        .then(() => console.log('示例运行完成'))
        .catch(error => console.error('示例运行失败:', error.message));
} 