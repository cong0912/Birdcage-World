import styles from './Navbar.module.scss';
import classNames from 'classnames/bind';
import logo from '../../../../assets/images/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);
const Navbar = () => {
    return (
        <div className={cx('navbar')}>
            <div className={cx('wrapper')}>
                <div className={cx('user-items')}>
                    <div className={cx('user-item')}>
                        <FontAwesomeIcon icon={faBell} className={cx('icon')} />
                    </div>
                    <div className={cx('user-item')}>
                        <FontAwesomeIcon icon={faUser} className={cx('icon')} />
                        <div className={cx('user-choose')}>
                            <Link
                                to={'/login'}
                                className={cx('log-out')}
                                onClick={() => {
                                    localStorage.removeItem('access_token');
                                    localStorage.removeItem('refresh_token');
                                    localStorage.removeItem('username');
                                }}
                            >
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Navbar;
