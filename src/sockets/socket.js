//src/sockets/socket.js
export const configureSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Cliente conectado");

    // Evento para agregar un nuevo producto
    socket.on("addProduct", (newProduct) => {
      // Aquí podrías incluir lógica adicional para validar o procesar el producto antes de emitirlo
      io.emit("updateProducts", newProduct); // Emitir el producto a todos los clientes
    });

    // Evento para eliminar un producto
    socket.on("deleteProduct", (productId) => {
      io.emit("removeProduct", productId); // Emitir la eliminación del producto a todos los clientes
    });

    // Evento de desconexión del cliente
    socket.on("disconnect", () => {
      console.log("Cliente desconectado");
    });
  });
};
