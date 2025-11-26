import React from 'react';
import { cn } from '@/lib/utils';
import './Skeleton.css';

const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={cn("skeleton", className)}
            {...props}
        />
    );
};

export { Skeleton };
