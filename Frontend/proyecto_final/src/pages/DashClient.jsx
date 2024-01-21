import React, { useState, useEffect } from "react";

// Otros
import {
  NavbarDash,
  ModalEdit,
  ModalCrCl,
  ApiHook,
} from "../components/routesComp";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useAuth } from "../components/AuthContext";

// React Bootstrap
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

// Iconos
import { CiMenuBurger } from "react-icons/ci";
import { IoSearch, IoPrintOutline } from "react-icons/io5";
import { TiDeleteOutline } from "react-icons/ti";
import { IoIosLogOut } from "react-icons/io";
import { FaRegEdit, FaUser, FaArrowLeft } from "react-icons/fa";

// Imagenes
import PerfilImg from "../assets/img/perfil/perfil.png";

export const DashClient = () => {
  const history = useNavigate();
  const url = "http://localhost:3001/usuarios";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenCRUD, setIsMenuOpenCRUD] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalCl, setShowModalCl] = useState(false);
  const [editItemId, setEditItem] = useState(null);
  const [editedUserData, setEditedUserData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // eslint-disable-next-line
  const [currentSearchPage, setCurrentSearchPage] = useState(1);
  const { userRole, setRole, imgUser, userName } = useAuth();

  const { response, error } = ApiHook("get", `${url}?rol=cliente`);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMenuCRUD = () => {
    setIsMenuOpenCRUD(!isMenuOpenCRUD);
  };

  const handleGoBack = () => {
    history(-1);
  };

  const handleLogout = () => {
    setRole(null);
    history("/iniciar-sesion");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          params: { page: 1, limit: 5, deleted: false, rol: "cliente" },
        });

        const clientes = response.data.data.filter(
          (user) => user.rol === "cliente"
        );

        setUserData(clientes);
      } catch (error) {
        console.log("Error al obtener los datos:", error);
      }
    };
    fetchData();
  }, []);

  //Generar pdf de usuarios
  const handleGeneratePDF = (userId = null) => {
    try {
      const pdf = new jsPDF();

      // Encontrar el usuario seleccionado
      const selectedClient = userData.find((user) => user._id === userId);

      const filename = userId
        ? `cliente_${selectedClient.nombre}_${selectedClient.apellido}.pdf`
        : "cliente.pdf";

      if (selectedClient) {
        // Encabezado de la tabla
        const headers = [
          "Rol",
          "Nombre",
          "Apellido",
          "Correo",
          "Cédula",
          "Teléfono",
          "Creación",
        ];
        const data = [
          [
            selectedClient.rol,
            selectedClient.nombre,
            selectedClient.apellido,
            selectedClient.correo,
            selectedClient.cedula,
            selectedClient.nro_tlf,
            selectedClient.fechaCreacion,
          ],
        ];

        // Configurar estilos y agregar tabla al PDF
        pdf.autoTable({
          head: [headers],
          body: data,
          startY: 20,
          margin: { top: 20 },
          styles: { overflow: "linebreak", fontSize: 10, cellPadding: 2 },
        });

        pdf.save(filename);
      } else {
        throw new Error("Usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al generar PDF:", error.message);
    }
  };

  const handlePageChange = async (page) => {
    try {
      const isSearching = searchResults.length > 0;

      const response = await axios.get(url, {
        params: {
          page,
          limit: itemsPerPage,
          deleted: false,
          search: isSearching ? searchTerm : "",
          rol: "cliente",
        },
      });

      const clientes = response.data.data.filter(
        (user) => user.rol === "cliente"
      );

      if (isSearching) {
        setSearchResults(clientes);
        setCurrentSearchPage(page);
      } else {
        setUserData(clientes);
        setCurrentPage(page);
      }
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(url, {
        params: {
          //page, // Siempre busca desde la primera página al realizar una búsqueda
          limit: itemsPerPage,
          deleted: false,
          search: searchTerm,
          rol: "cliente",
        },
      });
      const clientes = response.data.data.filter(
        (user) => user.rol === "cliente"
      );
      setSearchResults(clientes);
      setCurrentSearchPage(1);
      setCurrentPage(1);
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!response) {
    return (
      <div className="loader">
        <div className="loader-text">Cargando...</div>
        <div className="loader-bar"></div>
      </div>
    );
  }

  const formFields = [
    { label: "Nombre", name: "nombre", type: "text", placeholder: "Nombre" },
    {
      label: "Apellido",
      name: "apellido",
      type: "text",
      placeholder: "Apellido",
    },
    { label: "Correo", name: "correo", type: "email", placeholder: "Correo" },
    { label: "Cédula", name: "cedula", type: "text", placeholder: "Cédula" },
    {
      label: "Número de Teléfono",
      name: "nro_tlf",
      type: "text",
      placeholder: "Número de Teléfono",
    },
    {
      label: "Número de Habitación",
      name: "nro_hab",
      type: "text",
      placeholder: "Número de Habitación",
    },
    {
      label: "Dirección",
      name: "direccion",
      type: "text",
      placeholder: "Dirección",
    },
  ];

  const updateData = async () => {
    try {
      const response = await axios.get(url, {
        params: { page: 1, limit: 5, deleted: false, rol: "cliente" },
      });

      const clientes = response.data.data.filter(
        (user) => user.rol === "cliente"
      );

      setUserData(clientes);
    } catch (error) {
      console.log("Error al obtener los datos:", error);
    }
  };

  const openCreate = () => {
    setShowModalCl(true);
  };

  const handleEditClick = (id) => {
    setEditItem(id);
    setShowModal(true);
    fetchEditedUserData(id);
  };

  const fetchEditedUserData = async (id) => {
    try {
      const response = await axios.get(`${url}/${id}`);
      setEditedUserData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      console.log("Eliminar elemento con ID:", id);

      updateData();
    } catch (error) {
      console.error("Error al realizar la solicitud DELETE:", error);
    }
  };

  return (
    <>
      {showModal && (
        <ModalEdit
          showModal={showModal}
          setShowModal={setShowModal}
          editItemId={editItemId}
          itemData={editedUserData}
          updateData={updateData}
          Api={url}
          formFields={formFields}
        />
      )}
      {showModalCl && (
        <ModalCrCl
          show={showModalCl}
          setShowModalCreateCl={setShowModalCl}
          Api={url}
          updateData={updateData}
        />
      )}

      <div
        className="md:h-36
      w-full h-24 rounded-[0_0_50px_50px] bg-[#E81D1D]"
      >
        <div
          className="
        w-full h-14 grid grid-cols-3 place-items-center"
        >
          <div className="min-[1920px]:text-[30px] xl:text-2xl lg:flex lg:flex-row lg:text-[25px] lg:gap-10 mr-4">
            <FaArrowLeft
              className="lg:block md:text-[40px] min-[320px]:hidden lg:text-white"
              onClick={handleGoBack}
            />

            <Link to="/perfil-usuario">
              <FaUser className="lg:block lg:text-[35px] md:text-[40px] min-[320px]:hidden lg:text-white" />
            </Link>

            <CiMenuBurger
              className="lg:hidden md:text-[40px] text-2xl text-white"
              onClick={toggleMenu}
            />
          </div>
          <div className="flex items-center justify-center">
            <div className="rounded-lg bg-gray-200">
              <div className="lg:flex lg:justify-center lg:items-center lg:w-96 flex">
                <div
                  className="xl:h-[35px] flex w-10 items-center justify-center rounded-l-lg border-r border-gray-200 bg-white"
                  onClick={handleSearch}
                >
                  <IoSearch className="md:text-[20px]" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="xl:h-[35px] lg:w-[100%] lg:h-8
                  md:w-full md:text-[25px] md:h-10
                  w-full bg-white pl-2 text-base font-semibold outline-0 rounded-r-lg"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className="xl:ml-[50%]
           lg:ml-[10em]
            w-[33.33%] h-full ml-7"
          >
            <div
              className="lg:flex lg:flex-row lg:gap-8
              grid place-items-center mt-2"
            >
              {userRole ? (
                <>
                  <img
                    src={`http://localhost:3001/Usuarios/${imgUser}`}
                    alt="Imagen de perfil"
                    className="xl:w-16 xl:h-16 md:w-16 md:h-16
                  w-16 h-16 rounded-full object-fill"
                    title={userName}
                  />
                  <div className="xl:text-[50px] lg:text-[35px]">
                    <IoIosLogOut
                      className="lg:block lg:text-white min-[320px]:hidden"
                      onClick={handleLogout}
                    />
                  </div>
                </>
              ) : (
                <img
                  src={PerfilImg}
                  alt="Imagen de perfil por defecto"
                  className="xl:w-16 xl:h-16 md:w-16 md:h-16 w-16 h-16 rounded-full object-fill"
                  title="Perfil por defecto"
                />
              )}
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="lg:hidden md:w-[200px] md:mt-4 md:ml-10 ml-5 bg-[#00057B] w-40 h-auto absolute rounded-md z-10">
            <div className="md:text-[30px] p-2 text-center">
              {userRole === "administrador" && (
                <>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/usuarios">
                      Usuarios
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/clientes">
                      Clientes
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/vendedores">
                      Vendedores
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/productos">
                      Productos
                    </Link>{" "}
                  </li>
                  <li className="list-none">
                    <Link className="text-white no-underline" to="/ventas">
                      Ventas
                    </Link>{" "}
                  </li>
                </>
              )}
              {userRole === "vendedor" && (
                <>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/clientes">
                      Clientes
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/vendedores">
                      Vendedores
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-white no-underline" to="/productos">
                      Productos
                    </Link>{" "}
                  </li>
                  <li className="list-none">
                    <Link className="text-white no-underline" to="/ventas">
                      Ventas
                    </Link>{" "}
                  </li>
                </>
              )}
            </div>
          </div>
        )}

        <div
          className="xl:flex xl:justify-center xl:space-x-8 xl:text-[30px]
          lg:mt-8 lg:text-[25px]
        w-full flex flex-row gap-4 justify-center"
        >
          {userRole === "administrador" && (
            <>
              <li className="list-none text-white tracking-wide min-[320px]:hidden lg:block">
                <Link className="text-white no-underline" to="/">
                  Inicio
                </Link>
              </li>

              <li
                className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
              >
                <Link className="text-white no-underline" to="/reporte-cliente">
                  Reporte
                </Link>
              </li>
              <li
                className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
              >
                <Link
                  className="text-white no-underline"
                  onClick={toggleMenuCRUD}
                >
                  Manejos
                </Link>
              </li>
              <li
                className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
              >
                <Link className="text-white no-underline" to="/info-vendedores">
                  Vendedores
                </Link>
              </li>
            </>
          )}
          {userRole === "vendedor" && (
            <>
              <li className="list-none mb-3">
                <Link className="text-black no-underline" to="/clientes">
                  Clientes
                </Link>{" "}
              </li>
              <li className="list-none mb-3">
                <Link className="text-black no-underline" to="/vendedores">
                  Vendedores
                </Link>{" "}
              </li>
              <li className="list-none mb-3">
                <Link className="text-black no-underline" to="/productos">
                  Productos
                </Link>{" "}
              </li>
              <li className="list-none">
                <Link className="text-black no-underline" to="/ventas">
                  Ventas
                </Link>{" "}
              </li>
            </>
          )}
        </div>

        {isMenuOpenCRUD && (
          <div className="min-[1920px]:ml-[47%] xl:ml-[45%] lg:block lg:text-[25px] lg:w-[200px] lg:ml-[42%] ml-5 bg-[#00057B] w-24 h-auto absolute rounded-md z-10 hidden">
            <div className="p-2 text-center">
              {userRole === "administrador" && (
                <>
                  <li
                    className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
                  >
                    <Link className="text-white no-underline" to="/usuarios">
                      Usuarios
                    </Link>
                  </li>
                  <li
                    className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
                  >
                    <Link className="text-white no-underline" to="/clientes">
                      Clientes
                    </Link>
                  </li>
                  <li
                    className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
                  >
                    <Link className="text-white no-underline" to="/productos">
                      Productos
                    </Link>
                  </li>
                  <li
                    className="min-[320px]:hidden lg:block
          list-none text-white tracking-wide"
                  >
                    <Link className="text-white no-underline" to="/ventas">
                      Ventas
                    </Link>
                  </li>
                </>
              )}
              {userRole === "vendedor" && (
                <>
                  <li className="list-none mb-3">
                    <Link className="text-black no-underline" to="/clientes">
                      Clientes
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-black no-underline" to="/vendedores">
                      Vendedores
                    </Link>{" "}
                  </li>
                  <li className="list-none mb-3">
                    <Link className="text-black no-underline" to="/productos">
                      Productos
                    </Link>{" "}
                  </li>
                  <li className="list-none">
                    <Link className="text-black no-underline" to="/ventas">
                      Ventas
                    </Link>{" "}
                  </li>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="xl:text-[35px] md:text-[30px] w-full h-auto mx-auto text-center mt-4 mb-4">
        <h1>Manejo de Clientes</h1>
      </div>

      <div className="w-full h-auto mx-auto text-center">
        <button
          className="lg:w-40 lg:h-16 lg:text-[25px] md:w-[200px] md:text-[25px] md:h-20 rounded-xl bg-blue-500 text-white"
          onClick={() => openCreate()}
        >
          Crear Usuario
        </button>
      </div>

      {/* TABLA */}
      <div className="xl:h-[770px] lg:h-[600px] md:mb-14 md:w-[90%] md:h-[600px] overflow-x-auto overflow-y-auto mt-4 w-[95%] mx-auto h-60">
        <Table
          striped
          bordered
          hover
          variant=".text-secondary-emphasis"
          className="xl:text-[30px] lg:text-[25px] md:text-[25px] text-center"
          style={{ width: "100em", height: "22em" }}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Rol</th>
              <th>Nombre y apellido</th>
              <th>Correo</th>
              <th>Cédula</th>
              <th>Número de Teléfono</th>
              <th>Número de Habitación</th>
              <th>Dirección</th>
              <th>Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0
              ? searchResults.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.rol}</td>
                    <td>{user.nombre + " " + user.apellido}</td>
                    <td>{user.correo}</td>
                    <td>{user.cedula}</td>
                    <td>{user.nro_tlf}</td>
                    <td>{user.nro_hab}</td>
                    <td>{user.direccion}</td>
                    <td>{user.fechaCreacion}</td>
                    <td>
                      <div className="flex flex-row justify-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEditClick(user._id)}
                        >
                          <FaRegEdit />
                        </button>
                        <button
                          className="btn btn-warning"
                          onClick={() => handleGeneratePDF(user._id)}
                        >
                          <IoPrintOutline />
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          <TiDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : userData.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.rol}</td>
                    <td>{user.nombre + " " + user.apellido}</td>
                    <td>{user.correo}</td>
                    <td>{user.cedula}</td>
                    <td>{user.nro_tlf}</td>
                    <td>{user.nro_hab}</td>
                    <td>{user.direccion}</td>
                    <td>{user.fechaCreacion}</td>
                    <td>
                      <div className="flex flex-row justify-center">
                        <Button
                          className="btn btn-primary"
                          onClick={() => handleEditClick(user._id)}
                        >
                          <FaRegEdit />
                        </Button>
                        <Button
                          className="btn btn-warning"
                          onClick={() => handleGeneratePDF(user._id)}
                        >
                          <IoPrintOutline />
                        </Button>
                        <Button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          <TiDeleteOutline />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </Table>
      </div>

      {/* BOTONES DE PAGINACIÓN */}
      <div className="lg:mt-4 lg:ml-40 md:mb-20 w-full h-auto mx-auto mt-4 mb-4">
        {(searchResults.length > 0 || userData.length > 0) && (
          <>
            <button
              className="lg:text-[30px] md:text-[30px] ml-2"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            {Array.from({ length: response.meta.pageCount }, (_, index) => (
              <button
                key={index + 1}
                className={`lg:text-[25px] md:text-[25px] text-black px-2 ml-2 mr-2 font-semibold shadow-md border-2 hover:bg-blue-500 ${
                  currentPage === index + 1 ? "bg-blue-500 text-black" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="lg:text-[30px] md:text-[30px]"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === response.meta.pageCount}
            >
              Siguiente
            </button>
          </>
        )}
        {/* Botones para cambiar de página */}
      </div>

      <div className="md:mt-[130px] min-[320px]:block lg:hidden">
        <NavbarDash />
      </div>
    </>
  );
};
