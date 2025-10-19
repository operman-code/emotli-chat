import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchUsers, sendFriendRequest } from '../api/chat';
import './NormalChat.css';

const NormalChat = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchUsers(searchQuery);
      setSearchResults(response.data);
      
      // Add to recent searches
      const newSearch = {
        query: searchQuery,
        timestamp: new Date().toISOString(),
        results: response.data.length
      };
      
      const updatedRecent = [newSearch, ...recentSearches.filter(s => s.query !== searchQuery)].slice(0, 10);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleSendFriendRequest = async (userId) => {
    try {
      await sendFriendRequest({ receiverId: userId });
      alert('Friend request sent successfully!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const repeatSearch = (query) => {
    setSearchQuery(query);
    handleSearch({ preventDefault: () => {} });
  };

  return (
    <div className="normal-chat-container">
      <div className="normal-chat-header">
        <h1>💬 Normal Chat</h1>
        <p>Search for users globally and start conversations</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search by username, name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? '🔍' : '🔍'}
            </button>
          </div>
        </form>

        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <div className="recent-header">
              <h3>Recent Searches</h3>
              <button onClick={clearRecentSearches} className="clear-btn">
                Clear All
              </button>
            </div>
            <div className="recent-list">
              {recentSearches.map((search, index) => (
                <div key={index} className="recent-item" onClick={() => repeatSearch(search.query)}>
                  <span className="search-query">"{search.query}"</span>
                  <span className="search-results-count">{search.results} results</span>
                  <span className="search-time">
                    {new Date(search.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="search-results-section">
        {searchResults.length > 0 && (
          <div className="results-header">
            <h3>Search Results ({searchResults.length})</h3>
            <button onClick={() => setSearchResults([])} className="clear-results-btn">
              Clear Results
            </button>
          </div>
        )}

        <div className="search-results">
          {searchResults.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-main-info">
                  <h4 className="username">@{user.username}</h4>
                  <h5 className="name">{user.name}</h5>
                </div>
                <div className="user-details">
                  <p className="email">{user.email}</p>
                  <p className="phone">{user.phone}</p>
                </div>
                <div className="user-status">
                  <span className={`status ${user.is_online ? 'online' : 'offline'}`}>
                    {user.is_online ? '🟢 Online' : '🔴 Offline'}
                  </span>
                  {user.is_volunteer && (
                    <span className="volunteer-badge">🧘 Volunteer</span>
                  )}
                </div>
              </div>
              <div className="user-actions">
                <button 
                  className="add-friend-btn"
                  onClick={() => handleSendFriendRequest(user.id)}
                >
                  Add Friend
                </button>
              </div>
            </div>
          ))}
        </div>

        {searchQuery && searchResults.length === 0 && !loading && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>No users found</h3>
            <p>Try searching with a different username, name, or email</p>
          </div>
        )}

        {!searchQuery && searchResults.length === 0 && (
          <div className="welcome-message">
            <div className="welcome-icon">👋</div>
            <h3>Welcome to Normal Chat</h3>
            <p>Search for users by their username, name, or email to start conversations</p>
            <div className="search-tips">
              <h4>Search Tips:</h4>
              <ul>
                <li>Use exact usernames for best results</li>
                <li>Search by first or last name</li>
                <li>Try partial email addresses</li>
                <li>Look for volunteers to get support</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormalChat;