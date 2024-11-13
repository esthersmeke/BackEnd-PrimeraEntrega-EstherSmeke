// configureSocket.js

export const configureSocket = (io, productManager) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Enviar la lista de productos actual al cliente al conectarse
    productManager.getProducts().then((result) => {
      socket.emit("updateProducts", result.docs); // Emitir solo el array `docs`
    });

    // Escuchar y manejar el evento para agregar un nuevo producto
    socket.on("addProduct", async (newProduct) => {
      await productManager.addProduct(newProduct);
      const updatedProducts = (await productManager.getProducts()).docs;
      io.emit("updateProducts", updatedProducts); // Emitir solo el array actualizado
    });

    // Escuchar y manejar el evento para eliminar un producto específico
    socket.on("deleteProduct", async (productId) => {
      await productManager.deleteProduct(productId);
      const updatedProducts = (await productManager.getProducts()).docs;
      io.emit("updateProducts", updatedProducts); // Emitir solo el array actualizado
    });

    // Mensaje al desconectarse el cliente
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
