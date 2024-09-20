import React, { useState, useEffect } from 'react';
import './ManageServices.css'; // Import the CSS file
import Header from './SuperAdminHeader';


const ManageServices = () => {
    const [services, setServices] = useState([]); // Initialize as an empty array
    const [newService, setNewService] = useState({ name: '', price: '' });
    const [editServiceId, setEditServiceId] = useState(null);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await fetch('https://vynceianoani.helioho.st/getServices2.php');
            const data = await response.json();

            // Ensure that the response is an array
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.error('Unexpected data format: ', data);
                setServices([]); // Fallback to an empty array
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            setServices([]); // Fallback to an empty array in case of error
        }
    };

    const handleAddService = async () => {
        try {
            const response = await fetch('https://vynceianoani.helioho.st/addService.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newService),
            });
            const data = await response.json();
            if (data.success) {
                fetchServices(); // Refresh the service list
                setNewService({ name: '', price: '' }); // Reset form
            }
        } catch (error) {
            console.error('Error adding service:', error);
        }
    };

    const handleEditService = async (serviceId) => {
        try {
            const response = await fetch('https://vynceianoani.helioho.st/editService.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: serviceId, ...newService }),
            });
            const data = await response.json();
            if (data.success) {
                fetchServices();
                setEditServiceId(null); // Exit edit mode
            }
        } catch (error) {
            console.error('Error editing service:', error);
        }
    };

    const toggleServiceStatus = async (serviceId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'available' ? 'not available' : 'available';
            const response = await fetch('https://vynceianoani.helioho.st/toggleServiceStatus.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: serviceId, status: newStatus }),
            });
            const data = await response.json();
            if (data.success) {
                fetchServices();
            }
        } catch (error) {
            console.error('Error toggling service status:', error);
        }
    };

    return (
        <div>
            <Header/>
        <div className="manage-services-container">
            <h2>Manage Services</h2>

            <div className="form-container">
                <input
                    type="text"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    placeholder="Service Name"
                    className="input-field"
                />
                <input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                    placeholder="Service Price"
                    className="input-field"
                />
                <button
                    className="add-button"
                    onClick={editServiceId ? () => handleEditService(editServiceId) : handleAddService}
                >
                    {editServiceId ? 'Edit Service' : 'Add Service'}
                </button>
            </div>

            {/* Safely map over services if it is an array */}
            <ul className="services-list">
                {services.length > 0 ? (
                    services.map((service) => (
                        <li key={service.id} className="service-item">
                            <span className="service-details">{service.name} - ₱{service.price}</span>
                            <span className={`status ${service.status}`}>Status: {service.status}</span>
                            <button
                                className="toggle-status-btn"
                                onClick={() => toggleServiceStatus(service.id, service.status)}
                            >
                                Toggle Status
                            </button>
                            <button className="edit-btn" onClick={() => setEditServiceId(service.id)}>
                                Edit
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No services available.</li>
                )}
            </ul>
        </div>
        </div>
    );
};

export default ManageServices;
