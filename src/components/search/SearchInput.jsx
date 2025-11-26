import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import './SearchInput.css';

export const SearchInput = ({ value, onChange, onSubmit, isSearching, placeholder = "Search stories, people, and tags..." }) => {
    return (
        <form onSubmit={onSubmit} className="search-input-form">
            <div className="search-input-wrapper">
                <SearchIcon className="search-input-icon" size={20} />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="search-input-field"
                    autoFocus
                />
            </div>
            <Button type="submit" disabled={isSearching}>
                {isSearching ? 'Searching...' : 'Search'}
            </Button>
        </form>
    );
};
