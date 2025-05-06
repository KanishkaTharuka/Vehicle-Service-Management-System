import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ItemBrowser.css';
import Header from '../../home/Header';
import Footer from '../../home/Footer';

const ItemBrowser = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();
    const [sessionId, setSessionId] = useState('');

    const slideshowImages = [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2083&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
    ];

    useEffect(() => {
        // Slideshow interval
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

    const handleRemoveFromCart = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
    };

    const handleUpdateQuantity = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item._id === itemId ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = !selectedCategory || item.category?._id === selectedCategory;
        const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div>
             <Header />
        <div className="item-browser">
            <div className="header">
                <div className="header-left">
                    <h1 className="logo">Auto Expert</h1>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-button">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="header-right">
                    <button className="my-orders-btn" onClick={() => navigate('/orders')}>
                        <i className="fas fa-box"></i> My Orders
                    </button>
                    <div className="cart-icon" onClick={() => navigate('/cart')}>
                        <i className="fas fa-shopping-cart"></i>
                        <span className="cart-text">Cart</span>
                        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
                    </div>
                </div>
            </div>

            <div className="slideshow-container">
                <div 
                    className="slideshow"
                    style={{ 
                        backgroundImage: `url(${slideshowImages[currentSlide]})`,
                        transform: `translateX(-${currentSlide * 100}%)`
                    }}
                >
                    {slideshowImages.map((image, index) => (
                        <div 
                            key={index}
                            className="slide"
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))}
                </div>
                <div className="slideshow-controls">
                    {slideshowImages.map((_, index) => (
                        <button
                            key={index}
                            className={`slide-dot ${currentSlide === index ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>

            <div className="blue-rectangle"></div>

            <div className="category-dropdown">
                <button 
                    className="category-dropdown-btn"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                    <span>Categories</span>
                    <i className={`fas fa-chevron-${isCategoryOpen ? 'up' : 'down'}`}></i>
                </button>
                {isCategoryOpen && (
                    <div className="category-dropdown-content">
                        <div 
                            className={`category-item ${!selectedCategory ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedCategory('');
                                setIsCategoryOpen(false);
                            }}
                        >
                            All Items
                        </div>
                        {categories.map(category => (
                            <div 
                                key={category._id}
                                className={`category-item ${selectedCategory === category._id ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(category._id);
                                    setIsCategoryOpen(false);
                                }}
                            >
                                {category.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="main-content">
                <div className="items-grid">
                    {filteredItems.map(item => (
                        <div key={item._id} className="item-card">
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
                                <h3>{item.name}</h3>
                                <p className="company">{item.companyName}</p>
                                <p className="description">{item.description}</p>
                                <div className="price-section">
                                    <span className="price">${(item.sellingPrice || 0).toFixed(2)}</span>
                                    <span className="stock">
                                        {item.quantity > 0 ? `In Stock (${item.quantity})` : 'Out of Stock'}
                                    </span>
                                </div>
                                <button
                                    className="add-to-cart"
                                    onClick={() => addToCart(item)}
                                    disabled={item.quantity === 0}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
        <Footer/>
        </div>
    );
};

export default ItemBrowser; 