
import { useState, useEffect } from 'react';
import API_URL from '../config/api';

export const Cart = () => {
  const [cart, setCart] = useState<{ items: any[], total: number }>({
    items: [],
    total: 0
  });

  const [loading, setLoading] = useState(true);
  const [isCheckout, setIsCheckout] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<number | null>(null);

  // Поля формы
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 123456789;

  // Загрузка корзины
  const loadCart = () => {
    fetch(`${API_URL}/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  // Оформление заказа
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !city || !address) {
      alert('Заполните все поля!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: userId,
          customer_name: name,
          phone: phone,
          city: city,
          address: address
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessOrderId(data.order_id);
        setCart({ items: [], total: 0 });
      } else {
        alert(data.detail || 'Ошибка при создании заказа');
      }
    } catch (err) {
      alert('Сервер недоступен');
    }
  };

  if (loading) {
    return <p className="page-title">Загрузка...</p>;
  }

  // Если заказ успешно создан
  if (successOrderId) {
    return (
      <div
        style={{
          textAlign: 'center',
          paddingTop: '40px',
          paddingBottom: '120px'
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          ✅
        </div>

        <h1 style={{ fontSize: '20px', marginBottom: '8px' }}>
          Заказ оформлен!
        </h1>

        <p style={{ color: '#888', marginBottom: '24px' }}>
          Номер вашего заказа: #{successOrderId}
        </p>

        <button
          onClick={() => {
            setSuccessOrderId(null);
            setIsCheckout(false);
          }}
          style={{
            padding: '12px 24px',
            background: '#fff',
            color: '#000',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 600
          }}
        >
          Вернуться в магазин
        </button>
      </div>
    );
  }

  // Пустая корзина
  if (cart.items.length === 0 && !isCheckout) {
    return (
      <div style={{ paddingBottom: '120px' }}>
        <h1 className="page-title">Корзина</h1>

        <p style={{ textAlign: 'center', color: '#888' }}>
          Ваша корзина пуста
        </p>
      </div>
    );
  }

  // Форма оформления заказа
  if (isCheckout) {
    return (
      <div style={{ paddingBottom: '120px' }}>
        <button
          onClick={() => setIsCheckout(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            marginBottom: '16px',
            cursor: 'pointer'
          }}
        >
          ← Назад в корзину
        </button>

        <h1 className="page-title">Оформление заказа</h1>

        <form
          onSubmit={handleCheckout}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <input
            required
            placeholder="Ваше имя"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              padding: '14px',
              background: '#141414',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '8px'
            }}
          />

          <input
            required
            placeholder="Телефон"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={{
              padding: '14px',
              background: '#141414',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '8px'
            }}
          />

          <input
            required
            placeholder="Город"
            value={city}
            onChange={e => setCity(e.target.value)}
            style={{
              padding: '14px',
              background: '#141414',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '8px'
            }}
          />

          <input
            required
            placeholder="Адрес (или пункт выдачи)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            style={{
              padding: '14px',
              background: '#141414',
              border: '1px solid #333',
              color: '#fff',
              borderRadius: '8px'
            }}
          />

          <div
            style={{
              background: '#141414',
              padding: '16px',
              borderRadius: '8px',
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>К оплате:</span>
            <b>{cart.total.toLocaleString('ru-RU')} ₽</b>
          </div>

          <button
            type="submit"
            style={{
              padding: '16px',
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              marginTop: '12px',
              cursor: 'pointer'
            }}
          >
            Подтвердить заказ
          </button>
        </form>
      </div>
    );
  }

  // Просмотр корзины
  return (
    <div style={{ paddingBottom: '120px' }}>
      <h1 className="page-title">Корзина</h1>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {cart.items.map(item => {
          const imgSrc = item.file_id
            ? `${API_URL}/api/image/${item.file_id}`
            : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200&auto=format&fit=crop';

          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                gap: '16px',
                background: '#141414',
                padding: '12px',
                borderRadius: '12px'
              }}
            >
              <img
                src={imgSrc}
                alt={item.product_name}
                style={{
                  width: '80px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      margin: '0 0 4px 0'
                    }}
                  >
                    {item.product_name}
                  </h4>

                  <p
                    style={{
                      fontSize: '12px',
                      color: '#888',
                      margin: 0
                    }}
                  >
                    Размер: {item.size} | Кол-во: {item.quantity}
                  </p>
                </div>

                <p
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    margin: 0
                  }}
                >
                  {item.price.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          background: '#141414',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '16px', color: '#888' }}>
          Итого:
        </span>

        <span style={{ fontSize: '20px', fontWeight: 600 }}>
          {cart.total.toLocaleString('ru-RU')} ₽
        </span>
      </div>

      <button
        onClick={() => {
          console.log("Кнопка 'Перейти к оформлению' нажата!");
          setIsCheckout(true);
        }}
        style={{
          width: '100%',
          padding: '16px',
          background: '#fff',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 600,
          marginTop: '16px',
          cursor: 'pointer',
          position: 'relative',
          zIndex: 10
        }}
      >
        Перейти к оформлению
      </button>
    </div>
  );
};
