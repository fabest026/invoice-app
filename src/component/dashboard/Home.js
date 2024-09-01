import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import Chart from 'chart.js/auto'; // Capitalize 'Chart' to follow standard convention for imported components

const Home = () => {
    const [total, setTotal] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0); // Initially set to 0
    const [totalMonthCollection, setTotalMonthCollection] = useState(0); // Initially set to 0
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Initially set to true


    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setIsLoading(true); // Start loading
        const q = query(collection(db, "invoices"), where("uid", "==", localStorage.getItem('uid')));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setInvoices(data);
        getOverallTotal(data);
        getMonthsTotal(data);
        monthWiseCollection(data); // Call monthWiseCollection here
        setIsLoading(false); // Stop loading
    };

    const getOverallTotal = (invoiceList) => {
        let t = 0;
        invoiceList.forEach(data => {
            t += data.total;
        });
        setTotal(t);
    };

    const getMonthsTotal = (invoiceList) => {
        let mt = 0;
        invoiceList.forEach(data => {
            if (new Date(data.date.seconds * 1000).getMonth() === new Date().getMonth()) {
                mt += data.total;
            }
        });
        setTotalMonthCollection(mt);
    };

    const monthWiseCollection = (data) => {
        let chartData = {
            'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
            'Jul': 0, 'Aug': 0, 'Sep': 0, 'Oct': 0, 'Nov': 0, 'Dec': 0
        };

        data.forEach(d => {
            const date = new Date(d.date.seconds * 1000);
            if (date.getFullYear() === new Date().getFullYear()) {
                const month = date.toLocaleString('default', { month: 'short' });
                chartData[month] += d.total;
            }
        });

        createChart(chartData); // Pass the chartData to createChart function
    };

    const createChart = (chartData) => {
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(chartData),
                datasets: [{
                    label: 'Month wise Collection',
                    data: Object.values(chartData),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    };

    return (
        <div>
            <div>
                {isLoading ? (
                    // Loader: You can use any spinner icon or animation here
                    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
                        <i style={{ fontSize: 50 }} className='fa-solid fa-spinner fa-spin'></i>
                    </div>
                ) : (
                    // Your actual component content goes here
                    <div>
                        {/* Your data or component to be shown after loading */}
                    </div>
                )}
            </div>
            <div className='home-first-row'>
                <div className='home-box box-1'>
                    <h1 className='box-header'>Rs. {total}</h1>
                    <p className='box-title'>Overall</p>
                </div>
                <div className='home-box box-2'>
                    <h1 className='box-header'>{invoices.length}</h1>
                    <p className='box-title'>Invoices</p>
                </div>
                <div className='home-box box-3'>
                    <h1 className='box-header'>Rs. {totalMonthCollection}</h1>
                    <p className='box-title'>This Month</p>
                </div>
            </div>

            <div className='home-second-row'>
                <div className='chart-box'>
                    <canvas id="myChart"></canvas>
                </div>

                <div className='recent-invoices-list'>
                    <h1>Recent Invoice List</h1>
                    <hr />
                    <div className='list-header'>
                        <p>Client Name</p>
                        <p>Date</p>
                        <p>Total</p>
                    </div>

                    {
                        invoices.slice(0, 10).map(invoice => (
                            <div key={invoice.id}>
                                <p>{invoice.clientName || 'Client Name'}</p>
                                <p>{invoice.invoiceDate}</p>
                                <p>Rs. {invoice.total}</p>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    );
};

export default Home;
