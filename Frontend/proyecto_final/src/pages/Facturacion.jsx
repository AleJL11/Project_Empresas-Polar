import React, { useState, useEffect } from "react";

// Otros
import * as comp from "../components/routesComp";
import { useAuth } from "../components/AuthContext";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

// React Boostrap
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

// React Router Dom
import { useParams } from "react-router-dom";

// Imagenes
import Logo from "../assets/img/logo_2.png";

export const Facturacion = () => {
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState({
    vendedores: "",
    nombres: "",
    cantidades: 0,
    preciosUnitarios: "",
    subtotales: "",
    total: "",
  });

  const { id } = useParams();
  const productIds = id.split("-");

  const {
    userName,
    userLastName,
    userDNI,
    userEmail,
    userNroTlf,
    userDirection,
  } = useAuth();

  useEffect(() => {
    const fetchProductsInfo = async () => {
      try {
        const responses = await Promise.all(
          productIds.map((productId) =>
            axios.get(`http://localhost:3001/productos/${productId}`)
          )
        );
        //console.log(responses);

        const vendedores = responses
          .map((res) => res.data.product.vendedor)
          .join(", ");
        //console.log(vendedores);
        const nombres = responses
          .map((res) => res.data.product.nombre)
          .join(", ");
        //console.log(nombres);
        const cantidades = responses
          .map((res) => res.data.product.cantidad)
          .join(", ");
        //console.log(cantidades);
        const preciosUnitarios = responses
          .map(
            (res) => res.data.product.nombre + ": " + res.data.product.precio
          )
          .join(", ");
        //console.log(preciosUnitarios);
        const subtotales = responses
          .map(
            (res) =>
              `${res.data.product.nombre}: ${
                res.data.product.precio * res.data.product.cantidad
              }`
          )
          .join(", ");
        //console.log(subtotales);
        const total = responses.reduce(
          (sum, res) =>
            sum + res.data.product.precio * res.data.product.cantidad,
          0
        );
        //console.log(total);

        setProductInfo({
          vendedores,
          nombres,
          cantidades,
          preciosUnitarios,
          subtotales,
          total,
        });

        setLoading(true);
      } catch (error) {
        console.error(
          "Error al obtener la información de los productos:",
          error
        );
      }
    };

    fetchProductsInfo();
  }, [productIds]);

  const fetchNextInvoiceNumber = async () => {
    try {
      const response = await axios.get("http://localhost:3001/correlativo");
      //console.log(response.data.correlativo);
      const data = response.data.correlativo;
      //console.log(data);
      setNextInvoiceNumber(data);
    } catch (error) {
      console.error("Error fetching next invoice number:", error);
    }
  };

  useEffect(() => {
    fetchNextInvoiceNumber();
  }, []);

  if (!loading) {
    return (
      <div className="loader">
        <div className="loader-text">Cargando...</div>
        <div className="loader-bar"></div>
      </div>
    );
  }

  const handleGeneratePDF = async (e) => {
    e.preventDefault();
    try {
      const pdf = new jsPDF();

      // Productos
      const numeroFactura = document.getElementById("formNumeroFactura").value;
      const vendedores = productInfo.vendedores.split(", ");
      const nombres = productInfo.nombres.split(", ");
      const preciosUnitarios = productInfo.preciosUnitarios
        .split(", ")
        .map((item) => item.split(": ")[1]);
      const subtotales = productInfo.subtotales
        .split(", ")
        .map((item) => item.split(": ")[1]);
      const cantidades = productInfo.cantidades.split(", ");
      const total = productInfo.total;
      const totalBsS = productInfo.total * 40;

      // Encabezado del PDF
      pdf.setFont("times");
      pdf.setFontSize(20);
      pdf.text("Factura de su compra", 95, 25);

      // Agregar el logo al encabezado del PDF
      const imgData = Logo;
      pdf.addImage(imgData, "PNG", 10, 10, 45, 25);

      // Información del cliente
      pdf.setFontSize(14);
      pdf.text("Información del cliente:", 10, 45);
      pdf.text("Precios en divisas", 90, 85);
      pdf.text("Precios en bolívares", 90, 135);

      pdf.setFontSize(12);
      pdf.text(`Nombre: ${userName} ${userLastName}`, 10, 55);
      pdf.text(`Cédula: ${userDNI}`, 10, 60);
      pdf.text(`Correo: ${userEmail}`, 10, 65);
      pdf.text(`Número telefónico: ${userNroTlf}`, 10, 70);
      pdf.text(`Dirección: ${userDirection}`, 10, 75);

      // Información del total a pagar
      pdf.text(`Total a pagar en divisas: ${total}`, 149, 185);
      pdf.text(`Total a pagar en bolívares: ${totalBsS}`, 141, 195);

      // Encabezado de la tabla
      const headers = [
        "Vendedores",
        "Productos",
        "Precio Unitario",
        "Cantidad por Producto",
        "Sub-Total por Producto",
      ];
      const data = nombres.map((nombre, index) => {
        return [
          vendedores[index],
          nombre,
          preciosUnitarios[index],
          cantidades[index],
          subtotales[index],
        ];
      });

      // Configurar estilos y agregar tabla al PDF
      pdf.autoTable({
        theme: "grid",
        head: [headers],
        body: data,
        startY: 95,
        margin: { top: 20 },
        styles: {
          overflow: "linebreak",
          fontSize: 10,
          cellPadding: 2,
          halign: "center",
          valign: "middle",
        },
        headStyles: { fillColor: [56, 124, 211] },
      });

      const headers2 = [
        "Vendedores",
        "Productos",
        "Precio Unitario",
        "Cantidad por Producto",
        "Sub-Total por Producto",
      ];
      const data2 = nombres.map((nombre, index) => {
        return [
          vendedores[index],
          nombre,
          preciosUnitarios[index] * 40,
          cantidades[index],
          subtotales[index] * 40,
        ];
      });

      // Configurar estilos y agregar tabla al PDF
      pdf.autoTable({
        theme: "grid",
        head: [headers2],
        body: data2,
        startY: pdf.previousAutoTable.finalY + 25,
        margin: { top: 20 },
        styles: {
          overflow: "linebreak",
          fontSize: 10,
          cellPadding: 2,
          halign: "center",
          valign: "middle",
        },
        headStyles: { fillColor: [56, 124, 211] },
      });

      // 3era tabla
      const headers3 = ["Número de Factura"];
      const data3 = [[numeroFactura]];

      // Configurar estilos y agregar tercera tabla al PDF
      pdf.autoTable({
        theme: "grid",
        head: [headers3],
        body: data3,
        startY: 50,
        margin: { left: 155 },
        styles: {
          overflow: "linebreak",
          fontSize: 8,
          cellPadding: 2,
          halign: "center",
          valign: "middle",
        },
        columnStyles: { 0: { cellWidth: 40 } },
        headStyles: { fillColor: [56, 124, 211] },
      });

      const filename = `Factura_Nro_${numeroFactura}.pdf`;
      pdf.save(filename);

      // Almacenar en la base de datos
      try {
        const postData = {
          cliente: `${userName} ${userLastName}`,
          vendedor: productInfo.vendedores,
          productos: productInfo.nombres.split(", ").map((producto, index) => ({
            nombre: producto,
            cantidad: parseInt(productInfo.cantidades.split(", ")[index]),
            precioUnitario: parseFloat(
              productInfo.preciosUnitarios
                .split(", ")
                [index].split(": ")[1]
                .replace("$", "")
            ),
            subtotal: parseFloat(
              productInfo.subtotales
                .split(", ")
                [index].split(": ")[1]
                .replace("$", "")
            ),
          })),
        };

        const response = await axios.post(
          "http://localhost:3001/ventas",
          postData
        );
        if (response.status === 201) {
          console.log("Venta almacenada en la base de datos");
        }
      } catch (error) {
        console.error(
          "Error al almacenar la venta en la base de datos:",
          error
        );
      }

      /*const pdfOutput = pdf.output('bloburl');
      window.open(pdfOutput, '_blank');*/
    } catch (error) {
      console.error("Error al generar PDF:", error.message);
    }
  };

  return (
    <>
      <comp.Header />
      <div
        className="
      xl:w-[70%]
      lg:h-[50%]
      md:w-[70%] md:h-[70%] md:mt-[-8]
      w-[90%] h-20 mx-auto mt-[-50px]
      "
      >
        <div
          className="
          min-[1920px]:w-[40%] min-[1920px]:h-[250px]
        xl:w-[50%]
        lg:w-[60%] lg:h-[200px]
        md:h-[50%]
        w-[50%] h-20 mx-auto bg-white rounded-t-lg drop-shadow-xl
        "
        >
          <img
            src={Logo}
            alt="Logo Empresas Polar"
            className="
            md:w-[95%] md:h-full md:p-2
            w-[95%] h-full mx-auto p-2"
          />
        </div>
      </div>
      <h2 className="xl:text-[40px] md:text-[30px] text-center mt-4">Facturación de compra</h2>
      <div className="lg:w-[85%] lg:h-[1000px] lg:mb-[10%] md:h-[980px] md:w-[90%] w-[85%] mx-auto drop-shadow-2xl mt-8">
        <Form className="md:w-full">
          <div className="lg:w-full md:w-full md:flex md:justify-center md:mx-auto">
            <div className="lg:w-[50%] lg:h-full md:flex md:flex-col md:w-full md:ml-12">
              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formBasicNombre">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Nombre del usuario
                </Form.Label>
                <input
                  type="text"
                  placeholder={userName}
                  value={userName}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formBasicApellido">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Apellido del usuario
                </Form.Label>
                <input
                  type="text"
                  placeholder={userLastName}
                  value={userLastName}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formBasicCedula">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Cédula del usuario
                </Form.Label>
                <input
                  type="text"
                  placeholder={userDNI}
                  value={userDNI}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>
            </div>

            <div className="lg:w-[50%] lg:h-full md:flex md:flex-col md:w-full md:ml-12">
              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center"  controlId="formBasicCorreo">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Correo del usuario
                </Form.Label>
                <input
                  type="email"
                  placeholder={userEmail}
                  value={userEmail}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center"  controlId="formNumeroTelefono">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Número de teléfono del usuario
                </Form.Label>
                <input
                  type="text"
                  placeholder={userNroTlf}
                  value={userNroTlf}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center"  controlId="formNumeroDirecion">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Dirección del usuario
                </Form.Label>
                <input
                  type="text"
                  placeholder={userDirection}
                  value={userDirection}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>
            </div>
          </div>

          <p className="xl:text-[35px] lg:ml-[35%] md:text-[30px] md:mt-16 md:ml-[35%] md:mb-8 text-slate-500 ml-[20%] text-lg">
            Información del producto
          </p>

          <div className="lg:w-full lg:h-[400px] lg:mb-16 md:mb-8 md:flex md:justify-center md:mx-auto">
            <div className="lg:w-[50%] lg:h-full md:flex md:flex-col md:w-full md:ml-12">
              <Form.Group
                className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center"
                controlId="formNumeroFactura"
              >
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">
                  Número de Factura
                </Form.Label>
                <input
                  type="number"
                  placeholder={nextInvoiceNumber}
                  value={nextInvoiceNumber}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formNumeroNombre">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">Nombre de los productos</Form.Label>
                <input
                  type="text"
                  placeholder={productInfo.nombres}
                  value={productInfo.nombres}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formNumeroVendedor">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">Nombre de los vendedores</Form.Label>
                <input
                  type="text"
                  placeholder={productInfo.vendedores}
                  value={productInfo.vendedores}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>
            </div>

            <div className="lg:w-[50%] lg:h-full md:flex md:flex-col md:w-full md:ml-12">
              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formNumeroPrecioUnitario">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">Precio Unitario por producto</Form.Label>
                <input
                  type="text"
                  placeholder={productInfo.preciosUnitarios}
                  value={productInfo.preciosUnitarios}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formNumeroCantidad">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">Cantidades por producto</Form.Label>
                <input
                  type="text"
                  placeholder={productInfo.cantidades}
                  value={productInfo.cantidades}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formNumeroSubTotal">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">Sub-total por producto</Form.Label>
                <input
                  type="text"
                  placeholder={productInfo.subtotales}
                  value={productInfo.subtotales}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>

              <Form.Group className="min-[1920px]:w-[700px] xl:w-[500px] lg:h-[33.33%] md:w-[300px] md:mx-auto mb-3 text-center" controlId="formNumeroTotal">
                <Form.Label className="xl:text-[35px] lg:text-[30px] md:text-[27px]">Total por producto</Form.Label>
                <input
                  type="number"
                  placeholder={productInfo.total}
                  value={productInfo.total}
                  readOnly
                  className="lg:w-full lg:h-[50%] lg:text-2xl md:text-[25px] rounded-lg"
                />
              </Form.Group>
            </div>
          </div>

          <button
            type="submit"
            className="lg:w-[30%] lg:h-16 lg:text-[30px] lg:mx-[35%] lg:mt-4 md:w-[30%] md:h-16 md:text-[25px] md:ml-[35%] bg-red-500 rounded-lg ml-[23%] text-white h-12 w-[60%]"
            onClick={handleGeneratePDF}
          >
            Generar Factura
          </button>
        </Form>
      </div>
      <br />

      <comp.Footer />
      <comp.SubMenu />
    </>
  );
};
