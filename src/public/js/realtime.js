//src/public/js/realtime.js
const socket = io();

// Escuchar el evento de actualización de productos
socket.on("updateProducts", (newProduct) => {
  const productList = document.getElementById("productList");
  const newListItem = document.createElement("li");
  newListItem.innerHTML = `<strong>${newProduct.title}</strong> - ${newProduct.description} (${newProduct.price})`;
  productList.appendChild(newListItem);
});

// Escuchar la eliminación de un producto
socket.on("removeProduct", (productId) => {
  const productList = document.getElementById("productList");
  const productItem = productList.querySelector(`li[data-id="${productId}"]`);
  if (productItem) {
    productList.removeChild(productItem);
  }
});

// Manejar el envío del formulario
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const newProduct = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    thumbnail: document.getElementById("thumbnail").value,
  };

  socket.emit("addProduct", newProduct); // Enviamos el nuevo producto vía WebSocket

  // Limpiar el formulario
  document.getElementById("productForm").reset();
});
