import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from '../AdminDashboard/Sidebar';

const FinanceIncomeView = () => {
    const [transactions, setTransactions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8070/finance/income');
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error.message);
            }
        };

        fetchTransactions();
    }, []);

    const handleNewIncomeClick = () => {
        navigate('/formIncome');
    };

    const handleNewExpenseClick = () => {
        navigate('/formExpense');
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:8070/finance/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            setTransactions(transactions.filter(transaction => transaction._id !== id));
            console.log('Transaction deleted successfully');
        } catch (error) {
            console.error('Error deleting transaction:', error.message);
        }
    };

    const handleUpdate = (id) => {
        navigate(`/updateIncome/${id}`);
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.addImage('/logo.png', 'PNG', 10, 10, 30, 30);
        doc.setTextColor(0, 0, 0);
        doc.text('AUTOEXPERT (PVT) LTD', 105, 20, { align: 'center' });

        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text('Income Transactions Report', 105, 30, { align: 'center' });

        const columns = [
            { header: 'Title', dataKey: 'title' },
            { header: 'Description', dataKey: 'description' },
            { header: 'Amount', dataKey: 'amount' },
            { header: 'Date', dataKey: 'date' },
        ];

        const rows = transactions.map((transaction) => ({
            title: transaction.title,
            description: transaction.description,
            amount: `LKR ${transaction.amount.toLocaleString()}`,
            date: new Date(transaction.date).toLocaleDateString(),
        }));

        autoTable(doc, {
            head: [columns.map((col) => col.header)],
            body: rows.map((row) => columns.map((col) => row[col.dataKey])),
            startY: 40,
            styles: {
                fontSize: 12,
                cellPadding: 5,
                halign: 'center',
            },
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: [255, 255, 255],
                fontStyle: 'bold',
            },
            bodyStyles: {
                textColor: [0, 0, 0],
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
        });

        doc.save('income_transactions.pdf');
    };

    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount), 0);

    return (
        <div className="flex min-h-screen">
       
        <div className="w-[300px] flex-shrink-0">
           <Sidebar />
       </div>
       <div className="flex-1 p-5 bg-gray-50 overflow-y-auto">
            <div className="flex justify-end gap-3 mb-5 absolute top-5 right-5">
                
                <button
                    className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
                    onClick={handleNewExpenseClick}
                >
                    New Income
                </button>
                <button
                    className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                    onClick={handleDownloadPDF}
                >
                    Download PDF
                </button>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-center mb-3">Recent Income Transactions</h1>
                <p className="text-center text-gray-600 mb-5">
                    Below is the history of your income transactions records
                </p>
                <div className="mb-5 p-5 bg-gray-100 rounded-lg border border-gray-200 align-middle text-center">
                    <p className="text-base text-gray-800 ">
                        Total Number of Transactions: <strong className="text-blue-600">{totalTransactions}</strong>
                    </p>
                    <p className="text-base text-gray-800">
                        Total Amount: <strong className="text-blue-600">
                            LKR {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                    </p>
                </div>
                <table className="w-full border-collapse mb-5">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-3 text-left font-bold border-b border-gray-200">TITLE</th>
                            <th className="p-3 text-left font-bold border-b border-gray-200">DESCRIPTION</th>
                            <th className="p-3 text-left font-bold border-b border-gray-200">AMOUNT</th>
                            <th className="p-3 text-left font-bold border-b border-gray-200">DATE</th>
                            <th className="p-3 text-left font-bold border-b border-gray-200">UPDATE</th>
                            <th className="p-3 text-left font-bold border-b border-gray-200">DELETE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-gray-50">
                                <td className="p-3 border-b border-gray-200">{transaction.title}</td>
                                <td className="p-3 border-b border-gray-200">{transaction.description}</td>
                                <td className="p-3 border-b border-gray-200">
                                    LKR {parseFloat(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 border-b border-gray-200">
                                    {new Date(transaction.date).toLocaleDateString()}
                                </td>
                                <td className="p-3 border-b border-gray-200">
                                    <button
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                                        onClick={() => handleUpdate(transaction._id)}
                                    >
                                        Update
                                    </button>
                                </td>
                                <td className="p-3 border-b border-gray-200">
                                    <button
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                                        onClick={() => handleDelete(transaction._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
};

export default FinanceIncomeView;