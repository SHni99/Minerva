import React from "react";

export const Input = React.forwardRef(
  ({ className, style, value, placeholder, children, ...restProps }, ref) => {
    return (
      <>
        <input
          ref={ref}
          style={{
            alignItems: "center",
            backgroundColor: "#E7E4DE",
            borderRadius: "12px",
            display: "flex",
            height: "73px",
            overflow: "hidden",
            position: "relative",
            width: "850px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "#A2A9B3",
          }}
          className={className}
          value={value}
          placeholder={placeholder}
          {...restProps}
        />
        {children}
      </>
    );
  }
);
