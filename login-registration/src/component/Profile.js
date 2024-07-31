//profile that should provide all that information 

import React, { useState, useEffect } from 'react';
import './Profile.css'; // Importing the CSS file for styles

const Profile = ({ user }) => {
  const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);
  const [linkedin, setLinkedin] = useState(user.linkedin || '');
  const [github, setGithub] = useState(user.github || '');
  const [personalWebsite, setPersonalWebsite] = useState(user.personalWebsite || '');
  const [birthDate, setBirthDate] = useState(user.birthDate || '');
  const [education, setEducation] = useState(user.education || []);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [newEducation, setNewEducation] = useState({ institution: '', degree: '', startDate: '', endDate: '' });

  //handle education
  useEffect(() => {
    setEducation(user.education || []);
  }, [user.education]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  //handle the profile pic 
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);
    formData.append('email', user.email);

    try {
      const response = await fetch('http://localhost:5000/upload-profile-picture', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setProfilePicture(data.profilePicture);
      setShowOptions(false);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  //for remove or add another profile pic
  const handleRemove = async () => {
    try {
      await fetch('http://localhost:5000/remove-profile-picture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
      setProfilePicture(null);
      setShowOptions(false);
    } catch (error) {
      console.error('Error removing profile picture:', error);
    }
  };

  //handle social media profile links 
  const handleSaveSocialMedia = async () => {
    try {
      await fetch('http://localhost:5000/update-social-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          linkedin,
          github,
          personalWebsite,
        }),
      });
      setIsEditingSocial(false);
    } catch (error) {
      console.error('Error updating social media links:', error);
    }
  };

  //for bith date 
  const handleBirthDateChange = async (e) => {
    const newBirthDate = e.target.value;
    setBirthDate(newBirthDate);

    try {
      await fetch('http://localhost:5000/update-birth-date', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, birthDate: newBirthDate }),
      });
    } catch (error) {
      console.error('Error updating birth date:', error);
    }
  };

  //for education
  const handleAddEducation = async () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.startDate || !newEducation.endDate) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add-education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          institution: newEducation.institution,
          degree: newEducation.degree,
          startDate: newEducation.startDate,
          endDate: newEducation.endDate,
        }),
      });
      const data = await response.json();
      setEducation(data.education);
      setNewEducation({ institution: '', degree: '', startDate: '', endDate: '' });
      setIsEditingEducation(false);
    } catch (error) {
      console.error('Error adding education:', error);
    }
  };

  //change education details
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setNewEducation((prev) => ({ ...prev, [name]: value }));
  };

  //to remove education
  const handleRemoveEducation = async (index) => {
    try {
      const response = await fetch('http://localhost:5000/remove-education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, index }),
      });
      const data = await response.json();
      setEducation(data.education);
    } catch (error) {
      console.error('Error removing education:', error);
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completedFields = 0;
    const totalFields = 6; // Total number of fields to check for completion

    if (profilePicture) completedFields++;
    if (birthDate) completedFields++;
    if (linkedin || github || personalWebsite) completedFields++;
    if (education.length > 0) completedFields++;
    if (user.firstName && user.lastName) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  //all code that show on front end 
  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <div
        onClick={() => setShowOptions(!showOptions)}
        className="profile-picture-container"
      >
        {profilePicture ? (
          <img
            src={`http://localhost:5000${profilePicture}`}
            alt="Profile"
            className="profile-picture"
          />
        ) : (
          <div className="profile-picture-placeholder">
            <p>Profile Photo</p>
          </div>
        )}
      </div>
      {showOptions && (
        <div className="profile-options">
          {profilePicture ? (
            <>
              <button onClick={handleRemove}>Remove Profile Picture</button>
              <button>
                <label>
                  Change Profile Picture
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="file-input"
                  />
                </label>
              </button>
              <button onClick={handleUpload}>Upload</button>
            </>
          ) : (
            <>
              <label>
                Add Profile Photo
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                />
              </label>
              <button onClick={handleUpload}>Upload Profile Picture</button>
            </>
          )}
        </div>
      )}
      <div className="personal-info">
        <h3>Personal Information</h3>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>
          Birth Date:
          <input
            type="date"
            value={birthDate}
            onChange={handleBirthDateChange}
            className="date-input"
          />
        </p>
      </div>
      <div className="contact-details">
        <h3>Contact Details</h3>
        <p>Email Address: {user.email}</p>
        <p>Mobile Number: {user.mobile}</p>
      </div>
      <div className="social-media">
        <h3>Social Media Profile</h3>
        {isEditingSocial ? (
          <div className="social-media-edit">
            <label>
              LinkedIn:
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/in/your-profile"
              />
            </label>
            <br />
            <label>
              GitHub:
              <input
                type="url"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/your-profile"
              />
            </label>
            <br />
            <label>
              Personal Website:
              <input
                type="url"
                value={personalWebsite}
                onChange={(e) => setPersonalWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </label>
            <br />
            <button onClick={handleSaveSocialMedia}>Save</button>
            <button onClick={() => setIsEditingSocial(false)}>Cancel</button>
          </div>
        ) : (
          <div className="social-media-view">
            <p>
              LinkedIn:{' '}
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                {linkedin || 'Not Set'}
              </a>
            </p>
            <p>
              GitHub:{' '}
              <a href={github} target="_blank" rel="noopener noreferrer">
                {github || 'Not Set'}
              </a>
            </p>
            <p>
              Personal Website:{' '}
              <a href={personalWebsite} target="_blank" rel="noopener noreferrer">
                {personalWebsite || 'Not Set'}
              </a>
            </p>
            <button onClick={() => setIsEditingSocial(true)}>Edit Social Media Links</button>
          </div>
        )}
      </div>
      <div className="education">
        <h3>Education Details</h3>
        {isEditingEducation ? (
          <div className="education-edit">
            <label>
              Name of Institute:
              <input
                type="text"
                name="institution"
                value={newEducation.institution}
                onChange={handleEducationChange}
              />
            </label>
            <br />
            <label>
              Degree:
              <input
                type="text"
                name="degree"
                value={newEducation.degree}
                onChange={handleEducationChange}
              />
            </label>
            <br />
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={newEducation.startDate}
                onChange={handleEducationChange}
              />
            </label>
            <br />
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={newEducation.endDate}
                onChange={handleEducationChange}
              />
            </label>
            <br />
            <button onClick={handleAddEducation}>Save</button>
            <button onClick={() => setIsEditingEducation(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <button onClick={() => setIsEditingEducation(true)}>Add Education</button>
            <ul>
              {education.map((edu, index) => (
                <li key={index}>
                  <p>{edu.institution}</p>
                  <p>{edu.degree}</p>
                  <p>{edu.startDate} - {edu.endDate}</p>
                  <button onClick={() => handleRemoveEducation(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="profile-completion">
        <h3>Profile Completion</h3>
        <div className="completion-bar">
          <div
            className="completion-progress"
            style={{ width: `${calculateProfileCompletion()}%` }}
          ></div>
        </div>
        <p>{calculateProfileCompletion()}%</p>
      </div>
    </div>
  );
};

export default Profile;
