import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Portal</h1>
      <div>User Profile</div>
    </header>
  );
};

export default Header;