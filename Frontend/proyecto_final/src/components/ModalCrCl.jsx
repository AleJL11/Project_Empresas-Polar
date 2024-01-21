import React, { useState } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalCrCl = ({ show, setShowModalCreateCl, Api, updateData }) => {
  const [formData, setFormData] = useState({
    rol: "",
    nombre: "",
    apellido: "",
    cedula: "",
    correo: "",
    nro_tlf: "",
    clave: "",
    direccion: "",
    imagen: null,
  });

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [apellidoError, setApellidoError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contrasenaError, setContrasenaError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");
  const [cedulaError, setCedulaError] = useState("");
  const [direccionError, setDireccionError] = useState("");

  const regexNombreApellido = /^[a-zA-Z ]+$/;
  const regexCorreo = /^[a-zA-Z0-9._-]+@([a-zA-Z0-9.-]{2,7})+\.com$/;
  const regexTlf = /^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
  const regexCedula = /^(V-|E-)\d{1,8}$/;
  const regexDireccion = /^[a-zA-Z0-9 ]+$/;

  const nombreErrores = {
    formato:
      "El formato del nombre es inválido. Solo se admiten letras y espacios",
    vacio: "El nombre no puede estar vacío",
  };

  const apellidoErrores = {
    formato:
      "El formato del apellido es inválido. Solo se admiten letras y espacios",
    vacio: "El apellido no puede estar vacío",
  };

  const emailErrores = {
    formato: "El formato del correo es inválido. Debe ser usuario@dominio.com",
    faltaArroba: "Falta el símbolo @ en el correo",
    dominioInvalido: "El dominio del correo no es válido",
  };

  const claveErrores = {
    longitud: "La contraseña debe tener entre 8 y 10 caracteres",
    mayusculas: "La contraseña debe incluir al menos una letra mayúscula",
    numeros: "La contraseña debe incluir al menos un número",
    caracteresEspeciales:
      "La contraseña debe incluir al menos un carácter especial",
  };

  const telefonoErrores = {
    formato:
      "El formato es inválido, debe ser los siguientes: +1 (123) 456-7890 o 555-555-5555 o +54 9 11 1234-5678 o (541) 123-4567 o 123 456 7890",
  };

  const cedulaErrores = {
    formato:
      "El formato es inválido, debe ser los siguientes: V-12345678 o E-12345678",
    longitud: "La cédula debe tener como máximo 10 caracteres",
  };

  const direccionErrores = {
    vacio: "La dirección no puede estar vacío",
    formato:
      "El formato es inválido, solo se admiten letras, números y espacios",
    longitud: "No puede tener más de 200 caracteres",
  };

  const validarNombre = (nombre) => {
    if (nombre.trim() === "") {
      return "vacio";
    }

    return regexNombreApellido.test(nombre) ? "" : "formato";
  };

  const validarApellido = (apellido) => {
    if (apellido.trim() === "") {
      return "vacio";
    }

    return regexNombreApellido.test(apellido) ? "" : "formato";
  };

  const validarCorreo = (correo) => {
    if (!correo.includes("@")) {
      return "faltaArroba";
    }

    const parts = correo.split("@");

    if (!parts[1].includes(".com")) {
      return "dominioInvalido";
    }

    return regexCorreo.test(correo) ? "" : "formato";
  };

  const validarPassword = (contrasena) => {
    if (contrasena.length < 8 || contrasena.length > 10) {
      return "longitud";
    }

    if (!/[A-Z]/.test(contrasena)) {
      return "mayusculas";
    }

    if (!/[0-9]/.test(contrasena)) {
      return "numeros";
    }

    if (!/[^a-zA-Z0-9]/.test(contrasena)) {
      return "caracteresEspeciales";
    }

    return "";
  };

  const validarTelefono = (telefono) => {
    return regexTlf.test(telefono) ? "" : "formato";
  };

  const validarCedula = (cedula) => {
    if (cedula.length > 10) {
      return "longitud";
    }

    return regexCedula.test(cedula) ? "" : "formato";
  };

  const validarDireccion = (direccion) => {
    if (direccion.trim() === "") {
      return "vacio";
    }

    if (direccion.length > 200) {
      return "longitud";
    }

    return regexDireccion.test(direccion) ? "" : "formato";
  };

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
      formDataToSend.append("clave", formData.clave);
      formDataToSend.append("direccion", formData.direccion);
      formDataToSend.append("imagen", formData.imagen);

      const response = await axios.post(Api, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setShowModalCreateCl(false);
        updateData();
      } else {
        console.error("Error al crear el elemento:", response.data);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud POST:", error);
    }
  };

  return (
    <>
      <Modal size="xl" show={show} onHide={() => setShowModalCreateCl(false)}>
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
                Imagen
              </Form.Label>
              <input
                type="file"
                onChange={handleFileChange}
                className="lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Rol
              </Form.Label>
              <input
                type="text"
                placeholder="Rol"
                value="cliente"
                onChange={(e) => handleInputChange(e, "rol")}
                disabled
                className="lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-slate-400"
              />
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Nombre
              </Form.Label>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => {
                  handleInputChange(e, "nombre");
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
                Apellido
              </Form.Label>
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={(e) => {
                  handleInputChange(e, "apellido");
                  setApellido(e.target.value);
                  const error = validarApellido(e.target.value);
                  setApellidoError(error ? apellidoErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {apellidoError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {apellidoError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Cédula
              </Form.Label>
              <input
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => {
                  handleInputChange(e, "cedula");
                  setCedula(e.target.value);
                  const error = validarCedula(e.target.value);
                  setCedulaError(error ? cedulaErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {cedulaError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {cedulaError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Correo
              </Form.Label>
              <input
                type="text"
                placeholder="Correo"
                value={email}
                onChange={(e) => {
                  handleInputChange(e, "correo");
                  setEmail(e.target.value);
                  const error = validarCorreo(e.target.value);
                  setEmailError(error ? emailErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {emailError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {emailError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Nro. Teléfono
              </Form.Label>
              <input
                type="text"
                placeholder="Nro. Teléfono"
                value={telefono}
                onChange={(e) => {
                  handleInputChange(e, "nro_tlf");
                  setTelefono(e.target.value);
                  const error = validarTelefono(e.target.value);
                  setTelefonoError(error ? telefonoErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {telefonoError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {telefonoError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Contraseña
              </Form.Label>
              <input
                type="text"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => {
                  handleInputChange(e, "clave");
                  setContrasena(e.target.value);
                  const error = validarPassword(e.target.value);
                  setContrasenaError(error ? claveErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {contrasenaError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {contrasenaError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Dirección
              </Form.Label>
              <input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => {
                  handleInputChange(e, "direccion");
                  setDireccion(e.target.value);
                  const error = validarDireccion(e.target.value);
                  setDireccionError(error ? direccionErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {direccionError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {direccionError}
                </p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            variant="outline-secondary"
            onClick={() => setShowModalCreateCl(false)}
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
