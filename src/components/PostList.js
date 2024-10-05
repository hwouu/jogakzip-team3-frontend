import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostList.css';

const PostList = ({ groupId, posts, isPublicSelected, searchTerm, loading, hasFetchedPosts }) => {
  const navigate = useNavigate();

  const filteredPosts = posts.filter((post) => {
    const isVisible = isPublicSelected ? post.IsPublic : !post.IsPublic;
    const searchMatch =
      (post.Title && post.Title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.tags && post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ));

    return isVisible && searchMatch;
  });

  const renderPostCard = (post, index) => (
    <div key={post.id || index} className="post-card">
      <img src={post.imageUrl} alt={post.title} className="post-img" />
      <div className="post-info">
        <div className="post-meta">
          <span className="group-name">{post.groupName}</span>
          <span className="public-status">{post.isPublic ? "공개" : "비공개"}</span>
        </div>
        <h4 className="post-card-title">{post.title}</h4>
        <p className="post-tags">{post.tags ? post.tags.join(" ") : ""}</p>
        <div className="post-footer">
          <div className="post-location">
            <span>{post.location}</span>
            <span>{post.date}</span>
          </div>
          <div className="post-stats">
            <span>🌟 {post.likes}</span>
            <span>💬 {post.comments}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCreatePostClick = () => {
    navigate(`/groups/${groupId}/create-post`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (hasFetchedPosts && posts.length === 0) {
    return (
      <div className="empty-post">
        <img src="/empty-posts.png" alt="No posts" className="empty-icon" />
        <p className="no-results">게시된 추억이 없습니다.</p>
        <p className="upload-first-post">첫 번째 추억을 올려보세요!</p>
        <button className="post-upload-btn" onClick={handleCreatePostClick}>
          추억 올리기
        </button>
      </div>
    );
  }

  return (
    <div className="post-list">
      {filteredPosts.length > 0 ? (
        filteredPosts.map(renderPostCard)
      ) : (
        <p className="no-results">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default PostList;
