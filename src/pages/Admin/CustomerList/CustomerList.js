import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import styles from './CustomerList.module.scss';
import AdminLayout from '../AdminLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

export default function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showModals, setShowModals] = useState(false);
    const [formError, setFormError] = useState({});
    const [newCustomer, setNewCustomer] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        fetchCustomers();
    }, []);
    const openModalsss = () => {
        setShowModals(true);
    };
    const closeModalsss = () => {
        setShowModals(false);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/user/admin/getAll');
            //http://localhost:8080/api/v1/user/admin/getAll
            setCustomers(response.data.map((customer, index) => ({ ...customer, id: index + 1 })));
        } catch (error) {
            console.error('Error fetching Customers:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        // { field: 'user_id', headerName: 'USER ID', width: 250 },
        { field: 'username', headerName: 'User Name', width: 250 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'phone', headerName: 'Phone', width: 200 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <div className={cx('action-container')}>
                    <Link to={`/admin/customer/detail/${params.row.user_id}`}>
                        <div className={cx('action-container-detail')}>
                            <FontAwesomeIcon icon={faCircleInfo} className={cx('icon', 'trash-icon')} />
                        </div>
                    </Link>
                </div>
            ),
        },
    ];
    //search Customer
    const filteredCustomers = customers.filter(
        (customer) =>
            customer._excuted && // Kiểm tra _excuted === false
            customer.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const rows = filteredCustomers.map((customers) => ({
        id: customers.id,
        user_id: customers.user_id,
        username: customers.username,
        email: customers.email,
        phone: customers.phone,
        _excuted: customers._excuted,
        status: customers.status,
    }));
    //add products
    const handleAddCustomer = async () => {
        const errors = validateCustomer(newCustomer);
        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            console.error('Comment is not valid');
            return;
        }
        const formattedCustomer = {
            user_id: newCustomer.email,
            username: newCustomer.username,
            password: newCustomer.password,
            email: newCustomer.email,
            phone: newCustomer.phone,
        };

        try {
            await axios.post('http://localhost:8080/api/v1/auth/register', formattedCustomer);

            setShowModal(false);

            setShowModals(true);
        } catch (error) {
            console.error('Error adding Customer:', error);
        }
    };
    //invalid
    const validateCustomer = (customer) => {
        const errors = {};

        if (!customer.username) {
            errors.username = 'username is required';
        }

        if (!customer.password) {
            errors.password = 'password is required';
        }

        if (!customer.email) {
            errors.email = 'email is required';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(customer.email)) {
                errors.email = 'Invalid email';
            }
        }

        if (!customer.phone) {
            errors.phone = 'phone is required';
        } else if (customer.phone.length < 10) {
            errors.phone = 'Phone number at least 10 digits';
        }

        return errors;
    };

    return (
        <AdminLayout>
            <div className={cx('order')}>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        paddingTop: 17,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 28,
                    }}
                >
                    <div className={cx('title')}>
                        <h1>Customer List</h1>
                    </div>
                    <div className={cx('search-add')}>
                        <input
                            type="text"
                            placeholder="Search Customer"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button onClick={openModal}> Add </button>
                    </div>
                    {/* Form modal ADD comment */}
                    <div>
                        {showModal && (
                            <div className={cx('add-customer-form')}>
                                <div className={cx('modal-content')}>
                                    <div>
                                        <h1>Add Product</h1>
                                    </div>
                                    <div className={cx('close')}>
                                        <span onClick={closeModal}>&times;</span>
                                    </div>
                                    <div className={cx('username')}>
                                        <input
                                            type="text"
                                            placeholder="username"
                                            value={newCustomer.username}
                                            onChange={(e) =>
                                                setNewCustomer({ ...newCustomer, username: e.target.value })
                                            }
                                            required
                                        />
                                        {formError.username && (
                                            <div className={cx('error-message')}>{formError.username}</div>
                                        )}
                                    </div>
                                    <div className={cx('password')}>
                                        <input
                                            type="password"
                                            placeholder="password"
                                            value={newCustomer.password}
                                            onChange={(e) =>
                                                setNewCustomer({ ...newCustomer, password: e.target.value })
                                            }
                                            required
                                        />
                                        {formError.password && (
                                            <div className={cx('error-message')}>{formError.password}</div>
                                        )}
                                    </div>
                                    <div className={cx('email')}>
                                        <input
                                            type="text"
                                            placeholder="email"
                                            value={newCustomer.email}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                            required
                                        />
                                        {formError.email && (
                                            <div className={cx('error-message')}>{formError.email}</div>
                                        )}
                                    </div>
                                    <div className={cx('phone')}>
                                        <input
                                            type="number"
                                            placeholder="phone"
                                            value={newCustomer.phone}
                                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                            required
                                        />
                                        {formError.phone && (
                                            <div className={cx('error-message')}>{formError.phone}</div>
                                        )}
                                    </div>

                                    <button onClick={handleAddCustomer}>SUBMIT</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        {/* Modal */}
                        {showModals && (
                            <div className={cx('checks')}>
                                <div className={cx('check')}>
                                    <h1>Verification Alert</h1>
                                    <p>Please check your email to verify your account.</p>
                                    <button onClick={closeModalsss}>OK</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={cx('data')}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            style={{ fontSize: '1.5rem' }}
                            pagination
                            pageSize={10}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
