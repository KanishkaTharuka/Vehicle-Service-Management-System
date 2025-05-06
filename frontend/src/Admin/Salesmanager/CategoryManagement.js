import React, { useState, useEffect } from 'react';
import axios from 'axios';
 import './CategoryManagement.css';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        categoryCode: '',
        name: '',
        description: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/categories');
            setCategories(response.data);
        } catch (error) {
            setError('Failed to fetch categories');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingId) {
                await axios.put(`http://localhost:8070/api/categories/${editingId}`, formData);
                setSuccess('Category updated successfully');
            } else {
                await axios.post('http://localhost:8070/api/categories', formData);
                setSuccess('Category added successfully');
            }
            setFormData({ categoryCode: '', name: '', description: '' });
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleEdit = (category) => {
        setFormData({
            categoryCode: category.categoryCode,
            name: category.name,
            description: category.description
        });
        setEditingId(category._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`http://localhost:8070/api/categories/${id}`);
                setSuccess('Category deleted successfully');
                fetchCategories();
            } catch (error) {
                setError('Failed to delete category');
            }
        }
    };

    return (
        <div className="category-management">
            <h2>Category Management</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="category-form">
                <div className="form-group">
                    <label>Category Code</label>
                    <input
                        type="text"
                        name="categoryCode"
                        value={formData.categoryCode}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="form-control"
                        rows="3"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Category' : 'Add Category'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setFormData({ categoryCode: '', name: '', description: '' });
                            setEditingId(null);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="categories-list">
                <h3>Categories</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category._id}>
                                <td>{category.categoryCode}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(category._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryManagement;