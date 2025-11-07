'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FlexSearch from 'flexsearch';

const SearchPage = () => {
  const [index, setIndex] = useState(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const loadIndex = async () => {
      const newIndex = new FlexSearch.Document({
        document: {
          id: 'slug',
          index: ['title', 'description', 'content'],
        },
      });

      const keys = ['1.reg', 'content.1.map', 'description.1.map', 'title.1.map'];
      for (const key of keys) {
        const res = await fetch(`/search/${key}.json`);
        const data = await res.json();
        newIndex.import(key, data);
      }

      setIndex(newIndex);
    };

    loadIndex();
  }, []);

  useEffect(() => {
    if (index && query) {
      const searchResults = index.search(query, { enrich: true });
      const allResults = searchResults.flatMap(result => result.result);
      setResults(allResults);
    } else {
      setResults([]);
    }
  }, [index, query]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for posts..."
        className="w-full p-2 border border-gray-300 rounded-md mb-8"
      />
      <div className="space-y-8">
        {results.map(result => (
          <div key={result.doc.slug}>
            <h2 className="text-2xl font-bold">
              <Link href={`/blog/${result.doc.slug}`}>{result.doc.title}</Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{result.doc.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
