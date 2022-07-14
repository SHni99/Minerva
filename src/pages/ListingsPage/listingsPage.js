import React, { useState, useEffect, useContext, useRef } from "react";
import AuthContext from "util/AuthContext";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import ListingCard from "components/ListingCard/listingCard";
import { supabaseClient as supabase } from "config/supabase-client";
import { CloseButton } from "react-bootstrap";
import { debounce } from "lodash";
import FieldTag from "components/FieldTag/fieldTag";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import ListingModal from "components/ListingModal/listingModal";
import listingsPageStyles from "./listingsPage.module.css";

const ListingsPage = () => {
  const { authData } = useContext(AuthContext);
  const { blocked: blockedArray } = authData;
  const unusedModalState = {
    show: false,
    username: "",
    avatarUrl: "",
    image_urls: [],
    fields: [],
    creator_id: "",
  };
  const [modalState, setModalState] = useState(unusedModalState);

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ListingModal
        data={modalState}
        onHide={() => setModalState(unusedModalState)}
      />
      <ListingPageBody
        setModalState={setModalState}
        blockedArray={blockedArray}
      />
      <FooterBar />
    </div>
  );
};

export default ListingsPage;

const ListingPageBody = ({ setModalState, blockedArray }) => {
  // Stores the text of the tutor/tutee toggle
  // Loads previously saved tutor/tutee, if applicable
  const [tutorTutee, setTutorTutee] = useState(
    localStorage.getItem("lookingFor") || "tutor"
  );
  // Stores the text entered into the search bar
  const [query, setQuery] = useState("");

  const searchHandler = () => {
    setQuery(document.getElementById("search-input").value);
  };

  return (
    <Container className={`${listingsPageStyles["body"]}`}>
      {/* Header containing "I'm looking for a ..." with the Tutor/Tutee toggle */}
      <Row className={`${listingsPageStyles["filter-tutor-tutee"]}`}>
        <Col>
          <h1 className={`${listingsPageStyles["lookingForText"]}`}>
            I'm looking for a
          </h1>
        </Col>

        <Col>
          <TutorTuteeToggle
            tutorTutee={tutorTutee}
            setTutorTutee={setTutorTutee}
          />
        </Col>
      </Row>

      {/* Search Bar + Search Button */}
      <div className={listingsPageStyles["search-bar"]}>
        <div className={`${listingsPageStyles["search-box"]}`}>
          <input
            className={listingsPageStyles["input-text-1"]}
            id="search-input"
          />
          <CloseButton
            onClick={() => {
              setQuery("");
              document.getElementById("search-input").value = "";
            }}
          />
        </div>

        <div
          className={listingsPageStyles["button-master-1"]}
          onClick={searchHandler}
        >
          <div className={`${listingsPageStyles["text-1"]}`}>Search</div>
        </div>
      </div>

      {/* Legend for the listing field badge colors */}
      <div
        className="pt-5 pb-2 px-sm-2 d-flex flex-row justify-center"
        style={{ fontFamily: "Nunito" }}
      >
        <h5 className="text-center">
          Tags: <span></span>
          <FieldTag category="subject" value="Subject" />
          <FieldTag category="qualifications" value="Qualifications" />
          <FieldTag category="timing" value="Preferred Times" />
          <FieldTag category="commitment" value="Commitment Period" />
          <FieldTag category="others" value="Others" />
        </h5>
      </div>
      {/* Listings */}
      <Listings
        tutorTutee={tutorTutee}
        query={query}
        setModalState={setModalState}
        blockedArray={blockedArray}
      />
    </Container>
  );
};

const TutorTuteeToggle = ({ tutorTutee, setTutorTutee }) => {
  // Caches tutor/tutee state 500ms after last change
  const updateLookingFor = (newState) => {
    localStorage.setItem("lookingFor", newState);
  };
  const debouncedUpdate = useRef(
    debounce(updateLookingFor, 500, { leading: false, trailing: true })
  ).current;

  const handleClick = () => {
    const newState = tutorTutee === "tutor" ? "tutee" : "tutor";
    setTutorTutee(newState);
    debouncedUpdate(newState);
  };

  return (
    <div
      className={listingsPageStyles["tutor-tutee-toggle"]}
      onClick={handleClick}
      data-testid="tutorTuteeToggle"
    >
      <div className={`${listingsPageStyles["text"]}`}>{tutorTutee}</div>
    </div>
  );
};

const Listings = ({ tutorTutee, query, setModalState, blockedArray }) => {
  const [listingData, setListingData] = useState([]);
  // Set to true when data is being fetched from Supabase
  const [loading, setLoading] = useState(false);

  // Array of objects containing the data of each listing

  const filterListing = ({ level, rates, fields }) =>
    `${level} ${rates} ${Object.keys(fields).reduce(
      (acc, key) => `${acc} ${fields[key].value}`,
      ""
    )}`
      .toLowerCase()
      .includes(query.toLowerCase());

  // Fetch listings from Supabase and display using ListingCards
  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);
        // Fetch data using `get_listings()` RPC call
        let { data: listingDb, error: listingError } = await supabase
          .rpc("get_listings")
          .eq("seeking_for", tutorTutee);
        if (listingError) throw listingError;

        // Filter using the selected criteria
        const newListingData = listingDb.filter(filterListing);
        // listingDb = listingDb.filter(filterListing);

        //if no blocked user, it will return all the listings
        if (blockedArray === null) {
          setListingData(newListingData);
        } else {
          //filter blocked user from the listing data
          const current = newListingData.filter(({ creator_id }) =>
            blockedArray.reduce((cur, next) => cur && creator_id !== next, true)
          );
          setListingData(current);
        }

        setLoading(false);
      } catch (error) {
        alert(error.message);
      }
    };
    getListings();

    // We are disabling the eslint warning regarding useEffect having
    // missing dependencies `listingData` and `setListingData` as
    // including them in the dependency array will cause an infinite loop.
    // (because we are actively mutating `listingData` on each call!)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorTutee, query]);

  // Listen for live changes to listings
  useState(() => {
    const listingSub = supabase
      .from("listings")
      .on("INSERT", async (payload) => {
        try {
          const { data: newListingData, error } = await supabase
            .rpc("get_listings")
            .eq("listing_id", payload.new.listing_id);
          if (error) throw error;

          if (filterListing(newListingData)) {
            setListingData((oldListingData) => [
              ...oldListingData,
              newListingData,
            ]);
          }
        } catch (error) {
          alert(error.message);
        }
      })
      .on("DELETE", (payload) => {
        setListingData((oldListingData) =>
          oldListingData.filter(
            (data) => data.listing_id !== payload.old.listing_id
          )
        );
      })
      .subscribe();

    return () => supabase.removeSubscription(listingSub);
  }, []);

  return (
    <div className={listingsPageStyles["listings"]}>
      {loading ? (
        <Spinner animation="border" role="status" aria-label="Loading" />
      ) : listingData.length === 0 ? (
        <h1>Nothing here!</h1>
      ) : (
        <React.Fragment>
          {listingData.map(
            ({
              avatar_url,
              username,
              level,
              rates,
              fields,
              image_urls,
              listing_id,
              creator_id,
              avg_rating,
            }) => {
              return (
                <ListingCard
                  avatarUrl={
                    avatar_url &&
                    supabase.storage.from("avatars").getPublicUrl(avatar_url)
                      .publicURL
                  }
                  username={username}
                  key={listing_id}
                  listing_id={listing_id}
                  level={level}
                  rates={rates}
                  image_urls={image_urls}
                  fields={fields}
                  setModalState={setModalState}
                  creator_id={creator_id}
                  avg_rating={avg_rating}
                />
              );
            }
          )}
        </React.Fragment>
      )}
    </div>
  );
};
