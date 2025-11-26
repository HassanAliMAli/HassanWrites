import React from 'react';
import { cn } from '@/lib/utils';
import './Avatar.css';

const Avatar = React.forwardRef(({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    return (
        <div ref={ref} className={cn('avatar', `avatar--${size}`, className)} {...props}>
            {src ? (
                <img src={src} alt={alt} className="avatar__image" />
            ) : (
                <span className="avatar__fallback">{fallback || alt?.charAt(0) || '?'}</span>
            )}
        </div>
    );
});
Avatar.displayName = 'Avatar';

export { Avatar };
