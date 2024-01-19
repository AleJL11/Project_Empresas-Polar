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
    const isNumberField = fieldName === 'precio';
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
      categoria: selectedCategoria, // Update the selected category
      subcategoria:
        selectedCategoriaData.subcategorias.length > 0
          ? selectedCategoriaData.subcategorias[0]
          : "", // Set the first subcategory as default or empty if there are none
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
      formDataToSend.append("categorias", JSON.stringify([categorias]))

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
      .find((categoria) => categoria.nombre === formData.categoria) // Use the selected category from formData
      ?.subcategorias.map(
        (
          subcategoria,
          index // Use optional chaining in case the category is not found
        ) => (
          <option key={index} value={subcategoria}>
            {subcategoria}
          </option>
        )
      ) || [];

  return (
    <>
      <Modal show={show} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
              <Form.Label className="mt-2">Vendedor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Vendedor"
                value={formData.vendedor}
                onChange={(e) => handleInputChange(e, "vendedor")}
              />
              <Form.Label className="mt-2">Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange(e, "nombre")}
              />
              <Form.Label className="mt-2">Categoría</Form.Label>
              <Form.Control
                as="select"
                value={formData.categoria}
                onChange={handleCategoriaChange}
              >
                {categoriasOptions}
              </Form.Control>
              <Form.Label className="mt-2">Sub-Categoría</Form.Label>
              <Form.Control
                as="select"
                value={formData.categorias.subcategorias}
                onChange={handleSubcategoriaChange}
              >
                {subcategoriasOptions}
              </Form.Control>
              <Form.Label className="mt-2">Precio</Form.Label>
              <Form.Control
                type="number"
                placeholder="Precio"
                value={formData.precio}
                onChange={(e) => handleInputChange(e, "precio")}
              />
              <Form.Label className="mt-2">Inventario</Form.Label>
              <Form.Control
                type="number"
                placeholder="Inventario"
                value={formData.inventario}
                onChange={(e) => handleInputChange(e, "inventario")}
              />
              <Form.Label className="mt-2">Descripción</Form.Label>
              <Form.Control
                type="text"
                placeholder="Descripción"
                value={formData.descripcion}
                onChange={(e) => handleInputChange(e, "descripcion")}
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
