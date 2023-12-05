import styles from './Widget.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faArrowDown, faArrowUp, faDollarSign, faBoxOpen, faCoins } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
const cx = classNames.bind(styles);
const Widget = () => {
    const [totalusers, setTotalUsers] = useState(0);
    const [totalproducts, setTotalProducts] = useState(0);
    const [productsold, setProductSold] = useState(0);
    const [budget, setBudGet] = useState(0);
    useEffect(() => {
        //goi api users
        axios.get('http://localhost:8080/api/v1/user/count').then((res) => {
            setTotalUsers(res.data);
        });
        //goi api total products
        axios.get('http://localhost:8080/api/v1/product/count').then((res) => {
            setTotalProducts(res.data);
        });

        axios.get('http://localhost:8080/api/v1/dashboard/productsold').then((res) => {
            setProductSold(res.data);
        });

        axios.get('http://localhost:8080/api/v1/dashboard/budget').then((res) => {
            setBudGet(res.data);
        });
    }, []);
    return (
        <div className={cx('widget')}>
            <div className={cx('total-user')}>
                <div className={cx('total-user-left')}>
                    <span className={cx('title')}>TOTAL USERS</span>
                    <span className={cx('counter')}>{totalusers}</span>
                    <span className={cx('percentage')}>
                        <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
                        <span className={cx('percentage-in4')}>
                            <span>5%</span>
                            <span className={cx('percentage-in4-text')}>Since last month</span>
                        </span>
                    </span>
                </div>
                <div className={cx('total-user-right')}>
                    <div className={cx('boder-icon')}>
                        <FontAwesomeIcon icon={faUsers} className={cx('icon-total-users')}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
            <div className={cx('total-product')}>
                <div className={cx('total-product-left')}>
                    <span className={cx('title')}>TOTAL PRODUCTS</span>
                    <span className={cx('counter')}>{totalproducts}</span>
                    <span className={cx('percentage')}>
                        <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
                        <span className={cx('percentage-in4')}>
                            <span>7%</span>
                            <span className={cx('percentage-in4-text')}>Since last month</span>
                        </span>
                    </span>
                </div>
                <div className={cx('total-product-right')}>
                    <div className={cx('boder-icon')}>
                        <FontAwesomeIcon icon={faBoxOpen} className={cx('icon-total-products')}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
            <div className={cx('budget')}>
                <div className={cx('budget-left')}>
                    <span className={cx('title')}>BUDGET</span>
                    <span className={cx('counter')}>{budget} $</span>
                    <span className={cx('percentage')}>
                        <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
                        <span className={cx('percentage-in4')}>
                            <span>8%</span>
                            <span className={cx('percentage-in4-text')}>Since last month</span>
                        </span>
                    </span>
                </div>
                <div className={cx('budget-right')}>
                    <div className={cx('boder-icon')}>
                        <FontAwesomeIcon icon={faDollarSign} className={cx('icon-budgets')}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
            <div className={cx('total-product-sold')}>
                <div className={cx('total-product-sold-left')}>
                    <span className={cx('title')}>TOTAL PRODUCT SOLD</span>
                    <span className={cx('counter')}>{productsold}</span>
                    <span className={cx('percentage')}>
                        <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
                        <span className={cx('percentage-in4')}>
                            <span>12%</span>
                            <span className={cx('percentage-in4-text')}>Since last month</span>
                        </span>
                    </span>
                </div>
                <div className={cx('total-product-sold-right')}>
                    <div className={cx('boder-icon')}>
                        <FontAwesomeIcon icon={faCoins} className={cx('icon-total-product-solds')}></FontAwesomeIcon>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Widget;
