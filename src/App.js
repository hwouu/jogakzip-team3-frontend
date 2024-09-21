// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';  // Home 페이지 임포트
import GroupList from './pages/GroupList';  // 그룹 리스트 페이지 임포트
import CreatePost from './pages/CreatePost';  // 게시글 작성 페이지 임포트
import CreateGroup from './pages/CreateGroup';  // 새로 만든 그룹 생성 페이지 임포트

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/groups">Groups</Link></li>
          <li><Link to="/create-post">Create Post</Link></li>
          <li><Link to="/create-group">Create Group</Link></li> {/* 그룹 생성 링크 추가 */}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/groups" element={<GroupList />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/create-group" element={<CreateGroup />} /> {/* 그룹 생성 페이지 라우트 추가 */}
      </Routes>
    </Router>
  );
}

export default App;