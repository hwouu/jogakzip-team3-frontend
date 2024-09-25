import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';  // Home 페이지 임포트
import GroupList from './pages/Group/GroupList';  // 그룹 리스트 페이지 임포트 (폴더 경로 수정)
import CreatePost from './pages/Post/CreatePost';  // 게시글 작성 페이지 임포트 (폴더 경로 수정)
import CreateGroup from './pages/Group/CreateGroup';  // 그룹 생성 페이지 임포트 (폴더 경로 수정)
import GroupDetail from './pages/Group/GroupDetail';  // 그룹 상세 페이지 임포트 (폴더 경로 수정)

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
        <Route path="/groups" element={<GroupList />} />  {/* 그룹 목록 페이지 */}
        <Route path="/create-post" element={<CreatePost />} />  {/* 게시글 작성 페이지 */}
        <Route path="/create-group" element={<CreateGroup />} />  {/* 그룹 생성 페이지 */}
        <Route path="/group/:id" element={<GroupDetail />} />  {/* 그룹 상세 페이지 */}
      </Routes>
    </Router>
  );
}

export default App;