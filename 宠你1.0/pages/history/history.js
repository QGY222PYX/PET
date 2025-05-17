const { mockPetRecords } = require('../../mock/data.js')

Page({
  data: {
    records: [],
    searchText: '',
    loading: false
  },

  onLoad() {
    // 处理数据格式，将所有宠物的记录合并到一个数组中
    const allRecords = mockPetRecords.reduce((acc, pet) => {
      return acc.concat(pet.records.map(record => ({
        ...record,
        petName: pet.name,
        petType: pet.type,
        petBreed: pet.breed,
        // 确保缩略图路径存在
        thumbnail: record.thumbnail || '/static/images/default-pet.png'
      })));
    }, []);
    
    // 按时间倒序排序
    const sortedRecords = allRecords.sort((a, b) => {
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

    this.setData({
      records: sortedRecords
    });
  },

  // 格式化时间戳
  formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  },

  // 搜索功能
  onSearchInput(e) {
    const searchText = e.detail.value.toLowerCase();
    
    if (!searchText) {
      this.onLoad(); // 重新加载所有数据
      return;
    }

    const filteredRecords = this.data.records.filter(record => {
      return record.petName.toLowerCase().includes(searchText) ||
             record.description.toLowerCase().includes(searchText) ||
             record.emotionalState.toLowerCase().includes(searchText) ||
             record.scene.toLowerCase().includes(searchText);
    });

    this.setData({
      records: filteredRecords
    });
  },

  // 筛选功能
  onFilterTap() {
    wx.showActionSheet({
      itemList: ['按时间排序', '按情绪状态筛选', '按场景筛选'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0: // 按时间排序
            const sortedRecords = [...this.data.records].sort((a, b) => {
              return new Date(b.timestamp) - new Date(a.timestamp);
            });
            this.setData({ records: sortedRecords });
            break;
            
          case 1: // 按情绪状态筛选
            wx.showActionSheet({
              itemList: ['开心', '兴奋', '平静', '焦虑', '疲倦', '玩耍'],
              success: (res2) => {
                const emotions = ['happy', 'excited', 'calm', 'anxious', 'tired', 'playful'];
                const filteredRecords = mockPetRecords.reduce((acc, pet) => {
                  return acc.concat(pet.records.filter(record => 
                    record.emotionalState === emotions[res2.tapIndex]
                  ).map(record => ({
                    ...record,
                    petName: pet.name,
                    petType: pet.type,
                    petBreed: pet.breed
                  })));
                }, []);
                this.setData({ records: filteredRecords });
              }
            });
            break;
            
          case 2: // 按场景筛选
            wx.showActionSheet({
              itemList: ['客厅', '花园', '卧室', '厨房', '阳台'],
              success: (res2) => {
                const scenes = ['living_room', 'garden', 'bedroom', 'kitchen', 'balcony'];
                const filteredRecords = mockPetRecords.reduce((acc, pet) => {
                  return acc.concat(pet.records.filter(record => 
                    record.scene === scenes[res2.tapIndex]
                  ).map(record => ({
                    ...record,
                    petName: pet.name,
                    petType: pet.type,
                    petBreed: pet.breed
                  })));
                }, []);
                this.setData({ records: filteredRecords });
              }
            });
            break;
        }
      }
    });
  },

  // 点击记录项
  onItemTap(e) {
    const recordId = e.currentTarget.dataset.id;
    const record = this.data.records.find(r => r.id === recordId);
    
    if (record) {
      wx.showModal({
        title: `${record.petName}的状态记录`,
        content: `时间：${this.formatTimestamp(record.timestamp)}\n情绪：${record.emotionalState}\n场景：${record.scene}\n描述：${record.description}`,
        showCancel: false
      });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.onLoad();
    wx.stopPullDownRefresh();
  }
}) 