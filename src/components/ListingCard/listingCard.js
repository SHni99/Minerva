import React, { Component } from 'react';
import listingCardStyles from "./listingCard.module.css";

class ListingCard extends Component {
    render() { 
        return (
            <div className={`${listingCardStyles["listing"]} border-1px-mountain-mist`}>
                <div 
                className={listingCardStyles["avatar"]} 
                style={{
                    backgroundImage: (this.props.avatarImage || "url(/images/img_avatarmaster.png)")
                }}
                ></div>

                <div className={listingCardStyles["details"]}>
                    <p className={`${listingCardStyles["title"]} nunito-semi-bold-black-24px`}>
                        {this.props.title || "Listing Title"}
                    </p>
                    <p className={`${listingCardStyles["description"]} text-smregular`}>
                        {this.props.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                    </p>
                </div>
            </div>
        );
    }
}
 
export default ListingCard;