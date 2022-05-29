import React from 'react';
import listingCardStyles from "./listingCard.module.css";

const ListingCard = props => {
    const { avatarLink, title, description } = props;

    return (
        <div className={`${listingCardStyles["listing"]} border-1px-mountain-mist`}>
            <div 
            className={listingCardStyles["avatar"]} 
            style={{
                backgroundImage: (avatarLink || "url(/images/img_avatarDefault.jpg)")
            }}
            ></div>

            <div className={listingCardStyles["details"]}>
                <p className={`${listingCardStyles["title"]} nunito-semi-bold-black-24px`}>
                    {title || "Listing Title"}
                </p>
                <p className={`${listingCardStyles["description"]} text-smregular`}>
                    {description || "Listing Description"}
                </p>
            </div>
        </div>
    );
}
 
export default ListingCard;