// CreateAdmin.js
import React, { useState, useEffect } from 'react';
import Header from './SuperAdminHeader';

const CreateAdmin = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        contactNumber: '',
        services: [],
        branch: '',
    });
    const [servicesList, setServicesList] = useState([]);
    const [branchesList, setBranchesList] = useState([]);
    const [message, setMessage] = useState('');

    const fetchServices = () => {
        fetch('https://vynceianoani.helioho.st/getservices.php')
            .then((response) => response.json())
            .then((data) => setServicesList(data.services))
            .catch((error) => console.error('Error fetching services:', error));
    };

    const fetchBranches = () => {
        fetch('https://vynceianoani.helioho.st/getbranches.php')
            .then((response) => response.json())
            .then((data) => setBranchesList(data.branches))
            .catch((error) => console.error('Error fetching branches:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            services: checked
                ? [...prevFormData.services, value]
                : prevFormData.services.filter((service) => service !== value),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('https://vynceianoani.helioho.st/createadmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setMessage('Admin account created successfully!');
                    setFormData({
                        fullName: '',
                        email: '',
                        password: '',
                        contactNumber: '',
                        services: [],
                        branch: '',
                    });
                } else {
                    setMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setMessage('An error occurred while creating the account.');
            });
    };

    useEffect(() => {
        fetchServices();
        fetchBranches();
    }, []);

    return (
        <div>
            <Header/>
            <h2>Create Admin Account</h2>
            {message && <div className="message">{message}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Contact Number:</label>
                    <input
                        type="text"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        maxLength={11}
                    />
                </div>
                <div className="form-group">
                    <label>Branch:</label>
                    <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select a Branch</option>
                        {branchesList.map((branch, index) => (
                            <option key={index} value={branch.id}>
                                {branch.name} - {branch.address}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Services Offered:</label>
                    <table className="services-table">
                        <tbody>
                            {servicesList.map((service, index) => (
                                <tr key={index}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            value={service.name}
                                            checked={formData.services.includes(service.name)}
                                            onChange={handleCheckboxChange}
                                        />
                                    </td>
                                    <td>
                                        <label>{service.name}</label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <button type="submit">Create Admin</button>
            </form>
        </div>
    );
};

export default CreateAdmin;
