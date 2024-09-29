import React, { useState, useEffect } from "react";
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

  const handleLike = () => {
    alert("공감을 보냈습니다!");
  };

  return (
    <div className="group-detail-container">
      <div className="group-header">
        <img
          src="/path/to/image.jpg"
          alt={groupData.name}
          className="group-img"
        />
        <div className="group-info">
          <div className="group-meta">
            <span>{groupData.createdAt}</span>
            <span className="public-status">
              {groupData.isPublic ? "공개" : "비공개"}
            </span>
            <span className="edit-delete">
              <button className="edit-btn">그룹 정보 수정하기</button>
              <button className="delete-btn">그룹 삭제하기</button>
            </span>
          </div>
          <div className="group-name-stats">
            <h1 className="group-detail-title">{groupData.name}</h1>
            <div className="group-stats-inline">
              <span>추억 {groupData.postCount}</span>
              <span>그룹 공감 {groupData.likeCount}K</span>
            </div>
          </div>
          <p className="group-description">{groupData.description}</p>

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
        </div>
        <button className="like-btn" onClick={handleLike}>
          공감 보내기
        </button>
      </div>
    </div>
  );
};

export default GroupDetail;
