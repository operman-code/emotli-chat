import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { requestTherapy, getTherapySessions, getAvailableVolunteers } from '../api/therapy';
import './Therapy.css';

const Therapy = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [therapyRequest, setTherapyRequest] = useState({
    topic: '',
    chatType: 'general'
  });
  const [loading, setLoading] = useState(false);

  const chatTypes = [
    { value: 'general', label: 'General Support' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'grief', label: 'Grief' },
    { value: 'addiction', label: 'Addiction Recovery' }
  ];

  useEffect(() => {
    loadSessions();
    loadVolunteers();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await getTherapySessions(user.id);
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadVolunteers = async () => {
    try {
      const response = await getAvailableVolunteers();
      setVolunteers(response.data);
    } catch (error) {
      console.error('Error loading volunteers:', error);
    }
  };

  const handleRequestTherapy = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await requestTherapy(therapyRequest);
      setTherapyRequest({ topic: '', chatType: 'general' });
      setShowRequestForm(false);
      loadSessions();
      alert(`Connected to volunteer: ${response.data.volunteer_name}`);
    } catch (error) {
      console.error('Error requesting therapy:', error);
      alert('Failed to connect to volunteer. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="therapy-container">
      <div className="therapy-header">
        <h1>🧘 Therapy & Support</h1>
        <button 
          onClick={() => setShowRequestForm(true)}
          className="request-therapy-btn"
        >
          + Request Support
        </button>
      </div>

      {showRequestForm && (
        <div className="therapy-modal">
          <div className="modal-content">
            <h2>Request Therapy Session</h2>
            <form onSubmit={handleRequestTherapy}>
              <div className="form-group">
                <label>What would you like to talk about?</label>
                <input
                  type="text"
                  value={therapyRequest.topic}
                  onChange={(e) => setTherapyRequest({...therapyRequest, topic: e.target.value})}
                  required
                  placeholder="Briefly describe what you need support with"
                />
              </div>
              <div className="form-group">
                <label>Type of Support</label>
                <select
                  value={therapyRequest.chatType}
                  onChange={(e) => setTherapyRequest({...therapyRequest, chatType: e.target.value})}
                >
                  {chatTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowRequestForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Connecting...' : 'Connect to Volunteer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="therapy-content">
        <div className="sessions-section">
          <h2>Your Sessions</h2>
          {sessions.length > 0 ? (
            <div className="sessions-list">
              {sessions.map(session => (
                <div key={session.id} className="session-item">
                  <div className="session-info">
                    <h3>Session with {session.volunteer_name}</h3>
                    <p><strong>Topic:</strong> {session.topic}</p>
                    <p><strong>Type:</strong> {session.chat_type}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status ${session.status}`}>
                        {session.status}
                      </span>
                    </p>
                    <p><strong>Started:</strong> {new Date(session.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="session-actions">
                    {session.status === 'active' && (
                      <button className="continue-session-btn">
                        Continue Session
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-sessions">
              <p>No therapy sessions yet. Request support to get started!</p>
            </div>
          )}
        </div>

        <div className="volunteers-section">
          <h2>Available Volunteers</h2>
          {volunteers.length > 0 ? (
            <div className="volunteers-list">
              {volunteers.map(volunteer => (
                <div key={volunteer.id} className="volunteer-item">
                  <div className="volunteer-info">
                    <div className="volunteer-avatar">
                      {volunteer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4>{volunteer.name}</h4>
                      <p>Specializes in: {volunteer.preferred_chat_type}</p>
                      <span className={`status ${volunteer.is_online ? 'online' : 'offline'}`}>
                        {volunteer.is_online ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No volunteers available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Therapy;