import React, { Component } from 'react';
import NavBar2 from "components/LoggedInNavBar/navBar2";
import FooterBar from "components/FooterBar/footerBar";
import listingsPageStyles from "./loggedListingsPage.module.css";

const LoggedListingsPage = () => {
  return (
    <div>
      <NavBar2 />
      <ListingPageBody />
      <FooterBar />
    </div>
  );
};

export default LoggedListingsPage;

function ListingPageBody(props) {
  return (
    <div className={listingsPageStyles["body"]}>

      <div className={listingsPageStyles["filter-tutor-tutee"]}>
        <h1 className={`${listingsPageStyles["lookingForText"]} nunito-medium-black-48px`}>
          I'm looking for a
        </h1>
        <TutorTuteeToggle />
      </div>

      <div className={listingsPageStyles["search-bar"]}>
        <div className={`${listingsPageStyles["input-text"]} ${listingsPageStyles["input-composition-master"]} ${listingsPageStyles["input-box-set-master"]} ${listingsPageStyles["border-1px-gray500---98a2b3"]}`}>
          <input className={listingsPageStyles["input-text-1"]} />
        </div>

        <div className={listingsPageStyles["button-master-1"]}>
          <div className={`${listingsPageStyles["text-1"]} text-mdmedium`}>
            Search
          </div>
        </div>
      </div>

      <Listings />
    </div>
  );
}

class TutorTuteeToggle extends Component {
  state = { text: "tutor" } 

  handleClick = () => {
    this.setState({ text: (this.state.text === "tutor" ? "tutee" : "tutor")})
  }

  render() { 
    return (
      <div className={listingsPageStyles["tutor-tutee-toggle"]} onClick={this.handleClick}>
        <div className={`${listingsPageStyles["text"]} inter-medium-sapphire-48px`}>
          {this.state.text}
        </div>
      </div>
    );
  };
}
 
class Listings extends Component {
  // TBC (Backend Integration)
  render() { 
    return (
      <div className={listingsPageStyles["listings"]}>
      </div>
    );
  }
}