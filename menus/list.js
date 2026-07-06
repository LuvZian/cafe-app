const state = {
  category: 'all',
  query: ''
};

const menuGrid = $('#menu-grid');
const emptyState = $('#empty-state');
const menuCount = $('#menu-count');
const categoryTabs = $('#category-tabs');
const searchInput = $('#search-input');
const cartCount = $('#cart-count');
const toast = $('#toast');

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = count;
}

function getFilteredMenus() {
  const query = state.query.trim().toLowerCase();

  return getMenus().filter((menu) => {
    const categoryMatches = state.category === 'all' || menu.category === state.category;
    const queryMatches =
      !query ||
      menu.name.toLowerCase().includes(query) ||
      menu.description.toLowerCase().includes(query) ||
      getCategoryName(menu.category).toLowerCase().includes(query);

    return categoryMatches && queryMatches;
  });
}

function menuInitial(name) {
  return escapeHtml(name.slice(0, 1).toUpperCase());
}

function renderCategoryTabs() {
  const tabs = [{ id: 'all', name: 'All' }, ...CATEGORIES];

  categoryTabs.innerHTML = tabs
    .map(
      (category) => `
        <button
          type="button"
          class="${state.category === category.id ? 'is-active' : ''}"
          data-category="${escapeHtml(category.id)}"
          aria-selected="${state.category === category.id}"
        >
          ${escapeHtml(category.name)}
        </button>
      `
    )
    .join('');
}

function renderMenus() {
  const menus = getFilteredMenus();
  const itemLabel = menus.length === 1 ? 'item' : 'items';

  menuCount.textContent = `${menus.length} ${itemLabel}`;
  emptyState.hidden = menus.length > 0;

  renderList(
    menuGrid,
    menus,
    (menu) => `
      <article class="menu-card">
        <a
          class="menu-image"
          href="./detail.html?id=${encodeURIComponent(menu.id)}"
          ${menu.image ? `style="--menu-image: url('${escapeHtml(menu.image)}')"` : ''}
          aria-label="${escapeHtml(menu.name)} detail"
        >
          ${menu.image ? '' : menuInitial(menu.name)}
        </a>
        <div class="menu-body">
          <div class="menu-meta">
            <span>${escapeHtml(getCategoryName(menu.category))}</span>
            <strong>${formatPrice(menu.price)}</strong>
          </div>
          <h2 class="menu-title">${escapeHtml(menu.name)}</h2>
          <p class="menu-description">${escapeHtml(menu.description)}</p>
          <div class="menu-actions">
            <a class="detail-link" href="./detail.html?id=${encodeURIComponent(menu.id)}">Detail</a>
            <button class="cart-button" type="button" data-add-to-cart="${escapeHtml(menu.id)}">Add</button>
          </div>
        </div>
      </article>
    `
  );
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

categoryTabs.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-category]');
  if (!button) return;

  state.category = button.dataset.category;
  renderCategoryTabs();
  renderMenus();
});

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  renderMenus();
});

menuGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-add-to-cart]');
  if (!button) return;

  const menu = getMenuById(button.dataset.addToCart);
  if (!menu) return;

  addToCart(menu.id, 1);
  updateCartCount();
  showToast(`${menu.name} added to basket`);
});

renderCategoryTabs();
renderMenus();
updateCartCount();
