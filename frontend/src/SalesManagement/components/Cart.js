import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
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

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await axios.get('http://localhost:8070/api/orders');
            setOrders(response.data);
            setShowOrdersModal(true);
            setLoadingOrders(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders. Please try again.');
            setLoadingOrders(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:8070/api/orders/${orderId}`);
                // Update the orders list after deletion
                setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            } catch (error) {
                console.error('Error deleting order:', error);
                alert(error.response?.data?.message || 'Failed to delete order. Please try again.');
            }
        }
    };

    const selectedItemsTotal = cart
        .filter(item => selectedItems.includes(item.itemId))
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Orders Modal */}
            {showOrdersModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
                            <button
                                onClick={() => setShowOrdersModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-grow">
                            {loadingOrders ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-600">No orders found</h3>
                                    <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {orders.map(order => (
                                        <div key={order._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.substring(order._id.length - 8)}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                                                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'declined' ? 'bg-red-100 text-red-800' :
                                                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'}`}
                                                    >
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                    <span className="text-lg font-bold text-blue-600 mt-2">${order.totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Items</h4>
                                                <div className="space-y-3">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <span className="text-gray-800">{item.quantity} × {item.name}</span>
                                                            </div>
                                                            <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4 mt-4">
                                                <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                                                <p className="text-gray-600">
                                                    {order.customerDetails.fullName}<br />
                                                    {order.customerDetails.address}<br />
                                                    {order.customerDetails.city}, {order.customerDetails.state} {order.customerDetails.zipCode}
                                                </p>
                                            </div>

                                            <div className="border-t border-gray-200 pt-4 mt-4 flex justify-end">
                                                {(order.status === 'pending' || order.status === 'accepted' || order.status === 'processing') && (
                                                    <button
                                                        onClick={() => handleDeleteOrder(order._id)}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                    >
                                                        Delete Order
                                                    </button>
                                                )}
                                                {(order.status === 'shipped' || order.status === 'delivered') && (
                                                    <div className="text-sm text-gray-500 italic">
                                                        Orders that have been shipped or delivered cannot be deleted
                                                    </div>
                                                )}
                                                {order.status === 'declined' && (
                                                    <div className="text-sm text-gray-500 italic">
                                                        This order has been declined by the seller
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={() => setShowOrdersModal(false)}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-800">Auto Expert</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                                onClick={fetchOrders}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <span>My Orders</span>
                            </button>
                            <button
                                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                                onClick={() => navigate('/itemBrowser')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Continue Shopping</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
                    <span className="text-gray-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
                </div>

                {cart.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h2 className="text-2xl text-gray-600 mt-4 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            onClick={() => navigate('//itemBrowser')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                {cart.map(item => (
                                    <div
                                        key={item.itemId}
                                        className="flex items-start p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="mr-4 pt-1">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                                checked={selectedItems.includes(item.itemId)}
                                                onChange={() => handleItemSelect(item.itemId)}
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col sm:flex-row gap-6">
                                            <div className="w-32 h-32 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                {item.imageUrl ? (
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-contain p-2"
                                                    />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                                    <button
                                                        onClick={() => handleRemoveFromCart(item.itemId)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">{item.description || 'No description available'}</p>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                                                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                            </svg>
                                                        </button>
                                                        <span className="text-gray-800 font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                                                            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-600">${(item.price * item.quantity).toFixed(2)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    {selectedItems.length > 0 ? (
                                        cart.filter(item => selectedItems.includes(item.itemId)).map(item => (
                                            <div key={item.itemId} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className="text-sm text-gray-600">{item.quantity} × {item.name}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No items selected</p>
                                    )}
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Selected Items ({selectedItems.length})</span>
                                        <span>${selectedItemsTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg text-gray-800">
                                        <span>Total</span>
                                        <span>${selectedItemsTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 text-red-500 text-sm bg-red-50 p-2 rounded-md">{error}</div>
                                )}

                                <button
                                    onClick={handleCheckout}
                                    disabled={selectedItems.length === 0}
                                    className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${selectedItems.length > 0 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Cart;