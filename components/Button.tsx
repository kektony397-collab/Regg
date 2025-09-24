import React from 'react';

// FIX: Changed interface to type to correctly inherit HTMLButtonElement attributes.
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`rounded-md bg-brand-primary px-4 py-2 text-sm font-bold text-brand-dark shadow-md transition-all hover:bg-white hover:shadow-neon-accent focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-brand-dark disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;