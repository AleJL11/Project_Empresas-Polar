import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
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

  useEffect(() => {
    const fetchCorrelativoFactura = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/correlativo`
        );
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
      <Modal show={show} onHide={() => setShowModalCreateVs(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="mt-2">Cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Cliente"
                onChange={(e) => handleInputChange(e, "cliente")}
              />
              <Form.Label className="mt-2">Vendedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vendedor"
                onChange={(e) => handleInputChange(e, "vendedor")}
              />
              <Form.Label className="mt-2">Producto</Form.Label>
              <Form.Control
                as="select"
                multiple // Permite selección múltiple
                name="productos"
                value={formData.productos}
                onChange={(e) => handleInputChange(e, "productos")}
              >
                <option value="">Seleccionar productos</option>
                {productos.map((producto, index) => (
                  <option key={index} value={producto.nombre}>
                    {producto.nombre}
                  </option>
                ))}
              </Form.Control>
              <Form.Label className="mt-2">N° Factura</Form.Label>
              <Form.Control
                type="text"
                placeholder="N° Factura"
                value={correlativoFactura}
                disabled
              />
              <Form.Label className="mt-2">Precio Unitario</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Precios Unitarios"
                value={formData.productos
                  .map(
                    (producto, index) =>
                      `${producto}: ${formData.preciosUnitarios[index]}`
                  )
                  .join("\n")}
                disabled
                style={{ height: `${formData.productos.length * 30}px` }}
              />

              {formData.productos.map((producto, index) => (
                <>
                  <Form.Label className="mt-2">Cantidades</Form.Label>
                  <div key={index}>
                    <Form.Label>{producto}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Cantidad de ${producto}`}
                      value={formData.cantidades[producto]}
                      onChange={(e) => handleCantidadChange(e, producto)}
                    />
                  </div>
                </>
              ))}

              {formData.productos.map((producto, index) => (
                <>
                  <Form.Label className="mt-2">Sub-Total</Form.Label>
                  <div key={index}>
                    <Form.Label className="mt-2">{producto}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`Subtotal de ${producto}`}
                      value={formData.subtotales[producto]}
                      disabled
                    />
                  </div>
                </>
              ))}
              <Form.Label className="mt-2">Total</Form.Label>
              <Form.Control
                type="text"
                placeholder="Total"
                value={formData.total}
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModalCreateVs(false)}
          >
            Cerrar
          </Button>
          <Button variant="outline-primary" onClick={handleSaveChanges}>
            Crear
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
