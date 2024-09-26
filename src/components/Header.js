import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // 헤더 스타일링

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        {/* 로고에 링크를 걸어서 클릭하면 기본 페이지로 이동 */}
        <Link to="/">
          <img src="/jogakzip1.svg" alt="조각집 로고" className="logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
