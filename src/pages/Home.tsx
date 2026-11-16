import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../mockData';
import API_URL from '../config/api';

interface Props {
  onSelectProduct: (id: number) => void;
}

export const Home = ({ onSelectProduct }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('Ошибка при загрузке');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Не удалось загрузить товары.');
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="header">
        <span>BRAND STORE</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      
      <div style={{ 
        background: 'linear-gradient(45deg, #111, #222)', 
        padding: '40px 20px', 
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '32px',
        border: '1px solid #222'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: 300, letterSpacing: '2px' }}>NEW COLLECTION</h1>
        <p style={{ color: '#888', fontSize: '11px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>Exclusive Brands</p>
      </div>

      <h2 style={{ fontSize: '12px', fontWeight: 400, letterSpacing: '2px', color: '#888', textTransform: 'uppercase' }}>Популярное</h2>
      
      {isLoading && <p style={{ color: '#888', marginTop: '20px' }}>Загрузка...</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      
      <div className="product-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => onSelectProduct(product.id)} // <-- Передаем клик
          />
        ))}
      </div>
    </div>
  );
};