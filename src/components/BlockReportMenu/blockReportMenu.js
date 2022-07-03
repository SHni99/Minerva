import React from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";

const BlockReportMenu = (props) => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" text="dark">
        <ThreeDotsVertical size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item eventKey="report">Report</Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item eventKey="block" className="text-danger">
          Block
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BlockReportMenu;
