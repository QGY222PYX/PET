import moment from 'moment';

/**
 * 根据筛选条件过滤宠物记录
 * @param {Array} records - 原始记录数组
 * @param {Object} filters - 筛选条件
 * @returns {Array} - 过滤后的记录
 */
export const filterPetRecords = (records, filters) => {
    const {
        emotionalState,
        sceneType,
        timeRange,
        tags
    } = filters;

    return records.filter(record => {
        // 检查情绪状态
        if (emotionalState?.length > 0 && !emotionalState.includes(record.emotionalState)) {
            return false;
        }

        // 检查场景类型
        if (sceneType?.length > 0 && !sceneType.includes(record.scene)) {
            return false;
        }

        // 检查时间段
        if (timeRange?.length > 0) {
            const recordHour = moment(record.timestamp).hour();
            const isInTimeRange = timeRange.some(range => {
                switch (range) {
                    case 'morning':
                        return recordHour >= 6 && recordHour < 12;
                    case 'afternoon':
                        return recordHour >= 12 && recordHour < 18;
                    case 'evening':
                        return recordHour >= 18 && recordHour < 24;
                    case 'night':
                        return recordHour >= 0 && recordHour < 6;
                    default:
                        return false;
                }
            });
            if (!isInTimeRange) {
                return false;
            }
        }

        // 检查标签
        if (tags?.length > 0) {
            const recordTags = record.activities || [];
            const hasMatchingTag = tags.some(tag => 
                recordTags.some(activity => 
                    activity.toLowerCase().includes(tag.toLowerCase())
                )
            );
            if (!hasMatchingTag) {
                return false;
            }
        }

        return true;
    });
};

/**
 * 获取记录的时间段标签
 * @param {string} timestamp - 时间戳
 * @returns {string} - 时间段标签
 */
export const getTimeSlotLabel = (timestamp) => {
    const hour = moment(timestamp).hour();
    if (hour >= 6 && hour < 12) return '早晨';
    if (hour >= 12 && hour < 18) return '下午';
    if (hour >= 18 && hour < 24) return '晚上';
    return '凌晨';
};

/**
 * 格式化显示时间
 * @param {string} timestamp - 时间戳
 * @returns {string} - 格式化后的时间字符串
 */
export const formatTime = (timestamp) => {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}; 