import React, { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2'; // Import the Bar chart
import Header from './SuperAdminHeader';
import './SalesPage.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,   // Bar chart element
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register the necessary components with ChartJS
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,   // Register BarElement for the bar chart
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesPage = () => {
    const [salesData, setSalesData] = useState([]);
    const [totalSalesPerMonth, setTotalSalesPerMonth] = useState([]);

    useEffect(() => {
        fetch('https://vynceianoani.helioho.st/getsales.php')
            .then(response => response.json())
            .then(data => {
                setSalesData(data);

                // Calculate the total sales per month
                const totalSales = data.reduce((acc, curr) => {
                    acc[curr.month_year] = (acc[curr.month_year] || 0) + parseFloat(curr.total_sales);
                    return acc;
                }, {});

                // Convert the total sales object to an array for display and bar chart data
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
                <Bar data={barChartData} options={chartOptions} /> {/* Bar chart for sales per month */}
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
