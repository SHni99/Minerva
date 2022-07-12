import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  supabaseClient as supabase,
  supabaseClient,
} from "config/supabase-client";

import Accordion from "react-bootstrap/Accordion";
import CloseButton from "react-bootstrap/CloseButton";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import FieldTag from "components/FieldTag/fieldTag";
import createListingPageStyles from "./createListingPage.module.css";
import Button from "react-bootstrap/Button";
import { PlusCircle } from "react-bootstrap-icons";
import LoadingOverlay from "react-loading-overlay-ts";

const CreateListingPage = ({ isEditing }) => {
  const listingId = useLocation().state?.listingId;
  // Options to be shown under the selection field dropdown box. Edit if required!
  const fieldParams = {
    subject: "Subject",
    qualifications: "Qualifications",
    timing: "Preferred Times",
    commitment: "Commitment Period",
    others: "Others",
  };

  // Options to be shown under the education level dropdown box. Edit if required!
  const levelParams = {
    primary: "Primary",
    secondary: "Secondary",
    tertiary: "Tertiary",
    undergrad: "Undergraduate",
    grad: "Graduate",
    others: "Others",
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <CreateListingBody
        fieldParams={fieldParams}
        levelParams={levelParams}
        isEditing={isEditing}
        listingId={listingId}
      />
      <FooterBar />
    </div>
  );
};

export default CreateListingPage;

const CreateListingBody = ({
  fieldParams,
  levelParams,
  isEditing,
  listingId,
}) => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [level, setLevel] = useState("primary");
  const [sFieldInputs, setSFieldInputs] = useState([]);
  const [rates, setRates] = useState("");
  const [tutorTutee, setTutorTutee] = useState("tutor");
  const [imageURLs, setImageURLs] = useState([]);
  const [sFields, setSFields] = useState([{ id: 0 }]);
  const [invalidRates, setInvalidRates] = useState(null);
  const navigate = useNavigate();

  // Redirect user to login page if not logged in
  useEffect(() => {
    if (!supabaseClient.auth.user()) navigate("/loginpage");
  }, [navigate]);

  // Handles uploading of images to Supabase
  const onImgUpload = async (event) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
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
  const onSFieldAdd = (prevData) =>
    setSFields((old) => [...old, { id: old?.length || 0, ...prevData }]);

  // Handles deletion of selection fields
  const onSFieldDelete = (id) => {
    const newSFields = sFields.filter((sField) => sField.id !== id);
    setSFields(newSFields);
  };

  // Handles submission of entire form to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Get all relevant details from input fields
    const level = document.getElementById("level").value;
    const rates = document.getElementById("rates").value;
    if (!rates) {
      setInvalidRates("This is a required field.");
      document.getElementById("rates").focus();
      return;
    }
    const fields = [
      ...sFieldInputs.map((sFieldInput) => ({
        category: sFieldInput.requirement,
        value: sFieldInput.input().value,
      })),
    ];
    const image_urls = imageURLs.map((img) => img.publicURL);

    // Pack the data to be uploaded to Supabase
    const data = {
      creator_id: supabase.auth.user().id,
      fields,
      rates,
      image_urls,
      seeking_for: tutorTutee === "tutor" ? "tutee" : "tutor",
      level,
    };

    // Update Supabase with input
    try {
      // Causes screen to show "Submitting..."
      setSubmitting(true);

      if (isEditing) {
        // Attempt to update data in Supabase
        let { error } = await supabase
          .from("listings")
          .update(data, { returning: "minimal" })
          .eq("listing_id", listingId);
        if (error) throw error;
      } else {
        // Attempt to upload data to Supabase
        let { error } = await supabase
          .from("listings")
          .insert(data, { returning: "minimal" });
        if (error) throw error;
      }

      // Successful! Return to listings page
      navigate("/listingspage");
    } catch (error) {
      // Displays error message
      alert(error.message);
    }
  };

  // Switch to Edit Listing Mode if isEditing === true
  useEffect(() => {
    if (isEditing) {
      if (!listingId) navigate("/listingspage");
      else {
        (async () => {
          setLoading(true);
          try {
            const { data, error } = await supabaseClient
              .from("listings")
              .select("*")
              .eq("listing_id", listingId)
              .single();
            if (error) throw error;

            const { seeking_for, level, rates, image_urls, fields } = data;
            setTutorTutee(seeking_for === "tutor" ? "tutee" : "tutor");
            setLevel(level);
            setRates(rates);
            setImageURLs(
              image_urls.map((publicURL) => ({
                publicURL,
                filePath: publicURL.split("/").at(-1),
              }))
            );
            setSFields(
              fields.map((field, id) => ({
                id,
                category: field.category,
                value: field.value,
              }))
            );
            setSFieldInputs(
              fields.map((field, id) => ({
                id,
                requirement: field.category,
                input: () =>
                  document.getElementsByClassName(
                    createListingPageStyles["selection-input-box-master"]
                  )[id].firstChild,
              }))
            );

            setLoading(false);
          } catch (error) {
            alert(error.message);
          }
        })();
      }
    }

    // Disabling warnings as we only wish to run this once at the start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if submission is in progress. Show "Submitting..." if required.
  return submitting || loading ? (
    <div className={createListingPageStyles["body"]}>
      <h1 className="nunito-medium-black-48px">
        {submitting
          ? isEditing
            ? "Updating your listing..."
            : "Submitting..."
          : "Loading your previous listing..."}
      </h1>
      <Spinner animation="border" />
    </div>
  ) : (
    // Actual submission form. Shown only if not submitting and user is logged in.
    <form className={createListingPageStyles["body"]} onSubmit={handleSubmit}>
      {isEditing && (
        <>
          <h1 className="text-success mb-0">You are editing a listing</h1>
          <hr
            style={{
              borderTop: "3px solid #bbb",
              width: "100%",
            }}
          />
        </>
      )}
      {/* Fixed field 1: Tutor/Tutee toggle. Defaults to Tutor. */}
      <Row
        className={`${createListingPageStyles["choose-tutor-tutee"]} my-3 mx-4`}
      >
        <Col
          as="h1"
          className={`${createListingPageStyles["big-text"]} m-0 p-0`}
          xs={12}
          sm="auto"
        >
          Find me a
        </Col>
        <Col xs={12} sm="auto">
          <TutorTuteeToggle
            tutorTutee={tutorTutee}
            setTutorTutee={setTutorTutee}
          />
        </Col>
      </Row>

      {/* Fixed field 2: Teaching level. Defaults to Primary. */}
      <Row className="d-flex flex-row my-2 align-items-center justify-center mx-3">
        <Col
          as="h1"
          className={`${createListingPageStyles["big-text"]} p-0 m-0`}
          xs={12}
          sm="auto"
        >
          at the
        </Col>
        <Col
          as="select"
          className={`${createListingPageStyles["level-dropdown"]} py-0 mx-3`}
          id="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          xs={12}
          sm="auto"
        >
          {(() => {
            const fields = [];

            for (let field in levelParams) {
              fields.push(
                <option key={field} value={field}>
                  {levelParams[field]}
                </option>
              );
            }

            return fields;
          })()}
        </Col>
        <Col
          as="h1"
          className={`${createListingPageStyles["big-text"]} p-0 m-0`}
          xs={12}
          sm="auto"
        >
          level
        </Col>
      </Row>

      {/* Fixed field 3: Tutor/Tutee rate. Required field. */}
      <Row className="d-flex flex-row align-items-center my-3 my-sm-4">
        <Col
          as="h1"
          className={`${createListingPageStyles["big-text"]} m-0 p-0`}
          xs={12}
          sm="auto"
        >
          for
        </Col>
        <Col
          className="d-flex flex-row align-items-center justify-center"
          xs={12}
          sm="auto"
        >
          $
          <input
            name="rates"
            id="rates"
            className={`${createListingPageStyles["rates-input"]} rounded-4 mx-1`}
            value={rates}
            placeholder="..."
            onChange={(e) => {
              let newVal = e.target.value;
              // Prevent excessive leading 0s
              if (/^[0][0-9]+/.test(newVal))
                newVal = newVal.substring(1, newVal.length);

              if (/^\d{0,3}$/.test(newVal)) {
                setInvalidRates(null);
                setRates(newVal);
              } else if (/[^0-9]/.test(newVal)) {
                setInvalidRates("Only digits are allowed.");
              } else if (/^\d*/.test(newVal)) {
                setInvalidRates(
                  "Woah there! Try to keep your rates under $1000!"
                );
              }
            }}
          />
        </Col>
        <Col
          as="h1"
          className={`${createListingPageStyles["big-text"]} m-0 p-0`}
          xs={12}
          sm="auto"
        >
          per hour!
        </Col>
      </Row>
      <p className="text-danger mx-4 text-center">{invalidRates}</p>

      {/* Add Images section. Capped at 3. */}
      <Accordion defaultActiveKey="0" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Listing Images (max 3)</Accordion.Header>
          <Accordion.Body className={createListingPageStyles["accordion-item"]}>
            <LoadingOverlay active={uploading} spinner text="Loading...">
              <div
                className={`${createListingPageStyles["listing-images"]} my-4`}
              >
                {/* Map each element in imageURLs into a ListingImage to display the image. */}
                {imageURLs.map((imgObj) => (
                  <ListingImage
                    key={imgObj.publicURL}
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
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Start of dynamic fields/selection fields */}
      <Accordion defaultActiveKey="0" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Tags (Optional)</Accordion.Header>
          <Accordion.Body className={createListingPageStyles["accordion-item"]}>
            <Row
              className={`${createListingPageStyles["selection-fields"]} my-4 p-3`}
            >
              {/* Creates a SelectionField for each object present in the sFields state.
        SelectionField implementation can be found below. */}
              {sFields.map((sField) => (
                <SelectionField
                  key={`sField-${sField.id}`}
                  id={sField.id}
                  onSFieldDelete={onSFieldDelete}
                  sFieldInputStates={[sFieldInputs, setSFieldInputs]}
                  fieldParams={fieldParams}
                  value={sField.value}
                  category={sField.category}
                />
              ))}
              {/* Button to add selection fields. onClick handler can be found above, under CreateListingPage. */}
              <PlusCircle
                size={42}
                className="align-self-center mt-3"
                style={{ color: "gray", cursor: "pointer" }}
                onClick={onSFieldAdd}
              />
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      {/* Submit Button.  */}
      <Button
        type="submit"
        className="rounded-pill p-3 w-50"
        variant={isEditing ? "success" : "primary"}
        style={{
          fontSize: "20px",
          backgroundColor: isEditing ? "" : "var(--primary400---0354a6)",
        }}
      >
        {isEditing ? "Edit Listing" : "Let's Go!"}
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
      className={`${createListingPageStyles["tutor-tutee-toggle"]} px-2 my-0`}
      onClick={() => setTutorTutee(tutorTutee === "tutor" ? "tutee" : "tutor")}
    >
      <div>{tutorTutee}</div>
    </div>
  );
};

// The SelectionField element.
const SelectionField = ({
  id,
  onSFieldDelete,
  sFieldInputStates,
  fieldParams,
  value,
  category,
}) => {
  // Array of objects containing these three details:
  // 1. SelectionField id
  // 2. Value of the selected item in the dropdown box
  // 3. A method to get the value of the corresponding input box
  const [sFieldInputs, setSFieldInputs] = sFieldInputStates;
  const [previewText, setPreviewText] = useState(value || "Preview");
  const [previewCategory, setPreviewCategory] = useState(category || "subject");

  // Called whenever there is a change in the dropdown box selection.
  // Records the changes into the sFieldInputs state.

  const captureSField = (dropdown, input) => {
    setSFieldInputs([
      ...sFieldInputs.filter((sField) => sField.id !== id),
      {
        id,
        requirement: dropdown.value,
        input: () => input,
      },
    ]);
  };

  const handleDropdownChange = (e) => {
    captureSField(e.target, e.target.parentElement.children[1].firstChild);
    setPreviewCategory(e.target.value);
  };

  return (
    <Row className={`${createListingPageStyles["selection-field-1"]} my-2`}>
      {/*
         The dropdown box. 
         Calls handleDropdownChange when changed.
         Displays fixed values which can be changed in the fieldParams const
         declared at the start.
      */}
      <Col
        as="select"
        className={createListingPageStyles["selection-dropdown-box-master"]}
        defaultValue={category || "subject"}
        onChange={handleDropdownChange}
        xs={12}
        sm={6}
        lg={5}
      >
        {(() => {
          const fields = [];

          for (let field in fieldParams) {
            fields.push(
              <option key={field} value={field}>
                {fieldParams[field]}
              </option>
            );
          }

          return fields;
        })()}
      </Col>

      {/* The input box for users to elaborate on their requirements. */}
      <Col
        className={`${createListingPageStyles["selection-input-box-master"]}`}
        xs={12}
        sm={6}
        lg={4}
      >
        <input
          placeholder="Tell us more..."
          defaultValue={value}
          maxLength={30}
          onChange={(e) => setPreviewText(e.target.value || "Preview")}
          onFocus={(e) =>
            captureSField(
              e.target.parentElement.parentElement.firstChild,
              e.target
            )
          }
        />
      </Col>

      <Col
        className="d-flex flex-row align-items-center justify-center justify-content-lg-evenly text-center"
        xs={12}
        lg={3}
      >
        {/* Preview of the tag to be shown on their listing. */}
        <FieldTag
          category={previewCategory}
          value={previewText}
          maxWidth="calc(80% + 0.8vw)"
        />
        {/* Button to delete this SelectionField. */}
        <CloseButton className="m-1" onClick={() => onSFieldDelete(id)} />
      </Col>
    </Row>
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
    <div className={`${createListingPageStyles["add-image-placeholder"]}`}>
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
            value={imgUrl}
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
