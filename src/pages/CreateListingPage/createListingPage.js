import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from "react-bootstrap/CloseButton";
import FooterBar from 'components/FooterBar/footerBar';
import NavBar from 'components/NavBar/navBar';
import createListingPageStyles from "./createListingPage.module.css";
import { supabaseClient as supabase } from 'config/supabase-client';

const CreateListingPage = () => {
    const [submitting, setSubmitting] = useState(false);
    const [tutorTutee, setTutorTutee] = useState("tutor");
    const [sFields, setSFields] = useState( [0, 1, 2].map(id => { return { id } }) );
    const [sFieldInputs, setSFieldInputs] = useState([]);
    const navigate = useNavigate();


    const onSFieldAdd = () => {
        const newSFields = [ ...sFields, { id: sFields.length }];
        setSFields(newSFields);
    }

    const onSFieldDelete = (id) => {
        const newSFields = sFields.filter(sField => sField.id !== id);
        setSFields(newSFields);
    }

    const handleSubmit = async () => {
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const fields = sFieldInputs.map(
            sFieldInput => {
                return {
                    category: sFieldInput.requirement ,
                    value: sFieldInput.getInput()
                };
            }
        );
        
        try {
            setSubmitting(true);

            const data = {
                creator_id: supabase.auth.user().id,
                title,
                description,
                fields,
                seeking_for: tutorTutee
            };

            let { error } = await supabase
                .from("listings")
                .insert(data, { returning: "minimal" });

            if (error) throw error;

        } catch (error) {
            alert(error.message);
        } finally {
            navigate("/listingspage");
        }

    }

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
            />
            <FooterBar />
        </div>
    );
}

export default CreateListingPage;

const CreateListingBody = props => {
    const { 
        selectionFields, 
        sFieldInputStates, 
        onSFieldAdd, 
        onSFieldDelete,
        tutorTutee,
        setTutorTutee,
        handleSubmit
    } = props;

    return (
        <div className={createListingPageStyles["body"]}>

            <input className={`\
            ${createListingPageStyles["input-composition-master"]} \
            ${createListingPageStyles["border-1px-gray700--101828"]}`} 
            placeholder="Listing Title"
            id="title" />

            <div className={createListingPageStyles["choose-tutor-tutee"]}>
                <h1 className={`${createListingPageStyles["findMeText"]} nunito-medium-black-24px`}>
                    Find me a 
                </h1>
                <TutorTuteeToggle
                tutorTutee={tutorTutee}
                setTutorTutee={setTutorTutee}
                />
            </div>

            <div className={`\
            ${createListingPageStyles["listing-images"]} \
            ${createListingPageStyles["border-1px-gray700---101828"]}`}>
                <ListingImage />
            </div>

            <div className={createListingPageStyles["listing-fields"]}>

                <div className={`\
                ${createListingPageStyles["describe-listing-input"]} \
                ${createListingPageStyles["border-1px-gray700-101828"]}`}>
                    <input 
                    className={createListingPageStyles["describe-listing-text"]}
                    placeholder="Describe your listing in one sentence!" 
                    id="description" />
                </div>

                <div className={createListingPageStyles["selection-fields"]}>
                    {
                    selectionFields.map(sField => (
                        <SelectionField 
                        key={sField.id} 
                        id={sField.id} 
                        onSFieldDelete={onSFieldDelete} 
                        sFieldInputStates={sFieldInputStates}
                    />)) 
                    }
                    <div 
                    className={`${createListingPageStyles["plus-circle"]} border-1px-mountain-mist`}
                    onClick={onSFieldAdd}
                    >+</div>
                </div>

            </div>

            <div className={createListingPageStyles["submit-button"]} onClick={handleSubmit}>
                <div className={createListingPageStyles["text-2"]}>Let's Go!</div>
            </div>
        </div>
    );
}

const TutorTuteeToggle = ({ tutorTutee, setTutorTutee }) => {
  return (
    <div className={createListingPageStyles["tutor-tutee-toggle"]} 
    onClick={() => setTutorTutee( tutorTutee === "tutor" ? "tutee" : "tutor")}>
      <div className={`inter-medium-sapphire-24px`}>
        {tutorTutee}
      </div>
    </div>
  );
}

const SelectionField = props => {
    const { id, onSFieldDelete, sFieldInputStates } = props;
    const [ sFieldInputs, setSFieldInputs ] = sFieldInputStates;

    const fieldParams = {
        qualifications: "Qualifications",
        timing: "Preferred Times",
        commitment: "Commitment Period",
        others: "Others"
    };

    const handleDropdownChange = e => {
        const fieldDropdown = e.target;
        const fieldInput = e.target.parentElement.children[1].firstChild;
        setSFieldInputs([
            ...(sFieldInputs.filter(sField => sField.id !== id)),
            {
                id,
                requirement: fieldDropdown.value,
                getInput: () => fieldInput.value
            }
        ]);
    }

    return (
        <div className={createListingPageStyles["selection-field-1"]}>
            
            <select 
            className={createListingPageStyles["selection-dropdown-box-master"]}
            defaultValue="DEFAULT"
            onChange={handleDropdownChange}>
                <option disabled value="DEFAULT" hidden>Requirement</option>
                {
                    (() => { 
                        const fields = [];

                        for (let field in fieldParams) {
                            fields.push(
                                <option key={field} value={field}> {fieldParams[field]} </option>
                            );
                        }

                        return fields;
                    })()
                }
            </select>

            <div className={`\
            ${createListingPageStyles["selection-input-box-master"]} \
            ${createListingPageStyles["border-1px-gray500---98a2b3"]}`}>
                <input className={createListingPageStyles["input-text-4"]} placeholder="Tell us more..."/>
            </div>

            <CloseButton className="m-1" onClick={() => onSFieldDelete(id)} />
        </div>
    );
}

const ListingImage = props => {
    return (
        <div className={`${createListingPageStyles["add-image-placeholder"]} border-1px-mountain-mist`}>
           +
        </div>
    );
}