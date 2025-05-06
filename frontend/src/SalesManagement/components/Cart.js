import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/cart');
            setCart(response.data.items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await axios.delete(`http://localhost:8070/api/cart/remove/${itemId}`);
            setCart(response.data.items);
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await axios.put(`http://localhost:8070/api/cart/update/${itemId}`, {
                quantity: newQuantity
            });
            setCart(response.data.items);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleItemSelect = (itemId) => {
        setSelectedItems(prev => {
            if (prev.includes(itemId)) {
                return prev.filter(id => id !== itemId);
            } else {
                return [...prev, itemId];
            }
        });
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            setError('Please select at least one item to checkout');
            return;
        }
        const selectedCartItems = cart.filter(item => selectedItems.includes(item.itemId));
        navigate('/checkout', { 
            state: { 
                selectedItems: selectedCartItems,
                totalAmount: selectedItemsTotal
            } 
        });
    };

    const selectedItemsTotal = cart
        .filter(item => selectedItems.includes(item.itemId))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (loading) {
        return <div className="text-center py-12 text-gray-600 text-lg">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="global-header">
                <h1 className="text-3xl font-bold text-gray-800 text-center py-4">Auto Expert</h1>
            </div>
            <div className="max-w-6xl mx-auto p-5">
                <div className="flex justify-between items-center mb-8 pb-5 border-b-2 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
                    <button 
                        className="border-2 border-indigo-900 text-indigo-900 px-4 py-2 rounded-md font-semibold hover:bg-indigo-900 hover:text-white transition"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-2xl text-gray-600 mb-4">Your cart is empty</h2>
                        <button 
                            className="border-2 border-indigo-900 text-indigo-900 px-4 py-2 rounded-md font-semibold hover:bg-indigo-900 hover:text-white transition"
                            onClick={() => navigate('/')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="lg:flex-2">
                            {cart.map(item => (
                                <div 
                                    key={item.itemId} 
                                    className="flex items-center p-5 bg-white rounded-lg shadow-md mb-5 gap-5"
                                >
                                    <div className="min-w-[24px]">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 cursor-pointer"
                                            checked={selectedItems.includes(item.itemId)}
                                            onChange={() => handleItemSelect(item.itemId)}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px]">
                                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-sm text-gray-600">{item.description || 'No description available'}</p>
                                    </div>
                                    <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <div className="text-gray-400 text-2xl">
                                                <i className="fas fa-image"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center gap-2 min-w-[150px]">
                                        <div className="text-lg font-semibold text-indigo-900">${item.price.toFixed(2)}</div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg hover:bg-gray-200 transition"
                                                onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg hover:bg-gray-200 transition"
                                                onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="font-semibold text-gray-800">${(item.price * item.quantity).toFixed(2)}</div>
                                        <button
                                            className="text-red-500 hover:text-red-700 transition"
                                            onClick={() => handleRemoveFromCart(item.itemId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:flex-1">
                            <div className="bg-white p-5 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold text-gray-800 mb-5">Order Summary</h2>
                                <div className="p-4 bg-gray-100 rounded-md mb-5">
                                    {cart
                                        .filter(item => selectedItems.includes(item.itemId))
                                        .map(item => (
                                            <div key={item.itemId} className="flex items-center gap-2 mb-2">
                                                <img 
                                                    src={item.imageUrl} 
                                                    alt={item.name} 
                                                    className="w-10 h-10 object-contain bg-white p-1 rounded"
                                                />
                                                <span className="text-sm text-gray-800">{item.quantity}x {item.name}</span>
                                            </div>
                                        ))}
                                </div>
                                <div className="flex justify-between mb-2 pb-2 border-b border-gray-200">
                                    <span>Selected Items ({selectedItems.length})</span>
                                    <span>${selectedItemsTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg text-gray-800 pt-2">
                                    <span>Estimated Total</span>
                                    <span>${selectedItemsTotal.toFixed(2)}</span>
                                </div>
                                {error && (
                                    <div className="text-red-500 bg-red-50 p-2 rounded-md mb-5">{error}</div>
                                )}
                                <button 
                                    className="w-full py-3 bg-green-500 text-white rounded-md font-semibold hover:bg-green-600 transition mt-5"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;