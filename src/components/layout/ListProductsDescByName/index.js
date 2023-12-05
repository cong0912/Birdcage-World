import classNames from 'classnames/bind';
import styles from './ListProductsDescByName.module.scss';
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
let listProducts = [];
function ListProductsDescByName() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/product/getAllOrderByNameDesc')
            .then((res) => res.json())
            .then((product) => {
                let pro = [];
                pro = product.filter((p) => {
                    return p.is_post;
                });
                setProducts(pro);
            });
    }, []);
    if (products.length > 0) {
        listProducts = products;
    }
    return (
        <div className={cx('thumb-wrapper')}>
            {listProducts.length > 0 &&
                listProducts.map((p, index) => {
                    return (
                        <Link to={`/product/${p.id}`} className={cx('thumb')} key={index}>
                            <div className={cx('thumb-img')}>
                                <img src={p.product_image}></img>
                            </div>
                            <h4 className={cx('title')}>{p.name}</h4>
                            <span className={cx('price')}>{p.price}$</span>
                        </Link>
                    );
                })}
        </div>
    );
}

export default ListProductsDescByName;
