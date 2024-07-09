import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ManagePlaylists from './components/ManagePlaylists';
import ChannelList from './components/ChannelList';
import ChannelPlayer from './components/ChannelPlayer';
import NavBar from './components/NavBar';
import { PlaylistProvider } from './context/PlaylistContext';

function App() {
  return (
    <PlaylistProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manage" element={<ManagePlaylists />} />
          <Route path="/channels" element={<ChannelList />} />
        </Routes>
        <ChannelPlayer />
      </Router>
    </PlaylistProvider>
  );
}

export default App;