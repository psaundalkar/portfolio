import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './EnrollmentModal.css';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

const EnrollmentModal = ({ course, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', smartphone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) {
      setError('Please enter your name.');
      return false;
    }
    if (!form.email.trim()) {
      setError('Please enter your email.');
      return false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!form.phone.trim()) {
      setError('Please enter your phone number.');
      return false;
    }
    if (course.slug === 'mobile' && !form.smartphone) {
      setError('Please select your smartphone type.');
      return false;
    }
    return true;
  };

  const openRazorpay = (orderData) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: course.title,
      description: `Enrollment: ${course.title}`,
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      handler: async (response) => {
        setLoading(true);
        setError('');
        try {
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const data = await verifyRes.json();
          if (data.verified) {
            setSuccess(true);
          } else {
            setError('Payment verification failed. Please contact support with your payment ID.');
          }
        } catch (err) {
          setError('Verification failed. Please contact support with your payment details.');
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => {
      setError('Payment failed or was cancelled.');
      setLoading(false);
    });
    rzp.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: course.price,
          currency: course.currency || 'INR',
          courseSlug: course.slug,
          name: form.name,
          email: form.email,
          contact: form.phone,
          smartphone: course.slug === 'mobile' ? form.smartphone : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create order. Is the server running?');
        setLoading(false);
        return;
      }
      await loadRazorpayScript();
      if (window.Razorpay) {
        openRazorpay(data);
      } else {
        setError('Payment gateway could not be loaded.');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error. Please check the server and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="enrollment-modal-overlay" onClick={onClose}>
      <motion.div
        className="enrollment-modal"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="enrollment-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="enrollment-success"
            >
              <span className="enrollment-success-icon">✓</span>
              <h3>Payment successful</h3>
              <p>You’re enrolled in <strong>{course.title}</strong>. We’ll email you at <strong>{form.email}</strong> with access details shortly.</p>
              <button type="button" className="btn-enroll-v2" onClick={onClose}>
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2>Enroll in {course.title}</h2>
              <p className="enrollment-price">{course.priceLabel} one-time</p>
              <form onSubmit={handleSubmit} className="enrollment-form">
                <label>
                  Full name <span className="required">*</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    autoComplete="name"
                    disabled={loading}
                  />
                </label>
                <label>
                  Email <span className="required">*</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    disabled={loading}
                  />
                </label>
                <label>
                  Phone <span className="required">*</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    autoComplete="tel"
                    disabled={loading}
                  />
                </label>
                {course.slug === 'mobile' && (
                  <label>
                    Which smartphone you have? <span className="required">*</span>
                    <select
                      name="smartphone"
                      value={form.smartphone}
                      onChange={handleChange}
                      disabled={loading}
                    >
                      <option value="">Select</option>
                      <option value="iPhone">iPhone</option>
                      <option value="Android">Android</option>
                    </select>
                  </label>
                )}
                {error && <p className="enrollment-error">{error}</p>}
                <button type="submit" className="btn-buy-stripe" disabled={loading}>
                  {loading ? 'Opening payment…' : 'Proceed to Pay'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EnrollmentModal;
