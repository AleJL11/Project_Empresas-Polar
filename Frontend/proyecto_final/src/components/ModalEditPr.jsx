import React, { useState, useEffect } from "react";

// React Bootstrap
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Otros
import axios from "axios";

export const ModalEditPr = ({
  show,
  setShowModal,
  updateData,
  editItemId,
  Api,
}) => {
  const [formData, setFormData] = useState({
    vendedor: "",
    nombre: "",
    categorias: [],
    subcategoria: "",
    precio: 0,
    inventario: 0,
    descripcion: "",
    imagen: null,
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
    const fetchData = async () => {
      if (editItemId) {
        try {
          const response = await axios.get(`${Api}/${editItemId}`);
          if (response.status === 200) {
            //console.log(response.data);
            const responseData = response.data;

            if (Array.isArray(responseData.product.categorias)) {
              const allCategoriesMap = responseData.allCategories.reduce(
                (map, category) => {
                  map[category.nombre] = category.subcategorias;
                  return map;
                },
                {}
              );

              const uniqueCategories = [
                ...new Set([
                  ...responseData.product.categorias.map(
                    (categoria) => categoria.nombre
                  ),
                  ...responseData.allCategories.map(
                    (categoria) => categoria.nombre
                  ),
                ]),
              ];

              const categorias = uniqueCategories.map((categoria) => ({
                nombre: categoria,
                subcategorias: allCategoriesMap[categoria] || [],
              }));

              setFormData((prevFormData) => ({
                ...prevFormData,
                ...responseData.product,
                categorias,
              }));
            } else {
              console.error(
                "Formato de respuesta inválido: las categorías no son un array"
              );
            }
          } else {
            console.error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [editItemId, Api]);

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
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      imagen: file, // Actualiza el estado con la imagen seleccionada
    }));
  };

  const handleInputChange = (e, fieldName) => {
    const value = e.target.value;
    // Si el campo es 'precio', convierte el valor de entrada a un número
    const isNumberField = fieldName === "precio";
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: isNumberField ? Number(value) : value,
    }));
  };

  const handleCategoriaChange = (e) => {
    const selectedCategoria = e.target.value;
    const selectedCategoriaData = formData.categorias.find(
      (categoria) => categoria.nombre === selectedCategoria
    );
    setFormData((prevFormData) => ({
      ...prevFormData,
      categoria: selectedCategoria,
      subcategoria:
        selectedCategoriaData.subcategorias.length > 0
          ? selectedCategoriaData.subcategorias[0]
          : "",
    }));
  };

  const handleSubcategoriaChange = (e) => {
    setFormData({ ...formData, subcategoria: e.target.value });
  };

  const handleFormSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("vendedor", formData.vendedor);
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("precio", formData.precio);
      formDataToSend.append("inventario", formData.inventario);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("imagen", formData.imagen);

      const categorias = {
        nombre: formData.categoria,
        subcategorias: formData.subcategoria ? [formData.subcategoria] : [],
      };
      formDataToSend.append("categorias", JSON.stringify([categorias]));

      const response = await axios.patch(
        `${Api}/${editItemId}`,
        formDataToSend
      );
      if (response.status === 200) {
        setShowModal(false);
        updateData();
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const categoriasOptions = formData.categorias.map((categoria, index) => (
    <option key={index} value={categoria.nombre}>
      {categoria.nombre}
    </option>
  ));

  const subcategoriasOptions =
    formData.categorias
      .find((categoria) => categoria.nombre === formData.categoria)
      ?.subcategorias.map((subcategoria, index) => (
        <option key={index} value={subcategoria}>
          {subcategoria}
        </option>
      )) || [];

  return (
    <>
      <Modal size="xl" show={show} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
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
                onChange={handleImageChange}
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
                value={formData.vendedor}
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
                value={formData.nombre}
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
                //value={formData.categorias}
                onChange={handleCategoriaChange}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              >
                {categoriasOptions}
              </select>
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Sub-Categoría
              </Form.Label>
              <select
                //value={formData.categorias.subcategorias}
                onChange={handleSubcategoriaChange}
                className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
              >
                {subcategoriasOptions}
              </select>
            </Form.Group>

            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center">
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">
                Precio
              </Form.Label>
              <input
                type="number"
                placeholder="Precio"
                value={formData.precio}
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
                value={formData.inventario}
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
                value={formData.descripcion}
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
