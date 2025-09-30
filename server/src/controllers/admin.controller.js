import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function adminLogin(req, res, next) {
  try {
    const { adminId, password } = req.body;
    const admin = await Admin.findOne({ adminId });
    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not set');
    const token = jwt.sign({ role: 'admin', id: admin._id, adminId }, secret, { expiresIn: '7d' });
    res.json({ success: true, data: { token, admin: { adminId } } });
  } catch (e) {
    next(e);
  }
}


