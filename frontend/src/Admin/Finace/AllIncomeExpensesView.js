import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';
import Sidebar from '../AdminDashboard/Sidebar';

const AllIncomeExpensesView = () => {
    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const chartRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIncomeTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8070/finance/income');
                if (!response.ok) {
                    throw new Error('Failed to fetch income transactions');
                }
                const data = await response.json();
                setIncomeTransactions(data);
            } catch (error) {
                console.error('Error fetching income transactions:', error.message);
            }
        };

        fetchIncomeTransactions();
    }, []);

    useEffect(() => {
        const fetchExpenseTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8070/finance/expense');
                if (!response.ok) {
                    throw new Error('Failed to fetch expense transactions');
                }
                const data = await response.json();
                setExpenseTransactions(data);
            } catch (error) {
                console.error('Error fetching expense transactions:', error.message);
            }
        };

        fetchExpenseTransactions();
    }, []);

    const totalIncomeTransactions = incomeTransactions.length;
    const totalIncomeAmount = incomeTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

    const totalExpenseTransactions = expenseTransactions.length;
    const totalExpenseAmount = expenseTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

    const formatAsLKR = (amount) => {
        return `LKR ${amount.toLocaleString('en-LK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');

            if (chartRef.current.chart) {
                chartRef.current.chart.destroy();
            }

            chartRef.current.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Income', 'Expense'],
                    datasets: [
                        {
                            label: 'Amount (LKR)',
                            data: [totalIncomeAmount, totalExpenseAmount],
                            backgroundColor: ['#00ff00', '#ff0000'],
                            hoverBackgroundColor: ['#00ff00', '#ff0000'],
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Income vs Expense (LKR)',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: LKR ${context.raw.toLocaleString('en-LK', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}`;
                                }
                            }
                        }
                    },
                },
            });
        }
    }, [totalIncomeAmount, totalExpenseAmount]);

    return (
        <div className="flex min-h-screen">
            <div className="w-[300px] flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex-1 p-5 bg-gray-50 overflow-y-auto">
                <div className="max-w-4xl mx-auto p-5">
                    <h1 className="text-3xl font-bold text-center mb-3">All Income and Expense Transactions</h1>
                    <p className="text-center text-gray-600 mb-5">
                        Below is the summary of your income and expense transactions
                    </p>
                    <div className="mb-5 p-5 bg-gray-100 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Income Summary</h2>
                        <p className="text-base text-gray-800 mb-2">
                            Total Number of Income Transactions: <strong className="text-blue-600">{totalIncomeTransactions}</strong>
                        </p>
                        <p className="text-base text-gray-800 mb-3">
                            Total Income Amount: <strong className="text-blue-600">{formatAsLKR(totalIncomeAmount)}</strong>
                        </p>
                        <button
                            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                            onClick={() => navigate('/income')}
                        >
                            View Income History
                        </button>
                    </div>
                    <div className="mb-5 p-5 bg-gray-100 rounded-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Expense Summary</h2>
                        <p className="text-base text-gray-800 mb-2">
                            Total Number of Expense Transactions: <strong className="text-blue-600">{totalExpenseTransactions}</strong>
                        </p>
                        <p className="text-base text-gray-800 mb-3">
                            Total Expense Amount: <strong className="text-blue-600">{formatAsLKR(totalExpenseAmount)}</strong>
                        </p>
                        <button
                            className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                            onClick={() => navigate('/expenses')}
                        >
                            View Expenses History
                        </button>
                    </div>
                    <div className="flex w-full">
                        <div className="w-1/5 flex flex-col justify-start gap-2 p-2 mt-24">
                            <button
                                className="p-2 bg-blue-800 text-white rounded w-full hover:bg-blue-900 transition-all"
                                onClick={() => navigate('/appointments')}
                            >
                                Appointments Payments
                            </button>
                            <button
                                className="p-2 bg-blue-800 text-white rounded w-full hover:bg-blue-900 transition-all"
                                onClick={() => navigate('/acceptedbreakdowns')}
                            >
                                Accepted Breakdowns Payments
                            </button>
                            <button
                                className="p-2 bg-blue-800 text-white rounded w-full hover:bg-blue-900 transition-all"
                                onClick={() => navigate('/allemployees')}
                            >
                                All Employees Payments
                            </button>
                        </div>
                        <div className="w-3/5 p-2">
                            <canvas ref={chartRef} className="max-h-[500px]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllIncomeExpensesView;