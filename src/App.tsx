import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { ProductDetailPage } from './pages/ProductDetail';
import { BottomNav } from './components/BottomNav';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null); // Состояние для открытого товара

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
    }
  }, []);

  return (
    <div className="app-container">
      <main>
        {/* Если товар выбран, показываем детальную страницу, иначе вкладки */}
        {selectedProductId !== null ? (
          <ProductDetailPage 
            productId={selectedProductId} 
            onBack={() => setSelectedProductId(null)} 
          />
        ) : (
          <>
            {activeTab === 'home' && <Home onSelectProduct={setSelectedProductId} />}
            {activeTab === 'search' && <Search />}
            {activeTab === 'cart' && <Cart />}
            {activeTab === 'profile' && <Profile />}
          </>
        )}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={(tab) => {
        setSelectedProductId(null); // Сбрасываем товар при смене вкладки
        setActiveTab(tab);
      }} />
    </div>
  );
}

export default App;