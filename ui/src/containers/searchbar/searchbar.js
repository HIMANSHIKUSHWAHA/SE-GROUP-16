import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
    const [searchType, setSearchType] = useState('videos');
    const [searchParams, setSearchParams] = useState({
        title: '',
        tags: '',
        description: '',
        startDate: '',
        endDate: '',
        firstName: '',
        lastName: '',
        specialization: '',
        email: ''
    });
    const [results, setResults] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setResults(null);

        const endpointMap = {
            videos: '/search/videos',
            liveSessions: '/search/sessions',
            professionals: '/search/professionals'
        };

        try {
            const response = await axios.get(endpointMap[searchType], { params: searchParams });
            if (response.data.length === 0) {
                setErrorMessage('Nothing found');
            } else {
                setResults(response.data);
            }
        } catch (error) {
            setErrorMessage('An error occurred while searching');
            console.error('Search error', error);
        }
    };

    return (
        <div>
            <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                <option value="videos">Video</option>
                <option value="liveSessions">Live Session</option>
                <option value="professionals">Trainer</option>
            </select>


            <button onClick={handleSearch}>Search</button>

            {errorMessage && <div>{errorMessage}</div>}

            {results && results.map((result, index) => (
                <div key={index}>
                    <div>{result.title}</div>
                    {searchType === 'videos' && (
                        <button onClick={() => window.location.href = `/video/${result.id}`}>
                            View Video
                        </button>
                    )}
                    {searchType === 'liveSessions' && (
                        <button onClick={() => window.location.href = `/session/${result.id}`}>
                            View Live Session
                        </button>
                    )}
                    {searchType === 'professionals' && (
                        <button onClick={() => window.location.href = `/trainer/${result.id}`}>
                            View Trainer Profile
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default SearchBar;