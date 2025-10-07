import React from 'react';
import Link from 'next/link';

interface SignInLinkProps {
  text?: string;
  onClick?: () => void;
  href?: string;
  className?: string;
}

const SignInLink: React.FC<SignInLinkProps> = ({
  text = 'Sign in.',
  onClick,
  href,
  className = '',
}) => {
  const baseClasses = `text-sm text-sign hover:text-blue-700 cursor-pointer transition-colors ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseClasses} onClick={onClick}>
        {text}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} bg-transparent border-none p-0`}
    >
      {text}
    </button>
  );
};

export default SignInLink;