import { useState, useRef, useEffect } from "react";

import "./FadeIn.css";

function FadeIn(props) {
  const [isVisible, setVisible] = useState(true);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => setVisible(entry.isIntersecting));
    });
    const currentRef = domRef.current;
    
    observer.observe(currentRef);

    return () => observer.unobserve(currentRef);
  }, []);

  return (
    <div
      className={`fade-in-section ${isVisible ? "is-visible" : ""}`}
      ref={domRef}
    >
      {props.children}
    </div>
  );
}

export default FadeIn;
