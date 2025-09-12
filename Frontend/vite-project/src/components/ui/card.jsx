import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-3 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h2 className={`text-xl font-bold text-gray-800 ${className}`}>{children}</h2>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
}
