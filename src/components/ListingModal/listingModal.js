import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import listingModalStyles from "./listingModal.module.css";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FieldTag from "components/FieldTag/fieldTag";
import { supabaseClient as supabase } from "config/supabase-client";
import { useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";

const ListingModal = (props) => {
  const [deleteState, setDeleteState] = useState(0);
  const navigate = useNavigate();
  const { onHide, data } = props;
  const {
    show,
    username,
    avatarUrl,
    image_urls,
    fields,
    creator_id,
    listing_id,
  } = data;
  const isOwnListing = creator_id === supabase.auth.user().id;
  const tagNames = {
    subject: "Subjects",
    commitment: "Commitment Period",
    qualifications: "Qualifications",
    timing: "Preferred Timings",
    others: "Others",
  };

  const tags = fields.reduce((acc, obj) => {
    const key = obj.category;
    acc[key] = [...(acc[key] || []), obj.value];
    return acc;
  }, {});

  const deleteListing = async () => {
    try {
      setDeleteState(2);
      const { error } = await supabase
        .from("listings")
        .delete()
        .match({ listing_id });

      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setDeleteState(0);
      onHide();
    }
  };

  const generateDeleteFooter = () => {
    switch (deleteState) {
      case 1:
        return (
          <>
            <p className="text-lg text-center">
              Are you sure? <br />
              <Button
                variant="danger"
                className="px-3 mx-2"
                onClick={deleteListing}
              >
                Yes
              </Button>
              <Button
                variant="primary"
                className="px-5 mx-2"
                onClick={() => setDeleteState(0)}
              >
                No
              </Button>
            </p>
          </>
        );
      case 2:
        return <Spinner animation="border" />;
      default:
        return (
          <>
            {/* Edit button hidden due to incomplete development */}
            {/* <Button variant="primary" className="px-5">
              Edit
            </Button> */}
            <Button
              variant="danger"
              className="px-5"
              onClick={() => setDeleteState(1)}
            >
              Delete
            </Button>
          </>
        );
    }
  };

  const generateModalFooter = () => {
    return (
      <Modal.Footer className="px-4 d-flex justify-content-evenly">
        {isOwnListing ? (
          generateDeleteFooter()
        ) : (
          <>
            <Button
              variant="outline-secondary"
              onClick={(e) => {
                e.preventDefault();
                navigate("/profile", { state: { creator_id } });
              }}
            >
              View Profile
            </Button>
            <Button
              className="px-5"
              onClick={() =>
                navigate("/chats", {
                  state: {
                    startChatData: {
                      user_id: creator_id,
                      name: username,
                      src: avatarUrl,
                    },
                  },
                })
              }
            >
              Chat
            </Button>
          </>
        )}
      </Modal.Footer>
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <img
          src={avatarUrl || "/images/img_avatarDefault.jpg"}
          alt="Avatar"
          className={listingModalStyles.avatar}
        />
        <Link to="/profile" state={{ creator_id }} className="nunito-sans">
          {username}
        </Link>
        {/* Add rating here! (stars) */}
      </Modal.Header>
      <Modal.Body>
        <Row className={`${listingModalStyles["image-section"]} pb-4`}>
          {!image_urls || image_urls.length < 1 ? (
            <h1 className="text-center ">No listing images!</h1>
          ) : (
            <Carousel
              variant="dark"
              indicators={false}
              controls={image_urls.length > 1}
              interval={null}
            >
              {image_urls.map((imgUrl) => (
                <Carousel.Item
                  className={listingModalStyles["carousel-item"]}
                  key={imgUrl}
                >
                  <img src={imgUrl} alt="Listing Details" />
                </Carousel.Item>
              ))}
            </Carousel>
          )}
        </Row>
        {Object.keys(tags).map((tag) => (
          <Row className={listingModalStyles["tag-row"]} key={tag}>
            <Col
              className={listingModalStyles["tag-header"]}
              xs={5}
            >{`${tagNames[tag]}: `}</Col>
            <Col xs={7}>
              {tags[tag].map((tagValue) => (
                <FieldTag
                  category={tag}
                  value={tagValue}
                  key={`${tag} ${tagValue}`}
                />
              ))}
            </Col>
          </Row>
        ))}
      </Modal.Body>
      {generateModalFooter()}
    </Modal>
  );
};

export default ListingModal;
