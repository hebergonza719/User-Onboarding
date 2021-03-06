import React, { useState, useEffect } from 'react';
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

  // Add empty array as initial value []
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // if status has content (an obj from API response) then render function setUsers
    // use a spread to create a new array with all of users 
    // previous values + the new obj from the API stored in status
    // could be setUsers([...users, status]) but that fires a warning 
    // that we should watch users. We don't need to watch for users 
    // changes (this is the only place it could change)
    // change to users => [...users, status] to read in the current 
    // value of users, and then use it to create a new array

    // if status has content, then render function setUsers()
    status && setUsers(users => [...users, status]);

  }, [status]) // listens for any changes in status, status comes from handleSubmit

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
          {/* after <Field/> */}
          {/* If has been visited && errors exist for that */}
          {/* input => render JSX to show errors */}
          {touched.name && errors.name && (
            // errors.name comes from Yup
            <p>{errors.name}</p>
          )}
        </label>

        <label htmlFor="email">
          <Field 
            id="email"
            type="email"
            name="email"
            placeholder="Enter email"
          />
          {touched.email && errors.email && (
            <p>{errors.email}</p>
          )}
        </label>

        <label htmlFor="password">
          <Field
            id="password"
            type="password"
            name="password"
            placeholder="Enter password"
          />
          {touched.password && errors.password && (
            <p>{errors.password}</p>
          )}
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
      {/* render what we have already posted */}
      {users.map(user => {
        return (
          // <ul key="user.id">
          //   <li>Name: {user.name}</li>
          //   <li>Email: {user.email}</li>
          // </ul>
          <div key="user.id">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
          </div>
        );
      })}
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
    name: Yup.string().required("Please enter a name"),
    email: Yup.string().required("Don't forget an email"),
    password: Yup.string().required("Password is definitely required")
  }), // comma is required because we still have to declare handleSubmit 


  // passed through props (magically) to Form component in Formik
  // fires when button type=submit is fired
  // values = state of form, formikBag is second param
  // in FormikBag: setStatus (sends API response to AnimalForm) 
  // & resetForm (clears form when called)

  handleSubmit(values, { setStatus, resetForm }) {

    axios
      .post("https://reqres.in/api/users", values)
      .then(res => {
        console.log("this is the response: ", res);
        
        // sends a status update through props in UserForm with value as response.data content
        // this comes from the formikBag
        setStatus(res.data);

        //clears form inputs, from FormikBag
        resetForm();
      })

      // don't forget to add .catch
      .catch(err => console.log(err.response));
  }


  // you must add the form component at the end
})(UserForm);

// REALLY IMPORTANT !!!!!
// Export Formik Form component not regular form component
// because new form is wrapped around by formik
export default FormikUserForm;