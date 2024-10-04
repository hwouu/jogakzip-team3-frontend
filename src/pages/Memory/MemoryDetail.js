import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../components/Modal";
import Comments from "../../components/Comments";
import "./MemoryDetail.css";

function MemoryDetail() {
  const { groupId, memoryId } = useParams();
  const navigate = useNavigate();

  const [memoryData, setMemoryData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const response = await axios.get(`/api/posts/${memoryId}`);
        const memory = response.data;
        setMemoryData(memory);
        setLikeCount(memory.LikeCount);

        if (!memory.IsPublic) {
          setIsPasswordRequired(true);
        }

        setEditData({
          title: memory.Title,
          content: memory.Content,
          tags: memory.postTags ? memory.postTags.map(pt => pt.tag.Name).join(", ") : "",
          location: memory.Location,
          moment: memory.MemoryMoment,
        });
      } catch (error) {
        console.error("Error fetching memory data:", error);
      }
    };

    fetchMemoryData();
  }, [memoryId]);

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/${memoryId}/like`);
      setLikeCount(response.data.likes);
    } catch (error) {
      console.error("Error sending like:", error);
    }
  };

  const handleEditClick = () => setShowEditModal(true);
  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/api/posts/${memoryId}`, editData);
      alert("게시글이 성공적으로 수정되었습니다.");
      setShowEditModal(false);
      setMemoryData({ ...memoryData, ...editData });
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/posts/${memoryId}`, { data: { PPassword: password } });
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate(`/groups/${groupId}`);
    } catch (error) {
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post(`/api/posts/${memoryId}/verify-password`, {
        password: password,
      });

      if (response.data.access) {
        setIsPasswordRequired(false);
      } else {
        setErrorMessage("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Error verifying password:", error);
      setErrorMessage("비밀번호 확인에 실패했습니다.");
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
          <span className="username">{memoryData.Nickname}</span>
          <span className="divider">|</span>
          <span className="public-status">
            {memoryData.IsPublic ? "공개" : "비공개"}
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

        <h1 className="memory-title">{memoryData.Title}</h1>

        <div className="tags">
          {memoryData.postTags && memoryData.postTags.map((postTag, index) => (
            <span key={index}>{postTag.tag.Name}</span>
          ))}
        </div>

        <div className="like-button-container">
          <button className="like-button" onClick={handleLike}>
            🌸 공감 보내기
          </button>
        </div>

        <div className="memory-info">
          <span className="place">{memoryData.Location}</span>
          <span className="divider">·</span>
          <span className="date">{new Date(memoryData.MemoryMoment).toLocaleDateString()}</span>
          <span className="divider">·</span>
          <span className="like-count">🌸 {likeCount}</span>
        </div>
      </div>

      <div className="memory-content">
        <img src={memoryData.Image} alt="Memory" className="memory-image" />
        {memoryData.Content.split("\n").map((line, index) => (
          <p key={index} className="memory-text">
            {line}
          </p>
        ))}
      </div>

      <Comments memoryId={memoryId} />

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
    </div>
  );
}

export default MemoryDetail;