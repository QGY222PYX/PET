const { PetStatus, statusRules } = require('../mock/data');
const { PetMood, EnvironmentStatus, PetBreedTraits, moodThresholds } = require('../mock/data');

// 计算两个时间点之间的小时差
const getHoursDiff = (date1, date2) => {
  return Math.abs(date1 - date2) / (1000 * 60 * 60);
};

// 计算属性衰减值
const calculateDecay = (hours, decayRate) => {
  return Math.floor(hours * decayRate);
};

// 根据当前值和阈值判断状态
const determineStatus = (values) => {
  const { hunger, happiness, energy, health } = values;
  
  // 按优先级检查各项状态
  if (health < statusRules.health.threshold.critical) {
    return PetStatus.SICK;
  }
  
  if (hunger < statusRules.hunger.threshold.low) {
    return PetStatus.HUNGRY;
  }
  
  if (energy < statusRules.energy.threshold.low) {
    return PetStatus.TIRED;
  }
  
  if (happiness < statusRules.happiness.threshold.low) {
    return PetStatus.LONELY;
  }
  
  if (happiness > statusRules.happiness.threshold.high) {
    return PetStatus.HAPPY;
  }
  
  return PetStatus.NORMAL;
};

// 计算当前状态值
const calculateCurrentStatus = (pet, currentTime = new Date()) => {
  const hoursPassed = getHoursDiff(currentTime, new Date(pet.lastCheckTime));
  
  // 计算各属性的衰减
  const hungerDecay = calculateDecay(hoursPassed, statusRules.hunger.decayRate);
  const happinessDecay = calculateDecay(hoursPassed, statusRules.happiness.decayRate);
  const energyDecay = calculateDecay(hoursPassed, statusRules.energy.decayRate);
  const healthDecay = calculateDecay(hoursPassed / 24, statusRules.health.decayRate); // 健康值按天计算
  
  // 计算新的状态值
  const newValues = {
    hunger: Math.max(0, pet.hunger - hungerDecay),
    happiness: Math.max(0, pet.happiness - happinessDecay),
    energy: Math.max(0, pet.energy - energyDecay),
    health: Math.max(0, pet.health - healthDecay)
  };
  
  // 确定宠物状态
  const newStatus = determineStatus(newValues);
  
  return {
    ...newValues,
    status: newStatus
  };
};

// 应用活动效果
const applyActivity = (pet, activity) => {
  const {
    healthChange = 0,
    hungerChange = 0,
    happinessChange = 0,
    energyChange = 0
  } = activity.status;

  // 计算当前状态
  const currentStatus = calculateCurrentStatus(pet);
  
  // 应用活动变化
  const newValues = {
    health: Math.min(100, Math.max(0, currentStatus.health + healthChange)),
    hunger: Math.min(100, Math.max(0, currentStatus.hunger + hungerChange)),
    happiness: Math.min(100, Math.max(0, currentStatus.happiness + happinessChange)),
    energy: Math.min(100, Math.max(0, currentStatus.energy + energyChange))
  };
  
  // 确定新状态
  const newStatus = determineStatus(newValues);
  
  return {
    ...newValues,
    status: newStatus,
    lastCheckTime: new Date()
  };
};

// 获取状态描述
const getStatusDescription = (status) => {
  const descriptions = {
    [PetStatus.NORMAL]: '状态正常，精神愉快',
    [PetStatus.HUNGRY]: '肚子饿了，需要投喂',
    [PetStatus.TIRED]: '有点疲倦，需要休息',
    [PetStatus.SICK]: '身体不适，需要就医',
    [PetStatus.HAPPY]: '非常开心，活力满满',
    [PetStatus.LONELY]: '感到孤独，需要陪伴'
  };
  
  return descriptions[status] || '状态未知';
};

// 计算环境舒适度
const calculateEnvironmentComfort = (environment, breedTraits) => {
  let comfort = 100;
  
  // 根据品种特征评估环境适应度
  if (environment.noise_level === 'noisy' && breedTraits.noise_sensitivity === 'high') {
    comfort -= 30;
  } else if (environment.noise_level === 'quiet' && breedTraits.noise_sensitivity === 'low') {
    comfort += 10;
  }
  
  // 检查环境偏好
  if (breedTraits.environment_preference.includes(environment.temperature)) {
    comfort += 15;
  }
  if (breedTraits.environment_preference.includes(environment.space)) {
    comfort += 15;
  }
  
  return Math.min(100, Math.max(0, comfort));
};

// 确定情绪状态
const determineMood = (moodFactors, breedTraits) => {
  const { social_interaction, environmental_comfort, stimulation_level } = moodFactors;
  
  // 根据品种特征调整阈值
  const socialThreshold = breedTraits.social_need === 'high' ? 
    moodThresholds.social_interaction.high + 10 : 
    moodThresholds.social_interaction.high;
  
  // 判断情绪状态
  if (environmental_comfort < moodThresholds.environmental_comfort.low) {
    return stimulation_level > moodThresholds.stimulation_level.high ? 
      PetMood.ANXIOUS : PetMood.SCARED;
  }
  
  if (social_interaction < moodThresholds.social_interaction.low) {
    return PetMood.DEPRESSED;
  }
  
  if (social_interaction > socialThreshold && 
      stimulation_level > moodThresholds.stimulation_level.optimal) {
    return PetMood.EXCITED;
  }
  
  if (environmental_comfort > moodThresholds.environmental_comfort.high && 
      social_interaction > moodThresholds.social_interaction.high) {
    return PetMood.HAPPY;
  }
  
  if (environmental_comfort > moodThresholds.environmental_comfort.high) {
    return PetMood.CALM;
  }
  
  return PetMood.CALM; // 默认状态
};

// 获取当前状态
const getCurrentStatus = (pet, currentTime = new Date()) => {
  const breedTraits = PetBreedTraits[pet.type][pet.breed];
  
  // 计算环境舒适度
  const environmentalComfort = calculateEnvironmentComfort(pet.environment, breedTraits);
  
  // 更新心情因素
  const updatedMoodFactors = {
    ...pet.mood_factors,
    environmental_comfort: environmentalComfort
  };
  
  // 确定当前心情
  const currentMood = determineMood(updatedMoodFactors, breedTraits);
  
  return {
    current_mood: currentMood,
    mood_factors: updatedMoodFactors,
    environment: pet.environment,
    lastCheckTime: currentTime
  };
};

// 应用环境变化
const applyEnvironmentChange = (pet, newEnvironment) => {
  const breedTraits = PetBreedTraits[pet.type][pet.breed];
  const oldStatus = getCurrentStatus(pet);
  
  // 更新环境
  const updatedPet = {
    ...pet,
    environment: newEnvironment
  };
  
  // 计算新状态
  const newStatus = getCurrentStatus(updatedPet);
  
  return {
    before: oldStatus,
    after: newStatus,
    environmentImpact: newStatus.mood_factors.environmental_comfort - 
                      oldStatus.mood_factors.environmental_comfort
  };
};

// 获取情绪描述
const getMoodDescription = (mood, breedTraits) => {
  const descriptions = {
    [PetMood.HAPPY]: `看起来很开心，${breedTraits.personality[0]}的特质表现明显`,
    [PetMood.EXCITED]: `非常兴奋，充满${breedTraits.personality[2]}的活力`,
    [PetMood.CALM]: `保持平静，展现出${breedTraits.personality[0]}的一面`,
    [PetMood.ANXIOUS]: '有些焦虑不安',
    [PetMood.SCARED]: '感到害怕，需要安抚',
    [PetMood.ANGRY]: '似乎有些生气',
    [PetMood.DEPRESSED]: '情绪低落，需要额外关注'
  };
  
  return descriptions[mood] || '状态正常';
};

module.exports = {
  calculateCurrentStatus,
  applyActivity,
  getStatusDescription,
  getCurrentStatus,
  applyEnvironmentChange,
  getMoodDescription
}; 