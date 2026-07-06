const menuId = getQueryParam('id');
const menu = getMenuById(menuId);
const detailView = $('#detailView');
const notFound = $('#notFound');

function renderImagePanel(menuItem) {
  const imagePanel = $('#imagePanel');
  if (menuItem.image) {
    imagePanel.classList.add('has-image');
    imagePanel.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.18), rgba(0,0,0,0.18)), url('${menuItem.image}')`;
    imagePanel.textContent = '';
    return;
  }
  imagePanel.textContent = menuItem.name.slice(0, 1).toUpperCase();
}

function renderDetail() {
  if (!menu) {
    notFound.hidden = false;
    return;
  }

  detailView.hidden = false;
  $('#categoryName').textContent = getCategoryName(menu.category);
  $('#menuName').textContent = menu.name;
  $('#menuPrice').textContent = formatPrice(menu.price);
  $('#menuDescription').textContent = menu.description;
  $('#menuId').textContent = menu.id;
  $('#menuImage').textContent = menu.image || 'No image URL';
  $('#editLink').href = `edit.html?id=${encodeURIComponent(menu.id)}`;
  renderImagePanel(menu);
}

$('#deleteButton').addEventListener('click', () => {
  if (!menu) return;
  if (confirm(`Delete '${menu.name}'?`)) {
    deleteMenu(menu.id);
    window.location.href = 'list.html';
  }
});

renderDetail();
