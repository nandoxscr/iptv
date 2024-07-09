// src/App.js
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import ManagePlaylists from './components/ManagePlaylists';
import ChannelList from './components/ChannelList';
import NavBar from './components/NavBar';

const App = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);

  const onSelectCategory = (category) => {
    setCategory(category);
    navigate('/channels');
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home onSelectCategory={onSelectCategory} />} />
        <Route path="/manage" element={<ManagePlaylists />} />
        <Route path="/channels" element={<ChannelList category={category} />} />
      </Routes>
    </>
  );
};

export default App;