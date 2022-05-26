import React, { Component } from 'react';
import "./ListingCard.css";

class ListingCard extends Component {
    render() { 
        return (
            <div className="listing border-1px-mountain-mist">
                <div 
                className="avatar" 
                style={{
                    backgroundImage: (this.props.avatarImage || "url(/images/img_avatarmaster.png)")
                }}
                ></div>

                <div className="details">
                    <p className="title nunito-semi-bold-black-24px">
                        {this.props.title || "Listing Title"}
                    </p>
                    <p className="description text-smregular">
                        {this.props.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                    </p>
                </div>
            </div>
        );
    }
}
 
export default ListingCard;