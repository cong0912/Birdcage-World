import styles from './Chart.module.scss';
import classNames from 'classnames/bind';
import { BarChart } from '@mui/x-charts/BarChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const Chart = () => {
    const [chart, setChart] = useState([]);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const [select, setSelect] = useState('');
    const [week, setWeek] = useState('');
    useEffect(() => {
        //goi api users
        axios
            .get(`http://localhost:8080/api/v1/dashboard/week?year=${currentYear}&month=${currentMonth}`)
            .then((res) => {
                setChart(res.data);
            });
    }, []);
    console.log(chart);
    let uData = [0, 0, 0, 0, 0, 0, 0];
    if (week) {
        uData = [
            week.responses[0].saleOfDay,
            week.responses[1].saleOfDay,
            week.responses[2].saleOfDay,
            week.responses[3].saleOfDay,
            week.responses[4].saleOfDay,
            week.responses[5].saleOfDay,
            week.responses[6].saleOfDay,
        ];
    }

    const xLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Thursday', 'Saturday', 'Sunday'];
    const handleWeek = (e) => {
        setSelect(e.target.value);
        chart.find((w) => {
            return w.startOfDay == select;
        });
        console.log(
            'find',
            chart.find((w) => {
                return w.startOfDay == select;
            }),
        );
    };
    const handleClick = () => {
        setWeek(
            chart.find((w) => {
                return w.startOfDay == select;
            }),
        );
    };

    return (
        <div className={cx('chart')}>
            <div className={cx('chart-header')}>
                <div className={cx('title')}>Sales</div>
                <div className={cx('week')}>
                    <select onChange={handleWeek} className={cx('select')}>
                        {chart.map((week) => {
                            return (
                                <option value={week.startOfDay}>
                                    {week.startOfDay.split('T00:00:00')} to {week.endOfDay.split('T00:00:00')}
                                </option>
                            );
                        })}
                    </select>
                    <button className={cx('search-btn')} onClick={handleClick}>
                        Find
                    </button>
                </div>
            </div>

            <BarChart
                width={800}
                height={600}
                series={[
                    // { data: pData, label: 'pv', id: 'pvId' },
                    { data: uData },
                ]}
                xAxis={[{ data: xLabels, scaleType: 'band' }]}
                sx={{
                    '& rect': {
                        fill: 'rgb(99, 102, 241)',
                    },
                }}
            />
        </div>
    );
};
export default Chart;
