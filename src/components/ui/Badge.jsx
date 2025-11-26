import React from 'react';
import { cn } from '@/lib/utils';
import './Badge.css';

const Badge = React.forwardRef(({ className, variant = 'default', ...props }, ref) => {
    return (
        <div ref={ref} className={cn('badge', `badge--${variant}`, className)} {...props} />
    );
});
Badge.displayName = 'Badge';

export { Badge };
