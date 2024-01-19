import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalEditVs = ({
  show,
  setShowModal,
  updateData,
  editItemId,
  Api,
}) => {
  const [formData, setFormData] = useState({
    cliente: "",
    vendedor: "",
    productosDetalles: [],
    numeroFactura: "",
    productosPrecioUnitario: 0,
    productosCantidadProductos: 0,
    productoSubTotal: 0,
    productoTotal: 0,
  });
  //console.log(editItemId);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (editItemId) {
          const response = await axios.get(`http://localhost:3001/ventas/${editItemId}`);
          const ventaData = response.data;
          setFormData({
            cliente: ventaData.cliente,
            vendedor: ventaData.vendedor,
            productosDetalles: ventaData.productosDetalles,
            numeroFactura: ventaData.numeroFactura,
            productosPrecioUnitario: ventaData.productosPrecioUnitario,
            productosCantidadProductos: ventaData.productosCantidadProductos,
            productoSubTotal: ventaData.productoSubTotal,
            productoTotal: ventaData.productoTotal,
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos de la venta:", error);
      }
    };

    fetchData();
  }, [editItemId]);

  const handleInputChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      const formDataToSend = {
        cliente: formData.cliente,
        vendedor: formData.vendedor,
      };

      const response = await axios.patch(
        `http://localhost:3001/ventas/${editItemId}`,
        formDataToSend
      );
      console.log(response.data);
      if (response.status === 200) {
        setShowModal(false);
        updateData();
      } else {
        console.error("Error al actualizar los datos:", response.data);
      }
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Cliente</Form.Label>
              <Form.Control
                type="text"
                value={formData.cliente}
                onChange={(e) => handleInputChange(e, "cliente")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Vendedor</Form.Label>
              <Form.Control
                type="text"
                value={formData.vendedor}
                onChange={(e) => handleInputChange(e, "vendedor")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Productos</Form.Label>
              <Form.Control
                type="text"
                value={formData.productosDetalles}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>N° Factura</Form.Label>
              <Form.Control
                type="text"
                value={formData.numeroFactura}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Precios Unitarios</Form.Label>
              <Form.Control
                type="text"
                value={formData.productosPrecioUnitario}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cantidad de Productos</Form.Label>
              <Form.Control
                type="text"
                value={formData.productosCantidadProductos}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Subtotal por Producto</Form.Label>
              <Form.Control
                type="text"
                value={formData.productoSubTotal}
                disabled
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total</Form.Label>
              <Form.Control
                type="text"
                value={formData.productoTotal}
                disabled
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
          >
            Cerrar
          </Button>
          <Button variant="outline-primary" onClick={handleFormSubmit}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
