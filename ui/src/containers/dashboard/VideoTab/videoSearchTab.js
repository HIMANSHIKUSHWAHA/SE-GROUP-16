import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoPreview from './../videoEmbeds';
import TitleAutocomplete from "./TitleAutoComplete";
import { jwtDecode } from 'jwt-decode';
const VideoSearch = () => {

    const [searchParams, setSearchParams] = useState({
        title: '',
        tags: '',
        description: '',
    });
    const [results, setResults] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log(token);
        fetchAllVideos();
    }, []);


    const fetchAllVideos = async () => {
        try {
            const response = await axios.get('/api/v1/search/allvideos');
            setResults(response.data);
            console.log(response);
        } catch (error) {
            setErrorMessage('An error occurred while fetching videos.');
            console.error('Fetch all videos error', error);
        }
    };

    const handleInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.get('/api/v1/search/searchvideos', { params: searchParams });
            setResults(response.data); // This will trigger the useEffect if the array is empty
            if (response.data.length === 0) {
                setResults([]);
                setErrorMessage('No videos found.');
            }
        } catch (error) {
            setResults([]);
            setErrorMessage('An error occurred while searching for videos.');
            console.error('Search error', error);
        }
    };

    return (
        <div>
            <h1>Video Search</h1>
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={searchParams.title}
                onChange={handleInputChange}
            />

            <input
                type="text"
                name="tags"
                placeholder="Tags (comma-separated)"
                value={searchParams.tags}
                onChange={handleInputChange}
            />
            <TitleAutocomplete
                searchParams={searchParams}
                setSearchParams={setSearchParams}
            />
            <input
                type="text"
                name="description"
                placeholder="Description"
                value={searchParams.description}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button>

            {errorMessage && <div>{errorMessage}</div>}

            {results.map((result, index) => (
                <div key={index}>
                    <div>{result.title}</div>
                    <VideoPreview link={result.link} />
                    <div>{result.description}</div>
                </div>
            ))}
        </div>
    );
};

export default VideoSearch;