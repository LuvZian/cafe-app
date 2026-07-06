const menuTable = $('#menuTable');
const searchInput = $('#searchInput');
const categoryFilter = $('#categoryFilter');
const emptyState = $('#emptyState');
const totalCount = $('#totalCount');
const averagePrice = $('#averagePrice');
const visibleCount = $('#visibleCount');

function populateCategories() {
  categoryFilter.insertAdjacentHTML('beforeend', CATEGORIES.map((category) => (
    `<option value="${category.id}">${category.name}</option>`
  )).join(''));
}

function getFilteredMenus() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return getMenus().filter((menu) => {
    const matchesCategory = category === 'all' || menu.category === category;
    const matchesQuery = !query
      || menu.name.toLowerCase().includes(query)
      || menu.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });
}

function renderSummary(filteredMenus) {
  const menus = getMenus();
  const average = menus.length
    ? Math.round(menus.reduce((sum, menu) => sum + Number(menu.price), 0) / menus.length)
    : 0;

  totalCount.textContent = menus.length;
  averagePrice.textContent = formatPrice(average);
  visibleCount.textContent = filteredMenus.length;
}

function renderMenus() {
  const filteredMenus = getFilteredMenus();
  renderSummary(filteredMenus);
  emptyState.classList.toggle('show', filteredMenus.length === 0);

  menuTable.innerHTML = filteredMenus.map((menu) => `
    <tr>
      <td>
        <div class="menu-name">${escapeHtml(menu.name)}</div>
        <div class="muted">ID ${escapeHtml(menu.id)}</div>
      </td>
      <td><span class="badge">${getCategoryName(menu.category)}</span></td>
      <td><strong>${formatPrice(menu.price)}</strong></td>
      <td>${escapeHtml(menu.description)}</td>
      <td>
        <div class="actions">
          <a class="action" href="detail.html?id=${encodeURIComponent(menu.id)}">View</a>
          <a class="action" href="edit.html?id=${encodeURIComponent(menu.id)}">Edit</a>
          <button class="action danger" type="button" data-delete-id="${escapeHtml(menu.id)}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function bindEvents() {
  searchInput.addEventListener('input', renderMenus);
  categoryFilter.addEventListener('change', renderMenus);
  menuTable.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-id]');
    if (!button) return;

    const menu = getMenuById(button.dataset.deleteId);
    if (menu && confirm(`Delete '${menu.name}'?`)) {
      deleteMenu(menu.id);
      renderMenus();
    }
  });
}

populateCategories();
bindEvents();
renderMenus();
