import './styles/globals.css';
import { useState, useEffect } from 'react';
import { useWarRoom } from './hooks/useWarRoom';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import BattlefieldTab from './components/tabs/BattlefieldTab';
import ArsenalTab from './components/tabs/ArsenalTab';
import EconomicsTab from './components/tabs/EconomicsTab';
import IntelTab from './components/tabs/IntelTab';
import ProductDossier from './components/shared/ProductDossier';
import LoginPage from './components/auth/LoginPage';

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('warroom_auth') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('warroom_auth');
    localStorage.removeItem('warroom_user');
    setIsAuthenticated(false);
  };

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const warRoom = useWarRoom();

  // Show loading state
  if (warRoom.loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        color: '#fff',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '3px solid rgba(255,107,107,0.2)',
          borderTop: '3px solid #FF6B6B',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          Загрузка данных из Google Sheets...
        </p>
      </div>
    );
  }

  // Show error state
  if (warRoom.error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        color: '#fff',
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: '40px',
      }}>
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <h2 style={{ margin: 0, color: '#FF6B6B' }}>Ошибка загрузки данных</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: '500px' }}>
          {warRoom.error}
        </p>
        <button
          onClick={warRoom.refetch}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div>
      <Header
        productsCount={warRoom.voisProducts.length}
        filterMonth={warRoom.filterMonth}
        setFilterMonth={warRoom.setFilterMonth}
        totalVoisRevenue={warRoom.totalVoisRevenue}
        totalBudget={warRoom.totalBudget}
        activeTargets={warRoom.activeTargets}
        lastUpdated={warRoom.lastUpdated}
        refetch={warRoom.refetch}
        onLogout={handleLogout}
      />

      <Navigation
        activeTab={warRoom.activeTab}
        setActiveTab={warRoom.setActiveTab}
      />

      <main style={{ padding: '20px 28px' }}>
        {warRoom.activeTab === 'battlefield' && (
          <BattlefieldTab
            filteredProducts={warRoom.filteredProducts}
            categories={warRoom.categories}
            weapons={warRoom.weapons}
            filterCategory={warRoom.filterCategory}
            setFilterCategory={warRoom.setFilterCategory}
            sortBy={warRoom.sortBy}
            setSortBy={warRoom.setSortBy}
            selectedTarget={warRoom.selectedTarget}
            setSelectedTarget={warRoom.setSelectedTarget}
            getTargetWeapons={warRoom.getTargetWeapons}
            toggleWeapon={warRoom.toggleWeapon}
            budgets={warRoom.budgets}
            updateBudget={warRoom.updateBudget}
            getProductData={warRoom.getProductData}
            getGrowth={warRoom.getGrowth}
            onOpenDossier={warRoom.setDossierProductId}
          />
        )}

        {warRoom.activeTab === 'arsenal' && (
          <ArsenalTab
            weapons={warRoom.weapons}
            getWeaponUsageCount={warRoom.getWeaponUsageCount}
            addWeapon={warRoom.addWeapon}
            updateWeapon={warRoom.updateWeapon}
            deleteWeapon={warRoom.deleteWeapon}
            teamMembers={warRoom.teamMembers}
            weaponResponsibles={warRoom.weaponResponsibles}
            setWeaponResponsible={warRoom.setWeaponResponsible}
            getWeaponResponsible={warRoom.getWeaponResponsible}
          />
        )}

        {warRoom.activeTab === 'economics' && (
          <EconomicsTab
            voisProducts={warRoom.voisProducts}
            weapons={warRoom.weapons}
            totalBudget={warRoom.totalBudget}
            activeTargets={warRoom.activeTargets}
            totalVoisRevenue={warRoom.totalVoisRevenue}
            getTargetWeapons={warRoom.getTargetWeapons}
            budgets={warRoom.budgets}
            getProductData={warRoom.getProductData}
          />
        )}

        {warRoom.activeTab === 'intel' && (
          <IntelTab
            voisProducts={warRoom.voisProducts}
            getProductData={warRoom.getProductData}
            filterMonth={warRoom.filterMonth}
          />
        )}
      </main>

      {/* Product Dossier Modal */}
      {warRoom.dossierProductId && (() => {
        const product = warRoom.voisProducts.find(p => p.id === warRoom.dossierProductId);
        if (!product) return null;
        return (
          <ProductDossier
            product={product}
            mixitProducts={warRoom.mixitProducts}
            dossier={warRoom.getDossier(product.id)}
            onClose={() => warRoom.setDossierProductId(null)}
            onLinkMixit={(mixitId) => warRoom.linkMixitProduct(product.id, mixitId)}
            onAddScreenshot={(data, caption) => warRoom.addScreenshot(product.id, data, caption)}
            onDeleteScreenshot={(ssId) => warRoom.deleteScreenshot(product.id, ssId)}
            onAddNote={(text) => warRoom.addNote(product.id, text)}
            onUpdateNote={(noteId, text) => warRoom.updateNote(product.id, noteId, text)}
            onDeleteNote={(noteId) => warRoom.deleteNote(product.id, noteId)}
            onExport={warRoom.exportDossiers}
          />
        );
      })()}
    </div>
  );
}

export default App;
