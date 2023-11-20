import React from 'react';

const TitleAutocomplete = ({ searchParams, setSearchParams, suggestions, handleSuggestionClick }) => {
    return (
        <div>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={searchParams.title}
                onChange={(e) => setSearchParams({ ...searchParams, title: e.target.value })}
                autoComplete="off"
            />
            {suggestions.length > 0 && (
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)} style={{ cursor: 'pointer' }}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TitleAutocomplete;
