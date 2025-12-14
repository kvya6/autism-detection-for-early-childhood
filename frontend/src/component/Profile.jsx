import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ user }) {
  const navigate = useNavigate();

  return (
    <div className="profile-background">
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Child Age:</strong> {user.childAge}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Father:</strong> {user.fatherName}</p>
          <p><strong>Mother:</strong> {user.motherName}</p>
          <p><strong>Phone:</strong> {user.contact}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <button className="profile-btn" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  );
}

