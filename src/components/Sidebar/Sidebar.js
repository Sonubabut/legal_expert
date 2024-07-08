import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdMenu } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		if (isDarkMode) {
		  document.body.classList.add('dark-mode');
		} else {
		  document.body.classList.remove('dark-mode');
		}
	  }, [isDarkMode]);
	
	  const toggleDarkMode = () => {
		setIsDarkMode(!isDarkMode);
	  };
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        <MdMenu size={24} />
      </button>
	  <img src={"https://digitalt3.com/wp-content/uploads/2024/07/DT3-Bringing-Digital-AI-Together-Photoroom.png"} alt="Logo" className="logo" style={{ width: "200px"}} />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/chat">Legal Expert</Link></li>
        </ul>
      </nav>
	  <div className="dark-mode-toggle">
        <label>
          Dark Mode
          <input type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
        </label>
      </div>
    </div>
  );
};

export default Sidebar;

