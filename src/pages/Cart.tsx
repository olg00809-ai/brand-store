
import { useEffect, useState } from 'react';
import API_URL, { apiFetch } from '../config/api';

interface CartItem {
  id: number;
  product_name: string;
  size: string;
  price: number;
  quantity: number;
  file_id: string | null;
}

interface CartData {
  items: CartItem[];
  total: number;
}

export const Cart = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [success, setSuccess] = useState('');

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ru-RU').format(price) + ' ₽';

  const loadCart = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await apiFetch('/api/cart');

      if (!response.ok) {
        throw new Error(`Ошибка загрузки корзины: ${response.status}`);
      }

      const data: CartData = await response.json();

      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(Number(data.total) || 0);
    } catch (err) {
      console.error('Cart loading error:', err);
      setError('Не удалось загрузить корзину. Попробуйте обновить страницу.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const createOrder = async () => {
    try {
      setOrdering(true);
      setError('');
      setSuccess('');

      const response = await apiFetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Не удалось оформить заказ');
      }

      setItems([]);
      setTotal(0);
      setSuccess(`Заказ №${data.order_id} успешно создан!`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Ошибка оформления заказа'
      );
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#aaa' }}>
        Загрузка корзины...
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 30 }}>
      <h1 className="page-title">Корзина</h1>

      {success && (
        <div style={{
          padding: 16,
          marginBottom: 20,
          background: '#17251b',
          color: '#a5e6b5',
          textAlign: 'center',
          borderRadius: 6
        }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{
          padding: 16,
          marginBottom: 20,
          background: '#301818',
          color: '#ffaaaa',
          textAlign: 'center',
          borderRadius: 6
        }}>
          {error}
          <button
            onClick={loadCart}
            style={{
              display: 'block',
              margin: '12px auto 0',
              padding: '8px 18px',
              background: '#fff',
              color: '#000',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Повторить
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#888'
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>♧</div>
          <p style={{ fontSize: 15 }}>Ваша корзина пуста</p>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Добавьте товары из каталога
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}>
            {items.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  paddingBottom: 16,
                  borderBottom: '1px solid #292929'
                }}
              >
                {item.file_id ? (
                  <img
                    src={`${API_URL}/api/image/${encodeURIComponent(item.file_id)}`}
                    alt={item.product_name}
                    style={{
                      width: 105,
                      height: 130,
                      objectFit: 'cover',
                      background: '#171717',
                      borderRadius: 4
                    }}
                  />
                ) : (
                  <div style={{
                    width: 105,
                    height: 130,
                    background: '#171717',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontSize: 12
                  }}>
                    Нет фото
                  </div>
                )}

                <div style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{
                      fontSize: 14,
                      color: '#fff',
                      marginBottom: 10
                    }}>
                      {item.product_name}
                    </div>

                    <div style={{ fontSize: 12, color: '#888' }}>
                      Размер: {item.size}
                    </div>

                    <div style={{
                      fontSize: 12,
                      color: '#888',
                      marginTop: 6
                    }}>
                      Количество: {item.quantity}
                    </div>
                  </div>

                  <div style={{
                    fontSize: 15,
                    color: '#fff'
                  }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '1px solid #333'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 22
            }}>
              <span style={{ color: '#aaa', fontSize: 13 }}>
                Итого
              </span>

              <span style={{
                color: '#fff',
                fontSize: 21
              }}>
                {formatPrice(total)}
              </span>
            </div>

            <button
              onClick={createOrder}
              disabled={ordering || items.length === 0}
              style={{
                width: '100%',
                padding: 16,
                background: '#fff',
                color: '#000',
                border: 'none',
                fontSize: 12,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                cursor: ordering ? 'wait' : 'pointer',
                opacity: ordering ? 0.6 : 1
              }}
            >
              {ordering ? 'Оформляем...' : 'Оформить заказ'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
