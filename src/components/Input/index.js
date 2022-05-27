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
          style={{width: "90%", padding: "10px 10px 20px 20px"}}
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
