import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../../api';
import { findGroupBadges, checkAndUpdateBadges } from '../../services/badgeService';
import PostList from '../../components/PostList';
import "./GroupDetail.css";

const GroupDetail = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [groupData, setGroupData] = useState(null);
  const [posts, setPosts] = useState([]);  // 'memories'를 'posts'로 변경
  const [isPublicSelected, setIsPublicSelected] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasFetchedPosts, setHasFetchedPosts] = useState(false);  // 'hasFetchedMemories'를 'hasFetchedPosts'로 변경
  const [editGroupData, setEditGroupData] = useState({
    name: '',
    imageUrl: '',
    introduction: '',
    isPublic: false,
    password: '',
  });

  const [modalState, setModalState] = useState({
    isEditModalOpen: false,
    isDeleteModalOpen: false,
  });

  const [badges, setBadges] = useState([]);
  const [newBadges, setNewBadges] = useState([]);

  const handleModalToggle = (modalType) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  const fetchGroupData = useCallback(async () => {
    try {
      const groupResponse = await api.get(`/groups/${groupId}`);
      console.log("Group response:", groupResponse.data);
      setGroupData(groupResponse.data.groupInfo);
      setEditGroupData({
        name: groupResponse.data.groupInfo.name,
        imageUrl: groupResponse.data.groupInfo.imageUrl,
        introduction: groupResponse.data.groupInfo.introduction,
        isPublic: groupResponse.data.groupInfo.isPublic,
        password: '',
      });

      if (!groupResponse.data.groupInfo.isPublic) {
        navigate(`/groups/${groupId}/private-access`);
      } else {
        // 추억 목록 가져오기
        const postResponse = await api.get(`/groups/${groupId}/posts`);
        console.log("Post response:", postResponse.data);
        if (Array.isArray(postResponse.data?.data)) {
          setPosts(postResponse.data.data);
        } else {
          console.error("Posts data is not an array:", postResponse.data);
          setPosts([]);
        }

        // 배지 확 및 업���이트
        const newAcquiredBadges = await checkAndUpdateBadges(groupId);
        if (newAcquiredBadges.length > 0) {
          setNewBadges(newAcquiredBadges);
        }

        // 배지 목록 가져오기
        const badgesData = await findGroupBadges(groupId);
        setBadges(badgesData);
      }
      setHasFetchedPosts(true);  // 'setHasFetchedMemories'를 'setHasFetchedPosts'로 변경
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate]);

  useEffect(() => {
    fetchGroupData();

    // 주기적으로 배지 상태 확인 (예: 1분마다)
    const intervalId = setInterval(() => {
      checkAndUpdateBadges(groupId).then((newAcquiredBadges) => {
        if (newAcquiredBadges.length > 0) {
          setNewBadges(newAcquiredBadges);
          fetchGroupData(); // 새 배지 획득 시 그룹 데이터 새로고침
        }
      });
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchGroupData, groupId]);

  useEffect(() => {
    if (newBadges.length > 0) {
      // 새로운 배지 획득 알림 표시
      alert(`새로운 배지를 획득했습니다: ${newBadges.map(badge => badge.name).join(', ')}`);
      setNewBadges([]); // 알림 후 기화
    }
  }, [newBadges]);

  // 공감 보내기 함수
  const likeGroup = async () => {
    try {
      await api.post(`/groups/${groupId}/like`);
      alert("공감을 보냈습니다!");

      // 공감 수 업데이트
      setGroupData((prevData) => ({
        ...prevData,
        likeCount: prevData.likeCount + 1,
      }));
    } catch (error) {
      alert("공감 보내기에 실패했습니다.");
    }
  };

  // 모달 열기/닫기 함수
  const handleEditGroupClick = () => setModalState({ ...modalState, isEditModalOpen: true });
  const handleDeleteGroupClick = () => setModalState({ ...modalState, isDeleteModalOpen: true });

  // 그룹 수정 제출 함수
  const handleEditGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/groups/${groupId}`, editGroupData);
      alert("그룹 정보가 성공적으로 수정되었습니다.");
      setModalState({ ...modalState, isEditModalOpen: false }); // 모달 닫기
      // 그룹 정보를 다시 로드하거나 상태 업데이트
    } catch (error) {
      alert("그룹 정보 수정에 실패했습니다.");
    }
  };

  // 그룹 삭제 제출 함수
  const handleDeleteGroupSubmit = async () => {
    try {
      await api.delete(`/groups/${groupId}`, {
        data: { password: editGroupData.password }, // 비밀번호를 사용해 삭제 요청
      });
      alert("그룹이 성공적으로 삭제되었습니다.");
      navigate("/groups"); // 삭제 후 그룹 목록으로 이동
    } catch (error) {
      alert("그룹 삭제에 실패했습니다.");
    }
  };

  // 추억 올리기 버튼 클릭 시 페이지 이동
  const handleCreatePostClick = () => {
    navigate(`/groups/${groupId}/create-memory`);
  };

  const badgeInfo = {
    "7days": { name: "7일 연속 추억 등록", icon: "🦋" },
    "10kGroupLikes": { name: "그룹 공감 1만 개 이상 받기", icon: "🌼" },
    "10kPostLikes": { name: "게시글 공감 1만 개 이상 받기", icon: "💖" },
    "20posts": { name: "추억 20개 이상 등록", icon: "📚" },
    "1year": { name: "1년 달성", icon: "🎂" },
  };

  const renderBadge = (badgeId, isAcquired) => (
    <div key={badgeId} className={`badge ${isAcquired ? 'acquired' : 'not-acquired'}`}>
      <span className="badge-icon">{badgeInfo[badgeId].icon}</span>
      <span className="badge-name">{badgeInfo[badgeId].name}</span>
    </div>
  );

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!groupData) {
    return <div>그룹 정보를 불오지 못했습니다.</div>;
  }

  return (
    <div className="group-detail-container">
      {/* 그룹 상세 정보 */}
      <div className="group-header">
        <img src={groupData.imageUrl || "/default-group.png"} alt={groupData.name} className="group-img" />
        <div className="group-info">
          <div className="group-meta-actions">
            <div className="group-meta">
              <span>{groupData.createdAt}</span>
              <span className="public-status">
                {groupData.isPublic ? "공개" : "비공개"}
              </span>
            </div>
            <div className="group-actions">
              <button className="edit-btn" onClick={handleEditGroupClick}>그룹 정보 수정하기</button>
              <button className="delete-btn" onClick={handleDeleteGroupClick}>그룹 삭제하기</button>
            </div>
          </div>

          <div className="group-name-stats">
            <h1 className="group-detail-title">{groupData.name}</h1>
            <div className="group-stats-inline">
              <span>추억 {groupData.postCount}</span>
              <span>그룹 공감 {groupData.likeCount.toLocaleString()}</span>
            </div>
          </div>
          <p className="group-description">{groupData.introduction}</p>

          <div className="group-badge-and-like">
            <div className="group-badges">
              <h3>획득 배지</h3>
              <div className="badges-list">
                {Object.keys(badgeInfo).map((badgeId) => 
                  renderBadge(badgeId, badges.some(badge => badge.id === badgeId))
                )}
              </div>
            </div>
            <button className="like-btn" onClick={likeGroup}>
              <img src="/like-icon.svg" alt="공감 아이콘" />
              공감 보내기
            </button>
          </div>
        </div>
      </div>

      {/* 추억 목록 섹션 */}
      <div className="post-section">
        <div className="post-header">
          <h3>추억 목록</h3>
          <button className="post-upload-btn" onClick={handleCreatePostClick}>
            추억 올리기
          </button>
        </div>

        <div className="post-controls">
          <div className="privacy-toggle">
            <button className={`public-btn ${isPublicSelected ? "active" : ""}`} onClick={() => setIsPublicSelected(true)}>
              공개
            </button>
            <button className={`private-btn ${!isPublicSelected ? "active" : ""}`} onClick={() => setIsPublicSelected(false)}>
              비공개
            </button>
          </div>
          <div className="post-search-container">
            <img src="/search.svg" alt="search-icon" className="post-search-icon" />
            <input
              type="text"
              placeholder="태그 혹은 제목을 입력해 주세요"
              className="post-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="post-sort-select">
            <option value="likes">공감순</option>
            <option value="recent">최신순</option>
          </select>
        </div>

        <PostList
          groupId={groupId}
          posts={posts}
          isPublicSelected={isPublicSelected}
          searchTerm={searchTerm}
          loading={loading}
          hasFetchedPosts={hasFetchedPosts}
        />
      </div>

      {/* 그룹 수정 모달 */}
      {modalState.isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>그룹 정보 수정</h2>
            <button className="close-modal" onClick={() => handleModalToggle('isEditModalOpen')}>X</button>
            <form onSubmit={handleEditGroupSubmit}>
              <input
                type="text"
                className="modal-input"
                placeholder="그룹명"
                value={editGroupData.name}
                onChange={(e) => setEditGroupData({ ...editGroupData, name: e.target.value })}
              />
              <input
                type="text"
                className="modal-input"
                placeholder="대표 이미지 URL"
                value={editGroupData.imageUrl}
                onChange={(e) => setEditGroupData({ ...editGroupData, imageUrl: e.target.value })}
              />
              <textarea
                className="modal-input"
                placeholder="그룹 소개"
                value={editGroupData.introduction}
                onChange={(e) => setEditGroupData({ ...editGroupData, introduction: e.target.value })}
              />
              <label>
                그룹 공개 여부
                <input
                  type="checkbox"
                  checked={editGroupData.isPublic}
                  onChange={(e) => setEditGroupData({ ...editGroupData, isPublic: e.target.checked })}
                />
              </label>
              <input
                type="password"
                className="modal-input"
                placeholder="비밀번호"
                value={editGroupData.password}
                onChange={(e) => setEditGroupData({ ...editGroupData, password: e.target.value })}
              />
              <button type="submit" className="modal-submit">수정하기</button>
            </form>
          </div>
        </div>
      )}

      {/* 그룹 삭제 모달 */}
      {modalState.isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>그룹 삭제</h2>
            <button className="close-modal" onClick={() => handleModalToggle('isDeleteModalOpen')}>X</button>
            <p>그룹을 삭제하려면 비밀번호를 입력하세요:</p>
            <input
              type="password"
              className="modal-input"
              placeholder="비밀번호"
              value={editGroupData.password}
              onChange={(e) => setEditGroupData({ ...editGroupData, password: e.target.value })}
            />
            <button className="modal-submit" onClick={handleDeleteGroupSubmit}>삭제하기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetail;