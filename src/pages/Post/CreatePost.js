import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: "",
    title: "",
    content: "",
    image: null,
    tags: [],
    location: "",
    moment: "",
    postPassword: "",
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleTagsChange = (e) => {
    setFormData({
      ...formData,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const postData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        postData.append(key, JSON.stringify(formData[key]));
      } else if (key === "image") {
        if (formData[key]) {
          postData.append("imageUrl", formData[key]);
        }
      } else if (key === "moment") {
        postData.append(key, new Date(formData[key]).toISOString());
      } else {
        postData.append(key, formData[key]);
      }
    });

    console.log("Sending post data:");
    for (let [key, value] of postData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(
        `http://15.165.136.170:5000/api/groups/${groupId}/posts`,
        postData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);

      if (response.status === 200) {
        alert("추억이 성공적으로 등록되었습니다!");
        navigate(`/groups/${groupId}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      if (error.response) {
        console.error("Server error response:", error.response.data);
        console.error("Server error status:", error.response.status);
        setErrorMessage(
          error.response.data.message || "추억 등록에 실패했습니다."
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("서버로부터 응답을 받지 못했습니다.");
      } else {
        console.error("Error setting up request:", error.message);
        setErrorMessage("요청 설정 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1 className="create-post-title">추억 올리기</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-left">
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="닉네임을 입력해 주세요"
            />
          </div>
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력해 주세요"
            />
          </div>
          <div className="form-group">
            <label>내용</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="내용을 입력해 주세요"
            />
          </div>
          <div className="form-group">
            <label>이미지</label>
            <input type="file" name="imageUrl" onChange={handleImageChange} />
          </div>
        </div>
        <div className="form-right">
          <div className="form-group">
            <label>태그</label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(",")}
              onChange={handleTagsChange}
              placeholder="태그를 입력해 주세요 (콤마로 구분)"
            />
          </div>
          <div className="form-group">
            <label>장소</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="장소를 입력해 주세요"
            />
          </div>
          <div className="form-group">
            <label>추억의 순간</label>
            <input
              type="date"
              name="moment"
              value={formData.moment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="postPassword"
              value={formData.postPassword}
              onChange={handleChange}
              placeholder="비밀번호를 입력해 주세요"
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
              />
              공개 여부
            </label>
          </div>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "올리는 중..." : "올리기"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
