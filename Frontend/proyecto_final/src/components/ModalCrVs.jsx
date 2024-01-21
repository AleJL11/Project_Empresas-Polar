import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalCrVs = ({ show, setShowModalCreateVs, Api, updateData }) => {
  const [formData, setFormData] = useState({
    cliente: "",
    vendedor: "",
    productos: [],
    preciosUnitarios: [],
    numeroFactura: "",
    cantidades: {},
    subtotales: {},
    total: 0,
  });

  const [productos, setProductos] = useState([]);
  const [correlativoFactura, setCorrelativoFactura] = useState("");

  const [nombre, setNombre] = useState("");
  const [vendedor, setVendedor] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [vendedorError, setVendedorError] = useState("");

  const regexNombreApellido = /^[a-zA-Z ]+$/;

  const nombreErrores = {
    formato:
      "El formato del nombre es inválido. Solo se admiten letras y espacios",
    vacio: "El nombre no puede estar vacío",
  };

  const vendedorErrores = {
    formato:
      "El formato del nombre es inválido. Solo se admiten letras y espacios",
    vacio: "El nombre no puede estar vacío",
  };

  const validarNombre = (nombre) => {
    if (nombre.trim() === "") {
      return "vacio";
    }

    return regexNombreApellido.test(nombre) ? "" : "formato";
  };

  const validarVendedor = (vendedor) => {
    if (vendedor.trim() === "") {
      return "vacio";
    }

    return regexNombreApellido.test(vendedor) ? "" : "formato";
  };

  useEffect(() => {
    const fetchCorrelativoFactura = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/correlativo`);
        setCorrelativoFactura(response.data.correlativo);
      } catch (error) {
        console.error("Error al obtener el correlativo de factura:", error);
      }
    };

    const fetchProductos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/productos", {
          params: { deleted: false },
        });
        setProductos(response.data.data);
      } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
      }
    };

    fetchCorrelativoFactura();
    if (show) {
      fetchProductos();
    }
  }, [show]);

  const handleInputChange = (e, fieldName) => {
    if (fieldName === "productos") {
      const selectedProducts = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      const preciosUnitarios = selectedProducts.map((nombreProducto) => {
        const producto = productos.find((p) => p.nombre === nombreProducto);
        return producto ? producto.precio : 0;
      });

      // Inicializamos las cantidades con 0 para cada producto
      const cantidades = {};
      selectedProducts.forEach((producto) => {
        cantidades[producto] = 0;
      });

      // Calculamos los subtotales iniciales
      const subtotales = {};
      selectedProducts.forEach((producto, index) => {
        subtotales[producto] = 0;
      });

      setFormData({
        ...formData,
        productos: selectedProducts,
        preciosUnitarios: preciosUnitarios,
        cantidades: cantidades,
        subtotales: subtotales, // Agregamos los subtotales al estado
      });
    } else {
      setFormData({
        ...formData,
        [fieldName]: e.target.value,
      });
    }
  };

  const handleCantidadChange = (e, producto) => {
    const newCantidades = { ...formData.cantidades };
    newCantidades[producto] = e.target.value;

    const subtotalProducto =
      newCantidades[producto] *
      formData.preciosUnitarios[formData.productos.indexOf(producto)];

    const newSubtotales = { ...formData.subtotales };
    newSubtotales[producto] = subtotalProducto;

    const subtotalesArray = Object.values(newSubtotales);

    const total = subtotalesArray.reduce((acc, curr) => acc + curr, 0);

    setFormData({
      ...formData,
      cantidades: newCantidades,
      subtotales: newSubtotales,
      total,
    });
  };

  const handleSaveChanges = async () => {
    try {
      const productosData = formData.productos.map((producto, index) => {
        return {
          nombre: producto,
          cantidad: formData.cantidades[producto],
          subtotal: formData.subtotales[producto],
          total: formData.total[producto],
          precioUnitario: formData.preciosUnitarios[producto],
        };
      });

      const ventaData = {
        cliente: formData.cliente,
        vendedor: formData.vendedor,
        numeroFactura: correlativoFactura,
        productos: productosData,
      };

      const response = await axios.post(
        "http://localhost:3001/ventas",
        ventaData
      );

      if (response.status === 201) {
        setShowModalCreateVs(false);
        updateData();
      } else {
        console.error("Error al crear la venta:", response.data);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  };

  return (
    <>
      <Modal size="xl" show={show} onHide={() => setShowModalCreateVs(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group
              className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center"
              controlId="formBasicEmail"
            >
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Cliente
              </Form.Label>
              <input
                type="text"
                placeholder="Cliente"
                value={nombre}
                onChange={(e) => {
                  handleInputChange(e, "cliente");
                  setNombre(e.target.value);
                  const error = validarNombre(e.target.value);
                  setNombreError(error ? nombreErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {nombreError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {nombreError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Vendedor
              </Form.Label>
              <input
                type="text"
                placeholder="Vendedor"
                value={vendedor}
                onChange={(e) => {
                  handleInputChange(e, "vendedor");
                  setVendedor(e.target.value);
                  const error = validarVendedor(e.target.value);
                  setVendedorError(error ? vendedorErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {vendedorError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {vendedorError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Producto
              </Form.Label>
              <select
                multiple
                name="productos"
                value={formData.productos}
                onChange={(e) => handleInputChange(e, "productos")}
                className="w-full lg:text-3xl md:text-[25px] rounded-lg p-2 border-2 border-slate-400"
              >
                <option value="">Seleccionar productos</option>
                {productos.map((producto, index) => (
                  <option key={index} value={producto.nombre}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                N° Factura
              </Form.Label>
              <input
                type="text"
                placeholder="N° Factura"
                value={correlativoFactura}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Precio Unitario
              </Form.Label>
              <input
                type="textarea"
                placeholder="Precios Unitarios"
                value={formData.productos
                  .map(
                    (producto, index) =>
                      `${producto}: ${formData.preciosUnitarios[index]}, `
                  )
                  .join("\n")}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
                style={{ height: `${formData.productos.length * 30}px` }}
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              {formData.productos.map((producto, index) => (
                <>
                  <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                    Cantidades
                  </Form.Label>
                  <div key={index}>
                    <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                      {producto}
                    </Form.Label>
                    <input
                      type="text"
                      placeholder={`Cantidad de ${producto}`}
                      value={formData.cantidades[producto]}
                      onChange={(e) => handleCantidadChange(e, producto)}
                      className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
                    />
                  </div>
                </>
              ))}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              {formData.productos.map((producto, index) => (
                <>
                  <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                    Sub-Total
                  </Form.Label>
                  <div key={index}>
                    <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                      {producto}
                    </Form.Label>
                    <input
                      type="text"
                      placeholder={`Subtotal de ${producto}`}
                      value={formData.subtotales[producto]}
                      disabled
                      className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
                    />
                  </div>
                </>
              ))}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Total
              </Form.Label>
              <input
                type="text"
                placeholder="Total"
                value={formData.total}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            variant="outline-secondary"
            onClick={() => setShowModalCreateVs(false)}
            className="lg:h-16 lg:text-3xl md:text-[25px] md:w-[20%] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-slate-400 hover:bg-slate-400 hover:text-white"
          >
            Cerrar
          </button>
          <button
            variant="outline-primary"
            onClick={handleSaveChanges}
            className="lg:h-16 lg:text-3xl md:text-[25px] md:w-[20%] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-blue-400 hover:bg-blue-400 hover:text-white"
          >
            Crear
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
