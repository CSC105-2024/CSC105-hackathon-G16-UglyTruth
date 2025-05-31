import React from 'react';
import Sidebar from '../components/Sidebar';
import Home from '../components/Home';

const HomePage = () => {
  return (
    <div className="flex min-h-screen ml-50 bg-teal-950">
      <Sidebar />
      <main className="flex-grow overflow-auto">
        <Home />
      </main>
    </div>
  );
};

export default HomePage;