import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import '../styles/examples.css';
import ProfilePage from './pages/ProfilePage';
import Examples from './Examples';
import ChatsPage from './pages/ChatsPage';
import MatchesPage from './pages/MatchesPage';
import TestsPage from './pages/TestsPage';
import SearchPage from './pages/SearchPage';
import EditProfilePage from './pages/EditProfilePage';

const App: React.FC = () => {
    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Examples />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                        <Route path="/chats" element={<ChatsPage />} />
                        <Route path="/matches" element={<MatchesPage />} />
                        <Route path="/tests" element={<TestsPage />} />
                        <Route path="/search" element={<SearchPage />} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </div>
    );
};

export default App;
