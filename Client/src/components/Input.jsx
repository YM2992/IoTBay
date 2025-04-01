import PropTypes from "prop-types"; // Import PropTypes

function Input({ type, field, func }) {
  return (
    <input
      type={type}
      placeholder={field}
      className="input-field"
      onChange={(e) => func(e.target.value)}
      required
    />
  );
}
Input.propTypes = {
  type: PropTypes.string.isRequired,
  field: PropTypes.string.isRequired,
  func: PropTypes.func.isRequired,
};

export default Input;
