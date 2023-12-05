import { useState } from 'react';
import styles from './UserNameModal.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPencil } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function UserNameModal() {
    const token = localStorage.getItem('access_token');
    const [show, setShow] = useState(false);
    const [value, setValue] = useState('');
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAdd = async () => {
        localStorage.setItem('username', value);
        fetch(
            `http://localhost:8080/api/v1/user/change-profile?token=${token}&username=${value}&oldPassword=&password=`,
        );
        setShow(false);
        window.location.href = '/info';
    };
    return (
        <>
            <FontAwesomeIcon icon={faPencil} className={cx('pencil')} onClick={handleShow}></FontAwesomeIcon>
            {show && (
                <div className={cx('wrapper')}>
                    <div className={cx('modal')}>
                        <FontAwesomeIcon icon={faXmark} className={cx('close')} onClick={handleClose}></FontAwesomeIcon>
                        <div className={cx('title')}>Update UserName</div>
                        <div className={cx('content')}>
                            <label className={cx('new-username')}>New username :</label>
                            <input
                                type="text"
                                placeholder="Enter your new UserName"
                                className={cx('input-user')}
                                onChange={(e) => setValue(e.target.value)}
                            />
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

export default UserNameModal;
