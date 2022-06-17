import React from "react";
import Badge from "react-bootstrap/Badge";

const FieldTag = ({ category, value, maxWidth }) => {
  // Colors to set the relevant field badges to
  // Modify if necessary
  const fieldColors = {
    qualifications: "success",
    timing: "warning",
    commitment: "info",
    subject: "primary",
    others: "secondary",
  };

  return (
    <Badge
      pill
      bg={fieldColors[category]}
      text={category === "warning" ? "dark" : ""}
      className="m-1"
      style={{ maxWidth, overflowWrap: "break-word", whiteSpace: "normal" }}
    >
      {value}
    </Badge>
  );
};

export default FieldTag;
