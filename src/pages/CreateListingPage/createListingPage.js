import React, { Component } from 'react';
import CloseButton from "react-bootstrap/CloseButton";
import FooterBar from 'components/FooterBar/footerBar';
import NavBar from 'components/NavBar/navBar';
import createListingPageStyles from "./createListingPage.module.css";

class CreateListingPage extends Component {
    state = {
        selectionFields: [1,2,3].map(id => { return { id } }),
        nextSFieldId: 4
    }

    onSFieldAdd = () => {
        this.setState({ 
            selectionFields: [ ...this.state.selectionFields, { id: this.state.nextSFieldId }],
            nextSFieldId: this.state.nextSFieldId + 1
         });
    }

    onSFieldDelete = (id) => {
        const newSFields = [ ...this.state.selectionFields ].filter(sField => sField.id !== id);
        this.setState({
            selectionFields: newSFields,
            nextSFieldId: this.state.nextSFieldId
        });
    }

    render() { 
        return (
            <div>
                <NavBar />
                <CreateListingBody 
                selectionFields={this.state.selectionFields}
                onSFieldAdd={this.onSFieldAdd}
                onSFieldDelete={this.onSFieldDelete}
                />
                <FooterBar />
            </div>
        );
    }
}

export default CreateListingPage;

function CreateListingBody(props) {
    const { selectionFields, onSFieldAdd, onSFieldDelete } = props;
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
                    {
                    selectionFields.map(sField => (
                        <SelectionField 
                        key={sField.id} 
                        id={sField.id} 
                        onSFieldDelete={onSFieldDelete} 
                    />)) 
                    }
                    <div 
                    className={`${createListingPageStyles["plus-circle"]} border-1px-mountain-mist`}
                    onClick={onSFieldAdd}
                    >+</div>
                </div>

            </div>

            <div className={createListingPageStyles["submit-button"]}>
                <div className={createListingPageStyles["text-2"]}>Let's Go!</div>
            </div>
        </div>
    );
}

function SelectionField(props) {
    const { id, onSFieldDelete } = props;

    return (
        <div className={createListingPageStyles["selection-field-1"]}>
            
            <select 
            className={createListingPageStyles["selection-dropdown-box-master"]}
            defaultValue="DEFAULT">
                <option disabled value="DEFAULT" hidden>Requirement</option>
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

function ListingImage(props) {
    return (
        <div className={`${createListingPageStyles["add-image-placeholder"]} border-1px-mountain-mist`}>
           +
        </div>
    );
}