import React from "react";

// React Bootstrap
import Form from "react-bootstrap/Form";


export const Formulario = ({ formFields }) => {
  const handleChange = (e, index) => {
    console.log(`Valor del input ${index}: ${e.target.value}`);
  };

  return (
    <>
      <Form className="w-[70%] mx-auto">
        {formFields.map((field, index) => (
          <Form.Group key={index} controlId={`formBasic${field.name}`}>
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              placeholder={field.placeholder}
              name={field.name}
              value={field.value || ""}
              onChange={(e) => handleChange(e, index)}
            />
          </Form.Group>
        ))}
      </Form>
    </>
  );
};
