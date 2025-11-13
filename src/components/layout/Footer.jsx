import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} <span className="font-semibold">E-Market</span>. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default Footer