import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2'; // Import Doughnut chart
import Header from './SuperAdminHeader';
import './SalesPage.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,  // Needed for Doughnut chart
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the necessary components with ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    ArcElement,  // Register ArcElement for the doughnut chart
    Title,
    Tooltip,
    Legend
);

const SalesPage = () => {
    const [salesData, setSalesData] = useState([]);
    const [totalSalesPerMonth, setTotalSalesPerMonth] = useState([]);
    const [serviceData, setServiceData] = useState([]);

    useEffect(() => {
        fetch('https://vynceianoani.helioho.st/getsales.php')
            .then(response => response.json())
            .then(data => {
                setSalesData(data);

                // Assuming data contains services with accepted status
                const acceptedServices = data.filter(item => item.status === 'accepted');
                
                const serviceCounts = acceptedServices.reduce((acc, curr) => {
                    acc[curr.service_category] = (acc[curr.service_category] || 0) + 1;
                    return acc;
                }, {});

                const serviceArray = Object.keys(serviceCounts).map(category => ({
                    category,
                    count: serviceCounts[category]
                }));

                setServiceData(serviceArray);

                // Calculate the total sales per month
                const totalSales = data.reduce((acc, curr) => {
                    acc[curr.month_year] = (acc[curr.month_year] || 0) + parseFloat(curr.total_sales);
                    return acc;
                }, {});

                const totalSalesArray = Object.keys(totalSales).map(monthYear => ({
                    monthYear,
                    total: totalSales[monthYear].toFixed(2)
                }));

                setTotalSalesPerMonth(totalSalesArray);
            })
            .catch(error => console.error('Error fetching sales data:', error));
    }, []);

    // Data for the line chart (overall sales over time)
    const lineChartData = {
        labels: salesData.map(item => item.month_year),
        datasets: [
            {
                label: 'Total Sales',
                data: salesData.map(item => item.total_sales),
                fill: false,
                backgroundColor: 'rgba(75, 192, 192, 1)',
                borderColor: 'rgba(75, 192, 192, 1)',
            }
        ]
    };

    // Data for the bar chart (sales per month)
    const barChartData = {
        labels: totalSalesPerMonth.map(item => item.monthYear),
        datasets: [
            {
                label: 'Total Sales per Month',
                data: totalSalesPerMonth.map(item => item.total),
                backgroundColor: 'rgba(153, 102, 255, 1)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }
        ]
    };

    // Data for the donut chart (accepted services by category)
    const doughnutData = {
        labels: serviceData.map(item => item.category),
        datasets: [
            {
                data: serviceData.map(item => item.count),
                backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'],
                hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384', '#4BC0C0', '#9966FF', '#FF9F40'],
            }
        ]
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="sales-page-container">
            <Header />
            <div className="sales-box">
                <h2>Total Sales (Accepted Status)</h2>
                <Line data={lineChartData} options={chartOptions} />
            </div>
            <div className="sales-box">
                <h2>Sales per Month</h2>
                <Bar data={barChartData} options={chartOptions} />
            </div>
            <div className="sales-box">
                <h2>Accepted Services by Category</h2>
                <Doughnut data={doughnutData} />
            </div>
            <div className="total-sales-summary">
                <h3>Sales Summary per Month</h3>
                <ul>
                    {totalSalesPerMonth.length === 0 ? (
                        <li>No sales data available.</li>
                    ) : (
                        totalSalesPerMonth.map((item, index) => (
                            <li key={index}>
                                {item.monthYear}: ₱{item.total}
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SalesPage;
