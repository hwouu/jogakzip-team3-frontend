import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./GroupDetail.css";

const GroupDetail = () => {
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [groupData, setGroupData] = useState(null);
  const [memories, setMemories] = useState([]);  // 초기값을 빈 배열로 설정
  const [isPublicSelected, setIsPublicSelected] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [hasFetchedMemories, setHasFetchedMemories] = useState(false); //
  const [editGroupData, setEditGroupData] = useState({
    name: '',
    imageUrl: '',
    introduction: '',
    isPublic: false,
    password: '',
  });
  // 그룹 정보와 추억 데이터를 API로부터 가져오기
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const groupResponse = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setGroupData(groupResponse.data.groupInfo);
        setEditGroupData({
          name: groupResponse.data.groupInfo.name,
          imageUrl: groupResponse.data.groupInfo.imageUrl,
          introduction: groupResponse.data.groupInfo.introduction,
          isPublic: groupResponse.data.groupInfo.isPublic,
          password: '', // 초기 비밀번호는 빈 값
        });

        if (!groupResponse.data.groupInfo.isPublic) {
          navigate(`/groups/${groupId}/private-access`);
        } else {
          // 추억 목록 가져오기
          const memoryResponse = await axios.get(`http://localhost:5000/api/groups/${groupId}/posts`);
          setMemories(memoryResponse.data.memories); // API 응답에 맞게 설정
        }
        setHasFetchedMemories(true); // 데이터를 가져온 후 true로 설정
      } catch (err) {
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroupData();
  }, [groupId, navigate]);

  // 공감 보내기 함수
  const likeGroup = async () => {
    try {
      await axios.post(`http://localhost:5000/api/groups/${groupId}/like`);
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
  const handleEditGroupClick = () => setIsEditModalOpen(true);
  const handleDeleteGroupClick = () => setIsDeleteModalOpen(true);

  // 그룹 수정 제출 함수
  const handleEditGroupSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}`, editGroupData);
      alert("그룹 정보가 성공적으로 수정되었습니다.");
      setIsEditModalOpen(false); // 모달 닫기
      // 그룹 정보를 다시 로드하거나 상태 업데이트
    } catch (error) {
      alert("그룹 정보 수정에 실패했습니다.");
    }
  };

  // 그룹 삭제 제출 함수
  const handleDeleteGroupSubmit = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`, {
        data: { password: editGroupData.password }, // 비밀번호를 사용해 삭제 요청
      });
      alert("그룹이 성공적으로 삭제되었습니다.");
      navigate("/groups"); // 삭제 후 그룹 목록으로 이동
    } catch (error) {
      alert("그룹 삭제에 실패했습니다.");
    }
  };

  // 추억 검색 및 필터링
  const filteredMemories = memories ? memories.filter((memory) => {
    const isVisible = isPublicSelected ? memory.isPublic : !memory.isPublic;
    const searchMatch =
      memory.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      memory.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return isVisible && searchMatch;
  }) : [];

  // 추억 올리기 버튼 클릭 시 페이지 이동
  const handleCreateMemoryClick = () => {
    navigate(`/groups/${groupId}/create-memory`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!groupData) {
    return <div>그룹 정보를 불러오지 못했습니다.</div>;
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
                {groupData.badges.map((badge) => (
                  <div key={badge.id} className="badge">
                    <span className="badge-icon">{badge.icon}</span>
                    <span className="badge-name">{badge.name}</span>
                  </div>
                ))}
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
      <div className="memory-section">
        <div className="memory-header">
          <h3>추억 목록</h3>
          <button className="memory-upload-btn" onClick={handleCreateMemoryClick}>
            추억 올리기
          </button>
        </div>

        <div className="memory-controls">
          <div className="privacy-toggle">
            <button className={`public-btn ${isPublicSelected ? "active" : ""}`} onClick={() => setIsPublicSelected(true)}>
              공개
            </button>
            <button className={`private-btn ${!isPublicSelected ? "active" : ""}`} onClick={() => setIsPublicSelected(false)}>
              비공개
            </button>
          </div>
          <div className="memory-search-container">
            <img src="/search.svg" alt="search-icon" className="memory-search-icon" />
            <input
              type="text"
              placeholder="태그 혹은 제목을 입력해 주세요"
              className="memory-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select className="memory-sort-select">
            <option value="likes">공감순</option>
            <option value="recent">최신순</option>
          </select>
        </div>

        {/* 추억 목록 또는 빈 목록 상태 */}
        {loading ? (
          <div>로딩 중...</div>
        ) : hasFetchedMemories && (!memories || memories.length === 0) ? (
          <div className="empty-memory">
            <img src="/empty-posts.png" alt="No posts" className="empty-icon" />
            <p className="no-results">게시된 추억이 없습니다.</p>
            <p className="upload-first-memory">첫 번째 추억을 올려보세요!</p>
          </div>
        ) : (
          <div className="memory-list">
            {filteredMemories.length > 0 ? (
              filteredMemories.map((memory) => (
                <div key={memory.id} className="memory-card">
                  <img src={memory.imageUrl} alt={memory.title} className="memory-img" />
                  <div className="memory-info">
                    <div className="memory-meta">
                      <span className="group-name">{groupData.name}</span>
                      <span className="public-status">{memory.isPublic ? "공개" : "비공개"}</span>
                    </div>
                    <h4 className="memory-card-title">{memory.title}</h4>
                    <p className="memory-tags">{memory.tags.join(" ")}</p>
                    <div className="memory-footer">
                      <div className="memory-location">
                        <span>{memory.location}</span>
                        <span>{memory.date}</span>
                      </div>
                      <div className="memory-stats">
                        <span>🌟 {memory.likes}</span>
                        <span>💬 {memory.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>

      {/* 그룹 수정 모달 */}
      {isEditModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>그룹 정보 수정</h2>
            <button className="close-modal" onClick={() => setIsEditModalOpen(false)}>X</button>
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
      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>그룹 삭제</h2>
            <button className="close-modal" onClick={() => setIsDeleteModalOpen(false)}>X</button>
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
