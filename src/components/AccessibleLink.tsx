'use client';

import Link, { LinkProps } from 'next/link';
import { PropsWithChildren } from 'react';

interface AccessibleLinkProps extends LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const AccessibleLink = ({ children, href, className, ...props }: PropsWithChildren<AccessibleLinkProps>) => {
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
};

export default AccessibleLink;
