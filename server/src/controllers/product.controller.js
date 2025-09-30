import Product from '../models/Product.js';
import { buildQueryOptions } from '../services/queryBuilder.js';

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create({ ...req.body });
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
}

export async function listProducts(req, res, next) {
  try {
    const { page, limit, skip, sort, filters } = buildQueryOptions(req.query);
    const query = Product.find(filters).populate('shop');
    const [items, total] = await Promise.all([
      query.sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filters),
    ]);
    res.json({ success: true, data: items, pagination: { page, limit, total } });
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const item = await Product.findById(req.params.id).populate('shop');
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const item = await Product.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
}


