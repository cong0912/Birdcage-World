import classNames from 'classnames/bind';
import styles from './OrderHistory.module.scss';
import images from '../../assets/images';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';

const cx = classNames.bind(styles);
const id = localStorage.getItem('id');
let products = [];
function OrderHistory() {
    const [order, setOrder] = useState([]);

    useEffect(() => {
        getAllOrder();
    }, []);
    const getAllOrder = async () => {
        await axios.get(`http://localhost:8080/api/v1/order/getOrderByUserID?id=${id}`).then((res) => {
            setOrder(res.data);
        });
    };
    const getProductName = async (id) => {
        let name = '';
        await axios.get(`http://localhost:8080/api/v1/product/getName?id=${id}`).then((res) => {
            name = res.data;
            console.log('name', name);
            console.log('name', res);
        });
        products = [...products, name];
    };

    console.log('pro', products);
    // console.log('oder', order);

    return (
        <div>
            <img src={images.product_header} style={{ width: 100 + '%', height: 330 + 'px' }}></img>
            <div className={cx('personal-page')}>Order History</div>
            <div className={cx('mycontent')}>
                <table className={cx('table')}>
                    <tr>
                        <th>Code order</th>
                        <th className={cx('date')}>Date</th>
                        <th>Address</th>
                        <th>Order value</th>
                        <th>Payment methods</th>
                    </tr>
                    {order.length > 0 &&
                        order.map((o, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {o.orderItemList.map((p, index) => {
                                            getProductName(p.productitemid);
                                            return `${products[index]} x ${p.quantity}, `;
                                        })}
                                    </td>
                                    <td>{o.orderDetail.orderdate.split('T00:00:00')}</td>
                                    <td>{o.orderDetail.shipping_address}</td>
                                    <td>{o.orderDetail.order_total} $</td>
                                    <td>COD</td>
                                </tr>
                            );
                        })}
                </table>
            </div>
        </div>
    );
}

export default OrderHistory;
