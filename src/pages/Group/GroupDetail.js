import React, { useState } from "react";
import "./GroupDetail.css"; // 고유한 스타일 적용

const GroupDetail = () => {
  const [groupData, setGroupData] = useState({
    id: 1,
    name: "달봉이네 가족",
    description:
      "서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다. 서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.",
    isPublic: true,
    postCount: 8,
    likeCount: 1500,
    createdAt: "D+265",
    badges: [
      { id: 1, name: "7일 연속 추억 등록", icon: "🏆" },
      { id: 2, name: "그룹 공감 1만개 이상 받기", icon: "❤️" },
      { id: 3, name: "게시글 공감 1만개 이상 받기", icon: "💬" },
    ],
  });

  const [memories, setMemories] = useState([
    {
      id: 1,
      title: "에델바이스 꽃말이 소중한 추억인데 길어지면... ",
      tags: ["#태그", "#김연", "#인천", "#낚시"],
      date: "24.01.19",
      location: "인천 앞바다",
      imageUrl: "/path/to/image.jpg",
      likes: 120,
      comments: 8,
    },
    {
      id: 2,
      title: "달봉이와 함께한 낚시",
      tags: ["#가족", "#바다", "#낚시"],
      date: "24.01.20",
      location: "서해바다",
      imageUrl: "/path/to/image.jpg",
      likes: 130,
      comments: 10,
    },
    // 더미 데이터 추가 가능
  ]);

  const handleLike = () => {
    alert("공감을 보냈습니다!");
  };

  return (
    <div className="group-detail-container">
      {/* 그룹 상세 정보 섹션 */}
      <div className="group-header">
        <img
          src="/path/to/image.jpg"
          alt={groupData.name}
          className="group-img"
        />
        <div className="group-info">
          <div className="group-meta-actions">
            <div className="group-meta">
              <span>{groupData.createdAt}</span>
              <span className="public-status">
                {groupData.isPublic ? "공개" : "비공개"}
              </span>
            </div>
            <div className="group-actions">
              <button className="edit-btn">그룹 정보 수정하기</button>
              <button className="delete-btn">그룹 삭제하기</button>
            </div>
          </div>

          <div className="group-name-stats">
            <h1 className="group-detail-title">{groupData.name}</h1>
            <div className="group-stats-inline">
              <span>추억 {groupData.postCount}</span>
              <span>그룹 공감 {groupData.likeCount}K</span>
            </div>
          </div>
          <p className="group-description">{groupData.description}</p>

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
            <button className="like-btn" onClick={handleLike}>
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
          <button className="memory-upload-btn">추억 올리기</button>
        </div>

        <div className="memory-controls">
          <div className="privacy-toggle">
            <button className="public-btn">공개</button>
            <button className="private-btn">비공개</button>
          </div>
          <div className="memory-search-container">
            <img src="/search.svg" alt="search-icon" className="memory-search-icon" />
            <input
              type="text"
              placeholder="태그 혹은 제목을 입력해 주세요"
              className="memory-search-input"
            />
          </div>
          <select className="memory-sort-select">
            <option value="likes">공감순</option>
            <option value="recent">최신순</option>
          </select>
        </div>

        {/* 추억 카드 */}
        <div className="memory-list">
          {memories.map((memory) => (
            <div key={memory.id} className="memory-card">
              <img src={memory.imageUrl} alt={memory.title} className="memory-img" />
              <div className="memory-info">
                <div className="memory-meta">
                  <span className="group-name">{groupData.name}</span>
                  <span className="public-status">
                    {groupData.isPublic ? "공개" : "비공개"}
                  </span>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupDetail;
