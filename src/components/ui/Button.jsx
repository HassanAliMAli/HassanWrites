import React from 'react';
import { cn } from '@/lib/utils';
import './Button.css';

const Button = React.forwardRef(({
    className,
    variant = 'primary',
    size = 'md',
    isLoading,
    children,
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            className={cn(
                'btn',
                `btn--${variant}`,
                `btn--${size}`,
                isLoading && 'btn--loading',
                className
            )}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className="btn__spinner" /> : children}
        </button>
    );
});

Button.displayName = 'Button';

export { Button };
