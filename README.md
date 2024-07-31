# profile# User Profile Management System

## Overview

This project is a User Profile Management System developed using React.js for the frontend and Express.js for the backend. It allows users to manage their profile details, including personal information, profile picture, social media links, and education history. Users can register, log in, update their profile, and view their profile completion percentage.

### Users currently register for chech profile 
  
    1. Email- mayurmane656@gmail.com
       Password- Pass@123

    2. Email- raj11@gmail.com
       Password- Pass@123

## Features

- User Registration and Login
- Profile Picture Upload and Removal
- Update Personal Information and Social Media Links
- Add, Edit, and Remove Education Details
- View Profile Completion Percentage

## Technology Stack

- **Frontend:** React.js
- **Backend:** Express.js
- **Database:** JSON file (users.json) for data storage //currently used store the data (for large data in future handle can update with server) 
- **File Uploads:** Multer for handling file uploads // used to profile picture handle

## Installation

### Backend

1. Clone the repository:

    
       git clone https://github.com/7mayur14/profile.git
       cd profile

## Navigate to the backend directory:


    cd backend

## Install the necessary dependencies:

 
    npm install

## Start the backend server:

    
    npm start

## Frontend
Navigate to the frontend directory:

 
    cd login-registration

## Install the necessary dependencies:


    npm install
    
## Start the frontend development server:

    
    npm start

### API Endpoints
POST /register: Register a new user
POST /login: User login
POST /upload-profile-picture: Upload a profile picture
POST /remove-profile-picture: Remove a profile picture
POST /update-birth-date: Update user's birth date
POST /update-social-media: Update user's social media links
POST /add-education: Add education details
POST /remove-education: Remove education details
GET /get-profile-completion: Get profile completion percentage

### Frontend Components
Profile: Displays and manages user profile details
Uploads and removes profile pictures
Updates personal information and social media links
Manages education details

## Configuration
The backend server runs on port 5000.
The frontend development server runs on port 3000.
Contributing
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -am 'Add new feature').
Push to the branch (git push origin feature-branch).
Create a new Pull Request.

Contact
If you have any questions, please feel free to reach out to me at [mayurmane656@gmail.com].

Acknowledgments
Inspiration and guidance from various online resources.
Tools and libraries used in this project: React.js, Express.js, Multer.
