import React from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

// Requires 3 props
//
// showModal: Function that displays a modal by taking
// three parameters -- titleContent, bodyContent and footerContent
//
// hideModal: Function that hides modal when called
//
// target_id: ID of the user who is being reported/blocked

const BlockReportMenu = ({ showModal, hideModal, target_id }) => {
  const modalTitle = ["Report User", "Block User"];
  const modalBody = [
    "Are you sure you want to report this user?",
    "Are you sure you want to block this user?",
  ];
  const cancelButton = (
    <Button variant="outline-secondary" onClick={hideModal} className="mx-2">
      Cancel
    </Button>
  );

  // Reasons for reporting
  const reportReasons = [
    "Suspicious Activity",
    "Offensive Behaviour",
    "False Advertising",
    "Spamming",
    "Inappropriate Content",
  ];

  const blockAction = () => {
    // Implement block functionality here
    console.log(target_id);
    hideModal();
  };

  const reportAction = () => {
    // Implement report functionality here
    showModal(
      "Reason for Reporting",
      <select style={{ borderRadius: "6px" }}>
        {reportReasons.map((reason, i) => (
          <option key={`reportReason-${i}`}>{reason}</option>
        ))}
      </select>,
      <>
        <Button>Submit</Button>
        {cancelButton}
      </>
    );
    // hideModal();
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" text="dark">
        <ThreeDotsVertical size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          eventKey="report"
          onClick={() =>
            showModal(
              modalTitle[0],
              modalBody[0],
              <>
                <Button className="mx-2" onClick={reportAction}>
                  Confirm
                </Button>
                {cancelButton}
              </>
            )
          }
        >
          Report
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          eventKey="block"
          onClick={() =>
            showModal(
              modalTitle[1],
              modalBody[1],
              <>
                <Button variant="danger" className="mx-2" onClick={blockAction}>
                  Confirm
                </Button>
                {cancelButton}
              </>
            )
          }
          className="text-danger"
        >
          Block
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BlockReportMenu;
