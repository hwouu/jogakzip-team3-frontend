import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostList.css';

const PostList = ({ groupId, posts, loading, hasFetchedPosts }) => {
  const navigate = useNavigate();

  const handlePostClick = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts/${postId}/is-public`);
      const { isPublic } = response.data;

      if (isPublic) {
        // 공개 게시물은 비밀번호 확인 없이 바로 PostDetail 페이지로 이동
        navigate(`/groups/${groupId}/post/${postId}`);
      } else {
        // 비공개 게시물은 권한에 관계없이 private-access 페이지로 이동
        navigate(`/groups/${groupId}/post/${postId}/private-access`);
      }
    } catch (error) {
      console.error("Error checking post public status:", error);
      // 에러 처리 (예: 사용자에게 알림)
    }
  };

  const renderPostCard = (post, index) => (
    <div 
      key={post.id || index} 
      className="post-card" 
      onClick={() => handlePostClick(post.id)}
    >
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
