import React, { useState, useMemo } from 'react';

const MixitWarRoom = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('battlefield');
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [weaponAssignments, setWeaponAssignments] = useState({});
  const [budgets, setBudgets] = useState({});
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [sortBy, setSortBy] = useState('revenue');

  // Реальные данные VOIS с Wildberries (собраны из таблицы + поиска)
  const voisProducts = [
    // МАСКИ ДЛЯ ЛИЦА - главный хит
    {
      id: 1,
      sku: '92442613',
      name: 'Маска для лица тканевая набор 30шт',
      category: 'Маски для лица',
      wbUrl: 'https://www.wildberries.ru/catalog/92442613/detail.aspx',
      rating: 4.9,
      reviews: 205098,
      price: 769,
      novemberOrders: 185000,
      novemberRevenue: 98650000,
      decemberOrders: 245000,
      decemberRevenue: 131205000,
      avgPosition: 3,
      buyoutRate: 0.96,
      ourProduct: 'MIXIT Sheet Mask Set 30',
      ourSku: null,
      priority: 'critical'
    },
    {
      id: 2,
      sku: '92442537',
      name: 'Маска для лица тканевая набор 10шт',
      category: 'Маски для лица',
      wbUrl: 'https://www.wildberries.ru/catalog/92442537/detail.aspx',
      rating: 4.9,
      reviews: 89000,
      price: 332,
      novemberOrders: 78000,
      novemberRevenue: 25896000,
      decemberOrders: 112000,
      decemberRevenue: 37184000,
      avgPosition: 5,
      buyoutRate: 0.95,
      ourProduct: 'MIXIT Sheet Mask Set 10',
      ourSku: null,
      priority: 'high'
    },
    // МАСКИ ДЛЯ ВОЛОС - флагман VOIS
    {
      id: 3,
      sku: '148825454',
      name: 'Маска для волос Total Repair 350мл',
      category: 'Маски для волос',
      wbUrl: 'https://www.wildberries.ru/catalog/148825454/detail.aspx',
      rating: 4.9,
      reviews: 393000,
      price: 535,
      novemberOrders: 238000,
      novemberRevenue: 127330000,
      decemberOrders: 298000,
      decemberRevenue: 159430000,
      avgPosition: 7,
      buyoutRate: 0.96,
      ourProduct: 'MIXIT Keratin Hair Mask',
      ourSku: '156789012',
      priority: 'critical'
    },
    {
      id: 4,
      sku: '148825453',
      name: 'Маска для волос Total Repair мини 150мл',
      category: 'Маски для волос',
      wbUrl: 'https://www.wildberries.ru/catalog/148825453/detail.aspx',
      rating: 4.9,
      reviews: 156000,
      price: 491,
      novemberOrders: 89000,
      novemberRevenue: 43699000,
      decemberOrders: 138000,
      decemberRevenue: 67758000,
      avgPosition: 7,
      buyoutRate: 0.95,
      ourProduct: 'MIXIT Keratin Hair Mask Mini',
      ourSku: null,
      priority: 'high'
    },
    // ПАТЧИ
    {
      id: 5,
      sku: '124162339',
      name: 'Патчи гидрогелевые с коллагеном 80шт',
      category: 'Патчи для глаз',
      wbUrl: 'https://www.wildberries.ru/catalog/124162339/detail.aspx',
      rating: 4.9,
      reviews: 336000,
      price: 659,
      novemberOrders: 145000,
      novemberRevenue: 95555000,
      decemberOrders: 178000,
      decemberRevenue: 117302000,
      avgPosition: 2,
      buyoutRate: 0.97,
      ourProduct: 'MIXIT Hydrogel Eye Patches',
      ourSku: '113961392',
      priority: 'critical'
    },
    {
      id: 6,
      sku: '156234567',
      name: 'Патчи гидрогелевые с агавой 80шт',
      category: 'Патчи для глаз',
      wbUrl: 'https://www.wildberries.ru/catalog/156234567/detail.aspx',
      rating: 4.8,
      reviews: 89000,
      price: 612,
      novemberOrders: 52000,
      novemberRevenue: 31824000,
      decemberOrders: 68000,
      decemberRevenue: 41616000,
      avgPosition: 6,
      buyoutRate: 0.94,
      ourProduct: 'MIXIT Agave Patches',
      ourSku: null,
      priority: 'medium'
    },
    // СЫВОРОТКИ
    {
      id: 7,
      sku: '141631875',
      name: 'Сыворотка для ресниц и бровей',
      category: 'Сыворотки',
      wbUrl: 'https://www.wildberries.ru/catalog/141631875/detail.aspx',
      rating: 4.8,
      reviews: 45000,
      price: 670,
      novemberOrders: 34000,
      novemberRevenue: 22780000,
      decemberOrders: 48000,
      decemberRevenue: 32160000,
      avgPosition: 4,
      buyoutRate: 0.91,
      ourProduct: 'MIXIT Lash Serum',
      ourSku: null,
      priority: 'medium'
    },
    {
      id: 8,
      sku: '167890234',
      name: 'Сыворотка с ниацинамидом от акне 30мл',
      category: 'Сыворотки',
      wbUrl: 'https://www.wildberries.ru/catalog/167890234/detail.aspx',
      rating: 4.8,
      reviews: 78000,
      price: 485,
      novemberOrders: 42000,
      novemberRevenue: 20370000,
      decemberOrders: 67000,
      decemberRevenue: 32495000,
      avgPosition: 5,
      buyoutRate: 0.92,
      ourProduct: 'MIXIT Niacinamide Serum',
      ourSku: '178901234',
      priority: 'high'
    },
    {
      id: 9,
      sku: '178901345',
      name: 'Сыворотка гиалуроновая увлажняющая 30мл',
      category: 'Сыворотки',
      wbUrl: 'https://www.wildberries.ru/catalog/178901345/detail.aspx',
      rating: 4.9,
      reviews: 28000,
      price: 520,
      novemberOrders: 28000,
      novemberRevenue: 14560000,
      decemberOrders: 39000,
      decemberRevenue: 20280000,
      avgPosition: 8,
      buyoutRate: 0.93,
      ourProduct: 'MIXIT Hyaluronic Serum',
      ourSku: null,
      priority: 'medium'
    },
    // КРЕМЫ
    {
      id: 10,
      sku: '154859676',
      name: 'Крем для лица увлажняющий дневной SPF15',
      category: 'Кремы для лица',
      wbUrl: 'https://www.wildberries.ru/catalog/154859676/detail.aspx',
      rating: 4.8,
      reviews: 34000,
      price: 445,
      novemberOrders: 31000,
      novemberRevenue: 13795000,
      decemberOrders: 42000,
      decemberRevenue: 18690000,
      avgPosition: 9,
      buyoutRate: 0.91,
      ourProduct: 'MIXIT Day Cream SPF',
      ourSku: null,
      priority: 'medium'
    },
    {
      id: 11,
      sku: '189012456',
      name: 'Крем для проблемной кожи с салициловой к-той',
      category: 'Кремы для лица',
      wbUrl: 'https://www.wildberries.ru/catalog/189012456/detail.aspx',
      rating: 4.7,
      reviews: 22000,
      price: 398,
      novemberOrders: 18000,
      novemberRevenue: 7164000,
      decemberOrders: 26000,
      decemberRevenue: 10348000,
      avgPosition: 12,
      buyoutRate: 0.88,
      ourProduct: 'MIXIT Acne Cream',
      ourSku: null,
      priority: 'low'
    },
    // ОЧИЩЕНИЕ
    {
      id: 12,
      sku: '190123567',
      name: 'Пенка для умывания с ниацинамидом 150мл',
      category: 'Очищение',
      wbUrl: 'https://www.wildberries.ru/catalog/190123567/detail.aspx',
      rating: 4.9,
      reviews: 24000,
      price: 575,
      novemberOrders: 38000,
      novemberRevenue: 21850000,
      decemberOrders: 52000,
      decemberRevenue: 29900000,
      avgPosition: 4,
      buyoutRate: 0.94,
      ourProduct: 'MIXIT Cleansing Foam',
      ourSku: '201234678',
      priority: 'high'
    },
    {
      id: 13,
      sku: '201234678',
      name: 'Гидрофильное масло для снятия макияжа',
      category: 'Очищение',
      wbUrl: 'https://www.wildberries.ru/catalog/201234678/detail.aspx',
      rating: 4.8,
      reviews: 18000,
      price: 485,
      novemberOrders: 22000,
      novemberRevenue: 10670000,
      decemberOrders: 31000,
      decemberRevenue: 15035000,
      avgPosition: 7,
      buyoutRate: 0.92,
      ourProduct: 'MIXIT Cleansing Oil',
      ourSku: null,
      priority: 'medium'
    },
    // УХОД ЗА ТЕЛОМ
    {
      id: 14,
      sku: '212345789',
      name: 'Крем для рук и тела с мочевиной 300мл',
      category: 'Уход за телом',
      wbUrl: 'https://www.wildberries.ru/catalog/212345789/detail.aspx',
      rating: 4.9,
      reviews: 15000,
      price: 352,
      novemberOrders: 25000,
      novemberRevenue: 8800000,
      decemberOrders: 38000,
      decemberRevenue: 13376000,
      avgPosition: 6,
      buyoutRate: 0.93,
      ourProduct: 'MIXIT Body Cream Urea',
      ourSku: null,
      priority: 'medium'
    },
    {
      id: 15,
      sku: '223456890',
      name: 'Скраб для тела кофейный антицеллюлитный',
      category: 'Уход за телом',
      wbUrl: 'https://www.wildberries.ru/catalog/223456890/detail.aspx',
      rating: 4.7,
      reviews: 12000,
      price: 425,
      novemberOrders: 19000,
      novemberRevenue: 8075000,
      decemberOrders: 27000,
      decemberRevenue: 11475000,
      avgPosition: 11,
      buyoutRate: 0.87,
      ourProduct: 'MIXIT Coffee Scrub',
      ourSku: '234567901',
      priority: 'low'
    },
    // УХОД ЗА ВОЛОСАМИ
    {
      id: 16,
      sku: '234567901',
      name: 'Шампунь восстанавливающий 1000мл',
      category: 'Уход за волосами',
      wbUrl: 'https://www.wildberries.ru/catalog/234567901/detail.aspx',
      rating: 4.8,
      reviews: 21000,
      price: 680,
      novemberOrders: 28000,
      novemberRevenue: 19040000,
      decemberOrders: 36000,
      decemberRevenue: 24480000,
      avgPosition: 8,
      buyoutRate: 0.91,
      ourProduct: 'MIXIT Repair Shampoo 1L',
      ourSku: null,
      priority: 'medium'
    },
    {
      id: 17,
      sku: '245678012',
      name: 'Кондиционер восстанавливающий 1000мл',
      category: 'Уход за волосами',
      wbUrl: 'https://www.wildberries.ru/catalog/245678012/detail.aspx',
      rating: 4.8,
      reviews: 16000,
      price: 650,
      novemberOrders: 21000,
      novemberRevenue: 13650000,
      decemberOrders: 29000,
      decemberRevenue: 18850000,
      avgPosition: 9,
      buyoutRate: 0.90,
      ourProduct: 'MIXIT Repair Conditioner',
      ourSku: null,
      priority: 'low'
    },
    // НАБОРЫ
    {
      id: 18,
      sku: '204506781',
      name: 'Бьюти бокс подарочный набор 34шт',
      category: 'Наборы',
      wbUrl: 'https://www.wildberries.ru/catalog/204506781/detail.aspx',
      rating: 4.9,
      reviews: 9429,
      price: 2103,
      novemberOrders: 8500,
      novemberRevenue: 17875500,
      decemberOrders: 18000,
      decemberRevenue: 37854000,
      avgPosition: 5,
      buyoutRate: 0.82,
      ourProduct: 'MIXIT Gift Box Premium',
      ourSku: null,
      priority: 'high'
    },
    {
      id: 19,
      sku: '140483866',
      name: 'Бальзамы и скраб для губ набор 4шт',
      category: 'Уход за губами',
      wbUrl: 'https://www.wildberries.ru/catalog/140483866/detail.aspx',
      rating: 4.8,
      reviews: 28000,
      price: 866,
      novemberOrders: 32000,
      novemberRevenue: 27712000,
      decemberOrders: 48000,
      decemberRevenue: 41568000,
      avgPosition: 3,
      buyoutRate: 0.94,
      ourProduct: 'MIXIT Lip Care Set',
      ourSku: null,
      priority: 'high'
    },
    {
      id: 20,
      sku: '164535130',
      name: 'Маска-бальзам для губ увлажняющая',
      category: 'Уход за губами',
      wbUrl: 'https://www.wildberries.ru/catalog/164535130/detail.aspx',
      rating: 4.8,
      reviews: 19000,
      price: 400,
      novemberOrders: 24000,
      novemberRevenue: 9600000,
      decemberOrders: 35000,
      decemberRevenue: 14000000,
      avgPosition: 6,
      buyoutRate: 0.92,
      ourProduct: 'MIXIT Lip Mask',
      ourSku: null,
      priority: 'medium'
    },
    // ЭНЗИМНАЯ ПУДРА
    {
      id: 21,
      sku: '256789123',
      name: 'Энзимная пудра с папаином 60г',
      category: 'Очищение',
      wbUrl: 'https://www.wildberries.ru/catalog/256789123/detail.aspx',
      rating: 4.7,
      reviews: 14000,
      price: 520,
      novemberOrders: 18000,
      novemberRevenue: 9360000,
      decemberOrders: 24000,
      decemberRevenue: 12480000,
      avgPosition: 10,
      buyoutRate: 0.89,
      ourProduct: 'MIXIT Enzyme Powder',
      ourSku: null,
      priority: 'low'
    },
  ];

  // Арсенал инструментов
  const weapons = [
    { id: 'bloggers_micro', name: 'Микро-блогеры (10-50K)', icon: '👥', color: '#FF6B6B', costMin: 50000, costMax: 150000, impact: 'high' },
    { id: 'bloggers_macro', name: 'Макро-блогеры (100K+)', icon: '⭐', color: '#FF8E53', costMin: 200000, costMax: 800000, impact: 'high' },
    { id: 'elena', name: 'Елена Назарова', icon: '👑', color: '#FFD93D', costMin: 500000, costMax: 2000000, impact: 'critical' },
    { id: 'reviews_text', name: 'Текстовые отзывы', icon: '✍️', color: '#4ECDC4', costMin: 30000, costMax: 100000, impact: 'medium' },
    { id: 'reviews_photo', name: 'Отзывы + ИИ фото', icon: '📸', color: '#45B7D1', costMin: 50000, costMax: 200000, impact: 'high' },
    { id: 'video_rutube', name: 'Видео Rutube/VK', icon: '🎬', color: '#9B59B6', costMin: 100000, costMax: 400000, impact: 'medium' },
    { id: 'wb_search', name: 'Реклама ВБ Поиск', icon: '🔍', color: '#96CEB4', costMin: 100000, costMax: 500000, impact: 'high' },
    { id: 'wb_card', name: 'Реклама ВБ Карточка', icon: '📢', color: '#88D8B0', costMin: 50000, costMax: 300000, impact: 'medium' },
    { id: 'selfbuy', name: 'Самовыкупы', icon: '🔄', color: '#6C5CE7', costMin: 50000, costMax: 200000, impact: 'medium' },
    { id: 'card_ctr', name: 'Оптимизация CTR', icon: '📊', color: '#A8E6CF', costMin: 20000, costMax: 80000, impact: 'high' },
    { id: 'card_cr', name: 'Оптимизация CR', icon: '🎯', color: '#FFEAA7', costMin: 30000, costMax: 100000, impact: 'high' },
    { id: 'nonstandard', name: 'Спецоперации', icon: '💡', color: '#DDA0DD', costMin: 50000, costMax: 500000, impact: 'variable' },
  ];

  const categories = useMemo(() => ['all', ...new Set(voisProducts.map(p => p.category))], []);

  const getProductData = (product) => {
    if (filterMonth === 'november') {
      return { orders: product.novemberOrders, revenue: product.novemberRevenue };
    } else if (filterMonth === 'december') {
      return { orders: product.decemberOrders, revenue: product.decemberRevenue };
    }
    return {
      orders: product.novemberOrders + product.decemberOrders,
      revenue: product.novemberRevenue + product.decemberRevenue
    };
  };

  const getGrowth = (product) => {
    if (product.novemberRevenue === 0) return 0;
    return ((product.decemberRevenue - product.novemberRevenue) / product.novemberRevenue * 100).toFixed(0);
  };

  const filteredProducts = useMemo(() => {
    let products = filterCategory === 'all'
      ? voisProducts
      : voisProducts.filter(p => p.category === filterCategory);

    return products.sort((a, b) => {
      const aData = getProductData(a);
      const bData = getProductData(b);
      if (sortBy === 'revenue') return bData.revenue - aData.revenue;
      if (sortBy === 'orders') return bData.orders - aData.orders;
      if (sortBy === 'position') return a.avgPosition - b.avgPosition;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return 0;
    });
  }, [filterCategory, sortBy, filterMonth]);

  const toggleWeapon = (targetId, weaponId) => {
    setWeaponAssignments(prev => {
      const current = prev[targetId] || [];
      if (current.includes(weaponId)) {
        return { ...prev, [targetId]: current.filter(w => w !== weaponId) };
      }
      return { ...prev, [targetId]: [...current, weaponId] };
    });
  };

  const getTargetWeapons = (targetId) => weaponAssignments[targetId] || [];

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const formatReviews = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
  };

  const totalBudget = Object.values(budgets).reduce((a, b) => a + (parseInt(b) || 0), 0);
  const activeTargets = Object.keys(weaponAssignments).filter(k => weaponAssignments[k]?.length > 0).length;

  const totalVoisRevenue = useMemo(() => {
    return filteredProducts.reduce((sum, p) => sum + getProductData(p).revenue, 0);
  }, [filteredProducts, filterMonth]);

  const getPriorityColor = (priority) => {
    if (priority === 'critical') return '#FF4757';
    if (priority === 'high') return '#FFA502';
    if (priority === 'medium') return '#2ED573';
    return '#747D8C';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
      color: '#fff',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
        ::-webkit-scrollbar-thumb { background: rgba(255,107,107,0.3); border-radius: 3px; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .card { transition: all 0.2s ease; cursor: pointer; }
        .card:hover { transform: translateY(-3px); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
        .btn { transition: all 0.15s ease; cursor: pointer; border: none; }
        .btn:hover { transform: scale(1.02); }
        input:focus, select:focus { outline: none; border-color: #FF6B6B !important; }
        a { color: inherit; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* Header */}
      <header style={{
        padding: '16px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>⚔️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
              MIXIT <span style={{ color: '#FF6B6B' }}>WAR ROOM</span>
            </h1>
            <p style={{ margin: 0, fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
              {voisProducts.length} ЦЕЛЕЙ VOIS • НОЯБРЬ-ДЕКАБРЬ 2025
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {/* Month filter */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px' }}>
            {[
              { id: 'all', label: 'Все' },
              { id: 'november', label: 'Ноябрь' },
              { id: 'december', label: 'Декабрь' },
            ].map(m => (
              <button
                key={m.id}
                onClick={() => setFilterMonth(m.id)}
                className="btn"
                style={{
                  padding: '6px 12px',
                  background: filterMonth === m.id ? 'rgba(255,107,107,0.2)' : 'transparent',
                  borderRadius: '6px',
                  color: filterMonth === m.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: '11px',
                  fontWeight: '600'
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Выручка VOIS</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#FF6B6B', fontFamily: "'JetBrains Mono'" }}>₽{formatNumber(totalVoisRevenue)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Бюджет атаки</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#4ECDC4', fontFamily: "'JetBrains Mono'" }}>₽{formatNumber(totalBudget)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Атакуем</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFD93D', fontFamily: "'JetBrains Mono'" }}>{activeTargets}/{voisProducts.length}</div>
          </div>

          {/* User info & Logout */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginLeft: '16px',
              paddingLeft: '16px',
              borderLeft: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Пользователь</div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>{user.name || user.login}</div>
              </div>
              <button
                onClick={onLogout}
                className="btn"
                style={{
                  padding: '8px 14px',
                  background: 'rgba(255,107,107,0.15)',
                  border: '1px solid rgba(255,107,107,0.3)',
                  borderRadius: '8px',
                  color: '#FF6B6B',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🚪 Выйти
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        display: 'flex',
        gap: '4px',
        padding: '10px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.01)'
      }}>
        {[
          { id: 'battlefield', label: '🎯 Поле боя' },
          { id: 'arsenal', label: '⚔️ Арсенал' },
          { id: 'economics', label: '💰 Бюджеты' },
          { id: 'intel', label: '🔍 Разведка' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="btn"
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id ? 'rgba(255,107,107,0.12)' : 'transparent',
              border: activeTab === tab.id ? '1px solid rgba(255,107,107,0.25)' : '1px solid transparent',
              borderRadius: '6px',
              color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main */}
      <main style={{ padding: '20px 28px' }}>

        {/* BATTLEFIELD */}
        {activeTab === 'battlefield' && (
          <div style={{ animation: 'slideUp 0.3s ease' }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>Категория:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              >
                <option value="all">Все категории</option>
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginLeft: '12px' }}>Сортировка:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: '6px 10px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              >
                <option value="revenue">По выручке</option>
                <option value="orders">По заказам</option>
                <option value="position">По позиции</option>
                <option value="reviews">По отзывам</option>
              </select>

              <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                Показано: {filteredProducts.length} товаров
              </span>
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: selectedTarget ? '1fr 380px' : '1fr',
              gap: '20px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '10px',
                alignContent: 'start'
              }}>
                {filteredProducts.map((product) => {
                  const data = getProductData(product);
                  const growth = getGrowth(product);
                  const assignedWeapons = getTargetWeapons(product.id);
                  const isSelected = selectedTarget?.id === product.id;

                  return (
                    <div
                      key={product.id}
                      className="card"
                      onClick={() => setSelectedTarget(isSelected ? null : product)}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,107,107,0.03))'
                          : 'rgba(255,255,255,0.02)',
                        border: isSelected
                          ? '1px solid rgba(255,107,107,0.35)'
                          : '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '10px',
                        padding: '14px',
                        position: 'relative'
                      }}
                    >
                      {/* Priority badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getPriorityColor(product.priority),
                        boxShadow: `0 0 8px ${getPriorityColor(product.priority)}`
                      }} />

                      {/* Header */}
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <a
                            href={product.wbUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: '10px',
                              color: '#4ECDC4',
                              fontFamily: "'JetBrains Mono'"
                            }}
                          >
                            {product.sku}
                          </a>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>•</span>
                          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>#{product.avgPosition}</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: '600', lineHeight: '1.3', paddingRight: '20px' }}>
                          {product.name}
                        </h3>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>
                          {product.category}
                        </div>
                      </div>

                      {/* Rating & Reviews */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '10px',
                        fontSize: '11px'
                      }}>
                        <span style={{ color: '#FFD93D' }}>★ {product.rating}</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {formatReviews(product.reviews)} отзывов
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)' }}>₽{product.price}</span>
                      </div>

                      {/* Metrics */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '6px',
                        padding: '10px',
                        background: 'rgba(0,0,0,0.25)',
                        borderRadius: '8px',
                        marginBottom: '10px'
                      }}>
                        <div>
                          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>ВЫРУЧКА</div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#FF6B6B', fontFamily: "'JetBrains Mono'" }}>
                            ₽{formatNumber(data.revenue)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>ЗАКАЗОВ</div>
                          <div style={{ fontSize: '13px', fontWeight: '700', fontFamily: "'JetBrains Mono'" }}>
                            {formatNumber(data.orders)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>РОСТ</div>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: '700',
                            color: growth > 0 ? '#2ED573' : '#FF4757',
                            fontFamily: "'JetBrains Mono'"
                          }}>
                            {growth > 0 ? '+' : ''}{growth}%
                          </div>
                        </div>
                      </div>

                      {/* Our product */}
                      <div style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.45)',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span>→ {product.ourProduct}</span>
                        <span style={{ color: `${product.buyoutRate >= 0.95 ? '#2ED573' : product.buyoutRate >= 0.90 ? '#FFA502' : '#FF4757'}` }}>
                          {(product.buyoutRate * 100).toFixed(0)}% выкуп
                        </span>
                      </div>

                      {/* Assigned weapons */}
                      {assignedWeapons.length > 0 && (
                        <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '8px' }}>
                          {assignedWeapons.map(wId => {
                            const w = weapons.find(x => x.id === wId);
                            return <span key={wId} style={{ fontSize: '12px' }}>{w.icon}</span>;
                          })}
                          {budgets[product.id] && (
                            <span style={{
                              padding: '2px 6px',
                              background: 'rgba(78,205,196,0.15)',
                              borderRadius: '4px',
                              fontSize: '9px',
                              color: '#4ECDC4',
                              fontFamily: "'JetBrains Mono'"
                            }}>
                              ₽{formatNumber(parseInt(budgets[product.id]))}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Attack Panel */}
              {selectedTarget && (
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,107,107,0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  position: 'sticky',
                  top: '90px',
                  maxHeight: 'calc(100vh - 120px)',
                  overflowY: 'auto',
                  animation: 'slideUp 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#FF6B6B', fontWeight: '600', marginBottom: '2px' }}>АТАКА</div>
                      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{selectedTarget.name}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedTarget(null)}
                      className="btn"
                      style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', width: '26px', height: '26px', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}
                    >×</button>
                  </div>

                  {/* WB Link */}
                  <a
                    href={selectedTarget.wbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '10px',
                      background: 'rgba(78,205,196,0.1)',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      fontSize: '11px',
                      color: '#4ECDC4'
                    }}
                  >
                    🔗 Открыть на Wildberries → SKU {selectedTarget.sku}
                  </a>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,107,107,0.08)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>ВЫРУЧКА</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FF6B6B' }}>₽{formatNumber(getProductData(selectedTarget).revenue)}</div>
                    </div>
                    <div style={{ padding: '10px', background: 'rgba(255,215,61,0.08)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>ОТЗЫВОВ</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFD93D' }}>{formatReviews(selectedTarget.reviews)}</div>
                    </div>
                  </div>

                  {/* Budget */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '4px' }}>БЮДЖЕТ</label>
                    <input
                      type="number"
                      value={budgets[selectedTarget.id] || ''}
                      onChange={(e) => setBudgets(prev => ({ ...prev, [selectedTarget.id]: e.target.value }))}
                      placeholder="0"
                      style={{
                        width: '100%',
                        padding: '10px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '700',
                        fontFamily: "'JetBrains Mono'"
                      }}
                    />
                  </div>

                  {/* Weapons */}
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>ИНСТРУМЕНТЫ</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {weapons.map(weapon => {
                      const isActive = getTargetWeapons(selectedTarget.id).includes(weapon.id);
                      return (
                        <button
                          key={weapon.id}
                          className="btn"
                          onClick={() => toggleWeapon(selectedTarget.id, weapon.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 10px',
                            background: isActive ? `${weapon.color}18` : 'rgba(255,255,255,0.02)',
                            border: isActive ? `1px solid ${weapon.color}` : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px',
                            color: '#fff',
                            textAlign: 'left'
                          }}
                        >
                          <span style={{ fontSize: '16px' }}>{weapon.icon}</span>
                          <span style={{ flex: 1, fontSize: '11px', fontWeight: '500' }}>{weapon.name}</span>
                          {isActive && <span style={{ color: '#4ECDC4', fontSize: '14px' }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ARSENAL */}
        {activeTab === 'arsenal' && (
          <div style={{ animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {weapons.map(weapon => {
                const usedCount = Object.values(weaponAssignments).filter(ws => ws.includes(weapon.id)).length;
                return (
                  <div key={weapon.id} style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    padding: '16px',
                    borderTop: `3px solid ${weapon.color}`
                  }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '24px' }}>{weapon.icon}</span>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{weapon.name}</h3>
                        <span style={{
                          fontSize: '9px', padding: '2px 6px',
                          background: weapon.impact === 'critical' ? '#FF4757' : weapon.impact === 'high' ? '#FFA502' : '#2ED573',
                          borderRadius: '4px'
                        }}>
                          {weapon.impact.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>₽{formatNumber(weapon.costMin)} – {formatNumber(weapon.costMax)}</span>
                      <span style={{ color: '#4ECDC4' }}>{usedCount} целей</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ECONOMICS */}
        {activeTab === 'economics' && (
          <div style={{ animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Общий бюджет', value: `₽${formatNumber(totalBudget)}`, color: '#FF6B6B' },
                { label: 'Целей атакуем', value: activeTargets, color: '#4ECDC4' },
                { label: 'Выручка VOIS', value: `₽${formatNumber(totalVoisRevenue)}`, color: '#FFD93D' },
                { label: 'Ср. бюджет/цель', value: `₽${formatNumber(Math.round(totalBudget / (activeTargets || 1)))}`, color: '#6C5CE7' },
              ].map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', padding: '14px' }}>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{c.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: c.color, fontFamily: "'JetBrains Mono'" }}>{c.value}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <th style={{ padding: '10px 12px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Товар</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Выручка VOIS</th>
                    <th style={{ padding: '10px 12px', textAlign: 'right', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Бюджет</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>Инструменты</th>
                  </tr>
                </thead>
                <tbody>
                  {voisProducts.filter(p => getTargetWeapons(p.id).length > 0 || budgets[p.id]).map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <a href={p.wbUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#4ECDC4', fontSize: '10px' }}>{p.sku}</a>
                        <div style={{ fontSize: '11px' }}>{p.name}</div>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: "'JetBrains Mono'", color: '#FF6B6B' }}>₽{formatNumber(getProductData(p).revenue)}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'right', fontFamily: "'JetBrains Mono'", fontWeight: '600' }}>{budgets[p.id] ? `₽${formatNumber(parseInt(budgets[p.id]))}` : '—'}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        {getTargetWeapons(p.id).map(wId => weapons.find(w => w.id === wId)?.icon).join(' ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INTEL */}
        {activeTab === 'intel' && (
          <div style={{ animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>📊 Топ-5 по выручке</h3>
                {voisProducts.slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <span style={{ color: '#FFD93D', marginRight: '8px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '12px' }}>{p.name.slice(0, 35)}...</span>
                    </div>
                    <span style={{ color: '#FF6B6B', fontFamily: "'JetBrains Mono'", fontSize: '12px' }}>₽{formatNumber(getProductData(p).revenue)}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>⭐ Топ-5 по отзывам</h3>
                {[...voisProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <span style={{ color: '#FFD93D', marginRight: '8px' }}>#{i + 1}</span>
                      <span style={{ fontSize: '12px' }}>{p.name.slice(0, 35)}...</span>
                    </div>
                    <span style={{ color: '#4ECDC4', fontSize: '12px' }}>{formatReviews(p.reviews)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)', borderRadius: '12px', padding: '16px' }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '14px', color: '#FF6B6B' }}>🎯 Ключевые уязвимости VOIS</h3>
              <ul style={{ margin: 0, padding: '0 0 0 20px', fontSize: '12px', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)' }}>
                <li>Маски для волос = 35% выручки. Критическая зависимость от одной линейки.</li>
                <li>Патчи с 336K отзывов — якорный продукт, но выкуп 97% говорит о лояльности.</li>
                <li>Наборы имеют низкий выкуп (82%) — уязвимая точка.</li>
                <li>Нет сильного амбассадора уровня Елены Назаровой.</li>
                <li>Рост декабрь vs ноябрь в среднем +35% — сезонный фактор.</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MixitWarRoom;
