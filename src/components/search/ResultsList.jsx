import React from 'react';
import { PostCard } from '@/components/blog/PostCard';
import './ResultsList.css';

export const ResultsList = ({ results, query, isSearching }) => {
    if (isSearching) {
        return (
            <div className="results-loading">
                <div className="spinner"></div>
                <p>Searching...</p>
            </div>
        );
    }

    if (query && results.length === 0) {
        return (
            <div className="no-results">
                <p>No results found matching your query.</p>
                <p className="text-muted">Try checking for typos or using different keywords.</p>
            </div>
        );
    }

    return (
        <div className="results-list">
            {query && (
                <p className="results-count">
                    {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </p>
            )}
            <div className="results-grid">
                {results.map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};
