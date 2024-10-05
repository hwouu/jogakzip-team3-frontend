import api from '../api';

export const findGroupBadges = async (groupId) => {
  try {
    const response = await api.get(`/groups/${groupId}`);
    return response.data.badges || []; // 그룹 정보에서 배지 목록 추출
  } catch (error) {
    console.error("Error fetching group badges:", error);
    return [];
  }
};

export const checkAndUpdateBadges = async (groupId) => {
  try {
    const response = await api.post(`/groups/${groupId}/check-badges`);
    return response.data.newBadges || []; // 새로 획득한 배지 목록 반환
  } catch (error) {
    console.error("Error checking and updating badges:", error);
    return [];
  }
};
