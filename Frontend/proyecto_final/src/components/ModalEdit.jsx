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
    <Modal size="xl" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {formFields.map((field, index) => (
            <Form.Group className="min-w-[50%] xl:grid-cols-1 mb-3 flex flex-col justify-center" key={index} controlId={`formBasic${field.name}`}>
              <Form.Label className="xl:text-4xl lg:text-3xl md:text-2xl md:mr-12 mt-2">{field.label}</Form.Label>
              {field.name === "categoria" ? (
                <select
                  value={formData.categoria || ""}
                  onChange={handleCategoriaChange}
                  className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
                >
                  <option value="">Seleccionar Categoría</option>
                  {categoriasOptions.map((categoria, index) => (
                    <option key={index} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              ) : field.name === "subcategoria" ? (
                <select
                  value={formData.subcategoria || ""}
                  onChange={handleSubcategoriaChange}
                  className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
                >
                  <option value="">Seleccionar Subcategoría</option>
                  {categoriasOptions
                    .find((cat) => cat.nombre === formData.categoria)
                    ?.subcategorias.map((subcat, index) => (
                      <option key={index} value={subcat}>
                        {subcat}
                      </option>
                    ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.name]: e.target.value })
                  }
                  className="w-full lg:h-16 lg:text-3xl md:text-[25px] md:h-14 h-10 rounded-lg p-2 border-2 border-slate-400"
                />
              )}
            </Form.Group>
          ))}
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
          onClick={handleSaveChanges}
          className="lg:h-16 lg:text-3xl md:text-[25px] md:w-[20%] md:h-14 h-10 w-full rounded-lg p-2 border-2 border-blue-400 hover:bg-blue-400 hover:text-white"
        >
          Crear
        </button>
      </Modal.Footer>
    </Modal>
  );
};
