import React, { useState } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalCrPr = ({ show, setShowModalCreatePr, Api, updateData }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    categorias: "",
    subcategoria: "",
    precio: "",
    inventario: "",
    descripcion: "",
    imagen: null,
  });
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    setFormData({ ...formData, [fieldName]: value });
    validateField(fieldName, value);
  };

  const validateField = (fieldName, value) => {
    let errors = { ...validationErrors };
    if (fieldName === "nombre") {
      if (value.trim() === "") {
        errors[fieldName] = "El nombre es obligatorio";
      } else if (!/^[a-zA-Z0-9 .-]+$/) {
        errors[fieldName] = "El nombre solo admite letras y números";
      } else {
        delete errors[fieldName];
      }
    }

    if (fieldName === "categorias") {
      if (value.trim() === "") {
        errors[fieldName] = "La subcategoría es obligatoria";
      } else {
        delete errors[fieldName];
      }
    }

    if (fieldName === "subcategoria") {
      if (value.trim() === "") {
        errors[fieldName] = "La subcategoría es obligatoria";
      } else {
        delete errors[fieldName];
      }
    }

    if (fieldName === "precio") {
      if (isNaN(value)) {
        errors[fieldName] = "El precio debe ser un número válido";
      } else {
        delete errors[fieldName];
      }
    }

    if (fieldName === "inventario") {
      if (isNaN(value)) {
        errors[fieldName] = "El inventario debe ser un número válido";
      } else if (value.trim() === "") {
        errors[fieldName] = "El inventario es obligatorio";
      } else {
        delete errors[fieldName];
      }
    }

    if (fieldName === "descripcion") {
      if (value.trim() === "") {
        errors[fieldName] = "La descripción es obligatoria";
      } else if (!/^[a-zA-Z0-9 .,!?¿%]+$/) {
        errors[fieldName] =
          "La descripción solo admite letras, números y estos caracteres especiales: . , ! ? ¿ %";
      } else {
        delete errors[fieldName];
      }
    }

    setValidationErrors(errors);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
  };

  const handleSaveChanges = async () => {
    if (Object.keys(validationErrors).length === 0) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("nombre", formData.nombre);
        const categorias = [
          {
            nombre: formData.categorias,
            subcategorias: formData.subcategoria.split(","), // Las subcategorías podrían separarse por comas
          },
        ];
        formDataToSend.append("categorias", JSON.stringify(categorias));
        formDataToSend.append("precio", formData.precio);
        formDataToSend.append("inventario", formData.inventario);
        formDataToSend.append("descripcion", formData.descripcion);
        formDataToSend.append("imagen", formData.imagen);

        const response = await axios.post(Api, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          setShowModalCreatePr(false);
          updateData();
        } else {
          console.error("Error al crear el elemento:", response.data);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud POST:", error);
      }
    } else {
      console.error(
        "No se pueden guardar los cambios debido a errores de validación:",
        validationErrors
      );
    }
  };

  return (
    <>
      <Modal show={show} onHide={() => setShowModalCreatePr(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
              <Form.Label className="mt-2">Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="nombre"
                onChange={(e) => handleInputChange(e, "nombre")}
              />
              {validationErrors.nombre && (
                <>
                  {" "}
                  <Form.Text className="text-danger">
                    {validationErrors.nombre}
                  </Form.Text>
                  <br />
                </>
              )}
              <Form.Label className="mt-2">Categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Categoría"
                name="categorias"
                onChange={(e) => handleInputChange(e, "categorias")}
              />
              {validationErrors.categorias && (
                <>
                  {" "}
                  <Form.Text className="text-danger">
                    {validationErrors.categorias}
                  </Form.Text>
                </>
              )}
              <Form.Label className="mt-2">Sub-categoría</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sub-categoría"
                name="subcategoria"
                onChange={(e) => handleInputChange(e, "subcategoria")}
              />
              {validationErrors.subcategoria && (
                <>
                  {" "}
                  <Form.Text className="text-danger">
                    {validationErrors.subcategoria}
                  </Form.Text>
                </>
              )}
              <Form.Label className="mt-2">Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio"
                name="precio"
                onChange={(e) => handleInputChange(e, "precio")}
              />
              {validationErrors.precio && (
                <>
                  {" "}
                  <Form.Text className="text-danger">
                    {validationErrors.precio}
                  </Form.Text>
                </>
              )}
              <Form.Label className="mt-2">Inventario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Inventario"
                name="inventario"
                onChange={(e) => handleInputChange(e, "inventario")}
              />
              {validationErrors.inventario && (
                <>
                  {" "}
                  <Form.Text className="text-danger">
                    {validationErrors.inventario}
                  </Form.Text>
                </>
              )}
              <Form.Label className="mt-2">Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripción"
                name="descripcion"
                onChange={(e) => handleInputChange(e, "descripcion")}
              />
              {validationErrors.descripcion && (
                <>
                  {" "}
                  <Form.Text className="text-danger">
                    {validationErrors.descripcion}
                  </Form.Text>
                </>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowModalCreatePr(false)}
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
