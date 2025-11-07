'use client';

import { useLink } from 'react-aria';
import { useRef } from 'react';
import Link from 'next/link';

const AccessibleLink = (props) => {
  const ref = useRef();
  const { linkProps } = useLink(props, ref);

  return (
    <Link {...props} {...linkProps} ref={ref}>
      {props.children}
    </Link>
  );
};

export default AccessibleLink;
