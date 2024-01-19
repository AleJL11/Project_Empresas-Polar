import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalEdit = ({
  showModal,
  setShowModal,
  editItemId,
  updateData,
  itemData,
  Api,
  formFields,
  categoriasOptions
}) => {
  const [formData, setFormData] = useState({});

  const handleSaveChanges = async () => {
    try {
      if (!editItemId || editItemId === "undefined") {
        console.error("No se ha seleccionado elemento para editar");
        return;
      }
      if (Object.keys(formData).length === 0) {
        console.error("No se han proporcionado datos para actualizar");
        return;
      }
      const response = await axios.patch(`${Api}/${editItemId}`, formData);
      if (response.status === 200) {
        setShowModal(false);
        updateData();
      } else {
        console.error("Error al actualizar los datos:", response.data);
      }
      
    } catch (error) {
      console.error("Error al realizar la solicitud PATCH:", error);
    }
  };

  useEffect(() => {
    if (editItemId && itemData) {
        setFormData(itemData);
    }
  }, [editItemId, itemData]);

  const handleCategoriaChange = (e) => {
    const selectedCat = e.target.value;
    setFormData({ ...formData, categoria: selectedCat, subcategoria: "" });
  };

  const handleSubcategoriaChange = (e) => {
    setFormData({ ...formData, subcategoria: e.target.value });
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {formFields.map((field, index) => (
            <Form.Group key={index} controlId={`formBasic${field.name}`}>
              <Form.Label className="mt-2">{field.label}</Form.Label>
              {field.name === "categoria" ? (
                <Form.Control
                  type="select"
                  value={formData.categoria || ""}
                  onChange={handleCategoriaChange}
                >
                  <option value="">Seleccionar Categoría</option>
                  {categoriasOptions.map((categoria, index) => (
                    <option key={index} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </Form.Control>
              ) : field.name === "subcategoria" ? (
                <Form.Control
                  as="select"
                  value={formData.subcategoria || ""}
                  onChange={handleSubcategoriaChange}
                >
                  <option value="">Seleccionar Subcategoría</option>
                  {categoriasOptions
                    .find((cat) => cat.nombre === formData.categoria)
                    ?.subcategorias.map((subcat, index) => (
                      <option key={index} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                </Form.Control>
              ) : (
                <Form.Control
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                />
              )}
            </Form.Group>
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
        <Button variant="outline-primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
