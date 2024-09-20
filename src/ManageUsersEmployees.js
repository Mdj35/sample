import React, { useState, useEffect } from 'react';
import Header from './SuperAdminHeader';

const ManageUsersEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('all');
    const [pendingUsers, setPendingUsers] = useState([]);
    const [vipUsers, setVipUsers] = useState([]);
    const [deleteMessage, setDeleteMessage] = useState('');

    useEffect(() => {
        fetchBranches();
        fetchEmployees(selectedBranch); // Fetch employees for the initial branch (default 'all')
        fetchPendingUsers();
        fetchVipUsers();
    }, []); // Empty dependency array to fetch data on initial render

    const fetchBranches = () => {
        fetch('https://vynceianoani.helioho.st/getbranches.php')
            .then((response) => response.json())
            .then((data) => setBranches(data.branches || []))
            .catch((error) => console.error('Error fetching branches:', error));
    };

    const fetchEmployees = (branch) => {
        fetch('https://vynceianoani.helioho.st/getadmins.php', { // Update with your actual API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ branch }),
        })
            .then((response) => response.json())
            .then((data) => setEmployees(data.employees || []))
            .catch((error) => console.error('Error fetching employees:', error));
    };

    const fetchPendingUsers = () => {
        fetch('https://vynceianoani.helioho.st/getpendingusers.php')
            .then((response) => response.json())
            .then((data) => setPendingUsers(data.pendingUsers || []))
            .catch((error) => console.error('Error fetching pending users:', error));
    };

    const fetchVipUsers = () => {
        fetch('https://vynceianoani.helioho.st/getvipusers.php')
            .then((response) => response.json())
            .then((data) => setVipUsers(data.vipUsers || []))
            .catch((error) => console.error('Error fetching VIP users:', error));
    };

    const handleBranchChange = (event) => {
        setSelectedBranch(event.target.value);
    };

    const applyFilter = () => {
        fetchEmployees(selectedBranch);
    };

    const deactivateEmployee = (employeeId) => {
        fetch('https://vynceianoani.helioho.st/deleteadmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: employeeId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setDeleteMessage('Employee deactivated successfully!');
                    fetchEmployees(selectedBranch);
                } else {
                    setDeleteMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => setDeleteMessage('Error deactivating employee.'));
    };

    const activateEmployee = (employeeId) => {
        fetch('https://vynceianoani.helioho.st/activateadmin.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: employeeId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    setDeleteMessage('Employee activated successfully!');
                    fetchEmployees(selectedBranch);
                } else {
                    setDeleteMessage(data.message || 'An error occurred.');
                }
            })
            .catch((error) => setDeleteMessage('Error activating employee.'));
    };

    const setUserToVIP = (userId) => {
        fetch('https://vynceianoani.helioho.st/setvip.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: userId }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === 'success') {
                    fetchPendingUsers();
                    fetchVipUsers();
                }
            })
            .catch((error) => console.error('Error setting user as VIP:', error));
    };

    const activeEmployees = employees.filter((employee) => employee.status === 'active');
    const inactiveEmployees = employees.filter((employee) => employee.status === 'inactive');

    return (
        <div>
            <Header />
            <h2>Manage Employees and Users</h2>
            {deleteMessage && <div>{deleteMessage}</div>}

            <label>
                Filter by Branch:
                <select value={selectedBranch} onChange={handleBranchChange}>
                    <option value="all">All Branches</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))}
                </select>
            </label>
            <button onClick={applyFilter}>Apply Filter</button>

            <h3>Active Employees</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {activeEmployees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.fullName}</td>
                            <td>{employee.email}</td>
                            <td>
                                <button onClick={() => deactivateEmployee(employee.id)}>
                                    Deactivate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Inactive Employees</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {inactiveEmployees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.fullName}</td>
                            <td>{employee.email}</td>
                            <td>
                                <button onClick={() => activateEmployee(employee.id)}>
                                    Activate
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Pending VIP Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(pendingUsers) && pendingUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                            <td>
                                <button onClick={() => setUserToVIP(user.id)}>Set to VIP</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>VIP Users</h3>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {vipUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.fullName}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsersEmployees;
