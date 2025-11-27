import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import Sidebar from './Sidebar';
import './Header.css';

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const isAuthenticated = true;

    return (
        <>
            <header className="header">
                <div className="container header__container">
                    <div className="header__left">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="header__menu-btn md:hidden"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </Button>
                        <Link to="/" className="header__logo">
                            EdgeMaster
                        </Link>
                    </div>

                    <nav className="header__nav hidden md:flex">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/search" className="nav-link">Search</Link>
                        <Link to="/membership" className="nav-link">Membership</Link>
                    </nav>

                    <div className="header__right">
                        <Link to="/search">
                            <Button variant="ghost" size="icon" className="hidden md:flex">
                                <Search size={20} />
                            </Button>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/editor" className="hidden md:block">
                                    <Button variant="ghost" className="write-btn">
                                        <PenTool size={18} className="mr-2" />
                                        Write
                                    </Button>
                                </Link>
                                <Dropdown
                                    align="right"
                                    trigger={
                                        <Button variant="ghost" size="icon">
                                            <Bell size={20} />
                                        </Button>
                                    }
                                >
                                    <div className="p-2 w-64">
                                        <p className="text-sm font-medium mb-2 px-2">Notifications</p>
                                        <DropdownItem onClick={() => { }}>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm">New comment on your post</span>
                                                <span className="text-xs text-muted">2 mins ago</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem onClick={() => { }}>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm">Sarah followed you</span>
                                                <span className="text-xs text-muted">1 hour ago</span>
                                            </div>
                                        </DropdownItem>
                                        <DropdownItem onClick={() => { }}>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm">Your post is trending</span>
                                                <span className="text-xs text-muted">5 hours ago</span>
                                            </div>
                                        </DropdownItem>
                                    </div>
                                </Dropdown>
                                <Link to="/profile/hassan">
                                    <Avatar src="https://ui-avatars.com/api/?name=Hassan&background=6366f1&color=fff" alt="User" size="sm" />
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/auth/login">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link to="/auth/login">
                                    <Button>Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Header;
