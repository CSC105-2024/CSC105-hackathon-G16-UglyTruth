import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '/UglyTruthLogo.svg';
import { useAuth } from '../contexts/AuthContext'; // Import the auth context
import { Axios } from '../axiosinstance'; // Import the axios instance

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { logout } = useAuth(); // Get the logout function from auth context

  const MenuItem = ({ text, onClick, isActive }) => (
    <li
      className={`border border-cream text-cream text-center font-pica py-2 rounded-xl cursor-pointer hover:bg-cream hover:text-sage transition-colors ${isActive ? 'bg-cream text-sage' : ''}`}
      onClick={onClick}
    >
      {text}
    </li>
  );

  MenuItem.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
  };

  useEffect(() => {
    const checkScreenSize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleHome = () => {
    navigate('/');
    if (!isDesktop) setIsOpen(false);
  };

  const handleCreatePost = () => {
    navigate('/create-post');
    if (!isDesktop) setIsOpen(false);
  };

  const handleMyPrivatePosts = () => {
    navigate('/private-posts');
    if (!isDesktop) setIsOpen(false);
  };

  const handleMyPublicPosts = () => {
    navigate('/public-posts');
    if (!isDesktop) setIsOpen(false);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    try {
      // Call the logout function from AuthContext
      await logout();
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { text: 'Home', onClick: handleHome, path: '/home' },
    { text: 'Create Post', onClick: handleCreatePost, path: '/create-post' },
    { text: 'Private Posts', onClick: handleMyPrivatePosts, path: '/private-posts' },
    { text: 'Public Posts', onClick: handleMyPublicPosts, path: '/public-posts' },

  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-full w-[320px] bg-sage z-40 shadow-lg transition-transform duration-500 rounded-r-3xl flex flex-col items-center py-8 ${
          isDesktop ? 'translate-x-0' : isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Placeholder */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold font-pica text-cream leading-none">
            <img src={Logo} alt="Ugly Truth Logo" className="w- h-26 mx-auto" />
          </div>
          <div className="text-4xl font-pica text-cream mt-2">Ugly Truth</div>
        </div>

        {/* Navigation Menu */}
        <ul className="flex flex-col gap-4 w-4/7">
          {menuItems.map((item, index) => (
            <MenuItem 
              key={index} 
              text={item.text} 
              onClick={item.onClick}
              isActive={location.pathname === item.path}
            />
          ))}
        </ul>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Logout Button */}
        <div className="w-4/7 mb-4">
          <button
            onClick={handleLogout}
            className="w-full border border-cream text-cream font-pica py-2 rounded-xl hover:bg-cream hover:text-sage transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default SideBar;