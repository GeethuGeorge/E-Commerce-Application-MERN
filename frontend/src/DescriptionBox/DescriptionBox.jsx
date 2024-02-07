import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
    return (
        <div className="descriptionbox">
            <div className="discriptionbox-navigator">
                <div className="descriptionbox-nav-box">Description</div>
                <div className="descriptionbox-nav-box fade">Reviews(122)</div>
            </div>

            <div className="discriptionbox-discription">
                <p>
                Stay warm and stylish with our Cozy Knit Pullover Sweater, the perfect addition to your winter wardrobe. Crafted from a soft and breathable knit fabric, this pullover provides ultimate comfort while keeping you on-trend.
                </p>
                <p>
                Made from a blend of high-quality materials, our pullover feels incredibly soft against the skin
                </p>
            </div>
        </div>
    );
};

export default DescriptionBox;
