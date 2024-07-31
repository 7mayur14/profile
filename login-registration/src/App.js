// src/App.js
import React, { useState } from 'react';
import Login from './component/Login';
import Registration from './component/Registration';
import Profile from './component/Profile';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
  };

  return (
    <div>
      {user ? (
        <Profile user={user} />
      ) : (
        <>
          {isLogin ? (
            <Login toggleForm={toggleForm} onLogin={handleLogin} />
          ) : (
            <Registration toggleForm={toggleForm} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
