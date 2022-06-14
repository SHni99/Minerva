import React, { useState, useEffect } from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
// Feature Switch: Old vs New ListingCard
//import ListingCard from "components/ListingCard/listingCard";
import ListingCard from "components/ListingCard/newListingCard";
import { supabaseClient as supabase } from "config/supabase-client";
import { CloseButton } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

import listingsPageStyles from "./listingsPage.module.css";

const ListingsPage = () => {
  const [tutorTutee, setTutorTutee] = useState("tutor");
  const [listingData, setListingData] = useState([]);
  const [query, setQuery] = useState("");

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
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

const ListingPageBody = ({ tutorTuteeState, listingDataState, queryState }) => {
  const [tutorTutee, setTutorTutee] = tutorTuteeState;
  const [query, setQuery] = queryState;

  const searchHandler = () => {
    setQuery(document.getElementById("search-input").value);
  };

  return (
    <Container className={`${listingsPageStyles["body"]}`}>
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

      <div className={listingsPageStyles["search-bar"]}>
        <div className={`${listingsPageStyles["search-box"]}`}>
          <input
            className={listingsPageStyles["input-text-1"]}
            id="search-input"
          />
          <CloseButton
            onClick={() => {
              setQuery(null);
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

      <Listings
        tutorTutee={tutorTutee}
        listingDataState={listingDataState}
        query={query}
      />
    </Container>
  );
};

const TutorTuteeToggle = ({ tutorTutee, setTutorTutee }) => {
  const handleClick = () => {
    setTutorTutee(tutorTutee === "tutor" ? "tutee" : "tutor");
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

const Listings = ({ tutorTutee, listingDataState, query }) => {
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [listingData, setListingData] = listingDataState;

  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);

        let {
          data: listingDb,
          listingError,
          listingStatus,
        } = await supabase
          .from("listings")
          .select(
            "creator_id, title, description, subject, rates, fields, image_urls, listing_id"
          )
          .eq("seeking_for", tutorTutee);
        if (listingError && listingStatus !== 406) throw listingError;

        listingDb = listingDb.filter(
          ({ title, description, subject, rates, fields }) =>
            `${title} ${description} ${subject} ${rates} ${fields}`.includes(
              query
            )
        );
        if (listingDb.length === 0) {
          setIsEmpty(true);
          return;
        }
        setIsEmpty(false);

        const newListingData = await Promise.all(
          listingDb.map(
            async ({
              creator_id,
              title,
              description,
              subject,
              rates,
              fields,
              image_urls,
              listing_id,
            }) => {
              let {
                data: { avatar_url: avatarTitle },
                error: avatarError,
                status: avatarStatus,
              } = await supabase
                .from("profiles")
                .select("avatar_url")
                .eq("id", creator_id)
                .single();
              if (avatarError && avatarStatus !== 406) throw avatarError;

              const { publicURL: avatarUrl, error: urlError } =
                avatarTitle === ""
                  ? {}
                  : supabase.storage.from("avatars").getPublicUrl(avatarTitle);
              if (urlError) throw urlError;

              return {
                avatarUrl,
                title,
                description,
                subject,
                rates,
                fields,
                image_urls,
                listing_id,
              };
            }
          )
        );
        setListingData(newListingData);
      } catch (error) {
        alert(error.error);
      } finally {
        setLoading(false);
      }
    };
    getListings();

    // We are disabling the eslint warning regarding useEffect having
    // missing dependencies `listingData` and `setListingData` as
    // including them in the dependency array will cause an infinite loop.
    // (because we are actively mutating `listingData` on each call!)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tutorTutee, query]);

  return (
    <div className={listingsPageStyles["listings"]}>
      {isEmpty ? (
        <h1>Nothing here!</h1>
      ) : loading ? (
        <Spinner animation="border" role="status" aria-label="Loading" />
      ) : (
        <React.Fragment>
          {listingData
            .filter(
              (listing) =>
                listing.title.indexOf(query || "") > -1 ||
                listing.description.indexOf(query || "") > -1
            )
            .map(
              ({
                avatarUrl,
                title,
                description,
                subject,
                rates,
                fields,
                image_urls,
                listing_id,
              }) => {
                return (
                  (
                    <ListingCard
                      avatarUrl={avatarUrl}
                      title={title}
                      description={description}
                      key={listing_id}
                      subject={subject}
                      rates={rates}
                      image_urls={image_urls}
                      fields={fields}
                    />
                  ) || <h1>Nothing here!</h1>
                );
              }
            )}
        </React.Fragment>
      )}
    </div>
  );
};
