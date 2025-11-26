import React from 'react';
import { createPortal } from 'react-dom';
import { X, Home, Search, User, PenTool, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="sidebar-overlay" onClick={onClose}>
            <div className="sidebar-content" onClick={e => e.stopPropagation()}>
                <div className="sidebar-header">
                    <span className="sidebar-logo">EdgeMaster</span>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X size={24} />
                    </Button>
                </div>

                <nav className="sidebar-nav">
                    <Link to="/" className="sidebar-link" onClick={onClose}>
                        <Home size={20} />
                        <span>Home</span>
                    </Link>
                    <Link to="/search" className="sidebar-link" onClick={onClose}>
                        <Search size={20} />
                        <span>Search</span>
                    </Link>
                    <Link to="/profile" className="sidebar-link" onClick={onClose}>
                        <User size={20} />
                        <span>Profile</span>
                    </Link>
                    <Link to="/editor" className="sidebar-link" onClick={onClose}>
                        <PenTool size={20} />
                        <span>Write</span>
                    </Link>
                </nav>

                <div className="sidebar-footer">
                    <Link to="/auth/login" onClick={onClose} className="w-full">
                        <Button className="w-full">
                            <LogIn size={18} className="mr-2" />
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Sidebar;
