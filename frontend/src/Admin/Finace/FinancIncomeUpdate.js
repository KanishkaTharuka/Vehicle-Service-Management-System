import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../AdminDashboard/Sidebar';

const FinanceIncomeUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const fetchIncome = async () => {
            try {
                const response = await fetch(`http://localhost:8070/finance/getbyid/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch income details');
                }
                const data = await response.json();
                setTitle(data.title);
                setDescription(data.description);
                setAmount(data.amount);
                setDate(data.date);
            } catch (error) {
                console.error('Error fetching income details:', error.message);
            }
        };

        fetchIncome();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            title,
            description,
            amount: parseFloat(amount),
            date,
            action: 'income'
        };

        try {
            const response = await fetch(`http://localhost:8070/finance/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                throw new Error('Failed to update income');
            }

            const result = await response.json();
            console.log('Income updated successfully:', result);
            alert('Income updated successfully!');
            navigate('/income');
        } catch (error) {
            console.error('Error updating income:', error.message);
            alert('Failed to update income. Please try again.');
        }
    };

    return (
        
        <div className="max-w-md mx-auto p-5 border border-gray-300 rounded-lg bg-gray-50">
            <div className="w-[300px] flex-shrink-0">
                <Sidebar />
            </div>
            <h2 className="text-2xl font-bold text-center mb-5">Update Income</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block mb-1 font-bold text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block mb-1 font-bold text-gray-700">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="amount" className="block mb-1 font-bold text-gray-700">
                        Amount
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                </div>
               
            
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                >
                    Update Income
                </button>
            </form>
        </div>
    );
};

export default FinanceIncomeUpdate;
