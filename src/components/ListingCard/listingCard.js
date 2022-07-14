import React from "react";
import FieldTag from "components/FieldTag/fieldTag";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import listingCardStyles from "./listingCard.module.css";

const ListingCard = ({
  avatarUrl,
  username,
  image_urls,
  level,
  rates,
  fields,
  setModalState,
  creator_id,
  listing_id,
  avg_rating,
}) => {
  const levelParams = {
    primary: "Primary",
    secondary: "Secondary",
    tertiary: "Tertiary",
    undergrad: "Undergraduate",
    grad: "Graduate",
    others: "Others",
  };

  const showModal = (e) => {
    if (e.target.className.includes("carousel-control")) return;
    setModalState({
      show: true,
      username,
      avatarUrl,
      image_urls,
      fields,
      creator_id,
      listing_id,
      avg_rating,
    });
  };
  return (
    <Card
      className={listingCardStyles.card + " mx-sm-3 my-3 py-4 rounded-5"}
      onClick={showModal}
    >
      {/* Carousel to display avatar image + listing images */}
      {/* Note: Consider adding a modal image on click to show full image */}
      <Card.Body className="d-flex justify-center avatar-section">
        <Carousel
          variant="dark"
          indicators={false}
          interval={null}
          wrap={false}
          style={{
            paddingLeft: "36px",
            paddingRight: "36px",
          }}
        >
          {/* Avatar: Compulsory for every card */}
          <Carousel.Item>
            <img
              src={avatarUrl || "/images/img_avatarDefault.jpg"}
              alt="Avatar"
              className={listingCardStyles.avatar}
            />
          </Carousel.Item>

          {/* Add the remaining listing images */}
          {image_urls.map((imgUrl) => (
            <Carousel.Item key={imgUrl}>
              <img
                src={imgUrl}
                alt="Listing Details"
                className={listingCardStyles.listingImg}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Card.Body>

      {/* Given rates, per hour */}
      {/* Note: consider changing $0/hr to Free or something similar */}
      <Card.Body className="d-flex justify-center">
        <div
          className="d-flex align-items-end"
          style={{ fontFamily: "Nunito" }}
        >
          <h1 className="m-0">{"$" + rates}</h1>
          <p className="m-0">/hr</p>
        </div>
      </Card.Body>

      {/* Tutoring Level */}
      <Card.Subtitle
        as="h5"
        className={`${listingCardStyles.level} d-flex justify-center px-4 text-center`}
      >
        {levelParams[level]}
      </Card.Subtitle>

      {/* Optional fields. Decorated with Bootstrap Badges */}
      <Card.Body>
        {fields.map((field) => (
          <FieldTag
            category={field.category}
            value={field.value}
            key={field.category + field.value}
          />
        ))}
      </Card.Body>
    </Card>
  );
};

export default ListingCard;
