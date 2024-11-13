// configureSocket.js
export const configureSocket = (io, productManager) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Enviar todos los productos al conectar
    productManager.getProducts({}, { pagination: false }).then((result) => {
      socket.emit("updateProducts", result.docs); // solo el array `docs`
    });

    // Agregar producto
    socket.on("addProduct", async (newProduct) => {
      await productManager.addProduct(newProduct);
      const updatedProducts = (
        await productManager.getProducts({}, { pagination: false })
      ).docs;
      io.emit("updateProducts", updatedProducts); // solo el array
    });

    // Eliminar producto
    socket.on("deleteProduct", async (productId) => {
      await productManager.deleteProduct(productId);
      const updatedProducts = (
        await productManager.getProducts({}, { pagination: false })
      ).docs;
      io.emit("updateProducts", updatedProducts); // solo el array
    });

    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
