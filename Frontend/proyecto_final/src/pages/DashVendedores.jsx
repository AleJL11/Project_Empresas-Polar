import React, { useState, useEffect } from "react";

// Otros
import * as comp from "../components/routesComp";
import axios from "axios";
import { useAuth } from "../components/AuthContext";

// React Icons
import { IoIosLogOut } from "react-icons/io";
import { FaRegEdit, FaUser, FaArrowLeft } from "react-icons/fa";
import { CiUser, CiShoppingTag, CiMenuBurger } from "react-icons/ci";
import { FiShoppingBag } from "react-icons/fi";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

// React Boostrap
import Table from "react-bootstrap/Table";

// Imagenes
import PerfilImg from "../assets/img/perfil/perfil.png";

const fechaActual = new Date();
const mesActual = fechaActual.getMonth() + 1;
const anioActual = fechaActual.getFullYear();

export const DashVendedores = () => {
  const history = useNavigate();
  const urlCliente = "http://localhost:3001/usuarios";
  const urlProducto = "http://localhost:3001/productos";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenCRUD, setIsMenuOpenCRUD] = useState(false);

  const [data, setData] = useState([]);
  const [dataVendedores, setDataVendedores] = useState([]);

  const [showModalCl, setShowModalCl] = useState(false);
  const [showModalPr, setShowModalPr] = useState(false);
  const [showModalVs, setShowModalVs] = useState(false);

  const mesFormateado = mesActual.toString().padStart(2, "0");
  const [fechaInicio, setFechaInicio] = useState(
    `${anioActual}-${mesFormateado}-01`
  );
  const [fechaFin, setFechaFin] = useState(
    `${anioActual}-${mesFormateado}-${new Date(
      anioActual,
      mesActual,
      0
    ).getDate()}`
  );

  const { userRole, setRole, imgUser, userName, userId } = useAuth();
  //console.log(userId);
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

  const obtenerDatos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/reportes/reporte-ventas-vendedor/${userId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      //console.log(response.data);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  const obtenerDatosVendedores = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/reportes/reporte-ventas-vendedor?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      //console.log(response.data);
      setDataVendedores(response.data);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
    obtenerDatosVendedores();
  }, [fechaInicio, fechaFin]);

  const dataPrint = dataVendedores.map((item) => ({
    x: `${item.nombre} ${item.apellido}`,
    y: item.totalVentas,
  }));

  const openCreateCl = () => {
    setShowModalCl(true);
  };

  const openCreatePr = () => {
    setShowModalPr(true);
  };

  const openCreateVs = () => {
    setShowModalVs(true);
  };

  return (
    <>
      {showModalCl && (
        <comp.ModalCrCl
          show={showModalCl}
          setShowModalCreateCl={setShowModalCl}
          Api={urlCliente}
        />
      )}
      {showModalPr && (
        <comp.ModalCrPr
          show={showModalPr}
          setShowModalCreatePr={setShowModalPr}
          Api={urlProducto}
        />
      )}
      {showModalVs && (
        <comp.ModalCrVs
          show={showModalVs}
          setShowModalCreateVs={setShowModalVs}
          Api={"http://localhost:3001/ventas"}
        />
      )}

      {/* HEADER */}
      <div
        className="md:h-36
      w-full h-24 rounded-[0_0_50px_50px] bg-[#E81D1D]"
      >
        <div
          className="
        w-full h-14 grid grid-cols-3 place-items-center"
        >
          <div
            className="min-[1920px]:text-[30px] xl:text-2xl lg:flex lg:flex-row lg:text-[25px] lg:gap-10
          mr-4"
          >
            <FaArrowLeft
              className="lg:block min-[320px]:hidden lg:text-white"
              onClick={handleGoBack}
            />

            <Link to="/perfil-usuario">
              <FaUser className="lg:block min-[320px]:hidden lg:text-white" />
            </Link>

            <CiMenuBurger
              className="lg:hidden text-2xl text-white"
              onClick={toggleMenu}
            />
          </div>
          <div
            className="xl:ml-[50%]
           lg:ml-[50em]
          w-[33.33%] h-full ml-7"
          >
            <div
              className="min-[1920px]:ml-[40em] xl:ml-[30em] lg:flex lg:w-[85%]
            grid place-items-center mt-2"
            >
              {userRole ? (
                <img
                  src={`http://localhost:3001/Usuarios/${imgUser}`}
                  alt="Imagen de perfil"
                  className="
                  w-16 h-16 rounded-full object-fill"
                  title={userName}
                />
              ) : (
                <img
                  src={PerfilImg}
                  alt="Imagen de perfil por defecto"
                  className="w-16 h-16 rounded-full object-fill"
                  title="Perfil por defecto"
                />
              )}
              <div className="lg:flex lg:justify-center lg:w-[100%] lg:ml-4 lg:gap-8">
                <IoIosLogOut
                  className="min-[1920px]:text-[40px] xl:text-3xl min-[320px]:hidden 
              lg:block lg:text-2xl lg:text-white lg:mt-[-1px]"
                  onClick={handleLogout}
                />
              </div>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="ml-5 bg-[#D9D9D9] w-24 h-auto absolute rounded-md z-10">
            <div className="p-2 text-center">
              {userRole === "administrador" && (
                <>
                  <li className="list-none mb-3">
                    <Link className="text-black no-underline" to="/usuarios">
                      Usuarios
                    </Link>{" "}
                  </li>
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
          <div className="xl:w-40 xl:text-[30px] lg:ml-[48%] lg:w-32 lg:text-[25px] ml-5 bg-[#D9D9D9] w-24 h-auto absolute rounded-md z-10">
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

      <br />

      {/* Parte superior con botones */}
      <div className="lg:h-[500px] flex flex-col justify-center w-[95%] h-56 mx-auto drop-shadow-xl">
        <div className="flex flex-row w-[95%] h-28 mx-auto mt-1">
          {/* Primer Boton */}
          <div className="min-[1920px]:w-[35%] lg:h-40 bg-white w-[45%] h-24 mx-auto my-auto flex flex-row justify-center">
            <CiUser className="lg:mt-12 text-2xl h-10 w-10 mt-7 ml-2" />
            <div className="flex flex-col w-[70%] h-full justify-center items-center">
              <div className="w-full h-[50%] text-center">
                <p className="xl:text-[30px] lg:text-[30px] mt-1">Clientes:</p>
              </div>
              <button
                className="xl:text-[30px] xl:w-[40%] lg:w-32 lg:h-16 lg:text-[25px] bg-red-500 w-20 text-white text-center text-sm rounded-2xl p-1"
                onClick={() => openCreateCl()}
              >
                Ver más
              </button>
            </div>
          </div>
          {/* Segundo Boton */}
          <div className="lg:h-40 bg-white w-[45%] h-24 mx-auto my-auto flex flex-row justify-center">
            <FiShoppingBag className="lg:mt-12 text-2xl h-10 w-10 mt-7 ml-2" />
            <div className="flex flex-col w-[70%] h-full justify-center items-center">
              <div className="w-full h-[50%] text-center">
                <p className="xl:text-[30px] lg:text-[30px] mt-1">Productos:</p>
              </div>
              <button
                className="xl:text-[30px] xl:w-[40%] lg:w-32 lg:h-16 lg:text-[25px] bg-red-500 w-20 text-white text-center text-sm rounded-2xl p-1"
                onClick={() => openCreatePr()}
              >
                Ver más
              </button>
            </div>
          </div>
        </div>
        {/* Tercer Botón */}
        <div className="lg:h-40 lg:mt-20 bg-white w-[45%] h-24 mx-auto flex flex-row justify-center">
          <CiShoppingTag className="lg:mt-12 text-2xl h-10 w-10 mt-7 ml-2" />
          <div className="flex flex-col w-[70%] h-full justify-center items-center">
            <div className="w-full h-[50%] text-center">
              <p className="xl:text-[30px] lg:text-[30px] mt-1">Ventas:</p>
            </div>
            <button
              className="xl:text-[30px] xl:w-[40%] lg:w-32 lg:h-16 lg:text-[25px] bg-red-500 w-20 text-white text-center text-sm rounded-2xl p-1"
              onClick={() => openCreateVs()}
            >
              Ver más
            </button>
          </div>
        </div>
      </div>

      {/* Sección de filtros de ventas */}
      <div
        className="xl:w-[80%] xl:h-[80%]
            lg:h-[20em] grid grid-rows grid-flow-col-1 h-60 w-[90%] mx-auto mt-4 drop-shadow-2xl bg-white"
      >
        <div className="xl:text-xl grid grid-col-1 drop-shadow-2xl h-auto w-[90%] mx-auto mt-[5%] p-2">
          <h5 className="xl:text-[35px] lg:text-[30px] p-2">Filtrar Datos:</h5>
          <div className="xl:text-xl w-full flex space-x-4">
            <div className="w-1/2 p-2">
              <label
                htmlFor="fechaInicio"
                className="xl:text-[30px] lg:text-[25px] block text-md font-medium text-gray-700 mb-2"
              >
                Desde:
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="xl:text-[28px] xl:h-16 lg:text-[25px] mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="w-1/2 p-2">
              <label
                htmlFor="fechaFin"
                className="xl:text-[30px] lg:text-[25px] block text-md font-medium text-gray-700 mb-2"
              >
                Hasta:
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="xl:text-[28px] xl:h-16 lg:text-[25px] mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="xl:text-base flex flex-row mx-auto text-center gap-1">
          <button className="xl:text-[30px] xl:w-[10em] xl:h-[2em] lg:w-[200px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-32  text-center text-white rounded-2xl">
            {" "}
            Ver
          </button>
        </div>
        <br />
      </div>

      {/* TABLA DE INFORMACIÓN */}
      <div className="lg:w-[90%] lg:h-auto grid grid-col-2 bg-white drop-shadow-2xl h-[60%] w-[90%] mx-auto mt-[8%] overflow-x-auto overflow-y-auto">
        <Table
          striped
          bordered
          hover
          size="sm"
          style={{ width: "30em", height: "5em" }}
          className="xl:mx-auto xl:text-[30px] lg:text-[25px] mx-auto text-center"
        >
          <thead>
            <tr>
              <th>Nombre del vendedor</th>
              <th>Total de ventas</th>
              <th>Total de todas sus ventas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((data, index) => (
              <>
                <tr key={index}>
                  <td>{data.vendedor}</td>
                  <td>{data.totalVentas}</td>
                  <td>{data.totalMontoVentas}</td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Sección de gráficos de ventas y vendedores */}
      <div className="grid grid-rows grid-flow-col-1 w-[95%] mx-auto mt-4 drop-shadow-2xl">
        {/* Filtros adicionales para Ventas */}
        <div
          className="min-[1920px]:h-[400px] xl:w-[80%] xl:h-[350px]
            lg:h-[20em] grid grid-rows grid-flow-col-1 h-60 w-[90%] mx-auto mt-4 drop-shadow-2xl bg-white"
        >
          <div className="xl:text-xl grid grid-col-1 drop-shadow-2xl h-auto w-[90%] mx-auto mt-[5%] p-2">
            <h5 className="xl:text-[35px] lg:text-[30px] p-2">
              Filtrar Datos:
            </h5>
            <div className="xl:text-xl w-full flex space-x-4">
              <div className="w-1/2 p-2">
                <label
                  htmlFor="fechaInicio"
                  className="xl:text-[30px] lg:text-[25px] block text-md font-medium text-gray-700 mb-2"
                >
                  Desde:
                </label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="xl:text-[28px] xl:h-16 lg:text-[25px] mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="w-1/2 p-2">
                <label
                  htmlFor="fechaFin"
                  className="xl:text-[30px] lg:text-[25px] block text-md font-medium text-gray-700 mb-2"
                >
                  Hasta:
                </label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="xl:text-[28px] xl:h-16 lg:text-[25px] mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          <div className="xl:text-base flex flex-row mx-auto text-center gap-1">
            <button className="xl:text-[30px] xl:w-[10em] xl:h-[2em] lg:w-[200px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-32  text-center text-white rounded-2xl">
              {" "}
              Ver
            </button>
          </div>
          <br />
        </div>

        <br />

        {/* Gráfico de Vendedores */}
        <div className="xl:w-[80%] lg:h-[800px] w-[90%] h-60 bg-white text-center mx-auto mt-4 drop-shadow-2xl">
          <p className="xl:text-[40px] lg:text-[25px] p-2 text-lg">Vendedores</p>
            <comp.Graficos className="mx-auto" dataPrint={dataPrint} />
        </div>
      </div>

      <br />

      <div className="min-[320px]:block lg:hidden">
        <comp.NavbarDash />
      </div>
    </>
  );
};
