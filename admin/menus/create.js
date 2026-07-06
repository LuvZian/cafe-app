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

function validateMenu(menu) {
  if (!menu.name.trim()) return 'Name is required.';
  if (!menu.category) return 'Category is required.';
  if (menu.price === '' || Number(menu.price) < 0) return 'Price must be 0 or more.';
  if (!menu.description.trim()) return 'Description is required.';
  return '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = getFormData();
  const error = validateMenu(formData);
  errorMessage.textContent = error;
  if (error) return;

  const menu = createMenu(formData);
  window.location.href = `detail.html?id=${encodeURIComponent(menu.id)}`;
});

populateCategories();
