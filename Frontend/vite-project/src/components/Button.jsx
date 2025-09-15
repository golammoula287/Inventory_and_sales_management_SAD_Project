import React from 'react';

export default function Button({ children, type = 'button', onClick, disabled, loading = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`w-full py-3 px-6 rounded-lg text-white font-medium disabled:opacity-60 transition-all ease-in-out duration-300 transform 
        ${loading ? 'bg-gray-500' : 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'} focus:outline-none`}
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
