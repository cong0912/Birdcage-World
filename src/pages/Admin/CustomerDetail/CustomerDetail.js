import React, { useState, useEffect } from 'react';
import AdminLayout from '../AdminLayout';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames/bind';
import styles from './CustomerDetail.module.scss';
import images from '../../../assets/images';
import { DataGrid } from '@mui/x-data-grid';

const cx = classNames.bind(styles);

export function CustomerDetail() {
    const [APIData, setAPIData] = useState({});
    const [HisData, setHisData] = useState([]);
    const [productData, setProductData] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetchCustomers();
        fetchProductData();
        fetchHistory();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/user/profile?id=${id}`);
            if (response.data.length > 0) {
                setAPIData(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching Customers:', error);
        }
    };

    const fetchHistory = async () => {
        try {
            const responseHis = await axios.get(`http://localhost:8080/api/v1/order/getOrderByUserID?id=${id}`);
            setHisData(responseHis.data);
        } catch (error) {
            console.error('Error fetching History:', error);
        }
    };

    const fetchProductData = async () => {
        try {
            const responseProduct = await axios.get(`http://localhost:8080/api/v1/product`);
            setProductData(responseProduct.data);
        } catch (error) {
            console.error('Error fetching Product Data:', error);
        }
    };
    //compare to get id
    const getProductById = (productId) => {
        return productData.find((item) => item.id === productId);
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'productName',
            headerName: 'Product Name',
            width: 400,
        },

        { field: 'shippingAddress', headerName: 'Shipping Address', width: 250 },
        { field: 'orderDate', headerName: 'Order Date', width: 250 },

        { field: 'total', headerName: 'Price', width: 100 },
    ];

    const rows = HisData.filter((order) => order.orderItemList.length > 0) //filter products when orderItemList is null
        .map((order, index) => {
            const total = order.orderItemList.reduce((total, item) => {
                return total + item.quantity * item.price;
            }, 0);

            return {
                id: index + 1,
                // productName: order.orderItemList.map((item) => getProductById(item.productitemid)?.name).join('\n'),
                productName: order.orderItemList
                    .map((item) => `${getProductById(item.productitemid)?.name} (${item.quantity})`)
                    .join(' '),

                // quantity: order.orderItemList.reduce((total, item) => total + item.quantity, 0),
                shippingAddress: order.orderDetail.shipping_address,
                orderDate: order.orderDetail.orderdate,
                // price: order.orderItemList[0]?.price,
                total: total.toFixed(2),
            };
        });

    return (
        <AdminLayout>
            <div className={cx('head-title')}>
                <div className={cx('user')}>
                    <img src={images.avata} alt="avatar" />
                    <h1>{APIData.username}</h1>
                </div>
                <div className={cx('title')}>History order</div>
            </div>

            <div style={{ height: '100%', width: '100%' }}>
                <DataGrid rows={rows} columns={columns} style={{ fontSize: '1.5rem' }} pageSize={5} />
            </div>
        </AdminLayout>
    );
}
