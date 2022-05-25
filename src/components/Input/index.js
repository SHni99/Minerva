import React from "react";

export const Input = React.forwardRef(
  (
    { className, style, name, placeholder, type = "text", children, ...restProps },
    ref
  ) => {
    return (
      <>
        <input
          ref={ref}
          style={{width: "1000px" }}
          className={className}
          type={type}
          name={name}
          placeholder={placeholder}
          {...restProps}
        />
        {children}
      </>
    );
  }
);
