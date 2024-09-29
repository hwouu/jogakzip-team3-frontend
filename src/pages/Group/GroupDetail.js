import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './GroupDetail.css'; // 스타일링 적용

const GroupDetail = () => {
  const { groupId } = useParams(); // URL에서 groupId를 가져옴
  const [groupData, setGroupData] = useState(null);
  const [isProtected, setIsProtected] = useState(false);
  const [inputPassword, setInputPassword] = useState('');

  // 필터 및 검색 상태
  const [isPublicSelected, setIsPublicSelected] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('likes');

  // 그룹 데이터를 API에서 가져오는 함수
  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/groups/${groupId}`); // 포트를 5000으로 수정
        if (!response.ok) {
          throw new Error('그룹 데이터를 불러오지 못했습니다.');
        }
        const data = await response.json();
        setGroupData(data.groupInfo);
        setIsProtected(!data.groupInfo.isPublic); // 비공개 그룹일 경우 보호 설정
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };

    fetchGroupData();
  }, [groupId]);

  const handlePasswordSubmit = () => {
    if (inputPassword === groupData.password) {
      setIsProtected(false);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLike = () => {
    alert('공감을 보냈습니다!');
  };

  // 공개/비공개 토글 함수
  const togglePublicMemories = () => setIsPublicSelected(true);
  const togglePrivateMemories = () => setIsPublicSelected(false);

  if (!groupData) {
    return <div>로딩 중...</div>;
  }

  if (isProtected) {
    return (
      <div className="group-detail-container protected">
        <h2 className="protected-title">비공개 추억</h2>
        <p>비공개 추억에 접근하기 위해 권한 확인이 필요합니다.</p>
        <input
          type="password"
          placeholder="추억 비밀번호를 입력해 주세요"
          className="password-input"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
        />
        <button className="submit-btn" onClick={handlePasswordSubmit}>제출하기</button>
      </div>
    );
  }

  return (
    <div className="group-detail-container">
      <div className="group-header">
        {groupData.imageUrl && (
          <img
            src={groupData.imageUrl}
            alt={groupData.name}
            className="group-img"
          />
        )}
        <div className="group-info">
          <h1>{groupData.name}</h1>
          <p>{groupData.introduction}</p>
          <span>{groupData.isPublic ? '공개' : '비공개'}</span>
          <span>D+{groupData.createdAt}</span>
          <div className="group-stats">
            <span>추억 {groupData.postCount}</span>
            <span>그룹 공감 {groupData.likeCount}</span>
          </div>
        </div>
        <button className="like-btn" onClick={handleLike}>공감 보내기</button>
      </div>

      {/* 추억 목록과 업로드 버튼 */}
      <div className="memories-header">
        <h3>추억 목록</h3>
        <button className="memory-upload-btn">추억 올리기</button>
      </div>

      {/* 필터, 검색 및 정렬 옵션 */}
      <div className="group-list-controls">
        <div className="privacy-toggle">
          <button
            className={`public-btn ${isPublicSelected ? 'active' : ''}`}
            onClick={togglePublicMemories}
          >
            공개
          </button>
          <button
            className={`private-btn ${!isPublicSelected ? 'active' : ''}`}
            onClick={togglePrivateMemories}
          >
            비공개
          </button>
        </div>
        <div className="search-container">
          <img src="/search.svg" alt="search-icon" className="search-icon" />
          <input
            type="text"
            placeholder="추억을 검색해 주세요"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="sort-select"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="likes">공감순</option>
          <option value="recent">최신순</option>
        </select>
      </div>

      {/* 추억 목록 */}
      <div className="memories-list">
        <div className="memories-cards">
          {Array(12)
            .fill()
            .map((_, idx) => (
              <div key={idx} className="memory-card">
                {groupData.imageUrl && (
                  <img
                    src={groupData.imageUrl}
                    alt={`추억 ${idx + 1}`}
                    className="memory-img"
                  />
                )}
                <p>
                  {groupData.name}의 추억을 소중한 추억으로 장식하다 {idx + 1}
                </p>
                <span>공감 120</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
