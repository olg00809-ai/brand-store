import { useState } from 'react';
import type { Product } from '../mockData';
import API_URL from '../config/api';
console.log("PRODUCTCARD FILE LOADED");

interface Props {
  product: Product;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick }: Props) => {
  const [isFav, setIsFav] = useState(false);
  console.log('ТОВАР:', product.name);
console.log('PHOTO_FILE_IDS:', product.photo_file_ids);

  let fileId = null;
  if (product.photo_file_ids) {
    try {
      const parsed = JSON.parse(product.photo_file_ids);
      if (parsed && parsed.length > 0) {
        fileId = parsed[0];
      }
    } catch (e) {
      console.error("Ошибка парсинга фото", e);
    }
  }

  const imageSrc = fileId
  ? `${API_URL}/api/image/${fileId}`
  : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop";
    
  return (
    <div className="product-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="product-image-wrapper">
        <img src={imageSrc} alt={product.name} className="product-image" />
        
        <div className="badges">
          {product.old_price && <span className="badge sale">Скидка</span>}
        </div>

        <button 
          className={`favorite-btn ${isFav ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation(); // Чтобы клик по сердечку не открывал карточку товара
            setIsFav(!isFav);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="product-info">
        <div className="product-brand">Арт: {product.article || '—'}</div>
        <div className="product-name">{product.name}</div>
        
        <div className="price-row">
          <div className="product-price">{product.price.toLocaleString('ru-RU')} ₽</div>
          {product.old_price && (
            <div className="product-old-price">{product.old_price.toLocaleString('ru-RU')} ₽</div>
          )}
        </div>
      </div>
    </div>
  );
};