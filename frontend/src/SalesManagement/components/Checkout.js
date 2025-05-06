import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Checkout.css';

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedItems, totalAmount } = location.state || { selectedItems: [], totalAmount: 0 };

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        paymentMethod: 'credit_card'
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            setError('Full name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.phone.trim()) {
            setError('Phone number is required');
            return false;
        }
        if (!formData.address.trim()) {
            setError('Address is required');
            return false;
        }
        if (!formData.city.trim()) {
            setError('City is required');
            return false;
        }
        if (!formData.state.trim()) {
            setError('State is required');
            return false;
        }
        if (!formData.zipCode.trim()) {
            setError('ZIP code is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        try {
            const orderData = {
                items: selectedItems,
                shippingDetails: formData,
                totalAmount,
                sessionId: localStorage.getItem('sessionId')
            };

            const response = await axios.post('http://localhost:8070/api/orders', orderData);
            
            // Clear cart after successful order
            await axios.delete(`http://localhost:8070/api/cart/clear/${localStorage.getItem('sessionId')}`);
            
            // Navigate to order confirmation
            navigate('/order-confirmation', { state: { orderId: response.data.orderId } });
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to place order. Please try again.');
        }
    };

    if (selectedItems.length === 0) {
        return (
            <div className="checkout-container">
                <div className="error-message">
                    No items selected for checkout. Please return to your cart and select items.
                </div>
                <button className="back-to-cart" onClick={() => navigate('/cart')}>
                    Return to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container">
            <div className="global-header">
                <h1>Auto Expert</h1>
            </div>
            <div className="checkout-content-wrapper">
                <div className="checkout-header">
                    <h1>Checkout</h1>
                    <button className="back-to-cart" onClick={() => navigate('/cart')}>
                        Back to Cart
                    </button>
                </div>

                <div className="checkout-content">
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="selected-items-preview">
                            {selectedItems.map(item => (
                                <div key={item.itemId} className="selected-item">
                                    <img src={item.imageUrl} alt={item.name} />
                                    <span>{item.name}</span>
                                    <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="summary-item total">
                            <span>Total Amount:</span>
                            <span>${totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="checkout-form">
                        <h2>Shipping Details</h2>
                        {error && <div className="error-message">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="Enter your city"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="Enter your state"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="zipCode">ZIP Code</label>
                                <input
                                    type="text"
                                    id="zipCode"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="Enter your ZIP code"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="paymentMethod">Payment Method</label>
                                <select
                                    id="paymentMethod"
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="credit_card">Credit Card</option>
                                    <option value="debit_card">Debit Card</option>
                                    <option value="paypal">PayPal</option>
                                </select>
                            </div>

                            <button type="submit" className="place-order-btn">
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 