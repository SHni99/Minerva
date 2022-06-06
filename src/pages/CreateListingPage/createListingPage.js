import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient as supabase } from "config/supabase-client";
import { Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";

import CloseButton from "react-bootstrap/CloseButton";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import createListingPageStyles from "./createListingPage.module.css";
import Button from "react-bootstrap/Button";
import { PlusCircle } from "react-bootstrap-icons";

const CreateListingPage = () => {
  // Hook declarations
  const [submitting, setSubmitting] = useState(false);
  const [tutorTutee, setTutorTutee] = useState("tutor");
  const [sFields, setSFields] = useState(
    [0, 1, 2].map((id) => {
      return { id };
    })
  );
  const [sFieldInputs, setSFieldInputs] = useState([]);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit: validateAndSubmit,
    formState: { errors: validationErrors },
  } = useForm();

  // Options to be shown under the selection field dropdown box.
  // Edit this if required!
  const fieldParams = {
    qualifications: "Qualifications",
    timing: "Preferred Times",
    commitment: "Commitment Period",
    others: "Others",
  };

  // ------------------ End of const declarations ----------------------

  // Redirect user to login page if not logged in
  useEffect(() => {
    if (!supabase.auth.user()) navigate("/loginpage");

    // We are disabling the following warning as there is
    // no point in including the navigate method into the
    // dependency array.

    // eslint-disable-next-line
  }, []);

  // Handles adding of selection fields
  const onSFieldAdd = () => {
    const newSFields = [...sFields, { id: sFields.length }];
    setSFields(newSFields);
  };

  // Handles deletion of selection fields
  const onSFieldDelete = (id) => {
    const newSFields = sFields.filter((sField) => sField.id !== id);
    setSFields(newSFields);
  };

  // Handles submission of entire form to Supabase
  const handleSubmit = async () => {
    // Get all relevant details from input fields
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const fields = sFieldInputs.map((sFieldInput) => {
      return {
        category: sFieldInput.requirement,
        value: sFieldInput.getInput(),
      };
    });

    // Update Supabase with input
    try {
      // Causes screen to show "Submitting..."
      setSubmitting(true);

      // Pack the data to be uploaded to Supabase
      const data = {
        creator_id: supabase.auth.user().id,
        title,
        description,
        fields,
        seeking_for: tutorTutee,
      };

      // Attempt to upload data to Supabase
      let { error } = await supabase
        .from("listings")
        .insert(data, { returning: "minimal" });

      // If error encountered, handle it in the catch block
      if (error) throw error;
    } catch (error) {
      // Displays error message
      alert(error.message);
    } finally {
      // After submission, regardless of whether it succeeded or not, redirect user to the listings page
      navigate("/listingspage");
    }
  };

  return (
    <div>
      <NavBar />
      <CreateListingBody
        selectionFields={sFields}
        sFieldInputStates={[sFieldInputs, setSFieldInputs]}
        onSFieldAdd={onSFieldAdd}
        onSFieldDelete={onSFieldDelete}
        tutorTutee={tutorTutee}
        setTutorTutee={setTutorTutee}
        handleSubmit={handleSubmit}
        submitting={submitting}
        register={register}
        validateAndSubmit={validateAndSubmit}
        validationErrors={validationErrors}
      />
      <FooterBar />
    </div>
  );
};

export default CreateListingPage;

const CreateListingBody = (props) => {
  const {
    selectionFields,
    sFieldInputStates,
    onSFieldAdd,
    onSFieldDelete,
    tutorTutee,
    setTutorTutee,
    handleSubmit,
    submitting,
    register,
    validateAndSubmit,
    validationErrors,
  } = props;

  // Check if submission is in progress. Show "Submitting..." if required.
  return submitting ? (
    <div className={createListingPageStyles["body"]}>
      <h1 className="nunito-medium-black-48px">Submitting...</h1>
      <Spinner animation="border" />
    </div>
  ) : (
    // Actual submission form. Shown only if not submitting and user is logged in.
    <form
      className={createListingPageStyles["body"]}
      onSubmit={validateAndSubmit(handleSubmit)}
    >
      {/* Listing Title. Required field. */}
      <input
        className={`\
            ${createListingPageStyles["input-composition-master"]} \
            ${createListingPageStyles["border-1px-gray700--101828"]}`}
        placeholder="Listing Title"
        id="title"
        {...register("title", { required: "This is a required field." })}
      />
      <p className="text-danger mt-1">{validationErrors.title?.message}</p>

      {/* Tutor/Tutee toggle. Defaults to Tutor. */}
      <div className={createListingPageStyles["choose-tutor-tutee"]}>
        <h1
          className={`${createListingPageStyles["findMeText"]} nunito-medium-black-24px`}
        >
          Find me a
        </h1>
        <TutorTuteeToggle
          tutorTutee={tutorTutee}
          setTutorTutee={setTutorTutee}
        />
      </div>

      {/* Add Images section. Capped at 3. */}
      <div
        className={`\
            ${createListingPageStyles["listing-images"]} \
            ${createListingPageStyles["border-1px-gray700---101828"]}`}
      >
        <ListingImage />
      </div>

      {/* Input fields. Includes both fixed and dynamic (selection fields) fields. */}
      <div className={createListingPageStyles["listing-fields"]}>
        {/* Fixed field 1: Listing description
          Required field, with a maximum of 100 characters. */}
        <div
          className={`\
                ${createListingPageStyles["describe-listing-input"]} \
                ${createListingPageStyles["border-1px-gray700-101828"]}`}
        >
          <input
            className={createListingPageStyles["describe-listing-text"]}
            placeholder="Describe your listing in one sentence!"
            id="description"
            {...register("describeListing", {
              required: "This is a required field.",
            })}
          />
        </div>
        <p className="text-danger mt-1">
          {validationErrors.describeListing?.message}
        </p>

        {/* Start of dynamic fields/selection fields */}
        <div className={createListingPageStyles["selection-fields"]}>
          {/* Creates a SelectionField for each object present in the selectionFields state.
            SelectionField implementation can be found below. */}
          {selectionFields.map((sField) => (
            <SelectionField
              key={sField.id}
              id={sField.id}
              onSFieldDelete={onSFieldDelete}
              sFieldInputStates={sFieldInputStates}
            />
          ))}
          {/* Button to add selection fields. onClick handler can be found above, under CreateListingPage. */}
          {/* <div
            className={`${createListingPageStyles["plus-circle"]} border-1px-mountain-mist`}
            onClick={onSFieldAdd}
          >
            +
          </div> */}
          <PlusCircle
            size={42}
            className="align-self-center mt-3"
            style={{ color: "gray", cursor: "pointer" }}
            onClick={onSFieldAdd}
          />
        </div>
      </div>

      {/* Submit Button.  */}
      <Button
        type="submit"
        className="rounded-pill p-3 w-50"
        style={{
          fontSize: "20px",
          backgroundColor: "var(--primary400---0354a6)",
        }}
      >
        Let's Go!
      </Button>
    </form>
  );
};

// The tutor/tutee toggle.
// Changes based on current state, recorded in `tutorTutee`
// Destructuring of given attributes done in the parameter definition.
const TutorTuteeToggle = ({ tutorTutee, setTutorTutee }) => {
  return (
    <div
      className={createListingPageStyles["tutor-tutee-toggle"]}
      onClick={() => setTutorTutee(tutorTutee === "tutor" ? "tutee" : "tutor")}
    >
      <div className={`inter-medium-sapphire-24px`}>{tutorTutee}</div>
    </div>
  );
};

// The SelectionField element.
const SelectionField = (props) => {
  const { id, onSFieldDelete, sFieldInputStates, fieldParams } = props;
  const [sFieldInputs, setSFieldInputs] = sFieldInputStates;

  // Called whenever there is a change in the dropdown box selection.
  // Records the changes into the sFieldInputs state.
  // The sFieldInputs will contain objects with these three items:
  // 1. SelectionField id
  // 2. Value of the selected item in the dropdown box
  // 3. A method to get the value of the corresponding input box

  const handleDropdownChange = (e) => {
    const fieldDropdown = e.target;
    const fieldInput = e.target.parentElement.children[1].firstChild;
    setSFieldInputs([
      ...sFieldInputs.filter((sField) => sField.id !== id),
      {
        id,
        requirement: fieldDropdown.value,
        getInput: () => fieldInput.value,
      },
    ]);
  };

  return (
    <div className={createListingPageStyles["selection-field-1"]}>
      {/*
         The dropdown box. 
         Calls handleDropdownChange when changed.
         Displays fixed values which can be changed in the fieldParams const
         declared at the start.
      */}
      <select
        className={createListingPageStyles["selection-dropdown-box-master"]}
        defaultValue="DEFAULT"
        onChange={handleDropdownChange}
      >
        <option disabled value="DEFAULT" hidden>
          Requirement
        </option>
        {(() => {
          const fields = [];

          for (let field in fieldParams) {
            fields.push(
              <option key={field} value={field}>
                {" "}
                {fieldParams[field]}{" "}
              </option>
            );
          }

          return fields;
        })()}
      </select>

      {/* The input box for users to elaborate on their requirements. */}
      <div
        className={`\
            ${createListingPageStyles["selection-input-box-master"]} \
            ${createListingPageStyles["border-1px-gray500---98a2b3"]}`}
      >
        <input
          className={createListingPageStyles["input-text-4"]}
          placeholder="Tell us more..."
        />
      </div>

      {/* Button to delete this SelectionField. */}
      <CloseButton className="m-1" onClick={() => onSFieldDelete(id)} />
    </div>
  );
};

const ListingImage = (props) => {
  return (
    <div
      className={`${createListingPageStyles["add-image-placeholder"]} border-1px-mountain-mist`}
    >
      +
    </div>
  );
};
