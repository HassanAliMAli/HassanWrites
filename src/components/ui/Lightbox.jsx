import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import './Lightbox.css';

const Lightbox = ({ src, alt, isOpen, onClose }) => {
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="lightbox-overlay" onClick={onClose}>
            <Button
                variant="ghost"
                size="icon"
                className="lightbox-close"
                onClick={onClose}
                aria-label="Close lightbox"
            >
                <X size={24} />
            </Button>
            <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <img src={src} alt={alt} className="lightbox-image" />
                {alt && <p className="lightbox-caption">{alt}</p>}
            </div>
        </div>,
        document.body
    );
};

export default Lightbox;
