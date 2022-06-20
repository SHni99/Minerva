import React from "react";
import Modal from "react-bootstrap/Modal";
import listingModalStyles from "./listingModal.module.css";
import Button from "react-bootstrap/Button";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FieldTag from "components/FieldTag/fieldTag";
import { useNavigate } from "react-router-dom";

const ListingModal = (props) => {
  const { onHide, data } = props;
  const { show, username, avatarUrl, image_urls, fields, creator_id } = data;
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
  const navigate = useNavigate();
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <img
          src={avatarUrl || "/images/img_avatarDefault.jpg"}
          alt="Avatar"
          className={listingModalStyles.avatar}
        />
        <a href="/" className="nunito-sans">
          {username}
        </a>
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
      <Modal.Footer className="px-4 d-flex justify-content-evenly">
        <Button
          variant="outline-secondary"
          onClick={(e) => {
            e.preventDefault();
            navigate("/profile", {state: { creator_id }});
          }}
        >
          View Profile
        </Button>
        <Button className="px-5">Chat</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ListingModal;
