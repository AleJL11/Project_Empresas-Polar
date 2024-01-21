import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalCrPr = ({ show, setShowModalCreatePr, Api, updateData }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    vendedor: "",
    categorias: [],
    subcategorias: [],
    categoriaSeleccionada: "",
    subcategoria: "",
    precio: 0,
    inventario: 0,
    descripcion: "",
    imagen: null,
    categoriasData: {},
  });

  const [nombre, setNombre] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [inventario, setInventario] = useState("");

  const [nombreError, setNombreError] = useState("");
  const [nombreVendedorError, setNombreVendedorError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");
  const [precioError, setPrecioError] = useState("");
  const [inventarioError, setInventarioError] = useState("");

  const regexNombreApellido = /^[a-zA-Z ]+$/;
  const regexDescripcion = /^[a-zA-Z0-9 .,!?¿%]+$/;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/productos/categorias"
        );
        const categoriasData = response.data;
        setFormData((prevData) => ({
          ...prevData,
          categorias: Object.keys(categoriasData),
          subcategorias: Object.values(categoriasData).flat(),
          categoriasData: categoriasData,
        }));
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const nombreErrores = {
    formato:
      "El formato del nombre es inválido. Solo se admiten letras y espacios",
    vacio: "El nombre no puede estar vacío",
  };

  const nombreVendedorErrores = {
    formato:
      "El formato del nombre es inválido. Solo se admiten letras y espacios",
    vacio: "El nombre no puede estar vacío",
  };

  const descripcionErrores = {
    vacio: "La descripción no puede estar vacía",
    formato:
      "La descripción solo puede contener letras, números, puntos, comas, porcentaje, signos de interrogación y exclamación",
    longitud: "No puede tener más de 200 caracteres",
  };

  const precioErrores = {
    vacio: "El precio no puede estar vacío",
  };

  const inventarioErrores = {
    vacio: "El inventario no puede estar vacío",
  }

  const validarNombre = (nombre) => {
    if (nombre.trim() === "") {
      return "vacio";
    }

    return regexNombreApellido.test(nombre) ? "" : "formato";
  };

  const validarNombreVendedor = (nombre) => {
    if (nombre.trim() === "") {
      return "vacio";
    }

    return regexNombreApellido.test(nombre) ? "" : "formato";
  };

  const validarDescripcion = (descripcion) => {
    if (descripcion.trim() === "") {
      return "vacio";
    }

    if (descripcion.length > 200) {
      return "longitud";
    }

    return regexDescripcion.test(descripcion) ? "" : "formato";
  };

  const validarPrecio = (precio) => {
    if (precio.trim() === "") {
      return "vacio";
    }
  };

  const validarInventario = (inventario) => {
    if (inventario.trim() === "") {
      return "vacio";
    }
  };

  const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    if (fieldName === "categoriaSeleccionada") {
      const selectedCategoria = value;
      const subcategorias = formData.categoriasData[selectedCategoria];
      setFormData({
        ...formData,
        [fieldName]: value,
        subcategoria: "",
        subcategorias: subcategorias || [],
      });
    } else {
      setFormData({ ...formData, [fieldName]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen: e.target.files[0] });
  };

  const handleSaveChanges = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("vendedor", formData.vendedor);
      formDataToSend.append(
        "categorias",
        JSON.stringify([
          {
            nombre: formData.categoriaSeleccionada,
            subcategorias: [formData.subcategoria],
          },
        ])
      );
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
  };

  return (
    <>
      <Modal size="xl" show={show} onHide={() => setShowModalCreatePr(false)}>
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
                Vendedor
              </Form.Label>
              <input
                type="text"
                placeholder="Vendedor"
                name="vendedor"
                value={nombreVendedor}
                onChange={(e) => {
                  handleInputChange(e, "vendedor");
                  setNombreVendedor(e.target.value);
                  const error = validarNombreVendedor(e.target.value);
                  setNombreVendedorError(
                    error ? nombreVendedorErrores[error] : ""
                  );
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {nombreVendedorError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {nombreVendedorError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Nombre
              </Form.Label>
              <input
                type="text"
                placeholder="Nombre"
                name="nombre"
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
                Categoría
              </Form.Label>
              <select
                value={formData.categoriaSeleccionada}
                onChange={(e) => handleInputChange(e, "categoriaSeleccionada")}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              >
                <option value="">Selecciona una categoría</option>
                {formData.categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Sub-categoría
              </Form.Label>
              <select
                value={formData.subcategoria}
                onChange={(e) => handleInputChange(e, "subcategoria")}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              >
                <option value="">Selecciona una subcategoría</option>
                {formData.subcategorias.map((subcategoria, index) => (
                  <option key={index} value={subcategoria}>
                    {subcategoria}
                  </option>
                ))}
              </select>
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Precio
              </Form.Label>
              <input
                type="number"
                placeholder="Precio"
                name="precio"
                value={precio}
                onChange={(e) => {
                  handleInputChange(e, "precio");
                  setPrecio(e.target.value);
                  const error = validarPrecio(e.target.value);
                  setPrecioError(error ? precioErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {precioError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {precioError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Inventario
              </Form.Label>
              <input
                type="number"
                placeholder="Inventario"
                name="inventario"
                value={inventario}
                onChange={(e) => {
                  handleInputChange(e, "inventario");
                  setInventario(e.target.value);
                  const error = validarInventario(e.target.value);
                  setInventarioError(error ? inventarioErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {inventarioError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {inventarioError}
                </p>
              )}
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Descripción
              </Form.Label>
              <input
                type="text"
                placeholder="Descripción"
                name="descripcion"
                value={descripcion}
                onChange={(e) => {
                  handleInputChange(e, "descripcion");
                  setDescripcion(e.target.value);
                  const error = validarDescripcion(e.target.value);
                  setDescripcionError(error ? descripcionErrores[error] : "");
                }}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              />
              {descripcionError && (
                <p className="xl:text-[30px] md:text-[25px] text-red-500">
                  {descripcionError}
                </p>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            variant="outline-secondary"
            onClick={() => setShowModalCreatePr(false)}
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
