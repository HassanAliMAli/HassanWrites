import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Type, Moon, Sun, Monitor } from 'lucide-react';
import './ReaderModeToggle.css';

const ReaderModeToggle = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(100);
    const [theme, setTheme] = useState('system');

    useEffect(() => {
        document.documentElement.style.setProperty('--font-size-multiplier', `${fontSize / 100}`);
    }, [fontSize]);

    return (
        <div className="reader-mode-toggle">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                title="Reader Settings"
                aria-label="Reader Settings"
                aria-expanded={isOpen}
                aria-haspopup="dialog"
            >
                <Type size={20} />
            </Button>

            {isOpen && (
                <div
                    className="reader-settings-popover"
                    role="dialog"
                    aria-label="Reader Settings"
                >
                    <div className="setting-group">
                        <label id="font-size-label">Font Size</label>
                        <div className="font-controls" role="group" aria-labelledby="font-size-label">
                            <Button variant="outline" size="sm" onClick={() => setFontSize(Math.max(80, fontSize - 10))} aria-label="Decrease font size">A-</Button>
                            <span aria-live="polite">{fontSize}%</span>
                            <Button variant="outline" size="sm" onClick={() => setFontSize(Math.min(150, fontSize + 10))} aria-label="Increase font size">A+</Button>
                        </div>
                    </div>
                    <div className="setting-group">
                        <label id="theme-label">Theme</label>
                        <div className="theme-controls" role="group" aria-labelledby="theme-label">
                            <Button variant={theme === 'light' ? 'default' : 'ghost'} size="icon" onClick={() => setTheme('light')} aria-label="Light theme"><Sun size={16} /></Button>
                            <Button variant={theme === 'dark' ? 'default' : 'ghost'} size="icon" onClick={() => setTheme('dark')} aria-label="Dark theme"><Moon size={16} /></Button>
                            <Button variant={theme === 'system' ? 'default' : 'ghost'} size="icon" onClick={() => setTheme('system')} aria-label="System theme"><Monitor size={16} /></Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReaderModeToggle;
