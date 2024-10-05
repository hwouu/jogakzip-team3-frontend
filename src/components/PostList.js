import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PostList.css';

const PostList = ({ groupId, posts, loading, hasFetchedPosts }) => {
  const navigate = useNavigate();

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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (hasFetchedPosts && posts.length === 0) {
    return (
      <div className="empty-post">
        <img src="/empty-posts.png" alt="No posts" className="empty-icon" />
        <p className="no-results">게시된 추억이 없습니다.</p>
        <p className="upload-first-post">첫 번째 추억을 올려보세요!</p>
        
      </div>
    );
  }

  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map(renderPostCard)
      ) : (
        <p className="no-results">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default PostList;
