import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toggleVolunteerStatus } from '../api/therapy';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [isVolunteer, setIsVolunteer] = useState(user?.is_volunteer || false);
  const [preferredChatType, setPreferredChatType] = useState(user?.preferred_chat_type || 'general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const chatTypes = [
    { value: 'general', label: 'General Support' },
    { value: 'anxiety', label: 'Anxiety' },
    { value: 'depression', label: 'Depression' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'grief', label: 'Grief' },
    { value: 'addiction', label: 'Addiction Recovery' }
  ];

  const handleToggleVolunteer = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const newStatus = !isVolunteer;
      await toggleVolunteerStatus({
        status: newStatus,
        preferredChatType: preferredChatType
      });
      
      setIsVolunteer(newStatus);
      setMessage(newStatus ? 'Volunteer mode enabled!' : 'Volunteer mode disabled!');
    } catch (error) {
      console.error('Error toggling volunteer status:', error);
      setMessage('Failed to update volunteer status');
    }
    
    setLoading(false);
  };

  const handleChatTypeChange = async (e) => {
    const newChatType = e.target.value;
    setPreferredChatType(newChatType);
    
    if (isVolunteer) {
      setLoading(true);
      try {
        await toggleVolunteerStatus({
          status: true,
          preferredChatType: newChatType
        });
        setMessage('Volunteer preferences updated!');
      } catch (error) {
        console.error('Error updating chat type:', error);
        setMessage('Failed to update preferences');
      }
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
      </div>

      <div className="settings-content">
        <div className="settings-section">
          <h2>Account Information</h2>
          <div className="info-item">
            <label>Name:</label>
            <span>{user?.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <label>Account Type:</label>
            <span>{isVolunteer ? 'Volunteer' : 'User'}</span>
          </div>
        </div>

        <div className="settings-section">
          <h2>Volunteer Mode</h2>
          <p className="section-description">
            Enable volunteer mode to help others by providing emotional support and guidance.
          </p>
          
          <div className="volunteer-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={isVolunteer}
                onChange={handleToggleVolunteer}
                disabled={loading}
              />
              <span className="toggle-slider"></span>
              {isVolunteer ? 'Volunteer Mode ON' : 'Volunteer Mode OFF'}
            </label>
          </div>

          {isVolunteer && (
            <div className="volunteer-preferences">
              <label htmlFor="chatType">Preferred Support Type:</label>
              <select
                id="chatType"
                value={preferredChatType}
                onChange={handleChatTypeChange}
                disabled={loading}
              >
                {chatTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className="help-text">
                This determines what type of support requests you'll receive.
              </p>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h2>Privacy & Security</h2>
          <div className="privacy-item">
            <label>Message Filtering:</label>
            <span className="status-enabled">Enabled</span>
            <p className="help-text">
              Inappropriate messages are automatically blocked.
            </p>
          </div>
          <div className="privacy-item">
            <label>Data Encryption:</label>
            <span className="status-enabled">Enabled</span>
            <p className="help-text">
              All messages are encrypted for your privacy.
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2>About Emotli</h2>
          <div className="about-info">
            <p>Version: 1.0.0</p>
            <p>Built with ❤️ for emotional wellness</p>
            <p>Your privacy and safety are our top priorities.</p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('Failed') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;