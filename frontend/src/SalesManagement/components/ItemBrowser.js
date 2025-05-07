import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../home/Header';
import Footer from '../../home/Footer';
import './ItemBrowser.css';

const ItemBrowser = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [loadingOrders, setLoadingOrders] = useState(false);
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        // Generate or retrieve session ID
        let storedSessionId = localStorage.getItem('sessionId');
        if (!storedSessionId) {
            storedSessionId = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('sessionId', storedSessionId);
        }
        setSessionId(storedSessionId);
        fetchCart(storedSessionId);
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/items');
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch items:', error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const fetchCart = async (sessionId) => {
        try {
            const response = await axios.get(`http://localhost:8070/api/cart/${sessionId}`);
            setCart(response.data.items || []);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setCart([]);
        }
    };

    const addToCart = async (item) => {
        try {
            const response = await axios.post(`http://localhost:8070/api/cart/add`, {
                sessionId,
                itemId: item._id,
                name: item.name,
                quantity: 1,
                price: item.sellingPrice || 0,
                imageUrl: item.imageUrl
            });

            setCart(response.data.items || []);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
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
            setLoadingOrders(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:8070/api/orders/${orderId}`);
                setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
            } catch (error) {
                console.error('Error deleting order:', error);
                alert(error.response?.data?.message || 'Failed to delete order. Please try again.');
            }
        }
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = !selectedCategory || item.category?._id === selectedCategory;
        const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
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

            <Header />

            <div className="flex-grow">
                {/* Navigation and Search */}
                <div className="bg-white shadow-sm">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Category Dropdown */}
                            <div className="relative">
                                <button
                                    className="inline-flex justify-between items-center w-full md:w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    <span>{selectedCategory ? categories.find(c => c._id === selectedCategory)?.name || 'Category' : 'All Categories'}</span>
                                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isCategoryOpen && (
                                    <div className="origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                        <div className="py-1 max-h-60 overflow-y-auto">
                                            <div
                                                className={`block px-4 py-2 text-sm cursor-pointer ${!selectedCategory ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => {
                                                    setSelectedCategory('');
                                                    setIsCategoryOpen(false);
                                                }}
                                            >
                                                All Categories
                                            </div>
                                            {categories.map(category => (
                                                <div
                                                    key={category._id}
                                                    className={`block px-4 py-2 text-sm cursor-pointer ${selectedCategory === category._id ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}`}
                                                    onClick={() => {
                                                        setSelectedCategory(category._id);
                                                        setIsCategoryOpen(false);
                                                    }}
                                                >
                                                    {category.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Bar */}
                            <div className="flex-1 max-w-2xl">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search items..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-4">
                                <button
                                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
                                    onClick={fetchOrders}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <span className="hidden sm:inline">My Orders</span>
                                </button>
                                <button
                                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 relative"
                                    onClick={() => navigate('/cart')}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="hidden sm:inline">Cart</span>
                                    {cart.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cart.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {filteredItems.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
                            <p className="mt-2 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-6">
                            {filteredItems.map(item => (
                                <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                                    <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-grow flex flex-col">
                                        <div className="flex-grow">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                                            <p className="text-sm text-blue-600 mb-1 truncate">{item.companyName}</p>
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">{item.description}</p>
                                        </div>
                                        <div className="mt-auto">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xl font-bold text-gray-900">${(item.sellingPrice || 0).toFixed(2)}</span>
                                                <span className={`text-sm px-2 py-1 rounded-full ${item.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.quantity > 0 ? `In Stock (${item.quantity})` : 'Out of Stock'}
                                                </span>
                                            </div>
                                            <button
                                                className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${item.quantity > 0 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} transition-colors duration-300`}
                                                onClick={() => addToCart(item)}
                                                disabled={item.quantity === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ItemBrowser;