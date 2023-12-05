import { DataGrid } from '@mui/x-data-grid';
import AdminLayout from '../AdminLayout';
import styles from './Order.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
const cx = classNames.bind(styles);
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function AdminOrder() {
    const navigate = useNavigate();
    const [status, setStatus] = useState(true);
    const add = (id) => {
        axios.get(`http://localhost:8080/api/v1/order/changeStatus?id=${id}`);
        handleOpenStatus();
    };
    const [error, setError] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [open, setOpen] = useState(false);
    const [openstatus, setOpenStatus] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleOpenStatus = () => setOpenStatus(true);
    const handleCloseStatus = () => setOpenStatus(false);

    const handleClickChangeStatus = () => {
        window.location.href = '/adminorder';
    };
    const columns = [
        {
            field: 'id',
            headerName: 'OrderID',
            width: 120,
            renderCell: (params) => {
                return <div className={cx('id')}>{params.row.id}</div>;
            },
        },
        {
            field: 'user_id',
            headerName: 'Customer',
            width: 200,
            renderCell: (params) => {
                return <div className={cx('customer')}>{params.row.userid}</div>;
            },
        },

        {
            field: 'orderdate',
            headerName: 'Date',
            width: 120,
            renderCell: (params) => {
                return <div className={cx('date')}>{params.row.orderdate.split('T00:00:00')}</div>;
            },
        },
        {
            field: 'shipping_address',
            headerName: 'Address',
            width: 400,
            renderCell: (params) => {
                return <div className={cx('address')}>{params.row.shipping_address}</div>;
            },
        },
        {
            field: 'order_status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                return (
                    <div className={cx('status')}>
                        <div className={` ${params.row.order_status == 1 ? 'delivery' : 'pending'}`}>
                            {params.row.order_status == 1 ? (
                                <button className={cx('pending-button')} onClick={() => add(params.row.id)}>
                                    Pending
                                </button>
                            ) : (
                                <button className={cx('active-button')} onClick={() => add(params.row.id)}>
                                    Processed
                                </button>
                            )}
                        </div>
                    </div>
                );
            },
        },
        {
            field: 'payment_method',
            headerName: 'Payment',
            width: 120,
            renderCell: (params) => {
                return (
                    <div className={cx('payment')}>
                        {params.row.payment_method == '1' ? <span>COD</span> : <span>VNPAY</span>}
                    </div>
                );
            },
        },
        {
            field: 'order_total',
            headerName: 'Total',
            width: 100,
        },
        // {
        //     field: 'pantone_value',
        //     headerName: 'Pantone',
        //     width: 230,
        //     renderCell: (params) => {
        //         return (
        //             <div className={cx('pantone')}>
        //                 <span>{params.row.color}</span>
        //                 <p>{params.row.name}</p>
        //             </div>
        //         );
        //     },
        // },
    ];

    const [rows, setRows] = useState([]);
    const dataGridStyle = {
        fontSize: '16px', // Thay đổi kích thước font ở đây
    };
    const [list, setList] = useState();

    useEffect(() => {
        //goi api
        axios
            .get(
                'http://localhost:8080/api/v1/order/findByBetwenDay?startDate=2021-10-01T00:00:00&endDate=2030-10-31T23:59:59',
            )
            .then((res) => {
                setRows(res.data.body);
            });
    }, []);
    const HandleSearch = async () => {
        if (!startDate || !endDate) {
            setError('Please select start and end dates');
            handleOpen();
            return;
        }
        await axios
            .get(
                `http://localhost:8080/api/v1/order/findByBetwenDay?startDate=${startDate}T00:00:00&endDate=${endDate}T00:00:00`,
            )
            .then((res) => {
                setRows(res.data.body);
                setError(null); // Xóa thông báo lỗi khi có dữ liệu trả về
            });
    };
    console.log(rows);
    return (
        <AdminLayout>
            <div className={cx('order')}>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        paddingTop: 17,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 28,
                    }}
                >
                    <div className={cx('header')}>
                        <div className={cx('title')}>Orders</div>
                        <div className={cx('search-start')}>
                            <input
                                type="date"
                                placeholder="Search start"
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <div className={cx('search-end')}>
                            <input type="date" placeholder="Search end" onChange={(e) => setEndDate(e.target.value)} />
                        </div>

                        <button className={cx('search-btn')} onClick={HandleSearch}>
                            Find
                        </button>

                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    timeout: 500,
                                },
                            }}
                        >
                            <Fade in={open}>
                                <Box sx={style}>
                                    <Typography id="transition-modal-title" variant="h4" component="h3">
                                        Please select start and end dates
                                    </Typography>
                                </Box>
                            </Fade>
                        </Modal>

                        <Dialog
                            open={openstatus}
                            onClose={handleCloseStatus}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{'You want to change status ?'}</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleCloseStatus}>Cancel</Button>
                                <Button onClick={handleClickChangeStatus} autoFocus>
                                    OK
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className={cx('data')}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            style={{ fontSize: '1.6rem' }}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 10 },
                                },
                            }}
                            pageSizeOptions={[10, 15]}
                            checkboxSelection
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
