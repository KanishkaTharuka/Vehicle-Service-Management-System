import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../AdminDashboard/Sidebar';


const FinanceExpensesForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [action, setAction] = useState('expense');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const financeData = {
            title,
            description,
            amount: parseFloat(amount),
            action,
        };

        try {
            const response = await fetch('http://localhost:8070/finance/input', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(financeData),
            });

            if (!response.ok) {
                throw new Error('Failed to add finance entry');
            }

            const result = await response.json();
            console.log('Finance entry added successfully:', result);

            setTitle('');
            setDescription('');
            setAmount('');
            setAction('expense');

            if (action === 'expense') {
                alert('Expense added successfully');
                navigate('/expenses');
            } else if (action === 'income') {
                alert('Income added successfully');
                navigate('/income');
            }
        } catch (error) {
            console.error('Error adding finance entry:', error.message);
        }
    };

    return (
        
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-md ">
            <div className="w-[300px] flex-shrink-0">
                <Sidebar />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Record New Expense and Income</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label htmlFor="title" className="block mb-2 font-semibold text-gray-600">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="description" className="block mb-2 font-semibold text-gray-600">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mb-5">
                    <label htmlFor="amount" className="block mb-2 font-semibold text-gray-600">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-green-500"
                    />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 font-semibold text-gray-600">Action</label>
                    <div className="flex justify-center gap-5">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="expense"
                                checked={action === 'expense'}
                                onChange={(e) => setAction(e.target.value)}
                            />
                            Expense
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                value="income"
                                checked={action === 'income'}
                                onChange={(e) => setAction(e.target.value)}
                            />
                            Income
                        </label>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full p-3 bg-green-500 text-white rounded hover:bg-green-600 transition-all"
                >
                    Record Entry
                </button>
            </form>
        </div>
    );
};

export default FinanceExpensesForm;