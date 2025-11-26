import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './Dropdown.css';

export const Dropdown = ({ trigger, children, align = 'left' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className="dropdown-trigger" onClick={toggleDropdown}>
                {trigger}
            </div>
            {isOpen && (
                <div className={`dropdown-menu dropdown-align-${align}`}>
                    {children}
                </div>
            )}
        </div>
    );
};

export const DropdownItem = ({ children, onClick, icon: Icon, danger = false }) => (
    <div
        className={`dropdown-item ${danger ? 'dropdown-item-danger' : ''}`}
        onClick={onClick}
    >
        {Icon && <Icon size={16} className="dropdown-item-icon" />}
        {children}
    </div>
);
