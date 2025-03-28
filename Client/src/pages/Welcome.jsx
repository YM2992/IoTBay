import React from "react";

// After login redirect to welcome page and redirect to main again?

function Welcome() {
  const token = localStorage.getItem("jwt");

  
  return (
    <>
      <div>Welcome</div>
    </>
  );
}

export default Welcome;
