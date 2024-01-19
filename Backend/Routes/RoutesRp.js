const Venta = require("../Model/ModelVenta");
const User = require("../Model/ModelUs");
const routerRp = require("express").Router();
const mongoose = require("mongoose");

const getNombreUsuario = async (idUsuario) => {
  const usuario = await User.findById(idUsuario);
  return usuario ? `${usuario.nombre} ${usuario.apellido}` : null;
};

// Clientes
routerRp.get("/reporte-cliente-mas-compro", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
        },
      },
      {
        $group: {
          _id: "$cliente",
          totalCompras: { $sum: 1 },
        },
      },
      {
        $sort: { totalCompras: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "cliente",
        },
      },
      {
        $unwind: "$cliente",
      },
      {
        $project: {
          _id: 0,
          nombre: "$cliente.nombre",
          apellido: "$cliente.apellido",
          cedula: "$cliente.cedula",
          correo: "$cliente.correo",
          totalCompras: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas de clientes",
      error: error.message,
    });
  }
}); /* LISTO */

// Ventas
routerRp.get("/reporte-ventas", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    // Realizar la consulta utilizando aggregate
    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
          "deleted": false,
        },
      },
      {
        $group: {
          _id: null,
          totalMontoVentas: { $sum: { $sum: "$productos.total" } },
          totalVentas: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalMontoVentas: 1,
          totalVentas: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al generar el reporte de ventas diarias" });
  }
}); /* LISTO */

routerRp.get("/reporte-ventas-clientes", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
        },
      },
      {
        $group: {
          _id: "$cliente",
          totalCompra: { $sum: 1 },
        },
      },
      {
        $sort: { totalCompra: -1 },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "cliente",
        },
      },
      {
        $unwind: "$cliente",
      },
      {
        $project: {
          _id: 0,
          nombre: "$cliente.nombre",
          apellido: "$cliente.apellido",
          cedula: "$cliente.cedula",
          correo: "$cliente.correo",
          totalCompra: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas de vendedor",
      error: error.message,
    });
  }
}); /* LISTO */

// Productos
routerRp.get("/reporte-ventas-productos", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
          "deleted": false,
        },
      },
      {
        $unwind: "$productos", // Desglosar la matriz de productos
      },
      {
        $group: {
          _id: "$productos.producto", // Agrupar por producto
          totalVenta: { $sum: "$productos.cantidad" }, // Sumar la cantidad de ventas por producto
        },
      },
      {
        $sort: { totalVenta: -1 }, // Ordenar por la cantidad de ventas en orden descendente
      },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          nombre: "$producto.nombre",
          categoria: "$producto.categorias",
          descripcion: "$producto.descripcion",
          totalVenta: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas de vendedor",
      error: error.message,
    });
  }
}); /* LISTO */

routerRp.get("/reporte-producto-mas-vendido", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
          "deleted": false,
        },
      },
      {
        $unwind: "$productos", // Desglosar la matriz de productos
      },
      {
        $group: {
          _id: "$productos.producto", // Agrupar por producto
          totalVentas: { $sum: "$productos.cantidad" }, // Sumar la cantidad de ventas por producto
        },
      },
      {
        $sort: { totalVentas: -1 }, // Ordenar por la cantidad de ventas en orden descendente
      },
      {
        $limit: 1, // Obtener el producto con la mayor cantidad de ventas
      },
      {
        $lookup: {
          from: "productos",
          localField: "_id",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $project: {
          _id: 0,
          nombre: "$producto.nombre",
          categoria: "$producto.categorias",
          descripcion: "$producto.descripcion",
          totalVentas: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas de vendedor",
      error: error.message,
    });
  }
}); /* LISTO */

// Categorías
routerRp.get("/reporte-ventas-categorias", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
          "deleted": false,
        },
      },
      {
        $unwind: "$productos", // Desglosar la matriz de productos
      },
      {
        $lookup: {
          from: "productos",
          localField: "productos.producto",
          foreignField: "_id",
          as: "producto",
        },
      },
      {
        $unwind: "$producto",
      },
      {
        $unwind: "$producto.categorias", // Desglosar la matriz de categorías
      },
      {
        $group: {
          _id: "$producto.categorias.nombre", // Agrupar por nombre de categoría
          totalVenta: { $sum: "$productos.total" }, // Sumar el total de ventas por categoría
          cantidadVendidos: { $sum: "$productos.cantidad" }, // Sumar la cantidad vendida por categoría
        },
      },
      {
        $project: {
          _id: 0,
          categoria: "$_id",
          totalVenta: 1,
          cantidadVendidos: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas por categorías",
      error: error.message,
    });
  }
}); /* LISTO */

// Vendedores
routerRp.get("/reporte-ventas-vendedor", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
        },
      },
      {
        $group: {
          _id: "$vendedor",
          totalVentas: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "vendedor",
        },
      },
      {
        $unwind: "$vendedor",
      },
      {
        $project: {
          _id: 0,
          nombre: "$vendedor.nombre",
          apellido: "$vendedor.apellido",
          cedula: "$vendedor.cedula",
          totalVentas: 1,
        },
      },
    ]);
    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas de vendedor",
      error: error.message,
    });
  }
}); /* LISTO */

routerRp.get("/reporte-vendedor-mas-vendio", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    // Validar que se proporcionen mes y año
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio y fechaFin" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
        },
      },
      {
        $group: {
          _id: "$vendedor",
          totalVentas: { $sum: 1 },
          productosVendidos: { $sum: "$cantidad" },
        },
      },
      {
        $sort: { totalVentas: -1 },
      },
      {
        $limit: 1,
      },
      {
        $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "vendedor",
        },
      },
      {
        $unwind: "$vendedor",
      },
      {
        $project: {
          _id: 0,
          nombre: "$vendedor.nombre",
          apellido: "$vendedor.apellido",
          cedula: "$vendedor.cedula",
          totalVentas: 1,
          productosVendidos: 1,
        },
      },
    ]);

    res.json(reporte);
  } catch (error) {
    res.status(500).json({
      message: "Error al generar el reporte de ventas de vendedor",
      error: error.message,
    });
  }
}); /* LISTO */

// Pagina de vendedores
routerRp.get("/reporte-ventas-vendedor/:id", async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const { id } = req.params;

    // Validar que se proporcionen fechaInicio, fechaFin y id
    if (!fechaInicio || !fechaFin || !id) {
      return res.status(400).json({ message: "Debe proporcionar fechaInicio, fechaFin y el ID del vendedor" });
    }

    const fechaInicioFormateada = new Date(fechaInicio);
    const fechaFinFormateada = new Date(fechaFin);

    // Realizar la consulta utilizando aggregate
    const reporte = await Venta.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: fechaInicioFormateada,
            $lte: fechaFinFormateada,
          },
          vendedor: new mongoose.Types.ObjectId(id), // Convertir el ID a ObjectId
          "deleted": false,
        },
      },
      {
        $group: {
          _id: "$vendedor",
          totalMontoVentas: { $sum: { $sum: "$productos.total" } },
          totalVentas: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          vendedor: "$_id",
          totalMontoVentas: 1,
          totalVentas: 1,
        },
      },
    ]);

    // Obtener el nombre del vendedor
    const vendedor = await getNombreUsuario(id);

    // Agregar el nombre del vendedor al reporte
    reporte.forEach(reporte => {
      reporte.vendedor = vendedor;
    });

    res.json(reporte);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al generar el reporte de ventas por vendedor: " + error.message });
  }
});

module.exports = routerRp;
