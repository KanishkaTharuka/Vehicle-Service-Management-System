const nodemailer = require('nodemailer');

// Create a transporter object
const transporter = nodemailer.createTransport({
    host:'smtp-relay.brevo.com',
    port:587,
    auth: {
        user: '885955003@smtp-brevo.com', // Use environment variable or default
        pass: 'ghq1zFIbQJTc7LPG' // Use environment variable or default
    }
});

/**
 * Send an email notification
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email content in HTML format
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: 'vihagaviboshana549@gmail.com',
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

/**
 * Send order status update notification
 * @param {Object} order - Order object
 * @param {string} status - New status of the order
 * @returns {Promise} - Promise that resolves when email is sent
 */
const sendOrderStatusEmail = async (order, status) => {
    const to = 'pawan123hashi12@gmail.com';
    const subject = `Order #${order._id} Status Update`;
    
    let statusMessage = '';
    let additionalInfo = '';
    
    switch(status) {
        case 'accepted':
            statusMessage = 'Your order has been accepted and is being processed.';
            additionalInfo = 'Our team is preparing your items for shipment. You will receive another notification when your order is shipped.';
            break;
        case 'declined':
            statusMessage = 'Your order has been declined.';
            additionalInfo = 'We apologize for any inconvenience. Please contact our customer service for more information or assistance.';
            break;
        case 'processing':
            statusMessage = 'Your order is now being processed.';
            additionalInfo = 'Our team is preparing your items for shipment. You will receive another notification when your order is shipped.';
            break;
        case 'shipped':
            statusMessage = 'Your order has been shipped!';
            additionalInfo = 'Your items are on the way. You will receive another notification when your order is delivered.';
            break;
        case 'delivered':
            statusMessage = 'Your order has been delivered!';
            additionalInfo = 'Thank you for shopping with Auto Expert. We hope you enjoy your purchase!';
            break;
        default:
            statusMessage = `Your order status has been updated to: ${status}`;
            additionalInfo = 'Please contact our customer service for more information.';
    }

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #115F89;">Auto Expert</h1>
                <p style="font-size: 18px; color: #333;">Order Status Update</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p>Dear ${order.customerDetails.fullName},</p>
                <p><strong>${statusMessage}</strong></p>
                <p>${additionalInfo}</p>
            </div>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: #115F89;">Order Details</h3>
                <p><strong>Order ID:</strong> #${order._id}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h3 style="color: #115F89;">Items</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e0e0e0;">Item</th>
                            <th style="padding: 10px; text-align: center; border-bottom: 1px solid #e0e0e0;">Quantity</th>
                            <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td style="padding: 10px; text-align: left; border-bottom: 1px solid #e0e0e0;">${item.name}</td>
                                <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e0e0e0;">${item.quantity}</td>
                                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e0e0e0;">$${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
                <p>If you have any questions, please contact our customer service at <a href="mailto:support@autoexpert.com" style="color: #115F89;">support@autoexpert.com</a> or call us at +94 77 222 3333.</p>
                <p>Thank you for shopping with Auto Expert!</p>
            </div>
        </div>
    `;

    return await sendEmail(to, subject, html);
};

module.exports = {
    sendEmail,
    sendOrderStatusEmail
};
