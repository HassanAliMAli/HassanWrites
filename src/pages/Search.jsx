import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchInput } from '@/components/search/SearchInput';
import { FilterChips } from '@/components/search/FilterChips';
import { ResultsList } from '@/components/search/ResultsList';
import { api } from '@/lib/api';
import './Search.css';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(query);
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const filters = [
        { id: 'all', label: 'All' },
        { id: 'stories', label: 'Stories' },
        { id: 'people', label: 'People' },
        { id: 'tags', label: 'Tags' },
    ];

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                // Mock search implementation
                const allPosts = await api.getPosts();
                const filtered = allPosts.filter(post =>
                    post.title.toLowerCase().includes(query.toLowerCase()) ||
                    post.excerpt.toLowerCase().includes(query.toLowerCase())
                );
                setResults(filtered);
            } catch (error) {
                console.error('Search failed', error);
            } finally {
                setIsSearching(false);
            }
        };

        performSearch();
    }, [query, activeFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: searchTerm });
    };

    return (
        <div className="search-page container">
            <div className="search-header">
                <h1 className="search-title">Search</h1>
                <SearchInput
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={handleSearch}
                    isSearching={isSearching}
                />
            </div>

            <div className="search-results">
                <FilterChips
                    filters={filters}
                    activeFilter={activeFilter}
                    onSelect={setActiveFilter}
                />

                <ResultsList
                    results={results}
                    query={query}
                    isSearching={isSearching}
                />
            </div>
        </div>
    );
};

export default Search;
