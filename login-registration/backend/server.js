//server file for store data at backend
//here currently used to store the file for store data in itself in user.json file 


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/profile-pictures', express.static(path.join(__dirname, 'profile-pictures')));

const USERS_FILE = 'users.json';

// Helper function to read users from file
const readUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const users = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(users);
};

// Helper function to write users to file
const writeUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// Helper function to delete a file
const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error(`Error deleting file: ${filePath}`, err);
  });
};

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'profile-pictures');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Registration endpoint
app.post('/register', (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;
  const users = readUsers();

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const newUser = { firstName, lastName, email, mobile, password, education: [] };
  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: 'Registration successful' });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find((user) => user.email === email && user.password === password);

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  res.status(200).json({
    message: 'Login successful',
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      birthDate: user.birthDate || null,
      profilePicture: user.profilePicture || null,
      linkedin: user.linkedin || '',
      github: user.github || '',
      personalWebsite: user.personalWebsite || '',
      education: user.education || []
    },
  });
});

// Upload profile picture endpoint
app.post('/upload-profile-picture', upload.single('profilePicture'), (req, res) => {
  const { email } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (user.profilePicture) {
    const oldFilePath = path.join(__dirname, user.profilePicture);
    deleteFile(oldFilePath);
  }

  user.profilePicture = `/profile-pictures/${req.file.filename}`;
  writeUsers(users);

  res.status(200).json({ message: 'Profile picture uploaded successfully', profilePicture: user.profilePicture });
});

// Remove profile picture endpoint
app.post('/remove-profile-picture', (req, res) => {
  const { email } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (user.profilePicture) {
    const filePath = path.join(__dirname, user.profilePicture);
    deleteFile(filePath);
  }

  user.profilePicture = null;
  writeUsers(users);

  res.status(200).json({ message: 'Profile picture removed successfully' });
});

// Update birth date endpoint
app.post('/update-birth-date', (req, res) => {
  const { email, birthDate } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.birthDate = birthDate;
  writeUsers(users);

  res.status(200).json({ message: 'Birth date updated successfully' });
});

// Update social media links endpoint
app.post('/update-social-media', (req, res) => {
  const { email, linkedin, github, personalWebsite } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  user.linkedin = linkedin;
  user.github = github;
  user.personalWebsite = personalWebsite;

  writeUsers(users);

  res.status(200).json({ message: 'Social media links updated successfully' });
});

// Add education endpoint
app.post('/add-education', (req, res) => {
  const { email, institution, degree, startDate, endDate } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const newEducation = { institution, degree, startDate, endDate };
  user.education.push(newEducation);
  writeUsers(users);

  res.status(200).json({ message: 'Education added successfully', education: user.education });
});

// Remove education endpoint
app.post('/remove-education', (req, res) => {
  const { email, index } = req.body;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  user.education.splice(index, 1);
  writeUsers(users);

  res.status(200).json({ message: 'Education removed successfully', education: user.education });
});

// Example Express.js route to get user profile completion
app.get('/get-profile-completion', (req, res) => {
  const { email } = req.query;
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) return res.status(404).json({ message: 'User not found' });

  let completedFields = 0;
  const totalFields = 6; // Total number of fields to check for completion

  if (user.profilePicture) completedFields++;
  if (user.birthDate) completedFields++;
  if (user.linkedin || user.github || user.personalWebsite) completedFields++;
  if (user.education && user.education.length > 0) completedFields++;
  if (user.firstName && user.lastName) completedFields++;

  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  res.json({ completionPercentage });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
