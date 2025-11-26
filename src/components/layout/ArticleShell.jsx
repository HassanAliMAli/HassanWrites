import React from 'react';
import { cn } from '@/lib/utils';
import './ArticleShell.css';

const ArticleShell = ({ children, className }) => {
    return (
        <article className={cn('article-shell', className)}>
            {children}
        </article>
    );
};

export { ArticleShell };
