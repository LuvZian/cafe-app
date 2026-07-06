const basketList = $('#basket-list');
const emptyState = $('#empty-state');
const summaryCount = $('#summary-count');
const summaryTotal = $('#summary-total');
const clearButton = $('#clear-button');
const orderButton = $('#order-button');
const summaryNote = $('#summary-note');
const toast = $('#toast');

function normalizeQuantity(value) {
  const quantity = Number.parseInt(value, 10);
  if (Number.isNaN(quantity)) return 1;
  return Math.min(Math.max(quantity, 1), 99);
}

function getItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

function renderBasket() {
  const cart = getCart();
  const hasItems = cart.length > 0;

  emptyState.hidden = hasItems;
  basketList.hidden = !hasItems;
  clearButton.disabled = !hasItems;
  orderButton.disabled = !hasItems;
  summaryCount.textContent = getItemCount(cart);
  summaryTotal.textContent = formatPrice(getCartTotal());
  summaryNote.textContent = hasItems
    ? 'You can change quantities before ordering.'
    : 'Add menu items to start a basket.';

  renderList(
    basketList,
    cart,
    (item) => `
      <article class="basket-item" data-menu-id="${escapeHtml(item.menuId)}">
        <div>
          <h3 class="item-name">${escapeHtml(item.name)}</h3>
          <p class="item-meta">${escapeHtml(getCategoryName(item.category))} · ${formatPrice(item.price)}</p>
          <div class="item-actions">
            <button class="remove-button" type="button" data-remove="${escapeHtml(item.menuId)}">Remove</button>
          </div>
        </div>
        <div class="quantity-control" aria-label="${escapeHtml(item.name)} quantity">
          <button type="button" data-step="-1" aria-label="Decrease quantity">-</button>
          <input
            type="number"
            min="1"
            max="99"
            value="${escapeHtml(item.quantity)}"
            inputmode="numeric"
            data-quantity-input="${escapeHtml(item.menuId)}"
            aria-label="Quantity"
          />
          <button type="button" data-step="1" aria-label="Increase quantity">+</button>
        </div>
        <strong class="item-total">${formatPrice(item.price * item.quantity)}</strong>
      </article>
    `
  );
}

basketList.addEventListener('click', (event) => {
  const itemEl = event.target.closest('.basket-item');
  if (!itemEl) return;

  const removeButton = event.target.closest('button[data-remove]');
  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
    renderBasket();
    showToast('Item removed from basket');
    return;
  }

  const stepButton = event.target.closest('button[data-step]');
  if (!stepButton) return;

  const input = $('[data-quantity-input]', itemEl);
  const nextQuantity = normalizeQuantity(normalizeQuantity(input.value) + Number(stepButton.dataset.step));
  updateCartQuantity(itemEl.dataset.menuId, nextQuantity);
  renderBasket();
});

basketList.addEventListener('change', (event) => {
  const input = event.target.closest('[data-quantity-input]');
  if (!input) return;

  const quantity = normalizeQuantity(input.value);
  updateCartQuantity(input.dataset.quantityInput, quantity);
  renderBasket();
});

clearButton.addEventListener('click', () => {
  if (getCart().length === 0) return;
  clearCart();
  renderBasket();
  showToast('Basket cleared');
});

orderButton.addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) return;

  const order = createOrder(cart, getCartTotal());
  clearCart();
  renderBasket();
  showToast(`Order ${order.id} placed`);
});

renderBasket();
