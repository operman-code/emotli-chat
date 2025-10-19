import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getGroups, createGroup, addMember } from '../api/groups';
import './Groups.css';

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const response = await getGroups(user.id);
      setGroups(response.data);
    } catch (error) {
      console.error('Error loading groups:', error);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await createGroup(newGroup);
      setNewGroup({ name: '', description: '' });
      setShowCreateForm(false);
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
    }
    
    setLoading(false);
  };

  return (
    <div className="groups-container">
      <div className="groups-header">
        <h1>💬 Groups</h1>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="create-group-btn"
        >
          + Create Group
        </button>
      </div>

      {showCreateForm && (
        <div className="create-group-modal">
          <div className="modal-content">
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label>Group Name</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  required
                  placeholder="Enter group name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({...newGroup, description: e.target.value})}
                  placeholder="Enter group description"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="groups-list">
        {groups.length > 0 ? (
          groups.map(group => (
            <div key={group.id} className="group-item">
              <div className="group-info">
                <h3>{group.name}</h3>
                <p>{group.description}</p>
                <span className="admin-info">Admin: {group.admin_name}</span>
              </div>
              <div className="group-actions">
                <button className="join-group-btn">Join Group</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-groups">
            <p>No groups yet. Create your first group!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;