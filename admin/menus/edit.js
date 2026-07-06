const menuId = getQueryParam('id');
const menu = getMenuById(menuId);
const formShell = $('#formShell');
const notFound = $('#notFound');
const form = $('#menuForm');
const categorySelect = $('#category');
const errorMessage = $('#errorMessage');

function populateCategories() {
  categorySelect.innerHTML = CATEGORIES.map((category) => (
    `<option value="${category.id}">${category.name}</option>`
  )).join('');
}

function getFormData() {
  return {
    name: $('#name').value,
    category: $('#category').value,
    price: $('#price').value,
    image: $('#image').value,
    description: $('#description').value
  };
}

function validateMenu(menuData) {
  if (!menuData.name.trim()) return 'Name is required.';
  if (!menuData.category) return 'Category is required.';
  if (menuData.price === '' || Number(menuData.price) < 0) return 'Price must be 0 or more.';
  if (!menuData.description.trim()) return 'Description is required.';
  return '';
}

function fillForm() {
  $('#name').value = menu.name;
  $('#category').value = menu.category;
  $('#price').value = menu.price;
  $('#image').value = menu.image || '';
  $('#description').value = menu.description;
  $('#detailLink').href = `detail.html?id=${encodeURIComponent(menu.id)}`;
}

function renderPage() {
  populateCategories();
  if (!menu) {
    notFound.hidden = false;
    return;
  }
  formShell.hidden = false;
  fillForm();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = getFormData();
  const error = validateMenu(formData);
  errorMessage.textContent = error;
  if (error) return;

  const updated = updateMenu(menu.id, formData);
  window.location.href = `detail.html?id=${encodeURIComponent(updated.id)}`;
});

renderPage();
