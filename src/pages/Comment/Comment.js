import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import "./Comment.css";

function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [newComment, setNewComment] = useState({
    nickname: "",
    content: "",
    password: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingComment, setEditingComment] = useState(null);
  const [deletingComment, setDeletingComment] = useState(null);
  const [password, setPassword] = useState("");

  // Fetch comments with pagination
  const fetchComments = useCallback(async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`, {
        params: { page: currentPage, pageSize: 3 },
      });
      setComments(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }, [postId, currentPage]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentModalOpen = () => setShowCommentModal(true);
  const handleCommentModalClose = () => setShowCommentModal(false);

  // Submit a new comment
  const handleCommentSubmit = async () => {
    try {
      await axios.post(`/api/posts/${postId}/comments`, newComment); // 백틱 사용
      alert("댓글이 성공적으로 등록되었습니다.");
      setNewComment({ nickname: "", content: "", password: "" });
      fetchComments();
      setShowCommentModal(false);
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response?.data || error.message
      );
      alert(
        `댓글 등록에 실패했습니다: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // Edit an existing comment
  const handleCommentEdit = async () => {
    try {
      await axios.put(`/api/posts/${postId}/comments/${editingComment.id}`, {
        ...editingComment,
        password: password,
      });
      alert("댓글이 성공적으로 수정되었습니다.");
      setEditingComment(null);
      setPassword("");
      fetchComments();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("비밀번호가 틀렸습니다.");
      } else {
        alert("댓글 수정에 실패했습니다.");
      }
    }
  };

  // Delete a comment
  const handleCommentDelete = async () => {
    try {
      await axios.delete(`/api/comments/${deletingComment.id}`, {
        data: { password: password },
      });
      alert("댓글이 성공적으로 삭제되었습니다.");
      setDeletingComment(null);
      setPassword("");
      fetchComments();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("비밀번호가 틀렸습니다.");
      } else {
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  // Pagination handling
  const handleNextPage = () => {
    if (currentPage < totalPages) {
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
        {comments.map((comment) => (
          <li key={comment.id} className="comment-item">
            <div className="comment-content">
              <span className="comment-nickname">{comment.nickname}</span>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              <p>{comment.content}</p>
            </div>
            <div className="comment-actions">
              <button
                className="comment-edit"
                onClick={() => setEditingComment(comment)}
              >
                ✏️
              </button>
              <button
                className="comment-delete"
                onClick={() => setDeletingComment(comment)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="pagination">
        <button
          className="prev-button"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <img src="/arrow-left.svg" alt="Previous" />
        </button>

        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num + 1}
            onClick={() => setCurrentPage(num + 1)}
            className={currentPage === num + 1 ? "active" : ""}
          >
            {num + 1}
          </button>
        ))}

        <button
          className="next-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <img src="/arrow-right.svg" alt="Next" />
        </button>
      </div>

      {/* 댓글 등록 모달 */}
      <Modal showModal={showCommentModal} handleClose={handleCommentModalClose}>
        <h2>댓글 등록하기</h2>
        <label>닉네임</label>
        <input
          type="text"
          value={newComment.nickname}
          onChange={(e) =>
            setNewComment({ ...newComment, nickname: e.target.value })
          }
        />
        <label>댓글 내용</label>
        <textarea
          value={newComment.content}
          onChange={(e) =>
            setNewComment({ ...newComment, content: e.target.value })
          }
        />
        <label>비밀번호</label>
        <input
          type="password"
          value={newComment.password}
          onChange={(e) =>
            setNewComment({ ...newComment, password: e.target.value })
          }
        />
        <button onClick={handleCommentSubmit}>등록</button>
      </Modal>

      {/* 댓글 수정 모달 */}
      <Modal
        showModal={!!editingComment}
        handleClose={() => setEditingComment(null)}
      >
        <h2>댓글 수정하기</h2>
        <label>닉네임</label>
        <input
          type="text"
          value={editingComment?.nickname || ""}
          onChange={(e) =>
            setEditingComment({ ...editingComment, nickname: e.target.value })
          }
        />
        <label>댓글 내용</label>
        <textarea
          value={editingComment?.content || ""}
          onChange={(e) =>
            setEditingComment({ ...editingComment, content: e.target.value })
          }
        />
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleCommentEdit}>수정</button>
      </Modal>

      {/* 댓글 삭제 모달 */}
      <Modal
        showModal={!!deletingComment}
        handleClose={() => setDeletingComment(null)}
      >
        <h2>댓글 삭제하기</h2>
        <p>정말로 이 댓글을 삭제하시겠습니까?</p>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleCommentDelete}>삭제</button>
      </Modal>
    </div>
  );
}

export default Comments;
