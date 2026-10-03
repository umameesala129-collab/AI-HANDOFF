import React from 'react';

export default function Card({ children, className = '', hoverEffect = true, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-lg border border-slate-200 bg-slate-50 p-5 text-slate-800 ${
        hoverEffect ? 'hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-900/5 transition-all duration-200' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
