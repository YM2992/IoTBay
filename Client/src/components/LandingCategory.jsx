import { Link } from "react-router-dom";
import "./LandingCategory.css";
import FadeIn from "./FadeIn";

function LandingCategory({ link, image, title }) {
  return (
    <Link to={link} className="category-button">
      <FadeIn>
        <div className="category-container">
          <div className="category-image-container">
            <img className="category-image" src={image} />
          </div>
          <p className="category-title">{title}</p>
        </div>
      </FadeIn>
    </Link>
  );
}

export default LandingCategory;
