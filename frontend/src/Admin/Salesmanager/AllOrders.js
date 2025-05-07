import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SalesManagerSidebar from './SalesManagerSidebar';
import './CategoryManagement.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Reusing the same CSS

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, orderId: null });

    useEffect(() => {
        fetchOrders();
    }, []);

    // Filter orders when orders array or active filter changes
    useEffect(() => {
        if (activeFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === activeFilter));
        }
    }, [orders, activeFilter]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/orders');
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch orders');
            setLoading(false);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            await axios.delete(`http://localhost:8070/api/orders/${orderId}`);
            setSuccess('Order deleted successfully');
            fetchOrders();
            // Close the modal if it's open
            if (showOrderModal && selectedOrder && selectedOrder._id === orderId) {
                closeOrderModal();
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete order');
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            await axios.patch(`http://localhost:8070/api/orders/${orderId}/accept`);
            setSuccess('Order accepted successfully');
            fetchOrders();
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to accept order');
        }
    };

    const handleDeclineOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to decline this order? This will return items to inventory.')) {
            try {
                await axios.patch(`http://localhost:8070/api/orders/${orderId}/decline`);
                setSuccess('Order declined successfully');
                fetchOrders();
            } catch (error) {
                setError(error.response?.data?.message || 'Failed to decline order');
            }
        }
    };

    const handleFilterChange = (filter) => {
        setActiveFilter(filter);
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderModal(true);
    };

    const closeOrderModal = () => {
        setShowOrderModal(false);
        setSelectedOrder(null);
    };

    const showDeleteConfirmation = (orderId) => {
        setDeleteConfirmation({ show: true, orderId });
    };

    const cancelDelete = () => {
        setDeleteConfirmation({ show: false, orderId: null });
    };

    const confirmDelete = () => {
        if (deleteConfirmation.orderId) {
            handleDeleteOrder(deleteConfirmation.orderId);
            setDeleteConfirmation({ show: false, orderId: null });
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();

        // Add Auto Expert logo
        // You can replace this with the actual logo image
        doc.setFillColor(17, 95, 137); // #115F89 color
        doc.rect(14, 10, 30, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('AUTO EXPERT', 16, 17);

        // Add report title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Orders Summary Report', 105, 20, { align: 'center' });

        // Add report generation info
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const today = new Date();
        doc.text(`Generated on: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}`, 195, 20, { align: 'right' });

        // Add filter information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Filter: ${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Orders`, 14, 30);

        // Add order count
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Orders: ${filteredOrders.length}`, 14, 37);

        // Create table with order data
        const tableColumn = ["Order ID", "Customer", "Date", "Amount", "Status"];
        const tableRows = [];

        filteredOrders.forEach(order => {
            const orderData = [
                '#' + order._id.substring(order._id.length - 8),
                order.customerDetails.fullName,
                new Date(order.createdAt).toLocaleDateString(),
                '$' + order.totalAmount.toFixed(2),
                order.status.charAt(0).toUpperCase() + order.status.slice(1)
            ];
            tableRows.push(orderData);
        });

        // Generate the table
        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 45,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [17, 95, 137], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { top: 45 }
        });

        // Add summary statistics
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Order Summary Statistics', 14, finalY);

        // Calculate statistics
        const totalAmount = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
        const statusCounts = filteredOrders.reduce((counts, order) => {
            counts[order.status] = (counts[order.status] || 0) + 1;
            return counts;
        }, {});

        // Add statistics to PDF
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Revenue: $${totalAmount.toFixed(2)}`, 14, finalY + 7);

        let yPos = finalY + 14;
        Object.entries(statusCounts).forEach(([status, count]) => {
            const statusText = status.charAt(0).toUpperCase() + status.slice(1);
            doc.text(`${statusText} Orders: ${count} (${((count / filteredOrders.length) * 100).toFixed(1)}%)`, 14, yPos);
            yPos += 7;
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text(
                'Auto Expert - Vehicle Service Management System',
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
            doc.text(
                `Page ${i} of ${pageCount}`,
                195,
                doc.internal.pageSize.height - 10,
                { align: 'right' }
            );
        }

        // Save the PDF
        doc.save(`Auto_Expert_Orders_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (loading) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen">
                <SalesManagerSidebar />
                <div className="category-management flex-1">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Delete Confirmation Overlay */}
            {deleteConfirmation.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                        <div className="text-center mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Order</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete this order? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex justify-center space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Order Detail Modal */}
            {showOrderModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                Order #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
                            </h2>
                            <button
                                onClick={closeOrderModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 flex-grow">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="mb-2"><span className="font-medium">Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium
                                                ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                selectedOrder.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                selectedOrder.status === 'declined' ? 'bg-red-100 text-red-800' :
                                                selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                selectedOrder.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'}`}
                                            >
                                                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                            </span>
                                        </p>
                                        <p className="mb-2"><span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}</p>
                                        <p className="mb-2"><span className="font-medium">Total Amount:</span> ${selectedOrder.totalAmount.toFixed(2)}</p>
                                        <p className="mb-2"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod.replace('_', ' ').charAt(0).toUpperCase() + selectedOrder.paymentMethod.replace('_', ' ').slice(1)}</p>
                                        <p className="mb-2"><span className="font-medium">Payment Status:</span> {selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="mb-2"><span className="font-medium">Name:</span> {selectedOrder.customerDetails.fullName}</p>
                                        <p className="mb-2"><span className="font-medium">Email:</span> {selectedOrder.customerDetails.email}</p>
                                        <p className="mb-2"><span className="font-medium">Phone:</span> {selectedOrder.customerDetails.phone}</p>
                                        <p className="mb-2"><span className="font-medium">Address:</span> {selectedOrder.customerDetails.address}</p>
                                        <p className="mb-2"><span className="font-medium">City:</span> {selectedOrder.customerDetails.city}</p>
                                        <p className="mb-2"><span className="font-medium">State:</span> {selectedOrder.customerDetails.state}</p>
                                        <p className="mb-2"><span className="font-medium">Zip Code:</span> {selectedOrder.customerDetails.zipCode}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-2">Item</th>
                                                <th className="text-center py-2">Quantity</th>
                                                <th className="text-right py-2">Price</th>
                                                <th className="text-right py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrder.items.map((item, index) => (
                                                <tr key={index} className="border-b border-gray-200">
                                                    <td className="py-2">{item.name}</td>
                                                    <td className="text-center py-2">{item.quantity}</td>
                                                    <td className="text-right py-2">${item.price.toFixed(2)}</td>
                                                    <td className="text-right py-2">${(item.price * item.quantity).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-bold">
                                                <td colSpan="3" className="text-right py-2">Total:</td>
                                                <td className="text-right py-2">${selectedOrder.totalAmount.toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                                    <>
                                        <button
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                            onClick={() => {
                                                handleAcceptOrder(selectedOrder._id);
                                                closeOrderModal();
                                            }}
                                        >
                                            Accept Order
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                                            onClick={() => {
                                                handleDeclineOrder(selectedOrder._id);
                                                closeOrderModal();
                                            }}
                                        >
                                            Decline Order
                                        </button>
                                    </>
                                )}

                                {(selectedOrder.status === 'pending' || selectedOrder.status === 'accepted' || selectedOrder.status === 'processing') && (
                                    <button
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                                        onClick={() => {
                                            closeOrderModal();
                                            showDeleteConfirmation(selectedOrder._id);
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete Order
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-4 border-t border-gray-200">
                            <button
                                onClick={closeOrderModal}
                                className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <SalesManagerSidebar />
            <div className="category-management flex-1">
                <div className="header-section">
                    <h2>All Orders</h2>
                    <button
                        className="download-report-btn"
                        onClick={generatePDF}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download Report
                    </button>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="filter-buttons mb-4">
                    <button
                        className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('all')}
                    >
                        All Orders
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('pending')}
                    >
                        Pending
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'accepted' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('accepted')}
                    >
                        Accepted
                    </button>
                    <button
                        className={`filter-btn ${activeFilter === 'declined' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('declined')}
                    >
                        Declined
                    </button>
                </div>

                <div className="orders-list">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">No orders found</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order._id}>
                                        <td>#{order._id.substring(order._id.length - 8)}</td>
                                        <td>{order.customerDetails.fullName}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>${order.totalAmount.toFixed(2)}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="action-buttons">
                                            <div className="flex flex-wrap gap-1">
                                                <button
                                                    className="btn btn-sm btn-info"
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    View More
                                                </button>

                                                {(order.status === 'pending' || order.status === 'processing') && (
                                                    <>
                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() => handleAcceptOrder(order._id)}
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-warning"
                                                            onClick={() => handleDeclineOrder(order._id)}
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                )}

                                                {/* Delete button with bin icon */}
                                                {(order.status === 'pending' || order.status === 'accepted' || order.status === 'processing') && (
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => showDeleteConfirmation(order._id)}
                                                        title="Delete Order"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllOrders;
