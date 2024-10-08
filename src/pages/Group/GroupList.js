import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './GroupList.css'; // 스타일링 적용

const GroupList = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]); // 그룹 데이터를 저장할 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isPublicSelected, setIsPublicSelected] = useState(true); // 공개/비공개 선택
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  const [sortCriteria, setSortCriteria] = useState('latest'); // 정렬 기준
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

  // Add this new function to calculate days since creation
  const calculateDaysSinceCreation = (createdAt) => {
    const creationDate = new Date(createdAt);
    const currentDate = new Date();
    const diffTime = currentDate - creationDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `D+${diffDays}`;
  };

  // API를 통해 그룹 목록 불러오기
  const fetchGroups = async (page, isPublic, keyword, sortBy) => {
    try {
      const response = await axios.get('http://15.165.136.170:5000/api/groups', {
        params: {
          page: page,
          isPublic: isPublic,
          keyword: keyword,
          sortBy: sortBy,
        },
      });
      
      const data = response.data;
      if (data && data.data) {
        setGroups(data.data);
        setTotalPages(data.totalPages);
      } else {
        setError('그룹 데이터를 불러오는데 실패했습니다.');
      }
      setIsLoading(false);
    } catch (err) {
      setError('그룹 데이터를 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 페이지가 로드될 때 또는 검색, 정렬 옵션이 변경될 때마다 그룹 목록을 불러옴
    fetchGroups(currentPage, isPublicSelected, searchTerm, sortCriteria);
  }, [currentPage, isPublicSelected, searchTerm, sortCriteria]);

  // 그룹 필터링 및 정렬 로직은 서버에서 처리되므로 따로 필터링할 필요가 없음
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleGroupClick = async (group) => {
    try {
      const response = await axios.get(`http://15.165.136.170:5000/api/groups/${group.id}/is-public`);
      const { isPublic } = response.data;

      if (isPublic) {
        navigate(`/groups/${group.id}`);
      } else {
        // 로컬 스토리지에서 해당 그룹에 대한 접근 권한 확인
        const hasAccess = localStorage.getItem(`group_${group.id}_access`) === 'true';
        if (hasAccess) {
          navigate(`/groups/${group.id}`);
        } else {
          navigate(`/groups/${group.id}/private-access`);
        }
      }
    } catch (error) {
      console.error("Error checking group public status:", error);
      setError("그룹 정보를 불러오는데 실패했습니다.");
    }
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="group-list-container">
      {/* 상단 헤더 */}
      <div className="group-list-header">
        <h3>그룹 목록</h3>
        <button className="create-group-btn" onClick={() => navigate('/create-group')}>
          그룹 만들기
        </button>
      </div>

      {/* 필터, 검색 및 정렬 옵션 */}
      <div className="group-list-controls">
        <div className="privacy-toggle">
          <button
            className={`public-btn ${isPublicSelected ? 'active' : ''}`}
            onClick={() => setIsPublicSelected(true)}
          >
            공개
          </button>
          <button
            className={`private-btn ${!isPublicSelected ? 'active' : ''}`}
            onClick={() => setIsPublicSelected(false)}
          >
            비공개
          </button>
        </div>
        <div className="search-container">
          <img src="/search.svg" alt="search-icon" className="search-icon" />
          <input
            type="text"
            placeholder="그룹명을 검색해 주세요"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="sort-select"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="mostLiked">공감순</option>
          <option value="mostBadge">획득 배지순</option>
          <option value="postCount">게시글 많은순</option>
        </select>
      </div>

      {/* 그룹 카드 리��트 */}
      <div className="group-cards">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            onClick={() => handleGroupClick(group)}
          >
            <img
              src={group.imageUrl || '/edelweiss-public.png'} // Use default image if no imageUrl
              alt={group.name}
              className="group-card-img"
            />
            <div className="group-card-info">
              <div className="group-card-header">
                <span>{calculateDaysSinceCreation(group.createdAt)}</span>
                <span className={group.isPublic ? 'public' : 'private'}>
                  {group.isPublic ? '공개' : '비공개'}
                </span>
              </div>
              <h3 className="group-title">{group.name}</h3>
              <p className="group-description">{group.introduction}</p>
              <div className="group-stats">
                <span>획득 배지 {group.badgeCount}</span>
                <span>추억 {group.postCount}</span>
                <span>그룹 공감 {group.likeCount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 페이지 네비게이션 */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          이전
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
    </div>
  );
};

export default GroupList;