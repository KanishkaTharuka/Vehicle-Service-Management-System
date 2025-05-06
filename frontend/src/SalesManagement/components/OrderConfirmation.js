import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`http://localhost:8070/api/orders/${location.state.orderId}`);
                setOrder(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch order details');
                setLoading(false);
            }
        };

        if (location.state?.orderId) {
            fetchOrder();
        } else {
            setError('No order ID provided');
            setLoading(false);
        }
    }, [location.state]);

    const handleConfirmOrder = async () => {
        setConfirming(true);
        try {
            await axios.patch(`http://localhost:8070/api/orders/${order._id}/status`, {
                status: 'processing'
            });
            navigate('/itemBrowser');
        } catch (error) {
            setError('Failed to confirm order');
            setConfirming(false);
        }
    };

    if (loading) {
        return (
            <div className="order-confirmation-container">
                <div className="loading">Loading order details...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-confirmation-container">
                <div className="error-message">{error}</div>
                <button className="back-button" onClick={() => navigate('/')}>
                    Return to Home
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-confirmation-container">
                <div className="error-message">Order not found</div>
                <button className="back-button" onClick={() => navigate('/')}>
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="order-confirmation-container">
            <div className="global-header">
                <h1>Auto Expert</h1>
            </div>
            <div className="confirmation-content">
                <div className="confirmation-header">
                    <h1>Order Confirmation</h1>
                    <div className="order-status">
                        Status: <span className={`status-${order.status}`}>{order.status}</span>
                    </div>
                </div>

                <div className="order-details">
                    <div className="order-section">
                        <h2>Order Summary</h2>
                        <div className="items-list">
                            {order.items.map((item, index) => (
                                <div key={index} className="order-item">
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-quantity">x{item.quantity}</span>
                                    </div>
                                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="order-total">
                            <span>Total Amount:</span>
                            <span>${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="order-section">
                        <h2>Customer Details</h2>
                        <div className="customer-info">
                            <p><strong>Name:</strong> {order.customerDetails.fullName}</p>
                            <p><strong>Email:</strong> {order.customerDetails.email}</p>
                            <p><strong>Phone:</strong> {order.customerDetails.phone}</p>
                            <p><strong>Address:</strong> {order.customerDetails.address}</p>
                            <p><strong>City:</strong> {order.customerDetails.city}</p>
                            <p><strong>State:</strong> {order.customerDetails.state}</p>
                            <p><strong>ZIP Code:</strong> {order.customerDetails.zipCode}</p>
                        </div>
                    </div>

                    <div className="order-section">
                        <h2>Payment Information</h2>
                        <div className="payment-info">
                            <p><strong>Payment Method:</strong> {order.paymentMethod.replace('_', ' ').toUpperCase()}</p>
                            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                        </div>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <div className="confirmation-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-details">
                            <div className="summary-row">
                                <span>Items Total:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <div className="summary-row total">
                                <span>Total Amount:</span>
                                <span>${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button 
                            className="confirm-button"
                            onClick={handleConfirmOrder}
                            disabled={confirming || order.status !== 'pending'}
                        >
                            {confirming ? 'Confirming...' : 'Confirm Order'}
                        </button>
                        <button 
                            className="back-button"
                            onClick={() => navigate('/')}
                            disabled={confirming}
                        >
                            Return to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 