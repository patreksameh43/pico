import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_SETTINGS,
  OPTICAL_LENS_OPTIONS,
  SUNGLASSES_LENS_OPTIONS,
} from './src/data/mockData';
import { Category, Order, Product, SiteSettings } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-Memory Database store with persistent mutation across session
let products: Product[] = [...INITIAL_PRODUCTS];
let categories: Category[] = [...INITIAL_CATEGORIES];
let siteSettings: SiteSettings = { ...INITIAL_SITE_SETTINGS };
let orders: Order[] = [
  {
    id: 'RAMA-2026-1042',
    customer: {
      fullName: 'Alexander Wright',
      phoneNumber: '+1 (212) 555-0198',
      email: 'a.wright@manhattan.law',
      city: 'New York',
      deliveryAddress: '785 5th Ave, Apt 14B, New York, NY 10022',
      additionalNotes: 'Please ring concierge if not home.',
    },
    items: [
      {
        id: 'item-demo-1',
        product: INITIAL_PRODUCTS[0],
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        quantity: 1,
        selectedLens: OPTICAL_LENS_OPTIONS[2], // Blue Cut Lenses
        prescriptionDetails: {
          prescriptionType: 'single-vision',
          lensIndex: '1.67 Ultra Thin',
          odSphere: '-2.25',
          odCyl: '-0.50',
          odAxis: '180',
          osSphere: '-2.00',
          osCyl: '-0.25',
          osAxis: '175',
          pd: '63',
          notes: 'Standard anti-fatigue prescription',
        },
        itemUnitPrice: 245 + 45,
      },
    ],
    subtotal: 290,
    discountAmount: 0,
    shippingFee: 0,
    total: 290,
    paymentMethod: 'Cash on Delivery',
    status: 'Processing',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'RAMA-2026-1043',
    customer: {
      fullName: 'Sophia Kensington',
      phoneNumber: '+1 (310) 555-8821',
      email: 'sophia.k@beverlyhills.com',
      city: 'Los Angeles',
      deliveryAddress: '9420 Wilshire Blvd, Beverly Hills, CA 90212',
      additionalNotes: 'Luxury gift box requested.',
    },
    items: [
      {
        id: 'item-demo-2',
        product: INITIAL_PRODUCTS[1], // Sovereign Aviator 1978
        selectedColor: INITIAL_PRODUCTS[1].colors[0],
        quantity: 1,
        selectedLens: SUNGLASSES_LENS_OPTIONS[1], // Polarized
        itemUnitPrice: 280 + 40,
      },
    ],
    subtotal: 320,
    discountAmount: 32,
    appliedPromoCode: 'WELCOME10',
    shippingFee: 0,
    total: 288,
    paymentMethod: 'Cash on Delivery',
    status: 'Confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '10mb' }));

  // =====================
  // API ROUTES
  // =====================

  // 1. PRODUCTS
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, shape, material, gender, inStock, sort } = req.query;
    let filtered = [...products];

    if (category && category !== 'all') {
      filtered = filtered.filter(
        (p) => p.categoryId === category || p.brand.toLowerCase() === String(category).toLowerCase()
      );
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.frameShape.toLowerCase().includes(q) ||
          p.frameMaterial.toLowerCase().includes(q)
      );
    }

    if (shape) {
      const shapes = String(shape).split(',');
      filtered = filtered.filter((p) => shapes.includes(p.frameShape));
    }

    if (material) {
      const materials = String(material).split(',');
      filtered = filtered.filter((p) => materials.includes(p.frameMaterial));
    }

    if (gender) {
      const genders = String(gender).split(',');
      filtered = filtered.filter((p) => genders.includes(p.gender) || p.gender === 'Unisex');
    }

    if (inStock === 'true') {
      filtered = filtered.filter((p) => p.inStock && p.stockQuantity > 0);
    }

    // Sort
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sort === 'best-selling') {
      filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    res.json({ success: true, count: filtered.length, products: filtered });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  });

  // Admin Add Product
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: req.body.id || `rama-${Date.now().toString(36)}`,
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 1,
      inStock: req.body.inStock !== false,
      stockQuantity: req.body.stockQuantity || 10,
    };
    products.unshift(newProduct);
    res.status(201).json({ success: true, product: newProduct });
  });

  // Admin Update Product
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    products[index] = { ...products[index], ...req.body, id: req.params.id };
    res.json({ success: true, product: products[index] });
  });

  // Admin Delete Product
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const initialLen = products.length;
    products = products.filter((p) => p.id !== req.params.id);
    if (products.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  });

  // 2. CATEGORIES
  app.get('/api/categories', (_req: Request, res: Response) => {
    res.json({ success: true, categories });
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    const newCat: Category = {
      ...req.body,
      id: req.body.id || `cat-${Date.now().toString(36)}`,
      itemCount: 0,
      visible: true,
    };
    categories.push(newCat);
    res.status(201).json({ success: true, category: newCat });
  });

  app.put('/api/categories/:id', (req: Request, res: Response) => {
    const idx = categories.findIndex((c) => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Category not found' });
    categories[idx] = { ...categories[idx], ...req.body, id: req.params.id };
    res.json({ success: true, category: categories[idx] });
  });

  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    categories = categories.filter((c) => c.id !== req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  });

  // 3. ORDERS
  app.get('/api/orders', (_req: Request, res: Response) => {
    res.json({ success: true, count: orders.length, orders });
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { customer, items, subtotal, discountAmount, appliedPromoCode, shippingFee, total, paymentMethod } =
      req.body;

    if (!customer?.fullName || !customer?.phoneNumber || !customer?.deliveryAddress || !items?.length) {
      return res.status(400).json({ success: false, message: 'Please provide all required checkout fields.' });
    }

    const orderNumber = `RAMA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderNumber,
      customer,
      items,
      subtotal: subtotal || 0,
      discountAmount: discountAmount || 0,
      appliedPromoCode,
      shippingFee: shippingFee || 0,
      total: total || 0,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    // Decrement stock in database
    items.forEach((item: any) => {
      const prod = products.find((p) => p.id === item.product.id);
      if (prod && prod.stockQuantity) {
        prod.stockQuantity = Math.max(0, prod.stockQuantity - item.quantity);
        if (prod.stockQuantity === 0) prod.inStock = false;
      }
    });

    res.status(201).json({ success: true, order: newOrder });
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status } = req.body;
    const order = orders.find((o) => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.status = status;
    order.updatedAt = new Date().toISOString();
    res.json({ success: true, order });
  });

  // 4. SITE SETTINGS
  app.get('/api/settings', (_req: Request, res: Response) => {
    res.json({ success: true, settings: siteSettings });
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    siteSettings = { ...siteSettings, ...req.body };
    res.json({ success: true, settings: siteSettings });
  });

  // 5. ADMIN AUTH
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    // Standard secure credentials for RAMA OPTICS store management
    if (email === 'admin@ramaoptics.com' && password === 'rama2026') {
      const token = `rama-admin-session-${Date.now()}`;
      return res.json({
        success: true,
        token,
        user: { name: 'Store Director', email: 'admin@ramaoptics.com', role: 'admin' },
      });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
  });

  // 6. DASHBOARD ANALYTICS
  app.get('/api/analytics', (_req: Request, res: Response) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
    const totalProductsCount = products.length;

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalProductsCount,
      },
      recentOrders: orders.slice(0, 5),
    });
  });

  // =====================
  // VITE DEV / PRODUCTION
  // =====================
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RAMA OPTICS Luxury Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
