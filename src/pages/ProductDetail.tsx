import { useState, useEffect } from 'react';
import type { ProductDetail } from '../mockData';
import API_URL, { apiFetch } from '../config/api';
  // Получаем ID пользователя из Telegram (или фейковый для теста в браузере)

export const ProductDetailPage = ({ productId, onBack }: { productId: number, onBack: () => void }) => {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetch(`${API_URL}/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Товар не найден');
        return res.json();
      })
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Не удалось загрузить информацию о товаре.");
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <p style={{ padding: '20px' }}>Загрузка...</p>;
  if (error || !product) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p style={{ color: 'red', marginBottom: '16px' }}>{error || 'Товар не найден'}</p>
      <button onClick={onBack} style={{ padding: '10px 20px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Вернуться назад</button>
    </div>
  );

  // Парсим картинку
  let fileId = null;
  if (product.photo_file_ids) {
    try { fileId = JSON.parse(product.photo_file_ids)[0]; } catch(e) {}
  }
  const imageSrc = fileId ? `${API_URL}/api/image/${fileId}` : "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop";

  return (
    // Увеличили отступ снизу, чтобы нижнее меню не перекрывало кнопку "Купить"
    <div style={{ paddingBottom: '120px' }}>
      
      {/* Кнопка назад */}
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#888', fontSize: '16px', marginBottom: '16px', cursor: 'pointer' }}>
        ← Назад
      </button>

      {/* Фото (теперь с пропорциями 4:5 и обрезкой) */}
      <div style={{ 
        borderRadius: '12px', 
        overflow: 'hidden', 
        marginBottom: '24px',
        width: '100%',
        aspectRatio: '4/5',
        backgroundColor: '#141414' 
      }}>
        <img 
          src={imageSrc} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      </div>

      {/* Информация */}
      <div className="product-brand" style={{ fontSize: '12px', marginBottom: '4px' }}>{product.brand_name || 'Бренд'}</div>
      <h1 style={{ fontSize: '24px', fontWeight: 400, marginBottom: '8px' }}>{product.name}</h1>
      
      <div className="price-row" style={{ marginBottom: '24px' }}>
        <span style={{ fontSize: '20px', fontWeight: 600 }}>
          {product.price ? product.price.toLocaleString('ru-RU') : '0'} ₽
        </span>
        {product.old_price && <span className="product-old-price" style={{ fontSize: '16px' }}>{product.old_price.toLocaleString('ru-RU')} ₽</span>}
      </div>

      <p style={{ color: '#aaa', lineHeight: 1.6, marginBottom: '24px' }}>{product.description || 'Описание отсутствует'}</p>

      {/* Размеры */}
      <h3 style={{ fontSize: '14px', textTransform: 'uppercase', marginBottom: '12px' }}>Размеры</h3>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {product.variants && product.variants.length > 0 ? product.variants.map(v => (
          <button 
            key={v.id}
            onClick={() => setSelectedSize(v.size)}
            style={{ 
              padding: '8px 16px', 
              background: selectedSize === v.size ? '#fff' : 'transparent', 
              color: selectedSize === v.size ? '#000' : '#fff',
              border: '1px solid #fff', 
              cursor: 'pointer',
              opacity: v.stock === 0 ? 0.3 : 1
            }}
            disabled={v.stock === 0}
          >
            {v.size}
          </button>
        )) : <span style={{ color: '#888' }}>Нет в наличии</span>}
      </div>

      {/* Кнопки действий */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
          onClick={async () => {
            if (!selectedSize) {
              alert("Пожалуйста, выберите размер!");
              return;
            }
            
            // Находим ID выбранного варианта
            const variant = product.variants.find(v => v.size === selectedSize);
            if (!variant) return;

            try {
              const res = await apiFetch('/api/cart/add', {
                 method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                    },
                body: JSON.stringify({
                   variant_id: variant.id,
                  quantity: 1
                 })
              });
              
              if (res.ok) {
                alert("Товар добавлен в корзину!");
              } else {
                alert("Ошибка при добавлении");
              }
            } catch (e) {
              console.error(e);
              alert("Сервер недоступен");
            }
          }}
          style={{ padding: '16px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          Добавить в корзину
        </button>
        <a href={`https://www.avito.ru`} target="_blank" rel="noreferrer" style={{ textAlign: 'center', padding: '16px', border: '1px solid #333', color: '#fff', borderRadius: '8px', textDecoration: 'none' }}>
          Купить на Avito
        </a>
      </div>
    </div>
  );
};
