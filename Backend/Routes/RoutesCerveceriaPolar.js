const Product = require("../Model/ModelPr");
const routerCp = require("express").Router();

routerCp.get("/cerveceria-polar", async (req, res) => {
    try {
        const productos = await Product.find({
          "categorias.nombre": "Cerveceria Polar",
          deleted: false,
        });
    
        if (!productos || productos.length === 0) {
          return res.status(404).json({ message: "Productos no encontrados en la categoría Cerveceria Polar" });
        }
    
        res.status(200).json({
          titulo: "Cerveceria Polar",
          productos: productos,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
      }
});

module.exports = routerCp;
