import React, { Component } from 'react';
import FooterBar from 'components/FooterBar/footerBar';
import NavBar from 'components/NavBar/navBar';
import createListingPageStyles from "./createListingPage.module.css";

class CreateListingPage extends Component {
    render() { 
        return (
            <div>
                <NavBar />
                <CreateListingBody />
                <FooterBar />
            </div>
        );
    }
}

export default CreateListingPage;

function CreateListingBody(props) {
    return (
        <div className={createListingPageStyles["body"]}>

            <input className={`\
            ${createListingPageStyles["input-composition-master"]} \
            ${createListingPageStyles["border-1px-gray700--101828"]}`} 
            placeholder="Listing Title"/>

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
                    placeholder="Describe your listing in one sentence!" />
                </div>

                <div className={createListingPageStyles["selection-fields"]}>
                    <SelectionField />
                    <SelectionField />
                    <SelectionField />
                    <div className={`${createListingPageStyles["plus-circle"]} border-1px-mountain-mist`}>+</div>
                </div>

            </div>

            <div className={createListingPageStyles["submit-button"]}>
                <div className={createListingPageStyles["text-2"]}>Let's Go!</div>
            </div>
        </div>
    );
}

function SelectionField(props) {
    return (
        <div className={createListingPageStyles["selection-field-1"]}>
            
            <select 
            className={createListingPageStyles["selection-dropdown-box-master"]}>
                <option disabled selected hidden>Requirement</option>
            </select>

            <div className={`\
            ${createListingPageStyles["selection-input-box-master"]} \
            ${createListingPageStyles["border-1px-gray500---98a2b3"]}`}>
                <input className={createListingPageStyles["input-text-4"]} placeholder="Tell us more..."/>
            </div>
        </div>
    );
}

function ListingImage(props) {
    return (
        <div className={`${createListingPageStyles["add-image-placeholder"]} border-1px-mountain-mist`}>
           +
        </div>
    );
}