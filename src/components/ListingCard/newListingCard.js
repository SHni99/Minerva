import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import newListingCardStyles from "./newListingCard.module.css";

const ListingCard = ({
  avatarUrl,
  title,
  description,
  image_urls,
  subject,
  rates,
  fields,
}) => {
  const hasMultiImage = image_urls.length > 0;
  return (
    <Card
      className={newListingCardStyles.card + " mx-sm-3 my-3 py-4 rounded-5"}
    >
      <Card.Body className="d-flex justify-center">
        <Carousel
          variant="dark"
          controls={hasMultiImage}
          indicators={false}
          interval={null}
          style={{
            paddingLeft: "36px",
            paddingRight: "36px",
          }}
        >
          <Carousel.Item>
            <img
              src={avatarUrl || "/images/img_avatarDefault.jpg"}
              alt="Avatar"
              className={newListingCardStyles.avatar}
            />
          </Carousel.Item>
          {image_urls.map((imgUrl) => (
            <Carousel.Item key={imgUrl}>
              <img
                src={imgUrl}
                alt="Listing Details"
                className={newListingCardStyles.listingImg}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Card.Body>
      <Card.Body className="d-flex justify-center">
        <div
          className="d-flex align-items-end"
          style={{ fontFamily: "Nunito" }}
        >
          <h1 className="m-0">{"$" + rates}</h1>
          <p className="m-0">/hr</p>
        </div>
      </Card.Body>
      <Card.Subtitle
        as="h5"
        className="d-flex justify-center px-4 text-center"
        style={{ fontFamily: "Nunito" }}
      >
        {subject}
      </Card.Subtitle>
    </Card>
  );
};

export default ListingCard;
