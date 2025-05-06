import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ItemManagement.css';

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        itemCode: '',
        name: '',
        companyName: '',
        description: '',
        quantity: '',
        buyingPrice: '',
        sellingPrice: '',
        category: '',
        imageUrl: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchItems();
        fetchCategories();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/items');
            setItems(response.data);
        } catch (error) {
            setError('Failed to fetch items');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/categories');
            setCategories(response.data);
        } catch (error) {
            setError('Failed to fetch categories');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingId) {
                await axios.put(`http://localhost:8070/api/items/${editingId}`, formData);
                setSuccess('Item updated successfully');
            } else {
                await axios.post('http://localhost:8070/api/items', formData);
                setSuccess('Item added successfully');
            }
            setFormData({
                itemCode: '',
                name: '',
                companyName: '',
                description: '',
                quantity: '',
                buyingPrice: '',
                sellingPrice: '',
                category: '',
                imageUrl: ''
            });
            setEditingId(null);
            fetchItems();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleEdit = (item) => {
        setFormData({
            itemCode: item.itemCode,
            name: item.name,
            companyName: item.companyName,
            description: item.description,
            quantity: item.quantity,
            buyingPrice: item.buyingPrice,
            sellingPrice: item.sellingPrice,
            category: item.category._id,
            imageUrl: item.imageUrl
        });
        setEditingId(item._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://localhost:8070/api/items/${id}`);
                setSuccess('Item deleted successfully');
                fetchItems();
            } catch (error) {
                setError('Failed to delete item');
            }
        }
    };

    return (
        <div className="item-management">
            <h2>Item Management</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit} className="item-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Item Code</label>
                        <input
                            type="text"
                            name="itemCode"
                            value={formData.itemCode}
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
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="form-control"
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>
                                    {category.name} ({category.categoryCode})
                                </option>
                            ))}
                        </select>
                    </div>
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

                <div className="form-row">
                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            min="0"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Buying Price</label>
                        <input
                            type="number"
                            name="buyingPrice"
                            value={formData.buyingPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Selling Price</label>
                        <input
                            type="number"
                            name="sellingPrice"
                            value={formData.sellingPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className="form-control"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Image URL</label>
                    <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Item' : 'Add Item'}
                </button>
                {editingId && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setFormData({
                                itemCode: '',
                                name: '',
                                companyName: '',
                                description: '',
                                quantity: '',
                                buyingPrice: '',
                                sellingPrice: '',
                                category: '',
                                imageUrl: ''
                            });
                            setEditingId(null);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <div className="items-list">
                <h3>Items</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Category</th>
                            <th>Quantity</th>
                            <th>Buying Price</th>
                            <th>Selling Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item._id}>
                                <td>{item.itemCode}</td>
                                <td>{item.name}</td>
                                <td>{item.companyName}</td>
                                <td>{item.category?.name}</td>
                                <td>{item.quantity}</td>
                                <td>${item.buyingPrice.toFixed(2)}</td>
                                <td>${item.sellingPrice.toFixed(2)}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(item._id)}
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

export default ItemManagement; 