import express from 'express';
import { check } from 'express-validator';
import validate from '../middleware/validate.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Simple in-memory throttle: one message per IP every 30 seconds.
const lastSubmission = new Map();
const THROTTLE_MS = 30 * 1000;

router.post(
  '/',
  [
    check('name', 'Name is required').trim().notEmpty().isLength({ max: 100 }),
    check('email', 'Please include a valid email').trim().isEmail(),
    check('subject', 'Subject is required').trim().notEmpty().isLength({ max: 150 }),
    check('message', 'Message is required').trim().notEmpty().isLength({ max: 3000 }),
  ],
  validate,
  async (req, res) => {
    const { name, email, subject, message } = req.body;
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';

    const last = lastSubmission.get(ip) || 0;
    if (Date.now() - last < THROTTLE_MS) {
      return res.status(429).json({
        success: false,
        msg: 'Please wait a moment before sending another message.',
      });
    }

    const inbox = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;
    if (!inbox) {
      return res.status(503).json({
        success: false,
        msg: 'The contact form is temporarily unavailable. Please try again later.',
      });
    }

    try {
      await sendEmail({
        to: inbox,
        subject: `[ProHealth contact] ${subject}`,
        html: `
          <h2>New contact message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
        `,
      });

      lastSubmission.set(ip, Date.now());
      return res.json({
        success: true,
        msg: 'Thanks for reaching out. We will reply as soon as possible.',
      });
    } catch (error) {
      console.error('Contact email failed:', error.message);
      return res.status(502).json({
        success: false,
        msg: 'We could not send your message right now. Please try again later.',
      });
    }
  }
);

export default router;
