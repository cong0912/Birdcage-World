import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Compare from '../pages/Compare';
import { ShoppingCart } from '../pages/Cart/ShoppingCart';
import LoginPage from '../pages/LoginAccount';
import RegisterPage from '../pages/RegisterAccount';
import ForgotPassword from '../pages/ForgotPassword';
import DefaultLayout from '../components/layout/DefaultLayout';
import UserInfo from '../pages/UserInfo';
import AdminHome from '../pages/Admin/AdminHome/AdminHome';
import { Order } from '../pages/Order/Order';
import OrderSucess from '../pages/Order/OrderSucess/OrderSucess';
import AdminOrder from '../pages/Admin/Order/Order';
import ModalSuccess from '../pages/ModalSuccess';
import ProductsList from '../pages/Admin/ProductsList/ProductsList';
import CustomerList from '../pages/Admin/CustomerList/CustomerList';
import { Comment } from '../pages/Admin/Comment/Comment';
import OrderHistory from '../pages/OrderHistory';
import { CustomerDetail } from '../pages/Admin/CustomerDetail/CustomerDetail';
const role = localStorage.getItem('role');
const publicRoute = [
    { path: '/', component: Home, layout: DefaultLayout },
    { path: '/products', component: Products, layout: DefaultLayout },
    { path: '/product/:productID', component: ProductDetail, layout: DefaultLayout },
    { path: '/compare/:productID', component: Compare, layout: DefaultLayout },
    { path: '/Cart', component: ShoppingCart, layout: DefaultLayout },
    { path: '/info', component: UserInfo, layout: UserInfo },
    { path: '/login', component: LoginPage, layout: null },
    { path: '/register', component: RegisterPage, layout: null },
    { path: '/forgot', component: ForgotPassword, layout: null },
    { path: '/order', component: Order, layout: null },
    { path: '/ordersucess', component: OrderSucess, layout: null },
    { path: '/success', component: ModalSuccess, layout: null },
    { path: '/history', component: OrderHistory, layout: UserInfo },
];
if (role == 'ADMIN') {
    publicRoute.push({ path: '/admin', component: AdminHome, layout: null });
    publicRoute.push({ path: '/adminorder', component: AdminOrder, layout: null });
    publicRoute.push({ path: '/admin/products', component: ProductsList, layout: null });
    publicRoute.push({ path: '/admin/customer', component: CustomerList, layout: null });
    publicRoute.push({ path: '/admin/comment', component: Comment, layout: null });
    publicRoute.push({ path: '/admin/customer/detail/:id', component: CustomerDetail, layout: null });
}
const privateRoute = [];
export { publicRoute, privateRoute };
