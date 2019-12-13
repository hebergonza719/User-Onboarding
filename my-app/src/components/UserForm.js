import React from 'react';
import { withFormik, Form, Field } from "formik";
import axios from 'axios';
import * as Yup from 'yup';

// This is why it wasn't recognizing values vvv
// 1. props from Formik => values, errors, touched, status

// 2. these are prefixed props sent from Formik 
// into AnimalForm because AnimalForm is wrapped by withFormik HOC

// 3. values => state of inputs & updates with change in input
// 4. errors => any errors from Yup validation
// 5. touched => when an input has be entered and moved away from by user
// 6. status => when chagne from API has updated via setStatus

const UserForm = ({ values, errors, touched, status }) => {
  console.log("values", values);
  console.log("errors", errors);
  console.log("touched", touched);

  return (
    <div>
      <Form>
        <label htmlFor="name">
          <Field 
            id="name"
            type="text"
            name="name"
            placeholder="Enter name"
          />
        </label>

        <label htmlFor="email">
          <Field 
            id="email"
            type="email"
            name="email"
            placeholder="Enter email"
          />
        </label>

        <label htmlFor="password">
          <Field
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
          />
        </label>

        <label>
          Terms of Condition
          <Field
            type="checkbox"
            name="terms"
            checked={values.terms}
          />
        </label>
        <button type="submit">Submit!</button>
      </Form>
    </div>
  );

};


// create HOC when using withFormik

const FormikUserForm = withFormik({
  // this sets initial state for each field
  mapPropsToValues(props) {
    // this return requires an object {}
    return {
      // keys must be lower-case
      name: props.name || "",
      email: props.email || "",
      password: props.password || "",
      terms: props.terms || false
    };
    // a comma follows the curly brace to declare validationSchema
  },

  // Declare shape and requirement of values object (form state )
  validationSchema: Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required")
  }), // comma is required because we still have to declare handleSubmit 


  // you must add the form component at the end
})(UserForm);

// REALLY IMPORTANT !!!!!
// Export Formik Form component not regular form component
// because new form is wrapped around by formik
export default FormikUserForm;