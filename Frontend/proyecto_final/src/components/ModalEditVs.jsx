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
      console.log(formDataToSend);
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
      <Modal size="xl" show={show} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar venta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Cliente</Form.Label>
              <input
                type="text"
                value={formData.cliente}
                onChange={(e) => handleInputChange(e, "cliente")}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Vendedor</Form.Label>
              <input
                type="text"
                value={formData.vendedor}
                onChange={(e) => handleInputChange(e, "vendedor")}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Productos</Form.Label>
              <input
                type="text"
                value={formData.productosDetalles}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">N° Factura</Form.Label>
              <input
                type="text"
                value={formData.numeroFactura}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Precios Unitarios</Form.Label>
              <input
                type="text"
                value={formData.productosPrecioUnitario}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Cantidad de Productos</Form.Label>
              <input
                type="text"
                value={formData.productosCantidadProductos}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Subtotal por Producto</Form.Label>
              <input
                type="text"
                value={formData.productoSubTotal}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">Total</Form.Label>
              <input
                type="text"
                value={formData.productoTotal}
                disabled
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            className="lg:h-16 lg:text-3xl md:text-[25px] md:w-[20%] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-slate-400 hover:bg-slate-400 hover:text-white"
          >
            Cerrar
          </button>
          <button
            variant="outline-primary"
            onClick={handleFormSubmit}
            className="lg:h-16 lg:text-3xl md:text-[25px] md:w-[20%] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-blue-400 hover:bg-blue-400 hover:text-white"
          >
            Crear
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
