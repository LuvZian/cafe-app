const detailRoot = $('#detail-root');
const toast = $('#toast');

function menuInitial(name) {
  return escapeHtml(name.slice(0, 1).toUpperCase());
}

function normalizeQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  if (Number.isNaN(quantity)) return 1;
  return Math.min(Math.max(quantity, 1), 99);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

function renderNotFound() {
  detailRoot.innerHTML = `
    <div class="not-found">
      <h1>Menu not found</h1>
      <p>The menu item may have been removed.</p>
      <a href="./list.html">Go to menu</a>
    </div>
  `;
}

function renderDetail(menu) {
  document.title = `${menu.name} | Cafe Menu`;

  detailRoot.innerHTML = `
    <article class="detail-layout">
      <div
        class="detail-image"
        ${menu.image ? `style="--menu-image: url('${escapeHtml(menu.image)}')"` : ''}
        aria-label="${escapeHtml(menu.name)} image"
      >
        ${menu.image ? '' : menuInitial(menu.name)}
      </div>
      <div class="detail-panel">
        <span class="category-pill">${escapeHtml(getCategoryName(menu.category))}</span>
        <div>
          <h1 class="detail-title">${escapeHtml(menu.name)}</h1>
          <p class="detail-description">${escapeHtml(menu.description)}</p>
        </div>
        <div class="detail-price">${formatPrice(menu.price)}</div>
        <div class="purchase-box">
          <div class="quantity-row">
            <strong>Quantity</strong>
            <div class="quantity-control" aria-label="Quantity control">
              <button type="button" data-quantity-step="-1" aria-label="Decrease quantity">-</button>
              <input id="quantity-input" type="number" min="1" max="99" value="1" inputmode="numeric" />
              <button type="button" data-quantity-step="1" aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="add-button" type="button" id="add-button">Add to basket</button>
        </div>
      </div>
    </article>
  `;

  const quantityInput = $('#quantity-input');

  detailRoot.addEventListener('click', (event) => {
    const stepButton = event.target.closest('button[data-quantity-step]');
    if (stepButton) {
      quantityInput.value = normalizeQuantity(
        normalizeQuantity(quantityInput.value) + Number(stepButton.dataset.quantityStep)
      );
      return;
    }

    if (event.target.closest('#add-button')) {
      const quantity = normalizeQuantity(quantityInput.value);
      quantityInput.value = quantity;
      addToCart(menu.id, quantity);
      showToast(`${menu.name} ${quantity} added to basket`);
    }
  });

  quantityInput.addEventListener('change', () => {
    quantityInput.value = normalizeQuantity(quantityInput.value);
  });
}

const menuId = getQueryParam('id');
const menu = getMenuById(menuId);

if (!menu) {
  renderNotFound();
} else {
  renderDetail(menu);
}
