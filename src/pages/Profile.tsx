export const Profile = () => (
  <div>
    <h1 className="page-title">Профиль</h1>
    <div style={{ background: '#141414', padding: '32px 24px', borderRadius: '12px', textAlign: 'center', border: '1px solid #222' }}>
      
      {/* Монохромная SVG-иконка профиля */}
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#888" 
        strokeWidth="1" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        style={{ marginBottom: '16px' }}
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>

      <p style={{ fontWeight: 400, letterSpacing: '1px', color: '#fff' }}>ПОЛЬЗОВАТЕЛЬ TELEGRAM</p>
      <p style={{ color: '#666', fontSize: '11px', marginTop: '8px', textTransform: 'uppercase' }}>Авторизация через Mini App</p>
    </div>
  </div>
);