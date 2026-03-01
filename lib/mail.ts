import nodemailer from 'nodemailer';
import type { Order } from '@/types';
import { formatCurrency } from './utils';

type OrderEmailItem = {
  name: string;
  price: number;
  quantity: number;
  weightGrams: number;
};

// Helper to safely get env vars
const getEnv = (key: string) => process.env[key] || '';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: getEnv('SMTP_HOST'),
  port: Number(getEnv('SMTP_PORT')) || 587,
  secure: Number(getEnv('SMTP_PORT')) === 465, // true for 465, false for other ports
  auth: {
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS'),
  },
});

const FROM_EMAIL = getEnv('FROM_EMAIL') || 'info@roshanlaljisweets.com';
const ADMIN_EMAIL = getEnv('ADMIN_EMAIL') || 'info@roshanlaljisweets.com';

/**
 * Validates if SMTP credentials exist before attempting to send.
 */
function isConfigured() {
  return Boolean(getEnv('SMTP_HOST') && getEnv('SMTP_USER') && getEnv('SMTP_PASS'));
}

/**
 * Sends a HTML order confirmation to the customer
 */
export async function sendCustomerOrderEmail(
  order: Order,
  customer: { name: string; email: string },
  items: OrderEmailItem[]
) {
  if (!isConfigured()) {
    console.warn('[Mail] No SMTP config found. Skipping customer email for order:', order.id);
    return false;
  }

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #fcebb6;">
        <strong>${item.name}</strong><br/>
        <small style="color: #666;">${item.weightGrams}g &times; ${item.quantity}</small>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #fcebb6; text-align: right;">
        ${formatCurrency(item.price * item.quantity)}
      </td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #431407;">
      <div style="background: linear-gradient(135deg, #f97316 0%, #db2777 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0;">Order Confirmed!</h1>
      </div>
      
      <div style="padding: 30px; background-color: #fffaf0; border: 1px solid #fcebb6; border-top: none; border-radius: 0 0 12px 12px;">
        <p>Dear <strong>${customer.name}</strong>,</p>
        <p>Thank you for ordering from L.Roshanlal Ji Sweets. We are preparing your fresh mithai now!</p>
        
        <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 25px 0; border: 1px solid #fcebb6;">
          <h3 style="margin-top: 0; color: #9f1239; border-bottom: 2px solid #fcebb6; padding-bottom: 10px;">Order Details (#${order.id.slice(-8).toUpperCase()})</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>Subtotal</strong></td>
              <td style="padding: 10px; text-align: right;">${formatCurrency(order.subtotalPaise / 100)}</td>
            </tr>
            ${order.cgstTotalPaise > 0 || order.sgstTotalPaise > 0 ? `
            <tr>
              <td style="padding: 10px; text-align: right; color: #666;">CGST</td>
              <td style="padding: 10px; text-align: right; color: #666;">${formatCurrency(order.cgstTotalPaise / 100)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right; color: #666;">SGST</td>
              <td style="padding: 10px; text-align: right; color: #666;">${formatCurrency(order.sgstTotalPaise / 100)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 10px; text-align: right;"><strong>Delivery</strong></td>
              <td style="padding: 10px; text-align: right;">${order.deliveryPaise === 0 ? 'FREE' : formatCurrency(order.deliveryPaise / 100)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right; font-size: 1.1em; color: #9f1239;"><strong>Grand Total</strong></td>
              <td style="padding: 10px; text-align: right; font-size: 1.1em; color: #9f1239;"><strong>${formatCurrency(order.totalPaise / 100)}</strong></td>
            </tr>
          </table>
        </div>

        <h4 style="color: #9f1239; margin-bottom: 5px;">Delivery Address</h4>
        <p style="margin-top: 0; line-height: 1.5; color: #666;">
          ${order.addressLine}<br/>
          ${order.city}, ${order.state} - ${order.pincode}
        </p>
        
        <p style="text-align: center; margin-top: 40px; font-size: 0.9em; color: #888;">
          Questions? Reply to this email or call us at +91 70555 13961.
        </p>
      </div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"L.Roshanlal Ji Sweets" <${FROM_EMAIL}>`,
      to: customer.email,
      subject: `Order Confirmation - L.Roshanlal Ji Sweets #${order.id.slice(-8).toUpperCase()}`,
      html,
    });
    console.log('[Mail] Confirmation sent to', customer.email, info.messageId);
    return true;
  } catch (error) {
    console.error('[Mail] Failed to send customer email:', error);
    return false;
  }
}

/**
 * Sends a plain-text/simple HTML alert to the store admin
 */
export async function sendAdminAlertEmail(order: Order, customer: { name: string; phone: string }) {
  if (!isConfigured()) return false;

  const html = `
    <h2>New Order Received!</h2>
    <p><strong>Order ID:</strong> ${order.id}</p>
    <p><strong>Razorpay ID:</strong> ${order.razorpayPaymentId}</p>
    <p><strong>Amount:</strong> ₹${order.totalPaise / 100} (inc. ₹${(order.cgstTotalPaise + order.sgstTotalPaise) / 100} GST)</p>
    <hr/>
    <h3>Customer Details</h3>
    <p>Name: ${customer.name}</p>
    <p>Phone: ${customer.phone}</p>
    <p>Address: ${order.city} - ${order.pincode}</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"L.Roshanlal Ji Sweets" <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `New Order Received - ₹${order.totalPaise / 100}`,
      html,
    });
    console.log('[Mail] Admin alert sent', info.messageId);
    return true;
  } catch (error) {
    console.error('[Mail] Failed to send admin alert:', error);
    return false;
  }
}
