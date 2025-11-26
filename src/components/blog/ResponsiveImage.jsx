import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import './ResponsiveImage.css';

const ResponsiveImage = ({ src, alt, className, aspectRatio = '16/9', ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={cn("responsive-image-wrapper", className)} style={{ aspectRatio }}>
            {!isLoaded && <Skeleton className="responsive-image-skeleton" />}
            <img
                src={src}
                alt={alt}
                className={cn("responsive-image", isLoaded ? "loaded" : "loading")}
                onLoad={() => setIsLoaded(true)}
                loading="lazy"
                {...props}
            />
        </div>
    );
};

export default ResponsiveImage;
