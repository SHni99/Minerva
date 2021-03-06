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
import Rating from "components/Rating/Rating";

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
    avg_rating,
  } = data;
  const isOwnListing = supabase.auth.user()
    ? creator_id === supabase.auth.user().id
    : false;
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

  const generateFooter = () => {
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
            <Button
              variant="outline-secondary"
              className="px-5"
              onClick={() =>
                navigate("/edit-listing", {
                  state: { listingId: listing_id },
                })
              }
            >
              Edit
            </Button>
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
          generateFooter()
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
            {supabase.auth.user() && (
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
            )}
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
        <div>
          <Link to="/profile" state={{ creator_id }} className="nunito-sans">
            {username}
          </Link>
          <div className="d-flex flex-row align-items-center">
            <Rating index={avg_rating} size={12} />
            <p className="p-0 m-0 px-1" style={{ fontSize: 10 }}>
              {avg_rating
                ? `${avg_rating?.toFixed(1)} / 5.0`
                : "No ratings yet!"}
            </p>
          </div>
        </div>
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
