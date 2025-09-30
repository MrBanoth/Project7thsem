import Shop from '../models/Shop.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { buildQueryOptions } from '../services/queryBuilder.js';

export async function createShop(req, res, next) {
  try {
    const shop = await Shop.create({ ...req.body, owner: req.user.id });
    res.status(201).json({ success: true, data: shop });
  } catch (err) {
    next(err);
  }
}

export async function listShops(req, res, next) {
  try {
    const { page, limit, skip, sort, filters } = buildQueryOptions(req.query);
    const query = Shop.find(filters).populate('owner', '-password');
    const [items, total] = await Promise.all([
      query.sort(sort).skip(skip).limit(limit),
      Shop.countDocuments(filters),
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total } });
  } catch (err) {
    next(err);
  }
}

export async function getShop(req, res, next) {
  try {
    const item = await Shop.findById(req.params.id).populate('owner', '-password');
    if (!item) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateShop(req, res, next) {
  try {
    const item = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteShop(req, res, next) {
  try {
    const item = await Shop.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Shop not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}

export async function getShopAnalytics(req, res, next) {
  try {
    const { id } = req.params;
    const range = String(req.query.range || '7days');
    const days = range === '90days' ? 90 : range === '30days' ? 30 : 7;
    const since = new Date();
    since.setDate(since.getDate() - days);

    const shopId = id;
    // Aggregate orders for revenue and daily series
    const ordersAgg = await Order.aggregate([
      { $match: { shop: new (await import('mongoose')).default.Types.ObjectId(shopId), createdAt: { $gte: since } } },
      {
        $group: {
          _id: {
            y: { $year: '$createdAt' },
            m: { $month: '$createdAt' },
            d: { $dayOfMonth: '$createdAt' },
          },
          dailyRevenue: { $sum: '$total' },
          dailyOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          date: {
            $dateFromParts: { year: '$_id.y', month: '$_id.m', day: '$_id.d' },
          },
          dailyRevenue: 1,
          dailyOrders: 1,
          _id: 0,
        },
      },
      { $sort: { date: 1 } },
    ]);

    const totalsAgg = await Order.aggregate([
      { $match: { shop: new (await import('mongoose')).default.Types.ObjectId(shopId), createdAt: { $gte: since } } },
      {
        $group: {
          _id: null,
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
    ]);

    const totals = totalsAgg[0] || { revenue: 0, orders: 0 };

    // Category distribution from products in this shop
    const categoryAgg = await Product.aggregate([
      { $match: { shop: new (await import('mongoose')).default.Types.ObjectId(shopId) } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', value: '$count' } },
      { $sort: { value: -1 } },
      { $limit: 8 },
    ]);

    res.json({
      success: true,
      data: {
        totals: { revenue: totals.revenue || 0, orders: totals.orders || 0 },
        daily: ordersAgg.map((d) => ({ name: d.date.toISOString().slice(5, 10), sales: d.dailyRevenue, orders: d.dailyOrders })),
        categories: categoryAgg.map((c, idx) => ({ ...c })),
      },
    });
  } catch (err) {
    next(err);
  }
}


