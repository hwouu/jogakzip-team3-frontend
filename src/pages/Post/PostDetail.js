import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import Comment from "../Comment/Comment";
import "./PostDetail.css";

function PostDetail() {
  const { groupId, postId } = useParams();
  const navigate = useNavigate();

  const [postData, setPostData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    tags: "",
    location: "",
    moment: "",
  });

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/posts/${postId}`);
        const post = response.data;
        setPostData(post);
        setLikeCount(post.likeCount);

        setEditData({
          title: post.title,
          content: post.content,
          tags: post.tags ? post.tags.join(", ") : "",
          location: post.location,
          moment: post.moment,
        });
      } catch (error) {
        console.error("Error fetching post data:", error);
        setErrorMessage("게시물을 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like`);
      setLikeCount(response.data.likeCount); // 응답에서 likeCount 값을 사용
    } catch (error) {
      console.error("Error sending like:", error);
    }
  };

  const handleEditClick = () => setShowEditModal(true);
  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/api/posts/${postId}`, editData);
      alert("게시글이 성공적으로 수정되었습니다.");
      setShowEditModal(false);
      setPostData({ ...postData, ...editData });
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div className="error-message">{errorMessage}</div>;
  }

  if (!postData) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="post-detail-page">
      <div className="post-detail-header">
        <div className="header-left">
          <span className="username">{postData.nickname}</span>
          <span className="divider">|</span>
          <span className="public-status">
            {postData.isPublic ? "공개" : "비공개"}
          </span>
        </div>

        <div className="header-right">
          <button className="edit-button" onClick={handleEditClick}>
            추억 수정하기
          </button>
          <button className="delete-button" onClick={handleDeleteClick}>
            추억 삭제하기
          </button>
        </div>

        <h1 className="post-title">{postData.title}</h1>

        <div className="tags">
          {postData.tags &&
            postData.tags.map((tag, index) => <span key={index}>{tag}</span>)}
        </div>

        <div className="like-button-container">
          <button className="like-button" onClick={handleLike}>
            🌸 공감 보내기
          </button>
        </div>

        <div className="post-info">
          <span className="place">{postData.location}</span>
          <span className="divider">·</span>
          <span className="date">
            {new Date(postData.moment).toLocaleDateString()}
          </span>
          <span className="divider">·</span>
          <span className="like-count">🌸 {likeCount}</span>
        </div>
      </div>

      <div className="post-content">
        {postData.imageUrl && (
          <img src={postData.imageUrl} alt="Post" className="post-image" />
        )}
        {postData.content ? (
          postData.content.split("\n").map((line, index) => (
            <p key={index} className="post-text">
              {line}
            </p>
          ))
        ) : (
          <p className="post-text">내용이 없습니다.</p>
        )}
      </div>

      <Comment postId={postId} />

      <Modal
        showModal={showEditModal}
        handleClose={() => setShowEditModal(false)}
      >
        <h2>게시글 수정</h2>
        <label>제목</label>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
        />
        <label>본문</label>
        <textarea
          value={editData.content}
          onChange={(e) =>
            setEditData({ ...editData, content: e.target.value })
          }
        />
        <label>태그</label>
        <input
          type="text"
          value={editData.tags}
          onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
        />
        <label>장소</label>
        <input
          type="text"
          value={editData.location}
          onChange={(e) =>
            setEditData({ ...editData, location: e.target.value })
          }
        />
        <button onClick={handleEditSubmit}>수정하기</button>
      </Modal>

      <Modal
        showModal={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
      >
        <h2>게시글 삭제</h2>
        <p>정말로 이 게시글을 삭제하시겠습니까?</p>
        <button onClick={handleDeleteSubmit}>삭제하기</button>
        <button onClick={() => setShowDeleteModal(false)}>취소</button>
      </Modal>
    </div>
  );
}

export default PostDetail;
