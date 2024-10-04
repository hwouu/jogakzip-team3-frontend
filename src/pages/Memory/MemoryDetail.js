import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import "./MemoryDetail.css";

function MemoryDetail() {
  const { groupId, memoryId } = useParams();
  const navigate = useNavigate();

  const [memoryData, setMemoryData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    tags: "",
    location: "",
    moment: "",
  });
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await axios.get(`/api/posts/${memoryId}`);
        const memory = response.data;
        setMemoryData(memory);
        setLikeCount(memory.likeCount);

        if (!memory.isPublic) {
          setIsPasswordRequired(true);
        }

        setEditData({
          title: memory.title,
          content: memory.content,
          tags: memory.tags.join(", "),
          location: memory.location,
          moment: memory.moment,
        });

        // 댓글 데이터 가져오기
        const commentsResponse = await axios.get(`/api/posts/${memoryId}/comments`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching memory data:", error);
      }
    };

    fetchMemoryData();
  }, [memoryId]);

  const handleLike = async () => {
    try {
      await axios.post(`/api/posts/${memoryId}/like`);
      setLikeCount(likeCount + 1);
    } catch (error) {
      console.error("Error sending like:", error);
    }
  };

  const handleEditClick = () => setShowEditModal(true);
  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleCommentModalOpen = () => setShowCommentModal(true);
  const handleCommentModalClose = () => setShowCommentModal(false);

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/api/posts/${memoryId}`, editData);
      alert("게시글이 성공적으로 수정되었습니다.");
      setShowEditModal(false);
      // 수정된 데이터로 상태 업데이트
      setMemoryData({ ...memoryData, ...editData });
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/posts/${memoryId}`, { data: { postPassword: password } });
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(`/api/posts/${memoryId}/verify-password`, {
        postPassword: password,
      });

      if (response.data.verified) {
        setIsPasswordRequired(false);
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("비밀번호 확인에 실패했습니다.");
    }
  };

  // 댓글 페이지네이션
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

  if (!memoryData) {
    return <div>Loading...</div>;
  }

  if (isPasswordRequired) {
    return (
      <div className="password-check-page">
        <h2>비공개 추억</h2>
        <p>비공개 추억에 접근하기 위해 비밀번호를 입력해 주세요.</p>
        <input
          type="password"
          placeholder="비밀번호를 입력해 주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button onClick={handlePasswordSubmit}>확인</button>
      </div>
    );
  }

  return (
    <div className="memory-detail-page">
      <div className="memory-detail-header">
        <div className="header-left">
          <span className="username">{memoryData.nickname}</span>
          <span className="divider">|</span>
          <span className="public-status">
            {memoryData.isPublic ? "공개" : "비공개"}
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

        <h1 className="memory-title">{memoryData.title}</h1>

        <div className="tags">
          {memoryData.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>

        <div className="like-button-container">
          <button className="like-button" onClick={handleLike}>
            🌸 공감 보내기
          </button>
        </div>

        <div className="memory-info">
          <span className="place">{memoryData.location}</span>
          <span className="divider">·</span>
          <span className="date">{memoryData.moment}</span>
          <span className="divider">·</span>
          <span className="like-count">🌸 {likeCount}</span>
          <span className="divider">·</span>
          <span className="comment-count">💬 {memoryData.commentCount}</span>
        </div>
      </div>

      <div className="memory-content">
        <img src={memoryData.imageUrl} alt="Memory" className="memory-image" />
        {memoryData.content.split("\n").map((line, index) => (
          <p key={index} className="memory-text">
            {line}
          </p>
        ))}
      </div>

      <div className="comment-button-container">
        <button className="comment-button" onClick={handleCommentModalOpen}>
          댓글 등록하기
        </button>
      </div>

      <div className="comment-section">
        <h3>댓글 {comments.length}</h3>
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
      </div>

      <Modal showModal={showEditModal} handleClose={() => setShowEditModal(false)}>
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
          onChange={(e) => setEditData({ ...editData, content: e.target.value })}
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
          onChange={(e) => setEditData({ ...editData, location: e.target.value })}
        />
        <button onClick={handleEditSubmit}>수정하기</button>
      </Modal>

      <Modal showModal={showDeleteModal} handleClose={() => setShowDeleteModal(false)}>
        <h2>게시글 삭제</h2>
        <label>게시글 비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleDeleteSubmit}>삭제하기</button>
      </Modal>

      <Modal showModal={showCommentModal} handleClose={handleCommentModalClose}>
        <h2>댓글 등록하기</h2>
        <label>댓글 작성</label>
        <textarea
          placeholder="댓글을 입력해 주세요"
          className="comment-input"
        />
        <button className="modal-submit-btn">등록</button>
      </Modal>
    </div>
  );
}

export default MemoryDetail;