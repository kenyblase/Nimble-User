import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
      <p className="text-gray-500">Orders in this category will appear here</p>
    </div>
  );
};

export default EmptyState;