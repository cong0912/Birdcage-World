import { useEffect, useState } from 'react';
import styles from './AddressModal.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPencil } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function AddressModal() {
    const token = localStorage.getItem('access_token');
    const [show, setShow] = useState(false);
    const [value, setValue] = useState('');
    const [provinces, setProvinces] = useState([]);
    const [provincesCode, setProvincesCode] = useState('');
    const [districts, setDistricts] = useState([]);
    const [districtsCode, setDistrictsCode] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const id = localStorage.getItem('id');
    useEffect(() => {
        getAPI1();
    }, []);
    useEffect(() => {
        if (provincesCode) {
            getAPI2();
        }
    }, [provincesCode]);
    const getAPI1 = async () => {
        await axios.get('https://provinces.open-api.vn/api/').then((res) => {
            if (res && res.data) {
                if (res) setProvinces(res.data);
            }
        });
    };
    const getAPI2 = async () => {
        await axios.get('https://provinces.open-api.vn/api/?depth=2').then((res) => {
            if (res && res.data) {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].name == provincesCode) {
                        setDistricts(res.data[i].districts);
                    }
                }
            }
        });
    };
    const handleProvinceChange = (e) => {
        setProvincesCode(e.target.value);
    };
    const handleDistrictChange = (e) => {
        setDistrictsCode(e.target.value);
    };
    const handleAdd = async () => {
        let data = {
            userid: id,
            address_shipping: `${street}/${districtsCode}/${provincesCode}`,
            name: name,
            email: email,
            phone: phone,
        };

        await axios.post('http://localhost:8080/api/v1/address/add', data).then((res) => {
            if (res.data == 200) {
                window.location.href = '/info';
            }
        });
    };
    return (
        <>
            <div className={cx('_btn')} onClick={handleShow}>
                Add Address
            </div>
            {show && (
                <div className={cx('wrapper')}>
                    <div className={cx('modal')}>
                        <FontAwesomeIcon icon={faXmark} className={cx('close')} onClick={handleClose}></FontAwesomeIcon>
                        <div className={cx('title')}>Add Address</div>
                        <div className={cx('content')}>
                            <label className={cx('new-username')}>Name :</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className={cx('input-user')}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <label className={cx('new-username')}>Phone :</label>
                            <input
                                type="text"
                                placeholder="Enter your phone"
                                className={cx('input-user')}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                            <label className={cx('new-username')}>Email :</label>
                            <input
                                type="text"
                                placeholder="Enter your email"
                                className={cx('input-user')}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <label className={cx('new-username')}>Street address :</label>
                            <input
                                type="text"
                                placeholder="Enter your street address"
                                className={cx('input-user')}
                                onChange={(e) => setStreet(e.target.value)}
                            />
                            <label className={cx('new-username')}>Province :</label>
                            <select
                                id="province"
                                className={cx('select')}
                                onChange={handleProvinceChange}
                                value={provincesCode}
                            >
                                <option disabled value="">
                                    Select Provinces ...
                                </option>
                                {provinces.map((province) => {
                                    return (
                                        <option key={province.code} value={province.name}>
                                            {province.name}
                                        </option>
                                    );
                                })}
                            </select>
                            <label className={cx('new-username')}>District :</label>
                            <select
                                id="district"
                                className={cx('select')}
                                onChange={handleDistrictChange}
                                value={districtsCode}
                            >
                                <option disabled value="">
                                    Select District ...
                                </option>
                                {districts.map((district) => {
                                    return (
                                        <option key={district.code} value={district.name}>
                                            {district.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className={cx('btn')}>
                            <div className={cx('cancle')} onClick={handleClose}>
                                Cancel
                            </div>
                            <div className={cx('add')} onClick={handleAdd}>
                                Confirm
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddressModal;
