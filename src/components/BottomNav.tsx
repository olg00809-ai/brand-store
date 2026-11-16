interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav = ({ activeTab, setActiveTab }: Props) => {
  const navItems = [
    { 
      id: 'home', 
      icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" />, 
      label: 'Главная' 
    },
    { 
      id: 'search', 
      icon: (
        <>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </>
      ), 
      label: 'Поиск' 
    },
    { 
      id: 'cart', 
      icon: (
        <>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </>
      ), 
      label: 'Корзина' 
    },
    { 
      id: 'profile', 
      icon: (
        <>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </>
      ), 
      label: 'Профиль' 
    },
  ];

  return (
    <nav className="bottom-nav">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => setActiveTab(item.id)}
        >
          <svg 
            width="22" 
            height="22" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {item.icon}
          </svg>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};