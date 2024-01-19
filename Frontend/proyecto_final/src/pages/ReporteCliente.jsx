import React, { useState } from "react";

// Otros
import * as comp from "../components/routesComp";
import { useAuth } from "../components/AuthContext";

// Imagenes
import Logo from "../assets/img/logo_2.png";

// Iconos
import { CiMenuBurger } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { FaRegEdit, FaUser, FaArrowLeft } from "react-icons/fa";

// React Router Dom
import { Link, useNavigate } from "react-router-dom";

// Imagenes
import PerfilImg from "../assets/img/perfil/perfil.png";

export const ReporteCliente = () => {
  const history = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpenCRUD, setIsMenuOpenCRUD] = useState(false);
  const [tipoReporte, setTipoReporte] = useState("clientes");
  const { userRole, setRole, imgUser, userName } = useAuth();

  const manejarClickTipoReporte = (tipo) => {
    setTipoReporte(tipo);
  };

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

  return (
    <>
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

      {/* TIPO DE REPORTE */}
      <div className="min-[1920px]:h-[250px] xl:w-[80%] xl:h-[200px] xl:text-xl lg:h-44 grid grid-rows grid-flow-col-1 h-36 w-[90%] mx-auto mt-4 drop-shadow-2xl bg-white overflow-x-auto overflow-y-auto">
        <h5 className="xl:text-[30px] lg:text-[25px] ml-4 mt-4">
          Seleccionar tipo de reporte:
        </h5>
        <div
          className="lg:flex lg:justify-center lg:mx-auto lg:h-[10%]
        md:flex md:justify-center md:mx-auto md:h-[10%]
        flex flex-row mx-auto text-center gap-1 drop-shadow-2xl h-20 w-[90%] mt-[5%] p-2 space-x-4"
        >
          <button
            className={`xl:text-[25px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-auto px-4 -mt-7 text-center text-white rounded-2xl ${
              tipoReporte === "clientes" ? "bg-gray-500" : ""
            }`}
            onClick={() => manejarClickTipoReporte("clientes")}
          >
            Clientes
          </button>
          <button
            className={`xl:text-[25px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-auto px-4 -mt-7 text-center text-white rounded-2xl ${
              tipoReporte === "ventas" ? "bg-gray-500" : ""
            }`}
            onClick={() => manejarClickTipoReporte("ventas")}
          >
            Ventas
          </button>
          <button
            className={`xl:text-[25px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-auto px-4 -mt-7 text-center text-white rounded-2xl ${
              tipoReporte === "productos" ? "bg-gray-500" : ""
            }`}
            onClick={() => manejarClickTipoReporte("productos")}
          >
            Productos
          </button>
          <button
            className={`xl:text-[25px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-auto px-4 -mt-7 text-center text-white rounded-2xl ${
              tipoReporte === "categorias" ? "bg-gray-500" : ""
            }`}
            onClick={() => manejarClickTipoReporte("categorias")}
          >
            Categorías
          </button>
          <button
            className={`xl:text-[25px] lg:text-[25px] bg-red-500 hover:bg-red-400 h-10 w-auto px-4 -mt-7 text-center text-white rounded-2xl ${
              tipoReporte === "vendedores" ? "bg-gray-500" : ""
            }`}
            onClick={() => manejarClickTipoReporte("vendedores")}
          >
            Vendedores
          </button>
        </div>
      </div>

      {tipoReporte === "clientes" && <comp.ClienteReporte />}
      {tipoReporte === "ventas" && <comp.VentasReporte />}
      {tipoReporte === "productos" && <comp.ProductosReporte />}
      {tipoReporte === "categorias" && <comp.CategoriasReporte />}
      {tipoReporte === "vendedores" && <comp.VendedoresReporte />}

      <br />

      <div className="min-[320px]:block lg:hidden">
        <comp.NavbarDash />
      </div>
    </>
  );
};

/*

<div className="grid grid-rows grid-flow-col-1 w-[90%] mx-auto mt-4  drop-shadow-2xl bg-white">
<h4 className="text-center mt-3">Ventas</h4>
<div className="h-full w-full drop-shadow-2xl mt-2">
  <comp.Graficos data={data} className="mx-auto" />
</div>
<br />
</div>


          FILTRADO DE DATOS 
          <div className="grid grid-rows grid-flow-col-1 h-60 w-[90%] mx-auto mt-4 drop-shadow-2xl bg-white">
            <div className="grid grid-col-1 drop-shadow-2xl h-auto w-[90%] mx-auto mt-[5%] p-2">
              <h5 className="p-2">Filtrar Datos:</h5>
              <div className="w-full flex space-x-4">
                <div className="w-1/2 p-2">
                  <label
                    htmlFor="fechaInicio"
                    className="block text-md font-medium text-gray-700 mb-2"
                  >
                    Desde:
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="w-1/2 p-2">
                  <label
                    htmlFor="fechaFin"
                    className="block text-md font-medium text-gray-700 mb-2"
                  >
                    Hasta:
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    name="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-row mx-auto text-center gap-1">
              <button
                className="bg-red-500 hover:bg-red-400 h-10 w-32  text-center text-white rounded-2xl"
                onClick={() => exportToExcel(dataFinal)}
              >
                {" "}
                Imprimir reporte
              </button>
            </div>
            <br />
          </div>

          TABLA DE INFORMACIÓN 
          <div className="grid grid-col-2 bg-white drop-shadow-2xl h-[60%] w-[90%] mx-auto mt-[8%] overflow-x-auto overflow-y-auto">
            <Table striped bordered hover size="sm" style={{ width: "50em" }}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Cédula</th>
                  <th>Correo</th>
                  <th>Cantidad de compras</th>
                </tr>
              </thead>
              <tbody>
                {dataTable.map((data, index) => (
                  <>
                    <tr key={index}>
                      <td>{data.nombre}</td>
                      <td>{data.apellido}</td>
                      <td>{data.cedula}</td>
                      <td>{data.correo}</td>
                      <td>{data.totalCompras}</td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>

 */
