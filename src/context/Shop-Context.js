import { useState, useEffect } from 'react';
import { createContext } from 'react';
export const ShopContext = createContext(null);
// lay san pham o trang thai mac dinh
let listProducts = [];
const List = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        fetch('http://localhost:8080/api/v1/product')
            .then((res) => res.json())
            .then((product) => {
                setProducts(product);
            });
    }, []);
    if (products.length > 0) {
        listProducts = products;
        return listProducts;
    }
    return listProducts;
};
var Listlenght = 0;
const getDefaultCart = () => {
    Listlenght = List().length;
    let cart = [];

    for (let i = 1; i <= Listlenght; i++) {
        cart.push({ id: i, value: 0 });
    }
    return cart;
};

// lay du lieu ra và đẩy ra
const DefaultCart = () => {
    const cartItem = localStorage.getItem('shopCart');
    return cartItem ? JSON.parse(cartItem) : getDefaultCart;
};

export const ShopContextProvider = (props) => {
    const [cartItem, setcartItem] = useState(DefaultCart());
    // set local len server
    useEffect(() => {
        localStorage.setItem('shopCart', JSON.stringify(cartItem));
    }, [cartItem]);
    const addToCart = (productID) => {
        setcartItem((prevCart) => {
            const updatedCart = prevCart.map((item) => {
                if (item.id === productID) {
                    return { ...item, value: item.value + 1 };
                }
                return item;
            });

            // Nếu sản phẩm không tồn tại trong giỏ hàng, thêm mới
            if (!updatedCart.some((item) => item.id === productID)) {
                updatedCart.push({ id: productID, value: 1 });
            }

            return updatedCart;
        });
    };
    const removeFromCart = (productID) => {
        setcartItem((prevCart) => {
            const updatedCart = prevCart.map((item) => {
                if (item.id === productID) {
                    return { ...item, value: item.value - 1 };
                }
                return item;
            });

            // Loại bỏ sản phẩm khỏi giỏ hàng nếu số lượng là 0 hoặc dưới 0
            return updatedCart.filter((item) => item.value > 0);
        });
    };
    // hàm xóa luôn sản phẩm ra giỏ
    const deleteFromCart = (productID) => {
        setcartItem((prevCart) => {
            const updatedCart = prevCart.filter((item) => item.id !== productID); // Sử dụng filter để loại bỏ sản phẩm với productID khỏi giỏ hàng

            if (updatedCart.length === prevCart.length) {
                console.log(`Sản phẩm với ID ${productID} không có trong giỏ.`);
            }

            return updatedCart;
        });
    };
    // cập nhật số lượng sản phẩm
    const updateCartItemQuantity = (newQuantity, productID) => {
        setcartItem((prevCart) => {
            const updatedCart = prevCart.map((item) => {
                if (item.id === productID) {
                    return { ...item, value: newQuantity };
                }
                return item;
            });

            return updatedCart;
        });
    };
    // tính tổng
    const calculateTotalPrice = (cartItem, products) => {
        let total = 0;

        // Lặp qua tất cả sản phẩm trong giỏ hàng
        for (const item of cartItem) {
            const product = products.find((p) => p.id === item.id);

            if (product) {
                // Tính tổng tiền cho sản phẩm và cộng vào tổng số tiền
                total += product.price * item.value;
            }
        }

        return total;
    };
    //  Tính tổng số lượng tất cả sản phẩm có trong giỏ
    const calculateTotalQuantity = (cartItem) => {
        let totalQuantity = 0;

        // Lặp qua tất cả sản phẩm trong giỏ hàng
        for (const item of cartItem) {
            totalQuantity += item.value;
        }

        return totalQuantity;
    };

    const contextValue = {
        cartItem,
        addToCart,
        removeFromCart,
        deleteFromCart,
        updateCartItemQuantity,
        calculateTotalPrice,
        calculateTotalQuantity,
    };
    // console.log('cart', getDefaultCart());
    console.log('cart', cartItem);
    return <ShopContext.Provider value={contextValue}> {props.children}</ShopContext.Provider>;
};
