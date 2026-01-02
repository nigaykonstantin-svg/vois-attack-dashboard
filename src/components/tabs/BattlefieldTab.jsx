import ProductCard from '../shared/ProductCard';
import AttackPanel from '../shared/AttackPanel';

const BattlefieldTab = ({
    filteredProducts,
    categories,
    weapons,
    filterCategory,
    setFilterCategory,
    sortBy,
    setSortBy,
    selectedTarget,
    setSelectedTarget,
    getTargetWeapons,
    toggleWeapon,
    budgets,
    updateBudget,
    getProductData,
    getGrowth,
    onOpenDossier
}) => {
    return (
        <div className="animate-slide-up">
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
                            <ProductCard
                                key={product.id}
                                product={product}
                                data={data}
                                growth={growth}
                                assignedWeapons={assignedWeapons}
                                weapons={weapons}
                                isSelected={isSelected}
                                onClick={() => setSelectedTarget(isSelected ? null : product)}
                                budget={budgets[product.id]}
                                onOpenDossier={onOpenDossier}
                            />
                        );
                    })}
                </div>

                {/* Attack Panel */}
                {selectedTarget && (
                    <AttackPanel
                        target={selectedTarget}
                        weapons={weapons}
                        targetWeapons={getTargetWeapons(selectedTarget.id)}
                        budget={budgets[selectedTarget.id]}
                        onClose={() => setSelectedTarget(null)}
                        onToggleWeapon={(weaponId) => toggleWeapon(selectedTarget.id, weaponId)}
                        onBudgetChange={(value) => updateBudget(selectedTarget.id, value)}
                        getProductData={getProductData}
                    />
                )}
            </div>
        </div>
    );
};

export default BattlefieldTab;
