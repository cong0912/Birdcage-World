import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import styles from './UserInfo.module.scss';
import images from '../../assets/images';
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserNameModal from '../../components/layout/UserNameModal';
import PassWordModal from '../../components/layout/PassWordModal';
import AddressModal from '../../components/layout/AddressModal';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
const id = localStorage.getItem('id');
function UserInfo() {
    const [user, setUser] = useState({});
    const [show, setShow] = useState(false);
    const [address, setAddress] = useState([]);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    useEffect(() => {
        getUserById();
    }, []);
    const getUserById = async () => {
        const res = await axios.get(`http://localhost:8080/api/v1/user/profile?id=${id}`);
        if (res && res.data) {
            setUser(res.data[0]);
        }
    };

    useEffect(() => {
        getAllAddress();
    }, []);
    const getAllAddress = async () => {
        const res = await axios.get(`http://localhost:8080/api/v1/address/getByUserID?id=${id}`);
        if (res && res.data) {
            console.log(res.data);
            setAddress(res.data);
        }
    };
    return (
        <div>
            <img src={images.product_header} style={{ width: 100 + '%', height: 330 + 'px' }}></img>
            <div className={cx('personal-page')}>Personal Page</div>
            <div className={cx('mycontent')}>
                <div className={cx('left')}>
                    <div className={cx('mybox')}>
                        <div className={cx('acc')}>account page</div>
                        <div className={cx('hello')}>
                            Hello, <span className={cx('uname')}>{user.username}</span>
                        </div>
                    </div>
                    <img className={cx('avatar')} src={images.avata}></img>
                    <div className={cx('name')}>{user.username}</div>
                </div>
                <div className={cx('right')}>
                    <div className={cx('acc-info')}>ACCOUNT INFORMATION</div>
                    <div className={cx('myrow')}>
                        <span className={cx('title')}>User Name</span>
                        <span className={cx('des')}>{user.username}</span>
                        <UserNameModal />
                    </div>
                    <div className={cx('myrow')}>
                        <span className={cx('title')}>Email</span>
                        <span className={cx('des')}>{user.email}</span>
                    </div>
                    <div className={cx('myrow')}>
                        <span className={cx('title')}>Phone</span>
                        <span className={cx('des')}>{user.phone}</span>
                    </div>
                    <div className={cx('myrow')}>
                        <span className={cx('title')}>PassWord</span>
                        <span className={cx('des')}>********</span>
                        <PassWordModal />
                    </div>
                    <div className={cx('myrow')}>
                        <span className={cx('title')}>Order History</span>
                        <Link className={cx('des', 'link')} to={'/history'}>
                            View oder history
                        </Link>
                    </div>
                    <span className={cx('title1')}>Address</span>
                    <div className={cx('myrow1')}>
                        {address.length > 0 &&
                            address.map((add, index) => {
                                return (
                                    <div key={index} className={cx('address')}>
                                        <div>
                                            <span className={cx('idex')}>{`Address ${index + 1} :`}</span>
                                        </div>
                                        <div className={cx('name')}>
                                            Customer Name : <span className={cx('_name')}>{add.name}</span>
                                        </div>
                                        <div className={cx('phone')}>
                                            Customer Phone : <span className={cx('_phone')}>{add.phone}</span>
                                        </div>
                                        <div className={cx('add')}>
                                            Customer Address :{' '}
                                            <span className={cx('_add')}>{add.address_shipping}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        <AddressModal />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
