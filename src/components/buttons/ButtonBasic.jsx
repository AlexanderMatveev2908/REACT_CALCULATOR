import PropTypes from "prop-types";

const ButtonBasic = ({ styleProp, label, handleClick, ref }) => {
  const handleStyle = () =>
    styleProp === 1
      ? "btn__1"
      : styleProp === 2
      ? "btn__2"
      : styleProp === 3
      ? "btn__3"
      : "";

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={`btn__base ${handleStyle()}`}
    >
      {label}
    </button>
  );
};

ButtonBasic.propTypes = {
  styleProp: PropTypes.oneOf([1, 2, 3]).isRequired,
  label: PropTypes.string.isRequired,
};

export default ButtonBasic;
