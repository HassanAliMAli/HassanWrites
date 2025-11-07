'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

const Comments = () => {
  const { theme } = useTheme();

  return (
    <div className="mt-12">
      <Giscus
        repo="HassanAliMAli/HassanWrites"
        repoId="" // You need to get this from the Giscus website
        category="Announcements"
        categoryId="" // You need to get this from the Giscus website
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="en"
      />
    </div>
  );
};

export default Comments;
