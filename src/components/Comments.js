import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Modal from './Modal';
import "./Comments.css";

function Comments({ memoryId }) {
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState({
    nickname: "",
    content: "",
    commentPassword: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${memoryId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [memoryId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentModalOpen = () => setShowCommentModal(true);
  const handleCommentModalClose = () => setShowCommentModal(false);

  const handleCommentSubmit = async () => {
    try {
      await axios.post(`/api/posts/${memoryId}/comments`, newComment);
      alert("댓글이 성공적으로 등록되었습니다.");
      setNewComment({
        nickname: "",
        content: "",
        commentPassword: "",
      });
      fetchComments();
      setShowCommentModal(false);
    } catch (error) {
      alert("댓글 등록에 실패했습니다.");
    }
  };

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(comments.length / commentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="comment-section">
      <h3>댓글 {comments.length}</h3>
      <div className="comment-button-container">
        <button className="comment-button" onClick={handleCommentModalOpen}>
          댓글 등록하기
        </button>
      </div>
      <ul className="comment-list">
        {currentComments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="comment-content">
              <span className="comment-nickname">{comment.nickname}</span>
              <span className="comment-date">{comment.date}</span>
              <p>{comment.content}</p>
            </div>
            <div className="comment-actions">
              <button className="comment-edit">✏️</button>
              <button className="comment-delete">🗑️</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button className="prev-button" onClick={handlePreviousPage} disabled={currentPage === 1}>
          <img src="/arrow-left.svg" alt="Previous" />
        </button>

        {[...Array(Math.ceil(comments.length / commentsPerPage)).keys()].map(
          (num) => (
            <button
              key={num + 1}
              onClick={() => setCurrentPage(num + 1)}
              className={currentPage === num + 1 ? "active" : ""}
            >
              {num + 1}
            </button>
          )
        )}

        <button className="next-button" onClick={handleNextPage} disabled={currentPage === Math.ceil(comments.length / commentsPerPage)}>
          <img src="/arrow-right.svg" alt="Next" />
        </button>
      </div>

      <Modal showModal={showCommentModal} handleClose={handleCommentModalClose}>
        <h2>댓글 등록하기</h2>
        <label>닉네임</label>
        <input
          type="text"
          value={newComment.nickname}
          onChange={(e) => setNewComment({ ...newComment, nickname: e.target.value })}
        />
        <label>댓글 내용</label>
        <textarea
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
        />
        <label>비밀번호</label>
        <input
          type="password"
          value={newComment.commentPassword}
          onChange={(e) => setNewComment({ ...newComment, commentPassword: e.target.value })}
        />
        <button onClick={handleCommentSubmit}>등록</button>
      </Modal>
    </div>
  );
}

export default Comments;