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
import AutosizeInput from "react-input-autosize";
import LoadingOverlay from "react-loading-overlay-ts";

const CreateListingPage = () => {
  // Options to be shown under the selection field dropdown box. Edit if required!
  const fieldParams = {
    qualifications: "Qualifications",
    timing: "Preferred Times",
    commitment: "Commitment Period",
    others: "Others",
  };

  // Hook declarations in root element to maintain single source of truth
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sFieldInputs, setSFieldInputs] = useState([]);
  const [rates, setRates] = useState(null);
  const [tutorTutee, setTutorTutee] = useState("tutor");
  const [imageURLs, setImageURLs] = useState([]);
  const [sFields, setSFields] = useState(
    [0, 1, 2].map((id) => {
      return { id };
    })
  );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit: validateAndSubmit,
    formState: { errors: validationErrors },
  } = useForm();
  const [invalidRates, setInvalidRates] = useState(null);

  // ------------------ End of variable declarations ----------------------

  // Redirect user to login page if not logged in
  useEffect(() => {
    if (!supabase.auth.user()) navigate("/loginpage");

    // We are disabling the following warning as there is
    // no point in including the navigate method into the
    // dependency array.

    // eslint-disable-next-line
  }, []);

  // ------------------ Start of method declarations ----------------------

  // Handles uploading of images to Supabase
  const onImgUpload = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length == 0) {
        throw new Error("Please select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${supabase.auth.user().id}/${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      let { publicURL, downloadError } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);
      if (downloadError) throw downloadError;

      setImageURLs([...imageURLs, { filePath, publicURL }]);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  // Handles deletion of images from Supabase by URL
  const onImgDelete = async (imgURL) => {
    try {
      // Attempt to delete specified image from Supabase first
      setUploading(true);
      const imgObj_delete = imageURLs.find(
        (imgObj) => imgObj.publicURL === imgURL
      );

      let { error } = await supabase.storage
        .from(`listing-images`)
        .remove([imgObj_delete.filePath]);

      if (error) throw error;

      // Finally, remove specified image from imgURLs.
      setImageURLs(imageURLs.filter((imgObj) => imgObj.publicURL !== imgURL));
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

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
    const rates = document.getElementById("rates").value;
    const subject = document.getElementById("subject").value;
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
        rates,
        subject,
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

  // ------------------ End of method declarations ----------------------

  return (
    <div>
      <NavBar />
      <CreateListingBody
        selectionFields={sFields}
        sFieldInputStates={[sFieldInputs, setSFieldInputs]}
        onImgUpload={onImgUpload}
        onImgDelete={onImgDelete}
        uploading={uploading}
        onSFieldAdd={onSFieldAdd}
        onSFieldDelete={onSFieldDelete}
        tutorTutee={tutorTutee}
        setTutorTutee={setTutorTutee}
        handleSubmit={handleSubmit}
        fieldParams={fieldParams}
        submitting={submitting}
        register={register}
        validateAndSubmit={validateAndSubmit}
        validationErrors={validationErrors}
        rates={rates}
        setRates={setRates}
        invalidRates={invalidRates}
        setInvalidRates={setInvalidRates}
        imageURLs={imageURLs}
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
    onImgUpload,
    onImgDelete,
    uploading,
    tutorTutee,
    setTutorTutee,
    handleSubmit,
    fieldParams,
    submitting,
    register,
    validateAndSubmit,
    validationErrors,
    rates,
    setRates,
    invalidRates,
    setInvalidRates,
    imageURLs,
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
      <p className="text-danger mt-1 mb-5">{validationErrors.title?.message}</p>

      {/* Add Images section. Capped at 3. */}
      <LoadingOverlay active={uploading} spinner text="Loading...">
        <div
          className={`\
              ${createListingPageStyles["listing-images"]} \
              ${createListingPageStyles["border-1px-gray700---101828"]}`}
        >
          {/* Map each element in imageURLs into a ListingImage to display the image. */}
          {imageURLs.map((imgObj) => (
            <ListingImage
              imgUrl={imgObj.publicURL}
              onImgDelete={onImgDelete}
              uploading={uploading}
              numPics={imageURLs.length}
            />
          ))}

          {/* If there are less than 3 imageURL elements, then add a 
          placeholder ListingImage for user to add new images */}
          {imageURLs.length < 3 && (
            <ListingImage
              onImgUpload={onImgUpload}
              uploading={uploading}
              numPics={imageURLs.length}
            />
          )}
        </div>
      </LoadingOverlay>

      {/* Input fields. Includes both fixed and dynamic (selection fields) fields. */}
      <div className={createListingPageStyles["listing-fields"]}>
        {/* Fixed field 1: Tutor/Tutee toggle. Defaults to Tutor. */}
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

        {/* Fixed field 2: Tutor/Tutee rate. Required field. */}
        <div className="d-flex flex-row align-items-center">
          <h1 className="nunito-medium-black-24px m-0 p-0">for $</h1>
          <AutosizeInput
            name="rates"
            id="rates"
            value={rates}
            className="nunito-medium-black-24px ms-1 border-0 px-3 py-1 m-2"
            placeholder="..."
            style={{
              borderRadius: "15px",
              boxShadow: "0px 4px 4px #00000040",
              color: "var(--sapphire)",
              fontWeight: "bold",
            }}
            onChange={(e) => {
              let newVal = e.target.value;
              if (/^[0][0-9]+/.test(newVal))
                newVal = newVal.substring(1, newVal.length);
              if (/^\d{0,3}(\.\d{0,2})?$/.test(newVal)) {
                if (invalidRates) setInvalidRates(null);
                setRates(newVal);
              } else if (/^[^0-9.]/.test(newVal)) {
                setInvalidRates("Only digits and decimals are allowed.");
              } else if (/^\d{0,3}(\.\d*)/.test(newVal)) {
                setInvalidRates("2 decimal places will do!");
              } else if (/^\d*/.test(newVal)) {
                setInvalidRates(
                  "Woah there! Try to keep your rates under $1000!"
                );
              }
            }}
          />
          <h1 className="nunito-medium-black-24px m-0">per hour</h1>
        </div>
        <p className="text-danger">{invalidRates}</p>

        {/* Fixed field 3: Subject. Required Field.*/}
        <div className="d-flex flex-row align-items-center mb-1">
          <h1 className="nunito-medium-black-24px mx-2 my-0 p-0">to teach</h1>
          <input
            id="subject"
            className="nunito-medium-black-24px ms-1 border-0 px-3 py-1 mx-2 text-center"
            placeholder="Enter a subject!"
            style={{
              width: "250px",
              borderRadius: "15px",
              boxShadow: "0px 4px 4px #00000040",
              overflow: "scroll",
              color: "var(--sapphire)",
              fontWeight: "bold",
            }}
            {...register("subject", {
              required: "This is a required field.",
              maxLength: { value: 30, message: "That's a little too long!" },
            })}
          />
        </div>
        <p className="text-danger">{validationErrors.subject?.message}</p>

        {/* Fixed field 4: Listing description
          Required field, with a maximum of 100 characters. */}
        <div
          className={`\
                ${createListingPageStyles["describe-listing-input"]} \
                ${createListingPageStyles["border-1px-gray700-101828"]}`}
        >
          <input
            className={createListingPageStyles["describe-listing-text"]}
            placeholder="Describe your listing in one short sentence."
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
          <h1 className="nunito-medium-black-24px mx-2 my-0 pt-2 align-self-center">
            Additionally, ... (Optional)
          </h1>
          {/* Creates a SelectionField for each object present in the selectionFields state.
            SelectionField implementation can be found below. */}
          {selectionFields.map((sField) => (
            <SelectionField
              key={sField.id}
              id={sField.id}
              onSFieldDelete={onSFieldDelete}
              sFieldInputStates={sFieldInputStates}
              fieldParams={fieldParams}
            />
          ))}
          {/* Button to add selection fields. onClick handler can be found above, under CreateListingPage. */}
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

const ListingImage = ({
  imgUrl,
  onImgUpload,
  onImgDelete,
  uploading,
  numPics,
}) => {
  return (
    <div
      className={`${createListingPageStyles["add-image-placeholder"]} border-1px-mountain-mist`}
    >
      {imgUrl ? (
        <React.Fragment>
          <CloseButton
            className="border border-2 rounded-circle bg-light"
            onClick={() => onImgDelete(imgUrl)}
            style={{
              position: "absolute",
              right: "0px",
              top: "0px",
              fontSize: "20px",
            }}
          />
          <img
            src={imgUrl}
            alt="Selected preview"
            style={{ objectFit: "contain" }}
          />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <label
            htmlFor={`fileUpload-${numPics || 0}`}
            style={{
              width: "100%",
              height: "100%",
              cursor: "pointer",
              textAlign: "center",
              lineHeight: "256px",
            }}
          >
            +
          </label>
          <input
            type="file"
            id={`fileUpload-${numPics || 0}`}
            accept="image/*"
            value=""
            onChange={onImgUpload}
            disabled={uploading}
            style={{
              display: "none",
            }}
          ></input>
        </React.Fragment>
      )}
    </div>
  );
};
