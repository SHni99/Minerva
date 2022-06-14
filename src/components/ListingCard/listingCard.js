import React from "react";
import listingCardStyles from "./listingCard.module.css";

const ListingCard = (props) => {
  const { avatarUrl, title, description, subjects, rates, fields } = props;

  return (
    <div
      className={`${listingCardStyles["listing"]} border-1px-mountain-mist`}
      role="figure"
    >
      <div
        className={listingCardStyles["avatar"]}
        style={{
          backgroundImage: `url(${
            avatarUrl || "/images/img_avatarDefault.jpg"
          })`,
        }}
      ></div>

      <div className={listingCardStyles["details"]}>
        <p
          className={`${listingCardStyles["title"]} nunito-semi-bold-black-24px`}
        >
          {title || "Listing Title"}
        </p>
        <p className={`${listingCardStyles["description"]} text-smregular`}>
          {description || "Listing Description"}
        </p>
      </div>
    </div>
  );
};

export default ListingCard;
