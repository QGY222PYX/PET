// 情绪状态枚举
const EmotionalStates = {
    HAPPY: 'happy',
    EXCITED: 'excited',
    CALM: 'calm',
    ANXIOUS: 'anxious',
    TIRED: 'tired',
    PLAYFUL: 'playful',
    AGGRESSIVE: 'aggressive',
    NEUTRAL: 'neutral'
};

// 场景类型枚举
const SceneTypes = {
    LIVING_ROOM: 'living_room',
    GARDEN: 'garden',
    LAWN: 'lawn',
    BEDROOM: 'bedroom',
    KITCHEN: 'kitchen',
    BALCONY: 'balcony',
    BATHROOM: 'bathroom'
};

// 光线条件枚举
const LightingConditions = {
    BRIGHT_NATURAL: 'bright_natural',
    DIM_NATURAL: 'dim_natural',
    BRIGHT_ARTIFICIAL: 'bright_artificial',
    DIM_ARTIFICIAL: 'dim_artificial',
    DARK: 'dark'
};

// 宠物品种特征定义
const PetBreedCharacteristics = {
    DOG: {
        GOLDEN_RETRIEVER: {
            typicalTraits: ['friendly', 'gentle', 'intelligent'],
            activityLevel: 'high',
            size: 'large',
            coatType: 'long',
            commonEmotions: ['happy', 'excited', 'playful']
        },
        GERMAN_SHEPHERD: {
            typicalTraits: ['loyal', 'confident', 'courageous'],
            activityLevel: 'high',
            size: 'large',
            coatType: 'medium',
            commonEmotions: ['alert', 'protective', 'focused']
        },
        CHIHUAHUA: {
            typicalTraits: ['alert', 'quick', 'sassy'],
            activityLevel: 'moderate',
            size: 'small',
            coatType: 'short',
            commonEmotions: ['excited', 'anxious', 'alert']
        }
    },
    CAT: {
        PERSIAN: {
            typicalTraits: ['gentle', 'quiet', 'sweet'],
            activityLevel: 'low',
            size: 'medium',
            coatType: 'long',
            commonEmotions: ['calm', 'relaxed', 'lazy']
        },
        SIAMESE: {
            typicalTraits: ['social', 'vocal', 'intelligent'],
            activityLevel: 'high',
            size: 'medium',
            coatType: 'short',
            commonEmotions: ['playful', 'attention-seeking', 'active']
        },
        MAINE_COON: {
            typicalTraits: ['gentle', 'social', 'intelligent'],
            activityLevel: 'moderate',
            size: 'large',
            coatType: 'long',
            commonEmotions: ['friendly', 'playful', 'gentle']
        }
    }
};

// 模拟宠物数据记录
const mockPetRecords = [
    {
        id: 'pet001',
        name: '球球',
        type: 'DOG',
        breed: 'GOLDEN_RETRIEVER',
        age: 3,
        records: [
            {
                id: 'record001',
                timestamp: '2024-03-15T10:30:00Z',
                thumbnail: '/images/thumbnails/golden_happy_1.jpg',
                description: '检测到"可爱暴击"！您的金毛在阳光明媚的客厅里露出了标志性的微笑，幸福指数爆表！',
                emotionalState: 'happy',
                scene: 'living_room',
                lighting: 'bright_natural',
                activities: ['playing with toy', 'wagging tail'],
                vitalSigns: {
                    temperature: 38.5,
                    heartRate: 85,
                    respirationRate: 20
                }
            },
            {
                id: 'record002',
                timestamp: '2024-03-14T16:45:00Z',
                thumbnail: '/images/thumbnails/golden_playful_1.jpg',
                description: '欢乐时光！球球在花园里追逐蝴蝶，活力四射的样子让人忍俊不禁。',
                emotionalState: 'excited',
                scene: 'garden',
                lighting: 'bright_natural',
                activities: ['chasing butterflies', 'running around'],
                vitalSigns: {
                    temperature: 38.7,
                    heartRate: 95,
                    respirationRate: 25
                }
            },
            {
                id: 'record003',
                timestamp: '2024-03-13T20:15:00Z',
                thumbnail: '/images/thumbnails/golden_calm_1.jpg',
                description: '温馨一刻：球球在卧室里安静地趴着，眼神温柔地看着主人，仿佛在说"我爱你"。',
                emotionalState: 'calm',
                scene: 'bedroom',
                lighting: 'dim_artificial',
                activities: ['resting', 'gentle tail wagging'],
                vitalSigns: {
                    temperature: 38.3,
                    heartRate: 75,
                    respirationRate: 18
                }
            }
        ]
    },
    {
        id: 'pet002',
        name: '咪咪',
        type: 'CAT',
        breed: 'PERSIAN',
        age: 2,
        records: [
            {
                id: 'record004',
                timestamp: '2024-03-15T09:20:00Z',
                thumbnail: '/images/thumbnails/persian_lazy_1.jpg',
                description: '慵懒时光：波斯猫咪咪在阳台上晒太阳，享受着悠闲的早晨时光。',
                emotionalState: 'calm',
                scene: 'balcony',
                lighting: 'bright_natural',
                activities: ['sunbathing', 'gentle purring']
            },
            {
                id: 'record005',
                timestamp: '2024-03-14T21:30:00Z',
                thumbnail: '/images/thumbnails/persian_playful_1.jpg',
                description: '夜猫子上线！咪咪突然活力全开，在客厅里疯狂追逐逗猫棒。',
                emotionalState: 'playful',
                scene: 'living_room',
                lighting: 'dim_artificial',
                activities: ['playing with toy', 'jumping around']
            }
        ]
    },
    {
        id: 'pet003',
        name: '旺财',
        type: 'DOG',
        breed: 'GERMAN_SHEPHERD',
        age: 4,
        records: [
            {
                id: 'record006',
                timestamp: '2024-03-15T15:45:00Z',
                thumbnail: '/images/thumbnails/shepherd_alert_1.jpg',
                description: '尽职尽责！德牧旺财在花园巡逻，警惕地守护着家园的每个角落。',
                emotionalState: 'alert',
                scene: 'garden',
                lighting: 'bright_natural',
                activities: ['patrolling', 'alert watching']
            },
            {
                id: 'record007',
                timestamp: '2024-03-14T19:20:00Z',
                thumbnail: '/images/thumbnails/shepherd_calm_1.jpg',
                description: '休息时刻：旺财在客厅里安静地守护着家人，眼神中充满了忠诚。',
                emotionalState: 'calm',
                scene: 'living_room',
                lighting: 'dim_artificial',
                activities: ['resting', 'watching family']
            }
        ]
    },
    {
        id: 'pet004',
        name: '小白',
        type: 'CAT',
        breed: 'SIAMESE',
        age: 1,
        records: [
            {
                id: 'record008',
                timestamp: '2024-03-15T11:30:00Z',
                thumbnail: '/images/thumbnails/siamese_vocal_1.jpg',
                description: '话痨上线！暹罗猫小白又开始了她的日常演讲，声音甜美动听。',
                emotionalState: 'excited',
                scene: 'kitchen',
                lighting: 'bright_natural',
                activities: ['meowing', 'seeking attention']
            },
            {
                id: 'record009',
                timestamp: '2024-03-14T14:15:00Z',
                thumbnail: '/images/thumbnails/siamese_playful_1.jpg',
                description: '捣蛋鬼！小白在阳台上玩得不亦乐乎，各种花盆都成了她的玩具。',
                emotionalState: 'playful',
                scene: 'balcony',
                lighting: 'bright_natural',
                activities: ['playing with plants', 'jumping around']
            },
            {
                id: 'record010',
                timestamp: '2024-03-13T22:45:00Z',
                thumbnail: '/images/thumbnails/siamese_sleepy_1.jpg',
                description: '甜睡时光：小白终于安静下来了，在主人的床上蜷成了一个可爱的小团子。',
                emotionalState: 'tired',
                scene: 'bedroom',
                lighting: 'dim_artificial',
                activities: ['sleeping', 'purring softly']
            }
        ]
    }
];

module.exports = {
    EmotionalStates,
    SceneTypes,
    LightingConditions,
    PetBreedCharacteristics,
    mockPetRecords
}; 