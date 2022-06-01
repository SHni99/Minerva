import React, { useState, useEffect } from 'react';
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import ListingCard from 'components/ListingCard/listingCard';
import { supabaseClient as supabase } from 'config/supabase-client';
import { Spinner } from 'react-bootstrap';
import { CloseButton } from 'react-bootstrap';

import listingsPageStyles from "./listingsPage.module.css";

const ListingsPage = () => {
  const [tutorTutee, setTutorTutee] = useState("tutor");
  const [listingData, setListingData] = useState([]);
  const [query, setQuery] = useState(null);

  return (
    <div>
      <NavBar />
      <ListingPageBody 
      tutorTuteeState={[tutorTutee, setTutorTutee]}
      listingDataState={[listingData, setListingData]}
      queryState={[query, setQuery]}
      />
      <FooterBar />
    </div>
  );
};

export default ListingsPage;

function ListingPageBody({ tutorTuteeState, listingDataState, queryState }) {
  const [ tutorTutee, setTutorTutee ] = tutorTuteeState;
  const [ query, setQuery ] = queryState;

  const searchHandler = () => {
      setQuery(document.getElementById("search-input").value);
  }

  return (
    <div className={listingsPageStyles["body"]}>

      <div className={listingsPageStyles["filter-tutor-tutee"]}>
        <h1 className={`${listingsPageStyles["lookingForText"]} nunito-medium-black-48px`}>
          I'm looking for a
        </h1>
        <TutorTuteeToggle 
        tutorTutee={tutorTutee}
        setTutorTutee={setTutorTutee}
        />
      </div>

      <div className={listingsPageStyles["search-bar"]} >
        <div className={`
        ${listingsPageStyles["input-text"]} 
        ${listingsPageStyles["input-composition-master"]} 
        ${listingsPageStyles["input-box-set-master"]} 
        ${listingsPageStyles["border-1px-gray500---98a2b3"]}`}>
          <input className={listingsPageStyles["input-text-1"]} id="search-input" />
          <CloseButton onClick={() => { 
            setQuery(null); 
            document.getElementById("search-input").value = "";
          }}/>
        </div>

        <div className={listingsPageStyles["button-master-1"]} onClick={searchHandler}>
          <div className={`${listingsPageStyles["text-1"]} text-mdmedium`}>
            Search
          </div>
        </div>
      </div>

      <Listings 
      tutorTutee={tutorTutee}
      listingDataState={listingDataState}
      query={query}
      />
    </div>
  );
}

const TutorTuteeToggle = ({ tutorTutee, setTutorTutee }) => {

  const handleClick = () => {
    setTutorTutee(tutorTutee === "tutor" ? "tutee" : "tutor")
  }

  return (
    <div className={listingsPageStyles["tutor-tutee-toggle"]} onClick={handleClick}>
      <div className={`${listingsPageStyles["text"]} inter-medium-sapphire-48px`}>
        {tutorTutee}
      </div>
    </div>
  );
}
 
const Listings = ({ tutorTutee, listingDataState, query }) => {
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = listingDataState;

  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);

        let { data, error, status } = await supabase
          .from("listings")
          .select("creator_id, title, description, listing_id")
          .eq("seeking_for", tutorTutee);

        if (error && status !== 406) throw error;
        if (data) {
          const newListingData = [];
          for (let listing of data) {
            const { creator_id, title, description, listing_id } = listing;
            let { avatarLink, error, status } = await supabase
              .from("profiles")
              .select("avatar_url")
              .eq("id", creator_id)
              .single();

            if (error && status !== 406) throw error;

            newListingData.push({avatarLink, title, description, listingId: listing_id})
          }
          setListingData(newListingData);
        }

      } catch (error) {
        alert(error.error);
      } finally {
        setLoading(false);
      }
    }
    getListings();

    // We are disabling the eslint warning regarding useEffect having
    // missing dependencies `listingData` and `setListingData` as 
    // including them in the dependency array will cause an infinite loop.
    // (because we are actively mutating `listingData` on each call!)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorTutee, query])


  return (
    <div className={listingsPageStyles["listings"]} >
      {loading ? 
      <Spinner animation="border" role="status"/> 
      :
      <React.Fragment>
        {listingData
        .filter(listing => listing.title.indexOf(query || "") > -1 || listing.description.indexOf(query || "") > -1)
        .map(listing => {
          return (
          <ListingCard
          avatarLink={listing.avatarLink}
          title={listing.title}
          description={listing.description}
          key={listing.listingId}
          />
          ||
          <h1>Nothing here!</h1>);
        })}
      </React.Fragment>
      }
    </div>
  );
}
