import React, { useState, useEffect } from "react";
import ListingCard from "components/ListingCard/listingCard";
import { supabaseClient as supabase } from "config/supabase-client";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import ListingModal from "components/ListingModal/listingModal";
import userListingsStyles from "./userlistings.module.css";

const UserListingsPage = (props) => {
  const { checkId } = props;

  const [listingData, setListingData] = useState([]);
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
      <ListingModal
        data={modalState}
        onHide={() => setModalState(unusedModalState)}
      />
      <UserListingBody
        checkId={checkId}
        listingDataState={[listingData, setListingData]}
        setModalState={setModalState}
      />
    </div>
  );
};

export default UserListingsPage;

const UserListingBody = ({ checkId, listingDataState, setModalState }) => {
  return (
    <Container className={`${userListingsStyles["body"]}`}>
      <Listings
        checkId={checkId}
        listingDataState={listingDataState}
        setModalState={setModalState}
      />
    </Container>
  );
};

const Listings = ({ checkId, listingDataState, setModalState }) => {
  // Set to true when data is being fetched from Supabase
  const [loading, setLoading] = useState(false);

  // Set to true if there are no results, after filtering using given query
  const [isEmpty, setIsEmpty] = useState(false);

  // Array of objects containing the data of each listing
  const [listingData, setListingData] = listingDataState;

  // Fetch listings from Supabase and display using ListingCards
  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);

        // Fetch data from the 'listings' table
        let {
          data: listingDb,
          listingError,
          listingStatus,
        } = await supabase
          .from("listings")
          .select("creator_id, level, rates, fields, image_urls, listing_id")
          .eq("creator_id", checkId);
        if (listingError && listingStatus !== 406) throw listingError;

        // Indicate no results and useEffect call here, if filtered results array is empty
        if (listingDb.length === 0) {
          setIsEmpty(true);
          return;
        }

        // Results found. Continue with rendering them using ListingCards
        setIsEmpty(false);

        // Map each of the fetched rows into an async call to obtain each listing creators'
        // avatar URL. After all asynchronous calls have been resolved, set the result to
        // the listingData state/hook.
        const newListingData = await Promise.all(
          listingDb.map(
            async ({
              creator_id,
              level,
              rates,
              fields,
              image_urls,
              listing_id,
            }) => {
              let {
                data: { avatar_url: avatarTitle, username },
                error: avatarError,
                status: avatarStatus,
              } = await supabase
                .from("profiles")
                .select("username, avatar_url")
                .eq("id", checkId)
                .single();
              if (avatarError && avatarStatus !== 406) throw avatarError;

              const { publicURL: avatarUrl, error: urlError } =
                avatarTitle === ""
                  ? {}
                  : supabase.storage.from("avatars").getPublicUrl(avatarTitle);
              if (urlError) throw urlError;

              return {
                avatarUrl,
                username,
                level,
                rates,
                fields,
                image_urls,
                listing_id,
                creator_id,
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
  }, [checkId]);

  return (
    <div className={userListingsStyles["listings"]}>
      {isEmpty ? (
        <h1>Nothing here!</h1>
      ) : loading ? (
        <Spinner animation="border" role="status" aria-label="Loading" />
      ) : (
        <React.Fragment>
          {listingData.map(
            ({
              avatarUrl,
              username,
              level,
              rates,
              fields,
              image_urls,
              listing_id,
              creator_id,
            }) => {
              return (
                (
                  <ListingCard
                    avatarUrl={avatarUrl}
                    username={username}
                    key={listing_id}
                    listing_id={listing_id}
                    level={level}
                    rates={rates}
                    image_urls={image_urls}
                    fields={fields}
                    setModalState={setModalState}
                    creator_id={creator_id}
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
