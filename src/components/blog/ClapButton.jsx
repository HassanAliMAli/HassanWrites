import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import './ClapButton.css';

const ClapButton = ({ initialCount = 0, onClap }) => {
    const [count, setCount] = useState(initialCount);
    const [isClapped, setIsClapped] = useState(false);
    const [animate, setAnimate] = useState(false);

    const handleClap = () => {
        setCount(c => c + 1);
        setIsClapped(true);
        setAnimate(true);
        setTimeout(() => setAnimate(false), 600);
        if (onClap) onClap();
    };

    return (
        <Button
            variant="ghost"
            className={cn("clap-button", isClapped && "clapped")}
            onClick={handleClap}
        >
            <span className="clap-icon-wrapper">
                <span className={cn("clap-icon", animate && "animate")}>👏</span>
            </span>
            <span className="clap-count">{count}</span>
        </Button>
    );
};

export default ClapButton;
