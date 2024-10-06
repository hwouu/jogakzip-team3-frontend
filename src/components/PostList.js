import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PostList.css";

const PostList = ({ groupId, posts, loading, hasFetchedPosts }) => {
  const navigate = useNavigate();

  const handlePostClick = async (postId) => {
    console.log(`Clicked post ID: ${postId}`); // 클릭된 postId 확인

    try {
      const response = await axios.get(
        `http://15.165.136.170:5000/api/posts/${postId}/is-public`
      );
      console.log("Public status response:", response.data); // 응답 데이터 확인
      const { isPublic } = response.data;

      if (isPublic) {
        navigate(`/groups/${groupId}/post/${postId}`);
      } else {
        navigate(`/groups/${groupId}/post/${postId}/private-access`);
      }
    } catch (error) {
      console.error("Error checking post public status:", error);
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
          <span className="group-name">{post.nickname}</span>
          <span className="public-status">
            {post.isPublic ? "공개" : "비공개"}
          </span>
        </div>
        <h4 className="post-card-title">{post.title}</h4>
        <p className="post-tags">
          {post.tags ? post.tags.map((tag) => `#${tag}`).join(" ") : ""}
        </p>
        <div className="post-footer">
          <div className="post-location">
            <span>{post.location}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="post-stats">
            <span>🌟 {post.likeCount}</span>
            <span>💬 {post.commentCount}</span>
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
