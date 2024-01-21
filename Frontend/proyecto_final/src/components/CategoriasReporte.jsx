import React, { useState, useEffect } from "react";

// Otros
import axios from "axios";
import * as XLSX from "xlsx";
import * as comp from "../components/routesComp";

// React Boostrap
import Table from "react-bootstrap/Table";

const fechaActual = new Date();
const mesActual = fechaActual.getMonth() + 1;
const anioActual = fechaActual.getFullYear();

export const CategoriasReporte = () => {
  const [dataTable, setDataTable] = useState([]);
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

  const obtenerDatos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/reportes/reporte-ventas-categorias?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      //console.log(response);
      setDataTable(response.data);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [fechaInicio, fechaFin]);

  const titulo = [{ A: "Reporte de categorías:" }, {}];

  const infoAdicional = [
    {
      A: "Fecha de inicio:",
      B: fechaInicio,
      C: "Fecha de fin:",
      D: fechaFin,
    },
    {},
  ];

  let tabla = [
    {
      A: "Categoría",
      B: "Cantidad de productos vendidos",
      C: "Total vendido",
    },
  ];

  dataTable.forEach((element) => {
    tabla.push({
      A: element.categoria,
      B: element.cantidadVendidos,
      C: element.totalVenta,
    });
  });

  const dataFinal = [...titulo, ...infoAdicional, ...tabla];

  const exportToExcel = (dataFinal) => {
    const hoja = XLSX.utils.json_to_sheet(dataFinal, { skipHeader: true });
    const libro = XLSX.utils.book_new();

    hoja["!merges"] = [
      XLSX.utils.decode_range("A1:D1"),
      XLSX.utils.decode_range("A2:F2"),
      XLSX.utils.decode_range("A34:F34"),
    ];

    hoja["!cols"] = [{ wch: 20 }, { wch: 25 }, { wch: 15 }];

    XLSX.utils.book_append_sheet(libro, hoja, "Reporte de categorías");

    XLSX.writeFile(libro, "reporte_categoría.xlsx");
  };

  const dataPrint = dataTable.map((item) => ({
    x: `${item.categoria} \n Cnt: ${item.cantidadVendidos}`,
    y: item.totalVenta,
  }));

  return (
    <>
      {/* FILTRADO DE DATOS */}
      <div
        className="xl:w-[80%] xl:h-[80%]
            lg:h-[20em] md:h-[300px] grid grid-rows grid-flow-col-1 h-60 w-[90%] mx-auto mt-4 drop-shadow-2xl bg-white"
      >
        <div className="xl:text-xl grid grid-col-1 drop-shadow-2xl h-auto w-[90%] mx-auto mt-[5%] p-2">
          <h5 className="xl:text-[35px] lg:text-[30px] md:text-[25px] p-2">
            Filtrar Datos:
          </h5>
          <div className="xl:text-xl w-full flex space-x-4">
            <div className="w-1/2 p-2">
              <label
                htmlFor="fechaInicio"
                className="xl:text-[30px] lg:text-[25px] md:text-[25px] block text-md font-medium text-gray-700 mb-2"
              >
                Desde:
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="xl:text-[28px] xl:h-16 lg:text-[25px] md:text-[25px] md:h-14 mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div className="w-1/2 p-2">
              <label
                htmlFor="fechaFin"
                className="xl:text-[30px] lg:text-[25px] md:text-[25px] block text-md font-medium text-gray-700 mb-2"
              >
                Hasta:
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="xl:text-[28px] xl:h-16 lg:text-[25px] md:text-[25px] md:h-14 mt-1 -ml-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full py-2 px-1 shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
        <div className="xl:text-base flex flex-row mx-auto text-center gap-1">
          <button className="xl:text-[30px] xl:w-[10em] xl:h-[2em] lg:w-[200px] lg:text-[25px] md:text-[25px] md:h-14 bg-red-500 hover:bg-red-400 h-10 w-32  text-center text-white rounded-2xl" onClick={exportToExcel}>
            {" "}
            Ver
          </button>
        </div>
        <br />
      </div>

      {/* TABLA DE INFORMACIÓN */}
      <div className="xl:h-[770px] lg:h-[600px] md:mb-14 md:w-[90%] md:h-[200px] overflow-x-auto overflow-y-auto mt-4 w-[95%] mx-auto h-60">
        <Table
          striped
          bordered
          hover
          size="sm"
          style={{ width: "50em", height: "5em" }}
          className="xl:text-[30px] lg:text-[25px] md:text-[25px] text-center mx-auto"
        >
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Cantidad de productos vendidos</th>
              <th>Total vendido</th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((data, index) => (
              <>
                <tr key={index}>
                  <td>{data.categoria}</td>
                  <td>{data.cantidadVendidos}</td>
                  <td>{data.totalVenta}</td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      </div>

      {/* GRÁFICA */}
      <div className="xl:w-[80%] lg:h-[800px] md:h-auto w-[90%] h-60 bg-white text-center mx-auto mt-4 drop-shadow-2xl">
        <comp.Graficos dataPrint={dataPrint} />
      </div>
    </>
  );
};
