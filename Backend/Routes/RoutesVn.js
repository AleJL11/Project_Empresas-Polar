const Venta = require("../Model/ModelVenta");
const Product = require("../Model/ModelPr");
const User = require("../Model/ModelUs");
const routerVn = require("express").Router();
const { isValidObjectId } = require("mongoose");

const getNombreUsuario = async (idUsuario) => {
  const usuario = await User.findById(idUsuario);
  return usuario ? `${usuario.nombre} ${usuario.apellido}` : null;
};

const getNombreProductos = async (productos) => {
  const nombresProductos = await Promise.all(
    productos.map(async (producto) => {
      const productoDetalles = await Product.findById(producto.producto);
      return productoDetalles ? productoDetalles.nombre : null;
    })
  );
  const nombresProductosFormateados = nombresProductos.join(", ");

  return nombresProductosFormateados;
};

const getPreciosUnitarios = async (productos) => {
  const preciosUnitarios = await Promise.all(
    productos.map(async (producto) => {
      const productoDetalles = await Product.findById(producto.producto);
      return productoDetalles
        ? `${productoDetalles.nombre} - Precio: ${producto.precioUnitario}`
        : null;
    })
  );
  const preciosUnitariosFormateados = preciosUnitarios.join(", ");

  return preciosUnitariosFormateados;
};

const getCantidadProductos = async (productos) => {
  const cantidadesProductos = await Promise.all(
    productos.map(async (producto) => {
      const productoCantidad = await Product.findById(producto.producto);
      return productoCantidad
        ? `${productoCantidad.nombre} - Cantidad: ${producto.cantidad}`
        : null;
    })
  );

  const cantidadesFormateadas = cantidadesProductos.join(", ");

  return cantidadesFormateadas;
};

const getSubTotalProductos = async (productos) => {
  const subtotalProductos = await Promise.all(
    productos.map(async (producto) => {
      const productoSubTotal = await Product.findById(producto.producto);
      return productoSubTotal
        ? `${productoSubTotal.nombre} - Subtotal: ${producto.total}`
        : null;
    })
  );

  const subtotalFormateado = subtotalProductos.join(", ");

  return subtotalFormateado;
};

const getTotalProductos = async (productos) => {
  const total = productos.reduce(
    (acc, producto) => acc + producto.cantidad * producto.precioUnitario,
    0
  );

  return total;
};

// Obtener todos los pedidos
routerVn.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const searchTerm = req.query.search;

  try {
    let query = { deleted: false };
    if (searchTerm) {
      query = {
        $and: [
          { deleted: false },
          {
            $or: [{ numeroFactura: { $regex: searchTerm, $options: "i" } }],
          },
        ],
      };
    }

    // Agregar el filtro por rol (cambiado a "cliente" y "vendedor" en lugar de "rol")
    if (req.query.cliente) {
      query["cliente"] = req.query.cliente;
    }
    if (req.query.vendedor) {
      query["vendedor"] = req.query.vendedor;
    }

    const totalDocs = await Venta.countDocuments(query);
    const pageCount = Math.ceil(totalDocs / limit);

    const options = {
      page,
      limit,
    };

    const ventas = await Venta.paginate(query, options);

    const ventasWithNames = await Promise.all(
      ventas.docs.map(async (venta) => {
        const cliente = await getNombreUsuario(venta.cliente);
        const vendedor = await getNombreUsuario(venta.vendedor);
        const productosDetalles = await getNombreProductos(venta.productos);
        const productosPrecioUnitario = await getPreciosUnitarios(
          venta.productos
        );
        const productosCantidadProductos = await getCantidadProductos(
          venta.productos
        );
        const productoSubTotal = await getSubTotalProductos(venta.productos);
        const productoTotal = await getTotalProductos(venta.productos);

        return {
          ...venta.toObject(),
          cliente,
          vendedor,
          productosDetalles,
          productosPrecioUnitario,
          productosCantidadProductos,
          productoSubTotal,
          productoTotal,
        };
      })
    );

    res.status(200).json({
      data: ventasWithNames,
      meta: { totalDocs, pageCount },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener ventas", error: error.message });
  }
});

// Obtener pedidos por ID de venta
routerVn.get("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ message: "El ID de la venta debe ser un ObjectId válido" });
    }

    const sale = await Venta.findById(req.params.id);

    if (!sale) {
      return res.status(404).json({ message: "No se encontró la venta" });
    }

    const cliente = await getNombreUsuario(sale.cliente);
    const vendedor = await getNombreUsuario(sale.vendedor);
    const productosDetalles = await getNombreProductos(sale.productos);
    const productosPrecioUnitario = await getPreciosUnitarios(sale.productos);
    const productosCantidadProductos = await getCantidadProductos(
      sale.productos
    );
    const productoSubTotal = await getSubTotalProductos(sale.productos);
    const productoTotal = await getTotalProductos(sale.productos);

    const ventaWithNames = {
      ...sale.toObject(),
      cliente,
      vendedor,
      productosDetalles,
      productosPrecioUnitario,
      productosCantidadProductos,
      productoSubTotal,
      productoTotal,
    };

    res.status(200).json(ventaWithNames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener pedidos por ID de vendedor
routerVn.get("/vendedor/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ message: "El ID del vendedor debe ser un ObjectId válido" });
    }

    const ventas = await Venta.find({ vendedor: req.params.id });

    if (!ventas) {
      return res.status(404).json({ message: "No se encontraron ventas para este vendedor" });
    }

    const ventasConDetalles = await Promise.all(ventas.map(async (venta) => {
      const cliente = await getNombreUsuario(venta.cliente);
      const vendedor = await getNombreUsuario(venta.vendedor);
      const productosDetalles = await getNombreProductos(venta.productos);
      const productosPrecioUnitario = await getPreciosUnitarios(venta.productos);
      const productosCantidadProductos = await getCantidadProductos(venta.productos);
      const productoSubTotal = await getSubTotalProductos(venta.productos);
      const productoTotal = await getTotalProductos(venta.productos);

      return {
        ...venta.toObject(),
        cliente,
        vendedor,
        productosDetalles,
        productosPrecioUnitario,
        productosCantidadProductos,
        productoSubTotal,
        productoTotal,
      };
    }));

    res.status(200).json(ventasConDetalles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener correlativo
routerVn.get("/correlativo", async (req, res) => {
  try {
    const ultimaVenta = await Venta.findOne(
      {},
      {},
      { sort: { numeroFactura: -1 } }
    );
    let correlativo = "00000001";

    if (ultimaVenta) {
      const ultimoNumeroFactura = ultimaVenta.numeroFactura.toString();
      const nuevoNumeroFactura = (parseInt(ultimoNumeroFactura, 10) + 1)
        .toString()
        .padStart(7, "0");
      correlativo = nuevoNumeroFactura;
    }

    res.status(200).json({ correlativo });
  } catch (error) {
    console.error("Error al obtener el correlativo de factura:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el correlativo de factura" });
  }
});

// Middleware para actualizar precioUnitario en tiempo real
const actualizarPrecioUnitario = async (req, res, next) => {
  const { nombres } = req.query;

  try {
    const nombresArray = Array.isArray(nombres) ? nombres : [nombres]; // Convert the parameter to an array if it's not already an array
    const regexArray = nombresArray.map((nombre) => new RegExp(nombre, "i"));
    const productos = await Product.find(
      { nombre: { $in: regexArray } },
      "nombre precio"
    );

    if (!productos || productos.length === 0) {
      return res.status(404).json({ message: "Productos no encontrados" });
    }

    const preciosUnitarios = {};
    productos.forEach((producto) => {
      preciosUnitarios[producto.nombre] = producto.precio; // Store the unit price of each product in the object
    });

    req.preciosUnitarios = preciosUnitarios;
    next();
  } catch (error) {
    console.error("Error al obtener los precios de los productos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};

routerVn.get("/precios-unitarios", actualizarPrecioUnitario, (req, res) => {
  if (req.preciosUnitarios !== undefined) {
    res.status(200).json({ precios: req.preciosUnitarios }); // Return the unit prices of the products
  } else {
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// Insertar un nuevo pedido
const insertVenta = async (req, res) => {
  try {
    const { cliente, vendedor, productos, numeroFactura } = req.body;

    // Busca los usuarios por sus nombres
    const [nombreCliente, apellidoCliente] = cliente.split(" ");
    const clienteUsuario = await User.findOne({ nombre: nombreCliente, apellido: apellidoCliente });

    if (!clienteUsuario) {
      return res.status(400).json({ message: "Cliente no encontrado" });
    }

    let vendedoresUsuarios = [];
    if (Array.isArray(vendedor)) {
      vendedoresUsuarios = await Promise.all(
        vendedor.map(async (vend) => {
          const vendedorUsuario = await User.findOne({ nombre: vend.split(" ")[0] });
          if (!vendedorUsuario) {
            return res.status(400).json({ message: `Vendedor ${vend} no encontrado` });
          }
          return vendedorUsuario._id;
        })
      );
    } else {
      const vendedorUsuario = await User.findOne({ nombre: vendedor.split(" ")[0] });
      if (!vendedorUsuario) {
        return res.status(400).json({ message: `Vendedor ${vendedor} no encontrado` });
      }
      vendedoresUsuarios.push(vendedorUsuario._id);
    }

    const productosDetalles = await Promise.all(
      productos.map(async (producto) => {
        const productoDetalles = await Product.findOne({
          nombre: producto.nombre,
        });

        if (!productoDetalles) {
          return res
            .status(400)
            .json({ message: `Producto ${producto.nombre} no encontrado` });
        }

        return {
          producto: productoDetalles._id,
          cantidad: producto.cantidad,
          precioUnitario: productoDetalles.precio,
          total: producto.cantidad * productoDetalles.precio,
        };
      })
    );

    const totalVenta = productosDetalles.reduce(
      (acc, producto) => acc + producto.total,
      0
    );

    const venta = new Venta({
      cliente: clienteUsuario._id,
      vendedor: vendedoresUsuarios,
      productos: productosDetalles,
      numeroFactura,
      total: totalVenta,
    });

    await venta.save();
    res.status(201).json(venta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la venta" });
  }
};

routerVn.post("/", insertVenta);

// Actualizar un pedido
routerVn.patch("/:id", async (req, res) => {
  try {
    const clienteUsuario = req.body.cliente
      ? await User.findOne({ nombre: req.body.cliente })
      : null; // Buscar el cliente si se proporciona
    const vendedorUsuario = req.body.vendedor
      ? await User.findOne({ nombre: req.body.vendedor })
      : null; // Buscar el vendedor si se proporciona

    let ventaData = await Venta.findById(req.params.id);

    if (!ventaData) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    if (vendedorUsuario) {
      ventaData.vendedor = vendedorUsuario._id; // Actualizar el vendedor si se proporciona
    }

    if (clienteUsuario) {
      ventaData.cliente = clienteUsuario._id; // Actualizar el cliente si se proporciona
    }

    let updatedVenta = await ventaData.save();

    res.json(updatedVenta);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Eliminar un pedido
routerVn.delete("/:id", async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res
        .status(400)
        .json({ message: "ID de usuario no válido DELETE" });
    }

    const sales = await Venta.findByIdAndUpdate(
      req.params.id,
      { deleted: true }, // Establecer el campo 'deleted' en true
      { new: true } // Devolver el objeto de usuario actualizado
    );

    if (!sales) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(sales);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al eliminar el usuario", error: error.message });
  }
});

module.exports = routerVn;
