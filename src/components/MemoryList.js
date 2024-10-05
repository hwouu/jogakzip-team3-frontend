import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MemoryList.css';

const MemoryList = ({ groupId, memories, isPublicSelected, searchTerm, loading, hasFetchedMemories }) => {
  const navigate = useNavigate();

  const filteredMemories = memories.filter((memory) => {
    const isVisible = isPublicSelected ? memory.IsPublic : !memory.IsPublic;
    const searchMatch =
      (memory.Title && memory.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (memory.tags && memory.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    return isVisible && searchMatch;
  });

  const renderMemoryCard = (memory, index) => (
    <div key={memory.id || index} className="memory-card">
      <img src={memory.imageUrl} alt={memory.title} className="memory-img" />
      <div className="memory-info">
        <div className="memory-meta">
          <span className="group-name">{memory.groupName}</span>
          <span className="public-status">{memory.isPublic ? "공개" : "비공개"}</span>
        </div>
        <h4 className="memory-card-title">{memory.title}</h4>
        <p className="memory-tags">{memory.tags ? memory.tags.join(" ") : ""}</p>
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
  );

  const handleCreateMemoryClick = () => {
    navigate(`/groups/${groupId}/create-memory`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (hasFetchedMemories && memories.length === 0) {
    return (
      <div className="empty-memory">
        <img src="/empty-posts.png" alt="No posts" className="empty-icon" />
        <p className="no-results">게시된 추억이 없습니다.</p>
        <p className="upload-first-memory">첫 번째 추억을 올려보세요!</p>
        <button className="memory-upload-btn" onClick={handleCreateMemoryClick}>
          추억 올리기
        </button>
      </div>
    );
  }

  return (
    <div className="memory-list">
      {filteredMemories.length > 0 ? (
        filteredMemories.map(renderMemoryCard)
      ) : (
        <p className="no-results">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default MemoryList;
