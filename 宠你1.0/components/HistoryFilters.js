import React, { useState } from 'react';
import { EmotionalStates, SceneTypes } from '../mock/data';
import { Select, TimePicker, Tag, Space } from 'antd';
import moment from 'moment';

const { Option } = Select;

const HistoryFilters = ({ onFilterChange }) => {
    const [emotionalState, setEmotionalState] = useState([]);
    const [sceneType, setSceneType] = useState([]);
    const [timeRange, setTimeRange] = useState([]);
    const [tags, setTags] = useState([]);

    // 时间段选项
    const timeSlots = [
        { label: '早晨', value: 'morning', range: [6, 12] },
        { label: '下午', value: 'afternoon', range: [12, 18] },
        { label: '晚上', value: 'evening', range: [18, 24] },
        { label: '凌晨', value: 'night', range: [0, 6] },
    ];

    const handleEmotionalStateChange = (value) => {
        setEmotionalState(value);
        updateFilters({ emotionalState: value });
    };

    const handleSceneTypeChange = (value) => {
        setSceneType(value);
        updateFilters({ sceneType: value });
    };

    const handleTimeRangeChange = (value) => {
        setTimeRange(value);
        updateFilters({ timeRange: value });
    };

    const handleTagChange = (value) => {
        setTags(value);
        updateFilters({ tags: value });
    };

    const updateFilters = (newFilters) => {
        onFilterChange({
            emotionalState,
            sceneType,
            timeRange,
            tags,
            ...newFilters
        });
    };

    return (
        <div className="history-filters">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className="filter-section">
                    <h4>情绪状态筛选</h4>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="选择情绪状态"
                        onChange={handleEmotionalStateChange}
                        value={emotionalState}
                    >
                        {Object.entries(EmotionalStates).map(([key, value]) => (
                            <Option key={key} value={value}>
                                {value === 'happy' ? '开心' :
                                 value === 'anxious' ? '焦虑' :
                                 value === 'calm' ? '平静' :
                                 value === 'excited' ? '兴奋' :
                                 value === 'tired' ? '疲倦' :
                                 value === 'playful' ? '玩耍' :
                                 value === 'aggressive' ? '攻击性' : '中性'}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="filter-section">
                    <h4>场景类型筛选</h4>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="选择场景类型"
                        onChange={handleSceneTypeChange}
                        value={sceneType}
                    >
                        {Object.entries(SceneTypes).map(([key, value]) => (
                            <Option key={key} value={value}>
                                {value === 'living_room' ? '客厅' :
                                 value === 'garden' ? '花园' :
                                 value === 'bedroom' ? '卧室' :
                                 value === 'kitchen' ? '厨房' :
                                 value === 'balcony' ? '阳台' :
                                 value === 'bathroom' ? '浴室' : '草坪'}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="filter-section">
                    <h4>时间段筛选</h4>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="选择时间段"
                        onChange={handleTimeRangeChange}
                        value={timeRange}
                    >
                        {timeSlots.map(slot => (
                            <Option key={slot.value} value={slot.value}>
                                {slot.label}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className="filter-section">
                    <h4>标签筛选</h4>
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="添加标签"
                        onChange={handleTagChange}
                        value={tags}
                    >
                        {/* 这里可以预设一些常用标签 */}
                        <Option key="eating">进食</Option>
                        <Option key="sleeping">睡觉</Option>
                        <Option key="playing">玩耍</Option>
                        <Option key="training">训练</Option>
                        <Option key="walking">散步</Option>
                    </Select>
                </div>
            </Space>

            <style jsx>{`
                .history-filters {
                    padding: 20px;
                    background: #f5f5f5;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .filter-section {
                    margin-bottom: 15px;
                }
                .filter-section h4 {
                    margin-bottom: 8px;
                    color: #333;
                }
            `}</style>
        </div>
    );
};

export default HistoryFilters; 