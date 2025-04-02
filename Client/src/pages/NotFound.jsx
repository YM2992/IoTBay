import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/");
    }, 3000);
  }, []);

  return (
    <div
      style={{
        width: "100%",
        color: "white",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "90vh",
      }}
    >
      <div>
        <h1>The Page is Not Found</h1>
        <p>You will be redirect to main page shortly</p>
      </div>
    </div>
  );
}

export default NotFound;
