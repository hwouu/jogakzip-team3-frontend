import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GroupList.css'; // 스타일링 적용

const GroupList = () => {
  const navigate = useNavigate();
  
  // 그룹 데이터 (목업 데이터)
  const groups = [
    {
      id: 1,
      title: '에델바이스',
      description: '서로 한 마음으로 응원하고 아끼는 달봉이네 가족입니다.',
      badges: 2,
      memories: 8,
      likes: 1500,
      dDay: 265,
      isPublic: true,
      imgSrc: 'edelweiss-public.png', // 공개 그룹의 대표 이미지
    },
    {
      id: 2,
      title: '안개꽃',
      description: '작은 순간을 함께 기억하는 꽃같은 우리들',
      badges: 5,
      memories: 10,
      likes: 2300,
      dDay: 180,
      isPublic: false, // 비공개 그룹의 경우 이미지를 출력하지 않음
    },
    // 추가 목업 그룹 데이터
  ];

  const [isPublicSelected, setIsPublicSelected] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState('likes');

  // 공개/비공개 토글
  const togglePublicGroups = () => setIsPublicSelected(true);
  const togglePrivateGroups = () => setIsPublicSelected(false);

  // 그룹 필터링 (공개/비공개)
  const filteredGroups = groups
    .filter(group => group.isPublic === isPublicSelected)
    .filter(group => group.title.toLowerCase().includes(searchTerm.toLowerCase()));

  // 정렬 기준에 따른 그룹 정렬
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (sortCriteria === 'likes') return b.likes - a.likes;
    if (sortCriteria === 'badges') return b.badges - a.badges;
    if (sortCriteria === 'memories') return b.memories - a.memories;
    if (sortCriteria === 'recent') return b.dDay - a.dDay;
    return 0;
  });

  return (
    <div className="group-list-container">
      {/* 상단 헤더 */}
      <header className="group-list-header">
        <div className="logo-container">
          <img src="/jogakzip1.svg" alt="조각집 로고" className="logo" />
        </div>
        <button className="create-group-btn" onClick={() => navigate('/create-group')}>그룹 만들기</button>
      </header>

      {/* 필터, 검색 및 정렬 옵션 */}
      <div className="group-list-controls">
        <div className="privacy-toggle">
          <button className={`public-btn ${isPublicSelected ? 'active' : ''}`} onClick={togglePublicGroups}>공개</button>
          <button className={`private-btn ${!isPublicSelected ? 'active' : ''}`} onClick={togglePrivateGroups}>비공개</button>
        </div>
        <input
          type="text"
          placeholder="그룹명을 검색해 주세요"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="sort-select"
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="likes">공감순</option>
          <option value="badges">획득 배지순</option>
          <option value="memories">게시글 많은순</option>
          <option value="recent">최신순</option>
        </select>
      </div>

      {/* 그룹 카드 리스트 */}
      <div className="group-cards">
        {sortedGroups.map((group) => (
          <div key={group.id} className="group-card">
            {/* 공개 그룹일 때만 이미지를 출력 */}
            {group.isPublic && (
              <img
                src={group.imgSrc}  // 공개 그룹 이미지 출력
                alt={group.title}
                className="group-card-img"
              />
            )}
            <div className="group-card-info">
              <div className="group-card-header">
                <span>D+{group.dDay}</span>
                <span className={group.isPublic ? 'public' : 'private'}>
                  {group.isPublic ? '공개' : '비공개'}
                </span>
              </div>
              <h3 className="group-title">{group.title}</h3>
              <p className="group-description">{group.description}</p>
              <div className="group-stats">
                <span>획득 배지 {group.badges}</span>
                <span>추억 {group.memories}</span>
                <span>그룹 공감 {group.likes.toLocaleString()}K</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;