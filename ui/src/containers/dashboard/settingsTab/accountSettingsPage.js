import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './accountSettingsPage.css'; // Make sure to import the CSS file

const SettingsPage = () => {
    const navigate = useNavigate();
    const [entityData, setEntityData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        specialization: '',
        height: '',
        weight: ''
    });
    const [editedData, setEditedData] = useState({});
    const [entityType, setEntityType] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem("UserId");
        if (userId) {
            fetchEntity(userId);
        }
    }, []);

    useEffect(() => {
        setEditedData(entityData);
    }, [entityData]);

    const fetchEntity = async (id) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`/api/v1/settings/entity/${id}`);
            setEntityType(response.data.type);
            setEntityData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        setError('');
        try {
            const updateEndpoint = entityType === 'Professional' ? '/api/v1/settings/updateProfessional' : '/api/v1/settings/updateUser';
            await axios.put(`${updateEndpoint}/${entityData._id}`, editedData);
            fetchEntity(entityData._id);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleReturnToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="container">
            <div className="title">Update Account</div> {/* Title for the form */}
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            <div className="form-group">
                <label>Email:</label>
                <span>{entityData.email}</span>
            </div>

            <div className="form-group">
                <label>Password:</label>
                <input
                    type="password"
                    name="password"
                    value={editedData.password || ''}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <label>First Name:</label>
                <input
                    type="text"
                    name="firstName"
                    value={editedData.firstName || ''}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
                <label>Last Name:</label>
                <input
                    type="text"
                    name="lastName"
                    value={editedData.lastName || ''}
                    onChange={handleInputChange}
                />
            </div>

            {entityType === 'Professional' && (
                <div className="form-group">
                    <label>Specialization:</label>
                    <input
                        type="text"
                        name="specialization"
                        value={editedData.specialization || ''}
                        onChange={handleInputChange}
                    />
                </div>
            )}

            {entityType === 'User' && (
                <>
                    <div className="form-group">
                        <label>Height:</label>
                        <input
                            type="text"
                            name="height"
                            value={editedData.height || ''}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Weight:</label>
                        <input
                            type="text"
                            name="weight"
                            value={editedData.weight || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </>
            )}

            <button className="button" onClick={handleUpdate}>Update</button>
            <button className="button" onClick={handleReturnToDashboard}>Return to Dashboard</button>
        </div>
    );
};

export default SettingsPage;