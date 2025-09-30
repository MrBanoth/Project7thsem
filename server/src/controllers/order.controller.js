import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Shop from '../models/Shop.js';
import { buildQueryOptions } from '../services/queryBuilder.js';

export async function createOrder(req, res, next) {
  try {
    const { shop, items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Items are required' });
    }
    const shopExists = await Shop.findById(shop);
    if (!shopExists) return res.status(400).json({ success: false, message: 'Invalid shop' });

    // Calculate total and validate products
    let total = 0;
    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ success: false, message: 'Invalid product in items' });
      total += (it.quantity || 1) * p.price;
    }

    const order = await Order.create({ user: req.user.id, shop, items, total });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const { page, limit, skip, sort, filters } = buildQueryOptions(req.query);
    // Restrict to own orders unless admin/shopkeeper
    if (!['admin', 'shopkeeper'].includes(req.user.role)) {
      filters.user = req.user.id;
    }
    const query = Order.find(filters).populate('user', '-password').populate('shop').populate('items.product');
    const [items, total] = await Promise.all([
      query.sort(sort).skip(skip).limit(limit),
      Order.countDocuments(filters),
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total } });
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const item = await Order.findById(req.params.id).populate('user', '-password').populate('shop').populate('items.product');
    if (!item) return res.status(404).json({ success: false, message: 'Order not found' });
    // Authorization: owner or admin/shopkeeper
    if (String(item.user._id) !== req.user.id && !['admin', 'shopkeeper'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const item = await Order.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['admin', 'shopkeeper'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    item.status = req.body.status || item.status;
    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}


