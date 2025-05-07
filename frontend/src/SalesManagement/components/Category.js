import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Category.css';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/categories');
            setCategories(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch categories');
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`http://localhost:8070/api/categories/${categoryId}`);
                setCategories(categories.filter(category => category._id !== categoryId));
            } catch (error) {
                setError('Failed to delete category');
            }
        }
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="category-container">
            

            <div className="main-content">
                <div className="content-header">
                    <h1>Categories</h1>
                    <button 
                        className="add-category-btn"
                        onClick={() => handleNavigation('/add-category')}
                    >
                        Add New Category
                    </button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="categories-grid">
                    {categories.map(category => (
                        <div key={category._id} className="category-card">
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                            <div className="category-code">Code: {category.categoryCode}</div>
                            <div className="category-actions">
                                <button 
                                    className="edit-btn"
                                    onClick={() => handleNavigation(`/edit-category/${category._id}`)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="delete-btn"
                                    onClick={() => handleDeleteCategory(category._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Category; 