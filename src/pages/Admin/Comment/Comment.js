import AdminLayout from '../AdminLayout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './Comment.module.scss';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const cx = classNames.bind(styles);

export function Comment() {
    const [commentData, setCommentData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formError, setFormError] = useState({});
    const [newComment, setNewComment] = useState({
        userid: localStorage.getItem('id'),
        productitemid: '',
        commentdate: '',
        content: '',
    });
    useEffect(() => {
        fetchProductData();
        fetchComment();
    }, []);
    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };
    const fetchProductData = async () => {
        try {
            const responseProduct = await axios.get(`http://localhost:8080/api/v1/product`);
            setProductData(responseProduct.data);
        } catch (error) {
            console.error('Error fetching Product Data:', error);
        }
    };

    const fetchComment = async () => {
        try {
            const responseProduct = await axios.get(`http://localhost:8080/api/v1/comment/getAll`);
            setCommentData(responseProduct.data);
        } catch (error) {
            console.error('Error fetching Product Data:', error);
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'content', headerName: 'Content', width: 350 },
        {
            field: 'productName', // Fix the field name to 'productName'
            headerName: 'Product Name',
            width: 250,
        },

        { field: 'byuser', headerName: 'By User', width: 200 },
        { field: 'commentdate', headerName: 'Date', width: 200 },
        {
            field: 'Action',
            headerName: 'Action',
            width: 100,
            renderCell: (params) => {
                return (
                    <div
                        className={cx('icons')}
                        onClick={() => {
                            handleDeleteComment(params.row.id);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} className={cx('icon')} />
                    </div>
                );
            },
        },
    ];

    const filteredComments = commentData.filter((comment) =>
        comment.content?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    // Function to get product name by ID
    const getCommentById = (commentId) => {
        return productData.find((comment) => comment.id === commentId);
    };
    //handdle select
    const handleCommentChange = (event) => {
        const selectedProductId = event.target.value;
        setNewComment({ ...newComment, productitemid: selectedProductId });
        const errors = validateComment({
            ...newComment,
            productitemid: selectedProductId,
        });
        setFormError(errors);
    };
    //delete
    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/comment?id=${commentId}`);
            fetchComment();
        } catch (error) {
            console.error('Error deleting Comment:', error);
        }
    };
    const rows = filteredComments.map((comment) => ({
        id: comment.id,
        productName: getCommentById(comment.productitemid)?.name, // Get product name by ID
        content: comment.content,
        byuser: comment.userid,
        commentdate: comment.commentdate,
    }));
    //invalid
    const validateComment = (comment) => {
        const errors = {};

        if (!comment.productitemid || comment.productitemid.trim() === '') {
            errors.productitemid = 'Product is required';
        }
        if (!comment.content.trim()) {
            errors.content = 'Content is required';
        }
        return errors;
    };

    //add Comment
    const handleAddComment = async () => {
        const errors = validateComment(newComment);

        if (Object.keys(errors).length > 0) {
            setFormError(errors);
            console.error('Comment is not valid');
            return;
        }
        const formattedComment = {
            userid: newComment.userid,
            productitemid: newComment.productitemid,
            commentdate: newComment.commentdate,
            content: newComment.content,
        };

        try {
            await axios.post('http://localhost:8080/api/v1/comment/add', formattedComment);
            // Clear newComment state after adding a comment
            setNewComment({
                userid: localStorage.getItem('id'),
                productitemid: '',
                commentdate: '',
                content: '',
            });
            fetchComment();
            setShowModal(false);
        } catch (error) {
            console.error('Error adding Comment:', error);
        }
    };
    return (
        <AdminLayout>
            <div>
                <div className={cx('comments')}>
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
                            <h1>Comment</h1>
                        </div>
                        <div className={cx('search-add')}>
                            <input
                                type="text"
                                placeholder="Search Comments"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button onClick={openModal}> Add </button>
                        </div>
                        <div className={cx('data')}>
                            <DataGrid rows={rows} columns={columns} style={{ fontSize: '1.5rem' }} pageSize={5} />
                        </div>
                    </div>
                </div>
                <div>
                    {showModal && (
                        <div className={cx('add-customer-form')}>
                            <div className={cx('modal-content')}>
                                <div>
                                    <h1>Add Comment</h1>
                                </div>
                                <div className={cx('close')}>
                                    <span onClick={closeModal}>&times;</span>
                                </div>
                                <div className={cx('productname')}>
                                    <select
                                        id="productSelect"
                                        value={commentData.productitemid}
                                        onChange={handleCommentChange}
                                        required
                                    >
                                        <option value=" ">Select a product</option>
                                        {productData.map((product) => (
                                            <option key={product.id} value={product.id}>
                                                {product.name}
                                            </option>
                                        ))}
                                    </select>
                                    {formError.productitemid && (
                                        <div className={cx('error-message')}>{formError.productitemid}</div>
                                    )}
                                </div>

                                <div className={cx('content')}>
                                    <textarea
                                        type="text"
                                        placeholder="content comment"
                                        value={commentData.content}
                                        onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                        required
                                    />
                                    {formError.content && (
                                        <div className={cx('error-message')}>{formError.content}</div>
                                    )}
                                </div>

                                <button onClick={handleAddComment}>SUBMIT</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
