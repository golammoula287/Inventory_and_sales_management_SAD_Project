import React from 'react';

export default function Button({ children, type = 'button', onClick, disabled, loading = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3 px-6 rounded-lg text-white font-medium disabled:opacity-60 transition-all ease-in-out duration-300 transform 
        ${loading ? 'bg-gray-500' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 hover:from-purple-700 hover:to-blue-800'} focus:outline-none`}
    >
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-5 h-5 border-4 border-t-4 border-gray-300 border-solid rounded-full animate-spin border-t-white"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
