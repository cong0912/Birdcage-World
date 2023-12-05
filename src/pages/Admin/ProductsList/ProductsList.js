import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import classNames from 'classnames/bind';
import styles from './ProductsList.module.scss';
import AdminLayout from '../AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { ClipLoader } from 'react-spinners';

import axios from 'axios';

const cx = classNames.bind(styles);

const isValidURL = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(url);
};

function ProductList() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [newProduct, setNewProduct] = useState({
        category_id: '',
        name: '',
        description: '',
        amount: '',
        price: '',
        product_image: '',
    });
    const [editProduct, setEditProduct] = useState({
        category_id: '',
        name: '',
        description: '',
        amount: '',
        price: '',
        product_image: '',
    });
    const [formError, setFormError] = useState({});
    const [selectedProductId, setSelectedProductId] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const closeEdit = () => {
        setShowEdit(false);
    };
    //show products
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/v1/product');
            // http://localhost:8080/api/v1/product
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setIsLoading(false);
    };
    const categoryMap = {
        1: 'Wooden',
        2: 'Metal',
        // Thêm các mục ánh xạ khác
    };
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name Products', width: 250 },
        { field: 'amount', headerName: 'Amount', width: 100 },
        {
            field: 'category',
            headerName: 'Category',
            width: 100,
            renderCell: (params) => categoryMap[params.row.category] || '',
        },
        { field: 'price', headerName: 'Price', width: 100 },
        { field: 'is_post', headerName: 'Status', width: 100 },
        { field: 'description', headerName: 'Description', width: 250 },
        {
            field: 'action',
            headerName: 'Action',
            sortable: false,
            width: 200,
            renderCell: (params) => (
                <div className={cx('action-container')}>
                    <div className={cx('action-container-disable')}>
                        <FontAwesomeIcon
                            icon={faEyeSlash}
                            className={cx('icon', 'trash-icon')}
                            onClick={() => handleDisabledProduct(params.row.id)}
                        />
                    </div>
                    <div className={cx('action-container-edit')}>
                        <FontAwesomeIcon
                            icon={faPenToSquare}
                            className={cx('icon', 'edit-icon')}
                            onClick={() => handleEditProduct(params.row.id)}
                        />
                    </div>
                </div>
            ),
        },
    ];
    //search products
    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const rows = filteredProducts.map((product) => ({
        id: product.id,
        name: product.name,
        amount: product.amount,
        category: product.category_id,
        price: product.price,
        is_post: product.is_post,
        description: product.description,
    }));
    //delete products
    const handleDisabledProduct = async (productId) => {
        try {
            await axios.post(`http://localhost:8080/api/v1/product/changePost?id=${productId}`);
            // update products after add
            fetchProducts(); // Đảm bảo gọi hàm này nếu bạn muốn cập nhật danh sách sản phẩm sau khi xóa
        } catch (error) {
            console.error(`Error deleting product ${productId}:`, error);
        }
    };

    //edit products
    const handleEditProduct = (productId) => {
        console.log(productId);
        const productToEdit = products.find((product) => product.id === productId);

        if (productToEdit) {
            setEditProduct(productToEdit);
            setSelectedProductId(productId);
            setShowEdit(true);
        }
    };

    const handleUpdateProduct = async () => {
        try {
            await axios.put(`http://localhost:8080/api/v1/product/update?id=${selectedProductId}`, editProduct);
            // Cập nhật sản phẩm trong trạng thái form.
            const updatedProducts = products.map((product) => {
                if (product.id === selectedProductId) {
                    return editProduct;
                }
                return product;
            });

            setProducts(updatedProducts);

            // Đóng biểu mẫu chỉnh sửa.
            setShowEdit(false);
        } catch (error) {
            console.log(editProduct);
            console.error(`Lỗi khi cập nhật sản phẩm ${selectedProductId}:`, error);
        }
    };

    //add products
    const handleAddProduct = async () => {
        const errors = validateProduct(newProduct);

        if (Object.keys(errors).length === 0) {
            // No errors, proceed with adding the product
            const formattedProduct = {
                category_id: newProduct.category_id,
                name: newProduct.name,
                description: newProduct.description,
                amount: parseInt(newProduct.amount),
                price: parseFloat(newProduct.price),
                product_image: newProduct.product_image,
            };

            if (!formattedProduct.category_id) {
                formattedProduct.category_id = 1; // Set default value if not chosen
            }

            try {
                await axios.post('http://localhost:8080/api/v1/product/add', formattedProduct);
                // Update products after add
                fetchProducts();
                // Reset form values and close the modal
                setNewProduct({
                    category_id: '',
                    name: '',
                    description: '',
                    amount: '',
                    price: '',
                    product_image: '',
                    is_customer: true,
                    is_post: true,
                });
                setShowModal(false);
            } catch (error) {
                console.error('Error adding product:', error);
            }
            setFormError({});
        } else {
            // Update the form errors state with the validation errors
            setFormError(errors);
        }
    };

    // const productSchema = Yup.object().shape({
    //     name: Yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
    //     description: Yup.string().required('Description is required').min(3, 'Description must be at least 3 words'),
    //     amount: Yup.number()
    //         .required('Amount is required')
    //         .positive('Amount must be a positive integer')
    //         .integer('Amount must be an integer'),
    //     price: Yup.number().required('Price is required').positive('Price must be a positive decimal number'),
    //     product_image: Yup.string().required('Product image is required').url('Invalid URL'),
    // });
    const validateProduct = (product) => {
        const errors = {};

        // Validate name
        if (!product.name) {
            errors.name = 'Name is required';
        } else if (product.name.length < 3) {
            errors.name = 'Name must be at least 3 characters';
        }

        // Validate description
        if (!product.description) {
            errors.description = 'Description is required';
        } else if (product.description.length < 3) {
            errors.description = 'Description must be at least 3 words';
        }

        // Validate amount
        if (!product.amount) {
            errors.amount = 'Amount is required';
        } else if (product.amount <= 0) {
            errors.amount = 'Amount must be a positive integer';
        }

        // Validate price
        // Validate price
        if (!product.price) {
            errors.price = 'Price is required';
        } else if (product.price !== 0 && (isNaN(product.price) || product.price <= 0)) {
            errors.price = 'Price must be a positive number';
        }

        // Validate product_image
        if (!product.product_image) {
            errors.product_image = 'Product image is required';
        } else if (!isValidURL(product.product_image)) {
            errors.product_image = 'Invalid URL';
        }

        return errors;
    };
    return (
        <AdminLayout>
            {isLoading ? (
                <div className={cx('loading-spinner')}>
                    <ClipLoader size={35} color={'#123abc'} loading={isLoading} />
                </div>
            ) : (
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
                            <h1>Products List</h1>
                        </div>
                        <div className={cx('search-add')}>
                            <input
                                type="text"
                                placeholder="Search Products"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />

                            <button onClick={openModal}> Add </button>
                        </div>

                        {/* Form modal ADD products */}
                        <div>
                            {showModal && (
                                <div className={cx('add-product-form')}>
                                    <div className={cx('modal-content')}>
                                        <div>
                                            <h1>Add Product</h1>
                                        </div>
                                        <div className={cx('close')}>
                                            <span onClick={closeModal}>&times;</span>
                                        </div>
                                        <div className={cx('name')}>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={newProduct.name}
                                                required
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            />
                                            {formError.name && (
                                                <div className={cx('error-message')}>{formError.name}</div>
                                            )}
                                        </div>
                                        <div className={cx('amount-category')}>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={newProduct.amount}
                                                required
                                                onChange={(e) =>
                                                    setNewProduct({ ...newProduct, amount: e.target.value })
                                                }
                                            />
                                            {formError.amount && (
                                                <div className={cx('error-message')}>{formError.amount}</div>
                                            )}
                                            <select
                                                value={editProduct.category_id}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, category_id: e.target.value })
                                                }
                                            >
                                                <option value="1">Wooden</option>
                                                <option value="2">Metal</option>
                                            </select>
                                        </div>
                                        <div className={cx('price')}>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={newProduct.price}
                                                required
                                                onChange={(e) =>
                                                    setNewProduct({ ...newProduct, price: e.target.value })
                                                }
                                            />
                                            {formError.price && (
                                                <div className={cx('error-message')}>{formError.price}</div>
                                            )}
                                        </div>
                                        <div className={cx('image')}>
                                            <textarea
                                                type="text"
                                                placeholder="Image Url"
                                                value={newProduct.product_image}
                                                required
                                                onChange={(e) =>
                                                    setNewProduct({ ...newProduct, product_image: e.target.value })
                                                }
                                            />
                                            {formError.product_image && (
                                                <div className={cx('error-message')}>{formError.product_image}</div>
                                            )}
                                        </div>
                                        <div className={cx('description')}>
                                            <textarea
                                                type="text"
                                                placeholder="Description"
                                                value={newProduct.description}
                                                required
                                                onChange={(e) =>
                                                    setNewProduct({ ...newProduct, description: e.target.value })
                                                }
                                            />
                                            {formError.description && (
                                                <div className={cx('error-message')}>{formError.description}</div>
                                            )}
                                        </div>

                                        <button onClick={handleAddProduct}>SUBMIT</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Form modal EDIT products  */}
                        <div>
                            {showEdit && (
                                <div className={cx('edit-product-form')}>
                                    <div className={cx('modal-content')}>
                                        <div>
                                            <h1>Edit Product</h1>
                                        </div>
                                        <div className={cx('close')}>
                                            <span onClick={closeEdit}>&times;</span>
                                        </div>
                                        <div className={cx('name')}>
                                            <input
                                                type="text"
                                                placeholder="Name"
                                                value={editProduct.name}
                                                required
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, name: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div className={cx('amount-category')}>
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={editProduct.amount}
                                                required
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, amount: e.target.value })
                                                }
                                            />
                                            <select
                                                value={editProduct.category_id}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, category_id: e.target.value })
                                                }
                                            >
                                                <option value="1">Wooden</option>
                                                <option value="2">Metal</option>
                                            </select>
                                            {/* </div> */}
                                        </div>
                                        <div className={cx('price')}>
                                            <input
                                                type="number"
                                                placeholder="Price"
                                                value={editProduct.price}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, price: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className={cx('image')}>
                                            <textarea
                                                type="text"
                                                placeholder="Image Url"
                                                value={editProduct.product_image}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, product_image: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className={cx('description')}>
                                            <textarea
                                                type="text"
                                                placeholder="Description"
                                                value={editProduct.description}
                                                onChange={(e) =>
                                                    setEditProduct({ ...editProduct, description: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                        <button onClick={handleUpdateProduct}>SUBMIT</button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={cx('data')}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                style={{ fontSize: '1.5rem' }}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 10 },
                                    },
                                }}
                                pageSizeOptions={[10, 15]}
                            />
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

export default ProductList;
