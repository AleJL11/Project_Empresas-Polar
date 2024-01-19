import React, { useState, useEffect } from "react";

// Imagenes
import Logo from "../assets/img/logo_2.png";
import PerfilImg from "../assets/img/perfil/perfil.png";

// Iconos
import { TbCameraUp } from "react-icons/tb";

// Otros
import * as comp from "../components/routesComp";
import { useAuth } from "../components/AuthContext";
import axios from "axios";

// React Bootstrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export const Perfil = () => {
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [userData, setUserData] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

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

  const {
    userId,
    setImg,
  } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/usuarios/${userId}`
        );
        //console.log(response.data);
        setUserData(response.data);
      } catch (error) {
        console.log("Error al obtener los datos: ", error.message);
      }
    };
    fetchData();
  }, []);

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
  };

  const direccionErrores = {
    vacio: "La dirección no puede estar vacío",
    formato:
      "El formato es inválido, solo se admiten letras, números y espacios",
    longitud: "No puede tener más de 200 caracteres",
  };

  const validarNombre = (nombre) => {
    if (nombre.trim() === "") {
      setNombreError(nombreErrores.vacio);
      return false;
    } else if (!regexNombreApellido.test(nombre)) {
      setNombreError(nombreErrores.formato);
      return false;
    } else {
      setNombreError("");
      return true;
    }
  };

  const validarApellido = (apellido) => {
    if (apellido.trim() === "") {
      setApellidoError(apellidoErrores.vacio);
      return false;
    } else if (!regexNombreApellido.test(apellido)) {
      setApellidoError(apellidoErrores.formato);
      return false;
    } else {
      setApellidoError("");
      return true;
    }
  };

  const validarCorreo = (correo) => {
    if (!correo.includes("@")) {
      setEmailError(emailErrores.faltaArroba);
      return false;
    }

    const parts = correo.split("@");
    if (!parts[1].includes(".com")) {
      setEmailError(emailErrores.dominioInvalido);
      return false;
    }

    if (!regexCorreo.test(correo)) {
      setEmailError(emailErrores.formato);
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const validarPassword = (contrasena) => {
    if (contrasena.length < 8 || contrasena.length > 10) {
      setContrasenaError(claveErrores.longitud);
      return false;
    } else if (contrasena.length === "") {
      setContrasenaError(claveErrores.longitud);
      return false;
    } else if (!/[A-Z]/.test(contrasena)) {
      setContrasenaError(claveErrores.mayusculas);
      return false;
    } else if (!/[0-9]/.test(contrasena)) {
      setContrasenaError(claveErrores.numeros);
      return false;
    } else if (!/[^a-zA-Z0-9]/.test(contrasena)) {
      setContrasenaError(claveErrores.caracteresEspeciales);
      return false;
    } else {
      setContrasenaError("");
      return true;
    }
  };

  const validarTelefono = (telefono) => {
    if (!regexTlf.test(telefono)) {
      setTelefonoError(telefonoErrores.formato);
      return false;
    } else {
      setTelefonoError("");
      return true;
    }
  };

  const validarCedula = (cedula) => {
    if (!regexCedula.test(cedula)) {
      setCedulaError(cedulaErrores.formato);
      return false;
    } else {
      setCedulaError("");
      return true;
    }
  };

  const validarDireccion = (direccion) => {
    if (direccion.trim() === "") {
      setDireccionError(direccionErrores.vacio);
      return false;
    } else if (direccion.length > 200) {
      setDireccionError(direccionErrores.longitud);
      return false;
    } else if (!regexDireccion.test(direccion)) {
      setDireccionError(direccionErrores.formato);
      return false;
    } else {
      setDireccionError("");
      return true;
    }
  };

  const handleImageChange = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    //console.log(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };

    setImageData(file);

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("nombre", userData.nombre);
    formData.append("apellido", userData.apellido);
    formData.append("cedula", userData.cedula);
    formData.append("correo", userData.correo);
    formData.append("nro_tlf", userData.nro_tlf);
    formData.append("direccion", userData.direccion);
    formData.append("clave", userData.clave);
    formData.append("imagen", imageData);
    console.log(image);
    try {
      const response = await axios.patch(
        `http://localhost:3001/usuarios/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("¡Cambios guardados exitosamente!");
      setImg(response.data.imagen)
      console.log("Usuario actualizado:", response.data);
    } catch (error) {
      console.error("Error al enviar la solicitud PATCH:", error);
    }
  };

  return (
    <>
      <comp.Header />
      <div className="grid grid-rows place-content-center w-[80%] h-32 mx-auto mt-[-50px] bg-white drop-shadow-xl rounded-2xl">
        <div className="grid place-content-center w-28 h-28">
          <img src={Logo} alt="alimentos polar" className="w-max h-26" />
        </div>
      </div>
      <br />

      <h2 className="text-center mt-4">Perfil de usuario</h2>

      <div className="w-[85%] mx-auto drop-shadow-2xl mt-8">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicImage">
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={image ? image : PerfilImg}
                alt="Foto de perfil"
                className="w-28 h-28 rounded-full"
              />
              <input
                id="inputImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute bottom-1 left-1 opacity-0 w-8 h-8 cursor-pointer"
              />
              <label htmlFor="inputImage" className="cursor-pointer">
                <TbCameraUp className="absolute bottom-0 left-0 w-8 h-8 bg-white rounded-full p-2" />
              </label>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicNombre">
            <Form.Control
              type="text"
              placeholder={userData.nombre}
              name="nombre"
              value={userData.nombre}
              onChange={(e) => {
                setUserData({ ...userData, nombre: e.target.value });
                validarNombre(e.target.value);
              }}
            />
          </Form.Group>
          {nombreError && <p className="text-red-500">{nombreError}</p>}

          <Form.Group className="mb-3" controlId="formBasicApellido">
            <Form.Control
              type="text"
              name="apellido"
              placeholder={userData.apellido}
              value={userData.apellido}
              onChange={(e) => {
                setUserData({ ...userData, apellido: e.target.value });
                validarApellido(e.target.value);
              }}
            />
          </Form.Group>
          {apellidoError && <p className="text-red-500">{apellidoError}</p>}

          <Form.Group className="mb-3" controlId="formBasicCedula">
            <Form.Control
              type="text"
              name="cedula"
              placeholder={userData.cedula}
              value={userData.cedula}
              onChange={(e) => {
                setUserData({ ...userData, cedula: e.target.value });
                validarCedula(e.target.value);
              }}
            />
          </Form.Group>
          {cedulaError && <p className="text-red-500">{cedulaError}</p>}

          <Form.Group className="mb-3" controlId="formBasicCorreo">
            <Form.Control
              type="text"
              name="correo"
              placeholder={userData.correo}
              value={userData.correo}
              onChange={(e) => {
                setUserData({ ...userData, correo: e.target.value });
                validarCorreo(e.target.value);
              }}
            />
          </Form.Group>
          {emailError && <p className="text-red-500">{emailError}</p>}

          <Form.Group className="mb-3" controlId="formNumeroTelefono">
            <Form.Control
              type="text"
              name="nro_tlf"
              placeholder={userData.nro_tlf}
              value={userData.nro_tlf}
              onChange={(e) => {
                setUserData({ ...userData, nro_tlf: e.target.value });
                validarTelefono(e.target.value);
              }}
            />
          </Form.Group>
          {telefonoError && <p className="text-red-500">{telefonoError}</p>}

          <Form.Group className="mb-3" controlId="formNumeroDireccion">
            <Form.Control
              type="text"
              name="direccion"
              placeholder={userData.direccion}
              value={userData.direccion}
              onChange={(e) => {
                setUserData({ ...userData, direccion: e.target.value });
                validarDireccion(e.target.value);
              }}
            />
          </Form.Group>
          {direccionError && <p className="text-red-500">{direccionError}</p>}

          <Form.Group className="mb-3" controlId="formNumeroContraseña">
            <Form.Control
              type="text"
              name="clave"
              placeholder={userData.clave}
              value={userData.clave}
              onChange={(e) => {
                setUserData({ ...userData, clave: e.target.value });
                validarPassword(e.target.value);
              }}
            />
          </Form.Group>
          {contrasenaError && <p className="text-red-500">{contrasenaError}</p>}

          <Button
            variant="danger"
            type="submit"
            className="ml-[23%] text-white h-12 w-[60%]"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            Guardar Cambios
          </Button>
          {successMessage && (
            <p className="text-green-500 text-center mt-4">{successMessage}</p>
          )}
        </Form>
      </div>
      <br />

      <comp.Footer />
      <comp.SubMenu />
    </>
  );
};
