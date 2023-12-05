import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export function useOrder() {
    return useContext(OrderContext);
}

export function OrderProvider({ children }) {
    const [ordersucess, setOrderSucess] = useState({
        shippingInfo: {
            name: '',
            phone: '',
            streetAddress: '',
            province: '',
            district: '',
            email: '',
            paymentMethod: '',
            address_shipping: '',
        },
    });

    return <OrderContext.Provider value={{ ordersucess, setOrderSucess }}>{children}</OrderContext.Provider>;
}
