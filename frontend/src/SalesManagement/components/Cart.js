import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import './Cart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
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
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');

    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        if (storedSessionId) {
            setSessionId(storedSessionId);
            fetchCart(storedSessionId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchCart = async (sessionId) => {
        try {
            const response = await axios.get(`http://localhost:8070/api/cart/${sessionId}`);
            setCart(response.data.items);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setLoading(false);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
            const response = await axios.delete(`http://localhost:8070/api/cart/remove/${sessionId}/${itemId}`);
            setCart(response.data.items);
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            const response = await axios.put(`http://localhost:8070/api/cart/update/${sessionId}/${itemId}`, {
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
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="cart-container">
            <div className="global-header">
                <h1>Auto Expert</h1>
            </div>
            <div className="cart-content-wrapper">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <button className="continue-shopping" onClick={() => navigate('/')}>
                        Continue Shopping
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <h2>Your cart is empty</h2>
                        <button className="continue-shopping" onClick={() => navigate('/')}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.itemId} className="cart-item">
                                    <div className="item-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.itemId)}
                                            onChange={() => handleItemSelect(item.itemId)}
                                        />
                                    </div>
                                    <div className="item-description">
                                        <h3>{item.name}</h3>
                                        <p>{item.description || 'No description available'}</p>
                                    </div>
                                    <div className="item-image">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.name} />
                                        ) : (
                                            <div className="placeholder-image">
                                                <i className="fas fa-image"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <div className="price"><strong>${item.price.toFixed(2)}</strong></div>
                                        <div className="quantity-controls">
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="quantity-btn"
                                                onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="item-total">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            className="remove-btn"
                                            onClick={() => handleRemoveFromCart(item.itemId)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-section">
                            <div className="order-summary">
                                <h2>Order Summary</h2>
                                <div className="selected-items-preview">
                                    {cart
                                        .filter(item => selectedItems.includes(item.itemId))
                                        .map(item => (
                                            <div key={item.itemId} className="selected-item">
                                                <img src={item.imageUrl} alt={item.name} />
                                                <span>{item.quantity}x {item.name}</span>
                                            </div>
                                        ))}
                                </div>
                                <div className="summary-item">
                                    <span>Selected Items ({selectedItems.length})</span>
                                    <span>${selectedItemsTotal.toFixed(2)}</span>
                                </div>
                                <div className="summary-item total">
                                    <span>Estimated Total</span>
                                    <span>${selectedItemsTotal.toFixed(2)}</span>
                                </div>
                                {error && <div className="error-message">{error}</div>}
                                <button className="checkout-btn" onClick={handleCheckout}>
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