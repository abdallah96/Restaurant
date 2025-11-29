import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 py-16 overflow-hidden ${className}`}>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 text-orange-400">{title}</h1>
        {subtitle && <p className="text-2xl text-gray-900 font-medium bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-lg">{subtitle}</p>}
      </div>
    </div>
  );
}


