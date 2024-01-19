import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalCrUs = ({ show, setShowModalCreatePr, Api }) => {
  const [formData, setFormData] = useState({
    rol: "",
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    nro_tlf: "",
    nro_hab: "",
    clave: "",
    direccion: "",
    imagen: null,
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await axios.get("http://localhost:3001/usuarios/roles");
      setRoles(response.data.roles);
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
  };

  const handleSaveChanges = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("rol", formData.rol);
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("apellido", formData.apellido);
      formDataToSend.append("cedula", formData.cedula);
      formDataToSend.append("correo", formData.correo);
      formDataToSend.append("nro_tlf", formData.nro_tlf);
      formDataToSend.append("nro_hab", formData.nro_hab);
      formDataToSend.append("clave", formData.clave);
      formDataToSend.append("direccion", formData.direccion);
      formDataToSend.append("imagen", formData.imagen);

      const response = await axios.post(Api, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setShowModalCreatePr(false);
      } else {
        console.error("Error al crear el elemento:", response.data);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  };

  return (
    <Modal show={show} onHide={() => setShowModalCreatePr(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Crear</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Imagen</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
            <Form.Label className="mt-2">Rol</Form.Label>
            <Form.Select onChange={(e) => handleInputChange(e, "rol")}>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Form.Select>
            <Form.Label className="mt-2">Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre"
              onChange={(e) => handleInputChange(e, "nombre")}
            />
            <Form.Label className="mt-2">Apellido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Apellido"
              onChange={(e) => handleInputChange(e, "apellido")}
            />
            <Form.Label className="mt-2">Cédula</Form.Label>
            <Form.Control
              type="text"
              placeholder="Cédula"
              onChange={(e) => handleInputChange(e, "cedula")}
            />
            <Form.Label className="mt-2">Correo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Correo"
              onChange={(e) => handleInputChange(e, "correo")}
            />
            <Form.Label className="mt-2">Nro. Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nro. Teléfono"
              onChange={(e) => handleInputChange(e, "nro_tlf")}
            />
            <Form.Label className="mt-2">Nro. Habitación</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nro. Habitación"
              onChange={(e) => handleInputChange(e, "nro_hab")}
            />
            <Form.Label className="mt-2">Contraseña</Form.Label>
            <Form.Control
              type="text"
              placeholder="Contraseña"
              onChange={(e) => handleInputChange(e, "clave")}
            />
            <Form.Label className="mt-2">Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Dirección"
              onChange={(e) => handleInputChange(e, "direccion")}
            />
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
  );
};
