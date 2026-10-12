import React, { useState, useEffect, useCallback } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuthModal } from './components/AuthModal';
import { AdminGateModal } from './components/AdminGateModal';
import { StoreView } from './views/StoreView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { OrderHistoryView } from './views/OrderHistoryView';
import { TrackingView } from './views/TrackingView';
import { SupportView } from './views/SupportView';
import { WishlistView } from './views/WishlistView';
import { AdminPortalView } from './views/AdminPortalView';
import { db } from './services/db';
import { Order, Product, ProductCategory, StoreViewMode } from './types';
import { MessageCircle } from 'lucide-react';

function MainAppContent() {
  const { setShowAdminGateModal } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const [currentView, setCurrentView] = useState<StoreViewMode>('catalog');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const refreshCatalog = useCallback(() => {
    const list = db.getProducts();
    setProducts(list);
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const handleBuyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setActiveOrder(order);
    setCurrentView('order_confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOrderForTracking = (order: Order) => {
    setActiveOrder(order);
    setCurrentView('order_confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: StoreViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-[#0284c7] selection:text-white">
      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (currentView !== 'catalog') {
            setCurrentView('catalog');
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'catalog') {
            setCurrentView('catalog');
          }
        }}
        allProducts={products}
        onOpenProductDetail={(prod) => setSelectedProductDetail(prod)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <StoreView
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenProductDetail={(prod) => setSelectedProductDetail(prod)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'order_confirmation' && (
          <OrderConfirmationView
            order={activeOrder}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'order_history' && (
          <OrderHistoryView
            onNavigate={handleNavigate}
            onSelectOrderForTracking={handleSelectOrderForTracking}
          />
        )}

        {currentView === 'tracking' && (
          <TrackingView
            onNavigate={handleNavigate}
            onSelectOrderForDetails={handleSelectOrderForTracking}
          />
        )}

        {currentView === 'support' && (
          <SupportView onNavigate={handleNavigate} />
        )}

        {currentView === 'wishlist' && (
          <WishlistView
            products={products}
            onNavigate={handleNavigate}
            onOpenDetail={(prod) => setSelectedProductDetail(prod)}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortalView
            onNavigate={handleNavigate}
            onRefreshCatalog={refreshCatalog}
          />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer onNavigate={handleNavigate} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProductDetail}
        onClose={() => setSelectedProductDetail(null)}
        onBuyNow={handleBuyNow}
      />

      {/* Customer Auth / Profile Modal */}
      <AuthModal />

      {/* Secure Admin Gate Passkey Modal */}
      <AdminGateModal
        onUnlockSuccess={() => {
          setCurrentView('admin');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Floating WhatsApp Quick Action Button (Pakistan Hallmark) */}
      <a
        href="https://wa.me/923467792177?text=Hello%20Easy%20Store%20Pakistan!%20I%20have%20an%20order%20inquiry."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 group transition-all hover:scale-110 cursor-pointer"
        title="WhatsApp Support Pakistan (+92 346 7792177)"
      >
        <span className="text-xl">💬</span>
        <span className="hidden sm:group-hover:inline text-xs font-bold whitespace-nowrap pr-1">
          WhatsApp Support
        </span>
      </a>

      {/* Store Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdminGate={() => setShowAdminGateModal(true)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <MainAppContent />
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
