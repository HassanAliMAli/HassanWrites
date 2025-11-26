import React from 'react';
import { Badge } from '@/components/ui/Badge';
import './FilterChips.css';

export const FilterChips = ({ filters, activeFilter, onSelect }) => {
    return (
        <div className="filter-chips">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
                    onClick={() => onSelect(filter.id)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};
