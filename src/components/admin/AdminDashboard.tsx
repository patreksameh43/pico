import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  EyeOff,
  Filter,
  Layers,
  Lock,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Truck,
  Users,
  X,
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import {
  Category,
  FrameMaterial,
  FrameShape,
  Gender,
  Order,
  OrderStatus,
  Product,
  SiteSettings,
} from '../../types';
import { EyewearArtwork } from '../common/EyewearArtwork';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const {
    products,
    categories,
    settings,
    adminLoggedIn,
    adminLogin,
    adminLogout,
    refreshData,
  } = useShop();

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('admin@ramaoptics.com');
  const [loginPassword, setLoginPassword] = useState('rama2026');
  const [loginError, setLoginError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'analytics' | 'products' | 'categories' | 'orders' | 'customization'
  >('analytics');

  // Real data fetched from server
  const [serverOrders, setServerOrders] = useState<Order[]>([]);
  const [analyticsStats, setAnalyticsStats] = useState<any>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Search & Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Product Edit/Add Modal
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category Edit/Add Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Website Settings Form
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({ ...settings });
  const [settingsSaveMsg, setSettingsSaveMsg] = useState('');

  // Fetch orders and analytics
  const fetchAdminData = async () => {
    setLoadingOrders(true);
    try {
      const [ordersRes, analyticsRes] = await Promise.all([
        fetch('/api/orders').catch(() => null),
        fetch('/api/analytics').catch(() => null),
      ]);
      if (ordersRes && ordersRes.ok) {
        const oData = await ordersRes.json();
        setServerOrders(oData.orders || []);
      }
      if (analyticsRes && analyticsRes.ok) {
        const aData = await analyticsRes.json();
        setAnalyticsStats(aData.stats || null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (adminLoggedIn) {
      fetchAdminData();
    }
  }, [adminLoggedIn]);

  useEffect(() => {
    setSettingsForm({ ...settings });
  }, [settings]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setAuthLoading(true);
    const res = await adminLogin(loginEmail, loginPassword);
    setAuthLoading(false);
    if (!res.success) {
      setLoginError(res.message || 'Invalid administrator credentials');
    }
  };

  // Quick 1-click test fill
  const handleQuickTestLogin = () => {
    setLoginEmail('admin@ramaoptics.com');
    setLoginPassword('rama2026');
  };

  // Change Order Status
  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setServerOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this eyewear model?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      refreshData();
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        setSettingsSaveMsg('✓ Storefront customization saved successfully!');
        refreshData();
        setTimeout(() => setSettingsSaveMsg(''), 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // If not logged in, show luxury login gateway
  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-fadeIn">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <span className="text-xs uppercase tracking-widest text-[#C6A15B] font-semibold">
              RAMA OPTICS Concierge
            </span>
            <h2 className="mt-2 text-3xl font-serif font-bold text-[#222222]">
              Store Director Portal
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Authenticated management for products, lens matrices, and fulfillment.
            </p>
          </div>

          <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-xl rounded-2xl border border-[#E7E5E0]">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-lg">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Security Passkey
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                />
              </div>

              {/* Demo Credentials Helper */}
              <div className="p-3 bg-[#FAF8F4] border border-[#EBE7DF] rounded-lg text-[11px] text-stone-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-stone-800">Test Credentials:</span>
                  <span>admin@ramaoptics.com / rama2026</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickTestLogin}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#C6A15B] text-white rounded hover:bg-[#B38F48] transition-colors"
                >
                  Auto-Fill
                </button>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{authLoading ? 'Verifying...' : 'Access Dashboard'}</span>
              </button>

              <button
                type="button"
                onClick={onBackToStore}
                className="w-full py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 text-center"
              >
                ← Return to RAMA OPTICS Store
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = serverOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.customer.phoneNumber.includes(orderSearch) ||
      order.customer.city.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus =
      orderStatusFilter === 'all' || order.status.toLowerCase() === orderStatusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-[#E7E5E0] sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-[#222222] tracking-tight">
              RAMA OPTICS
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/15 px-2 py-0.5 rounded">
              Director Dashboard
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'categories', label: 'Categories', icon: Layers },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
              { id: 'customization', label: 'Customization', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            title="Refresh database records"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onBackToStore}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
          <button
            onClick={adminLogout}
            className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* TAB 1: ANALYTICS & DASHBOARD STATS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#222222]">Store Overview</h1>
              <p className="text-xs text-stone-500">
                Key performance metrics, live order volume, and optical inventory status.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-[#E7E5E0] shadow-sm">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                  <span>Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#C6A15B]" />
                </div>
                <p className="text-2xl font-serif font-bold text-[#222222]">
                  ${analyticsStats?.totalRevenue ?? 578}
                </p>
                <span className="text-[11px] text-emerald-700 font-medium">Real-time gross volume</span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#E7E5E0] shadow-sm">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                  <span>Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-stone-600" />
                </div>
                <p className="text-2xl font-serif font-bold text-[#222222]">
                  {serverOrders.length}
                </p>
                <span className="text-[11px] text-stone-500 font-medium">Placed orders</span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#E7E5E0] shadow-sm">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                  <span>Pending Fulfillment</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-2xl font-serif font-bold text-amber-700">
                  {serverOrders.filter((o) => o.status === 'Pending').length}
                </p>
                <span className="text-[11px] text-amber-600 font-medium">Awaiting lab review</span>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#E7E5E0] shadow-sm">
                <div className="flex items-center justify-between text-stone-500 text-xs mb-2">
                  <span>Active Catalog Frames</span>
                  <Package className="w-4 h-4 text-[#C6A15B]" />
                </div>
                <p className="text-2xl font-serif font-bold text-[#222222]">{products.length}</p>
                <span className="text-[11px] text-stone-500 font-medium">Across {categories.length} categories</span>
              </div>
            </div>

            {/* Recent Orders Snapshot */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-[#222222]">Latest Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-[#C6A15B] hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {serverOrders.slice(0, 4).map((o) => (
                  <div key={o.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-800">{o.id} · {o.customer.fullName}</p>
                      <p className="text-stone-500 text-[11px]">
                        {o.items.length} items · {o.paymentMethod} · {new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900">${o.total}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-stone-100 text-stone-700">
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#222222]">Product Inventory</h1>
                <p className="text-xs text-stone-500">
                  Manage frame specifications, titanium materials, pricing, and stock levels.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Frame</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-[#E7E5E0] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] border-b border-[#E7E5E0] text-stone-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3.5 px-4">Frame</th>
                      <th className="py-3.5 px-4">Shape & Material</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-9 rounded border border-stone-200 overflow-hidden shrink-0 bg-[#FAF9F5]">
                              <EyewearArtwork
                                shape={p.frameShape}
                                color={p.colors[0]}
                                isOptical={p.isOptical}
                                customImageUrl={p.customImageUrl}
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900">{p.name}</p>
                              <p className="text-[10px] text-[#C6A15B] uppercase tracking-wider">
                                {p.brand}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {p.frameShape} · {p.frameMaterial}
                        </td>
                        <td className="py-3.5 px-4 text-stone-600">
                          {categories.find((c) => c.id === p.categoryId)?.name || p.categoryId}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          ${p.price}
                          {p.discountPercent ? (
                            <span className="text-[10px] text-[#C6A15B] ml-1.5">
                              (-{p.discountPercent}%)
                            </span>
                          ) : null}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              p.inStock
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {p.inStock ? `${p.stockQuantity} in stock` : 'Out of stock'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductModalOpen(true);
                              }}
                              className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-serif font-bold text-[#222222]">Categories</h1>
                <p className="text-xs text-stone-500">
                  Organize store taxonomy, descriptions, and catalog visibility.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryModalOpen(true);
                }}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-xl flex items-center gap-2 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-5 bg-white rounded-2xl border border-[#E7E5E0] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C6A15B]">
                        {c.slug}
                      </span>
                      <span className="text-xs text-stone-400">{c.itemCount} items</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#222222]">{c.name}</h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-4">
                    <span className="text-[10px] text-stone-400 font-mono">ID: {c.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(c);
                          setCategoryModalOpen(true);
                        }}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded"
                        title="Edit category"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#222222]">Customer Orders</h1>
              <p className="text-xs text-stone-500">
                Track prescriptions, customer shipping destinations, and update fulfillment stages.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-[#E7E5E0]">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C6A15B]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-stone-400" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-[#C6A15B]"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#E7E5E0] text-stone-400 text-xs">
                  No orders matching the specified filter criteria.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-6 bg-white rounded-2xl border border-[#E7E5E0] shadow-sm space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#222222]">
                            {order.id}
                          </span>
                          <span className="text-stone-300">·</span>
                          <span className="text-xs text-stone-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Recipient: <strong className="text-stone-900">{order.customer.fullName}</strong> ({order.customer.phoneNumber})
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-stone-500 font-medium">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-stone-200 bg-[#FAF9F6] text-stone-800 focus:outline-none focus:border-[#C6A15B]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Destination & Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600 p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE7DF]">
                      <div>
                        <span className="font-semibold text-stone-800 block mb-0.5">
                          Delivery Destination
                        </span>
                        <p>{order.customer.deliveryAddress}, {order.customer.city}</p>
                        {order.customer.email && <p>Email: {order.customer.email}</p>}
                      </div>
                      <div>
                        <span className="font-semibold text-stone-800 block mb-0.5">
                          Payment & Instructions
                        </span>
                        <p>Method: {order.paymentMethod}</p>
                        {order.customer.additionalNotes && (
                          <p className="text-stone-500 italic mt-0.5">
                            "{order.customer.additionalNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Configured Eyewear ({order.items.length})
                      </p>
                      <div className="divide-y divide-stone-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2.5 flex items-start justify-between text-xs">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-9 rounded border border-stone-200 overflow-hidden shrink-0 bg-[#FAF9F5]">
                                <EyewearArtwork
                                  shape={item.product.frameShape}
                                  color={item.selectedColor}
                                  isOptical={item.product.isOptical}
                                  customImageUrl={item.product.customImageUrl}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-stone-900">
                                  {item.quantity}x {item.product.name} ({item.selectedColor.name})
                                </p>
                                <p className="text-stone-500 text-[11px]">
                                  Lens: <strong className="text-[#C6A15B]">{item.selectedLens.name}</strong>
                                </p>

                                {item.prescriptionDetails?.odSphere && (
                                  <div className="text-[10px] text-stone-600 bg-white p-1.5 rounded border border-stone-200 mt-1">
                                    <span>OD: SPH {item.prescriptionDetails.odSphere} CYL {item.prescriptionDetails.odCyl || '0'} AX {item.prescriptionDetails.odAxis || '0'}</span>
                                    <span className="mx-2">|</span>
                                    <span>OS: SPH {item.prescriptionDetails.osSphere} CYL {item.prescriptionDetails.osCyl || '0'} AX {item.prescriptionDetails.osAxis || '0'}</span>
                                    <span className="mx-2">|</span>
                                    <span>PD: {item.prescriptionDetails.pd}mm</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-stone-900">
                              ${item.itemUnitPrice * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex justify-between items-center pt-3 border-t border-stone-100 text-xs">
                      <div className="text-stone-500">
                        Subtotal: ${order.subtotal} {order.discountAmount > 0 && `(Discount -$${order.discountAmount})`} · Delivery: ${order.shippingFee}
                      </div>
                      <div className="text-base font-serif font-bold text-stone-900">
                        Total: ${order.total}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: WEBSITE CUSTOMIZATION */}
        {activeTab === 'customization' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#222222]">Storefront Customization</h1>
              <p className="text-xs text-stone-500">
                Update homepage headlines, promotional banners, shipping thresholds, and concierge contact channels.
              </p>
            </div>

            {settingsSaveMsg && (
              <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium">
                {settingsSaveMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E7E5E0] space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, brandName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Homepage Hero Headline
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroHeadline}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Homepage Subtitle
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroSubtitle}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Top Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementBanner}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, announcementBanner: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Free Shipping Threshold ($)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        freeShippingThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Standard Shipping Fee ($)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShippingFee}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        standardShippingFee: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Concierge WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactWhatsApp}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactWhatsApp: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Concierge Phone
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, contactPhone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Boutique Physical Address
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeAddress}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeAddress: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-lg focus:border-[#C6A15B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end">
                <button
                  type="submit"
                  className="py-2.5 px-6 text-xs font-semibold text-white bg-[#C6A15B] hover:bg-[#B38F48] rounded-xl shadow transition-colors"
                >
                  Save Storefront Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Product Add / Edit Modal */}
      {productModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setProductModalOpen(false)}
          onSuccess={() => {
            setProductModalOpen(false);
            refreshData();
          }}
        />
      )}

      {/* Category Add / Edit Modal */}
      {categoryModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setCategoryModalOpen(false)}
          onSuccess={() => {
            setCategoryModalOpen(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

// Sub-Modal: Add/Edit Product
const ProductFormModal: React.FC<{
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ product, categories, onClose, onSuccess }) => {
  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || 'RAMA Atelier');
  const [description, setDescription] = useState(product?.description || '');
  const [categoryId, setCategoryId] = useState(product?.categoryId || categories[0]?.id || 'cat-optical');
  const [price, setPrice] = useState(product?.price || 240);
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 280);
  const [stockQuantity, setStockQuantity] = useState(product?.stockQuantity || 15);
  const [frameShape, setFrameShape] = useState<FrameShape>(product?.frameShape || 'Round');
  const [frameMaterial, setFrameMaterial] = useState<FrameMaterial>(
    product?.frameMaterial || 'Japanese Titanium'
  );
  const [gender, setGender] = useState<Gender>(product?.gender || 'Unisex');
  const [isOptical, setIsOptical] = useState(product?.isOptical ?? true);
  const [customImageUrl, setCustomImageUrl] = useState(product?.customImageUrl || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      brand,
      description,
      categoryId,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      discountPercent:
        originalPrice && originalPrice > price
          ? Math.round(((originalPrice - price) / originalPrice) * 100)
          : undefined,
      stockQuantity: Number(stockQuantity),
      inStock: Number(stockQuantity) > 0,
      frameShape,
      frameMaterial,
      gender,
      isOptical,
      customImageUrl: customImageUrl.trim() || undefined,
      colors: product?.colors || [
        { name: 'Champagne Gold', hex: '#C6A15B' },
        { name: 'Onyx Black', hex: '#1C1C1E' },
      ],
      dimensions: product?.dimensions || { lensWidth: 51, bridgeWidth: 19, templeLength: 145 },
      weight: product?.weight || '18g',
    };

    try {
      if (product) {
        await fetch(`/api/products/${product.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-[#E7E5E0]">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            {product ? 'Edit Eyewear Model' : 'Add New Eyewear Model'}
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Model Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Brand / Studio</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Price ($)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Stock Pairs</label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Frame Shape</label>
              <select
                value={frameShape}
                onChange={(e) => setFrameShape(e.target.value as FrameShape)}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              >
                <option value="Round">Round</option>
                <option value="Square">Square</option>
                <option value="Rectangle">Rectangle</option>
                <option value="Aviator">Aviator</option>
                <option value="Cat Eye">Cat Eye</option>
                <option value="Oval">Oval</option>
                <option value="Geometric">Geometric</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Frame Material</label>
              <select
                value={frameMaterial}
                onChange={(e) => setFrameMaterial(e.target.value as FrameMaterial)}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              >
                <option value="Japanese Titanium">Japanese Titanium</option>
                <option value="Italian Acetate">Italian Acetate</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Carbon Fiber">Carbon Fiber</option>
                <option value="TR90 Ultem">TR90 Ultem</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
              >
                <option value="Unisex">Unisex</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">
              Custom Image URL (Optional)
            </label>
            <input
              type="text"
              placeholder="https://... (Leave blank to use vector CAD visualizer)"
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isOpticalCheck"
              checked={isOptical}
              onChange={(e) => setIsOptical(e.target.checked)}
              className="rounded text-[#C6A15B] focus:ring-[#C6A15B]"
            />
            <label htmlFor="isOpticalCheck" className="font-medium text-stone-700">
              Optical Frame (Offers prescription lens customization)
            </label>
          </div>

          <div className="pt-4 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#C6A15B] text-white font-semibold rounded-lg hover:bg-[#B38F48]"
            >
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Sub-Modal: Add/Edit Category
const CategoryFormModal: React.FC<{
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState(category?.name || '');
  const [slug, setSlug] = useState(category?.slug || '');
  const [description, setDescription] = useState(category?.description || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description,
      iconName: category?.iconName || 'Glasses',
    };

    try {
      if (category) {
        await fetch(`/api/categories/${category.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      onSuccess();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4 border border-[#E7E5E0]">
        <div className="flex items-center justify-between border-b pb-3">
          <h3 className="font-serif font-bold text-lg text-stone-900">
            {category ? 'Edit Category' : 'Add Category'}
          </h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Slug URL</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. titanium-optical"
              className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Description</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:border-[#C6A15B] focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#C6A15B] text-white font-semibold rounded-lg hover:bg-[#B38F48]"
            >
              {loading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
