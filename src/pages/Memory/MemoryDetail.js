import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./MemoryDetail.css";
import Modal from "../../components/Modal"; // 모달 컴포넌트 임포트

function MemoryDetail() {
  const { groupId, memoryId } = useParams();
  const [memoryData, setMemoryData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showCommentModal, setShowCommentModal] = useState(false); // 댓글 모달 상태
  const [comments, setComments] = useState([]); // 댓글 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const commentsPerPage = 3; // 한 페이지당 댓글 수

  // 더미 데이터를 사용하여 UI 구현
  useEffect(() => {
    const dummyMemoryData = {
      id: memoryId,
      groupId: groupId,
      nickname: "달봉이아들",
      isPublic: true,
      title: "인천 앞바다에서 무려 60cm 월척을 낚다!",
      tags: ["#인천", "#낚시"],
      place: "인천 앞바다",
      date: "24.01.19",
      likeCount: 120,
      commentCount: 8,
      imageUrl: "/incheon.png",
      content: 
      `인천 앞바다에서 월척을 낚았습니다!
      가족들과 기억에 오래도록 남을 멋진 하루였어요
      인천 앞바다에서 월척을 낚았습니다!
      
      인천 앞바다에서 월척을 낚았습니다!
      가족들과 기억에 오래도록 남을 멋진 하루였어요
      인천 앞바다에서 월척을 낚았습니다!`,
    };

    const dummyComments = [
      {
        id: 1,
        nickname: "다람이네가족",
        date: "24.01.18 21:50",
        content: "우와 60cm이라니..!! 저도 가족들과 가봐야겠어요~",
      },
      {
        id: 2,
        nickname: "핑구",
        date: "24.01.18 21:50",
        content: "우와 60cm이라니..!! 저도 가족들과 가봐야겠어요~",
      },
      {
        id: 3,
        nickname: "멸치소",
        date: "24.01.18 21:50",
        content: "우와 60cm이라니..!! 저도 가족들과 가봐야겠어요~",
      },
      {
        id: 4,
        nickname: "다람쥐",
        date: "24.01.18 21:50",
        content: "우와 60cm이라니..!! 저도 가족들과 가봐야겠어요~",
      },
      {
        id: 5,
        nickname: "짱구네",
        date: "24.01.18 21:50",
        content: "우와 60cm이라니..!! 저도 가족들과 가봐야겠어요~",
      },
      {
        id: 6,
        nickname: "구설수",
        date: "24.01.18 21:50",
        content: "우와 60cm이라니..!! 저도 가족들과 가봐야겠어요~",
      },
    ];

    setMemoryData(dummyMemoryData);
    setLikeCount(dummyMemoryData.likeCount);
    setComments(dummyComments);
  }, [groupId, memoryId]);

  const handleLike = () => {
    setLikeCount(likeCount + 1);
  };

  const handleCommentModalOpen = () => {
    setShowCommentModal(true); // 댓글 모달 열기
  };

  const handleCommentModalClose = () => {
    setShowCommentModal(false); // 댓글 모달 닫기
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

  return (
    <div className="memory-detail-page">
      {/* 기본 정보 헤더 */}
      <div className="memory-detail-header">
        <div className="header-left">
          <span className="username">{memoryData.nickname}</span>
          <span className="divider">|</span>
          <span className="public-status">
            {memoryData.isPublic ? "공개" : "비공개"}
          </span>
        </div>

        <div className="header-right">
          <button className="edit-button">추억 수정하기</button>
          <button className="delete-button">추억 삭제하기</button>
        </div>

        <h1 className="memory-title">{memoryData.title}</h1>

        <div className="tags">
          {memoryData.tags.map((tag, index) => (
            <span key={index}>{tag}</span>
          ))}
        </div>

        {/* 공감 버튼을 오른쪽 정렬 */}
        <div className="like-button-container">
          <button className="like-button" onClick={handleLike}>
            🌸 공감 보내기
          </button>
        </div>

        {/* 장소/날짜/공감수/댓글수 */}
        <div className="memory-info">
          <span className="place">{memoryData.place}</span>
          <span className="divider">·</span>
          <span className="date">{memoryData.date}</span>
          <span className="divider">·</span>
          <span className="like-count">🌸 {likeCount}</span>
          <span className="divider">·</span>
          <span className="comment-count">💬 {memoryData.commentCount}</span>
        </div>
      </div>

      {/* 본문 영역 */}
      <div className="memory-content">
        <img src={memoryData.imageUrl} alt="Memory" className="memory-image" />

        {/* 본문 내용을 줄바꿈 기준으로 나누어 표시 */}
        {memoryData.content.split("\n").map((line, index) => (
          <p key={index} className="memory-text">
            {line}
          </p>
        ))}
      </div>

      {/* 댓글 등록 버튼 */}
      <div className="comment-button-container">
        <button className="comment-button" onClick={handleCommentModalOpen}>
          댓글 등록하기
        </button>
      </div>

      {/* 댓글 목록 */}
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

        {/* 페이지네이션 */}
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

      {/* 댓글 등록 모달 */}
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
