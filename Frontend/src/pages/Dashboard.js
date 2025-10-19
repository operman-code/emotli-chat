import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { searchUsers, getFriends, getFriendRequests } from '../api/chat';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const socket = React.useContext(SocketContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socket && user) {
      socket.emit('authenticate', user.id);
      loadFriends();
      loadFriendRequests();
    }
  }, [socket, user]);

  const loadFriends = async () => {
    try {
      const response = await getFriends(user.id);
      setFriends(response.data);
    } catch (error) {
      console.error('Error loading friends:', error);
    }
  };

  const loadFriendRequests = async () => {
    try {
      const response = await getFriendRequests(user.id);
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error loading friend requests:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await searchUsers(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>🧠 Emotli</h1>
          <span className="welcome-text">Welcome, {user?.name}</span>
        </div>
        <div className="header-right">
          <Link to="/settings" className="settings-btn">⚙️ Settings</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button 
            className={activeTab === 'friends' ? 'active' : ''} 
            onClick={() => setActiveTab('friends')}
          >
            👥 Friends
          </button>
          <button 
            className={activeTab === 'search' ? 'active' : ''} 
            onClick={() => setActiveTab('search')}
          >
            🔍 Find People
          </button>
          <Link to="/groups" className="nav-link">
            💬 Groups
          </Link>
          <Link to="/therapy" className="nav-link">
            🧘 Therapy
          </Link>
        </nav>

        <div className="dashboard-main">
          {activeTab === 'friends' && (
            <div className="friends-section">
              <h2>Your Friends</h2>
              {friendRequests.length > 0 && (
                <div className="friend-requests">
                  <h3>Friend Requests ({friendRequests.length})</h3>
                  {friendRequests.map(request => (
                    <div key={request.id} className="friend-request">
                      <div className="request-info">
                        <strong>{request.sender_name}</strong>
                        <span>{request.sender_email}</span>
                      </div>
                      <div className="request-actions">
                        <button className="accept-btn">Accept</button>
                        <button className="decline-btn">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="friends-list">
                {friends.length > 0 ? (
                  friends.map(friend => (
                    <div key={friend.id} className="friend-item">
                      <div className="friend-info">
                        <div className="friend-avatar">
                          {friend.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{friend.name}</strong>
                          <span className={friend.is_online ? 'online' : 'offline'}>
                            {friend.is_online ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="chat-btn"
                        onClick={() => navigate(`/chat/${friend.id}`)}
                      >
                        💬 Chat
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="no-friends">No friends yet. Search for people to connect!</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="search-section">
              <h2>Find People</h2>
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </form>
              
              <div className="search-results">
                {searchResults.map(user => (
                  <div key={user.id} className="search-result">
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                        {user.is_volunteer && <span className="volunteer-badge">🧘 Volunteer</span>}
                      </div>
                    </div>
                    <button className="add-friend-btn">Add Friend</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;