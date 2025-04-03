import { Link } from "react-router-dom";
import "./LandingCategory.css";

function LandingCategory({ image, title }) {
  return (
    <Link to="/main" className="category-button">
      <div className="category-container">
        <div className="category-image-container">
            <img className="category-image" src={image} />
        </div>
        <p className="category-title">{title}</p>
      </div>
    </Link>
  );
}

export default LandingCategory;
