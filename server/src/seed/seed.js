import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db.js';
import User from '../models/User.js';
import Shop from '../models/Shop.js';
import Product from '../models/Product.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
  await connectToDatabase();

  const adminEmail = 'admin@example.com';
  const customerEmail = 'customer@example.com';
  const seededAdminId = 'admin';

  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('password', 10);

  await Promise.all([
    User.deleteMany({ email: { $in: [adminEmail, customerEmail] } }),
    Shop.deleteMany({}),
    Product.deleteMany({}),
    Admin.deleteMany({ adminId: seededAdminId }),
  ]);

  const [admin, customer] = await User.create([
    { name: 'Admin', email: adminEmail, password: passwordHash, role: 'admin' },
    { name: 'Customer', email: customerEmail, password: passwordHash, role: 'customer' },
  ]);

  await Admin.create({ adminId: seededAdminId, password: adminPasswordHash });

  const shop = await Shop.create({
    name: 'Sample Kirana',
    address: '123 Market Street, Mumbai',
    phone: '9999999999',
    category: 'Groceries',
    owner: admin._id,
  });

  await Product.create([
    { name: 'Wheat Flour', price: 45, category: 'Grains', inStock: true, shop: shop._id },
    { name: 'Rice', price: 65, category: 'Grains', inStock: true, shop: shop._id },
    { name: 'Milk', price: 30, category: 'Dairy', inStock: true, shop: shop._id },
  ]);

  // eslint-disable-next-line no-console
  console.log('Seed complete: created admin and customer users');
  process.exit(0);
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});


