import React, { useContext, useState } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { supabaseClient } from "../../config/supabase-client";
import { useEffect } from "react";
import AuthContext from "util/AuthContext";

// Requires 3 props
//
// showModal: Function that displays a modal by taking
// three parameters -- titleContent, bodyContent and footerContent
//
// hideModal: Function that hides modal when called
//
// target_id: ID of the user who is being reported/blocked

const BlockReportMenu = ({ showModal, hideModal, target_id, blockedArray }) => {
  const user = supabaseClient.auth.user();
  const [isReported, setIsReported] = useState(false);
  const { authData } = useContext(AuthContext);
  const getIsBlocked = () => authData.blocked.includes(target_id);
  const modalTitle = ["Report User", "Block User", "Unblock User"];
  const modalBody = [
    "Are you sure you want to report this user?",
    "Are you sure you want to block this user?",
    "Are you sure you want to unblock this user?",
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

  useEffect(() => {
    const checkReportedStatus = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("reports")
          .select("*")
          .eq("reporter_id", user.id)
          .eq("reported_id", target_id);
        if (error) throw error;

        setIsReported(data.length > 0);
      } catch (error) {
        alert(error.message);
      }
    };
    // checkBlockedStatus();
    checkReportedStatus();
  }, [target_id, user]);

  const unblockAction = async () => {
    try {
      const blockedUpdate = blockedArray.filter((i) => i !== target_id);

      const { error: unblockError } = await supabaseClient
        .from("profiles")
        .update({
          blocked: blockedUpdate,
        })
        .eq("id", user.id)
        .single();

      if (unblockError) throw unblockError;
      hideModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const blockAction = async () => {
    try {
      if (blockedArray === null) {
        blockedArray = [];
      }

      const prev = blockedArray;

      // Implement block functionality here
      const { error } = await supabaseClient
        .from("profiles")
        .update({
          blocked: [...prev, target_id],
        })
        .eq("id", user.id)
        .single();

      if (error) throw error;

      hideModal();
    } catch (error) {
      alert(error.message);
    }
  };

  const reportAction = () => {
    // Implement report functionality here
    const reasonMenu = (
      <select style={{ borderRadius: "6px" }} id="report-reason">
        {reportReasons.map((reason, i) => (
          <option key={`reportReason-${i}`}>{reason}</option>
        ))}
      </select>
    );
    showModal(
      "Reason for Reporting",
      reasonMenu,
      <>
        <Button
          onClick={async () => {
            showModal(
              "Reason for Reporting",
              reasonMenu,
              <Spinner animation="border" />
            );
            await submitReport();
            setIsReported(true);
            hideModal();
          }}
        >
          Submit
        </Button>
        {cancelButton}
      </>
    );
    // hideModal();
  };

  const submitReport = async () => {
    const reportReason = document.getElementById("report-reason").value;
    try {
      let { error } = await supabaseClient.from("reports").insert({
        description: reportReason,
        reported_id: target_id,
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" text="dark">
        <ThreeDotsVertical size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          disabled={isReported}
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
              modalTitle[getIsBlocked() ? 2 : 1],
              modalBody[getIsBlocked() ? 2 : 1],

              <>
                <Button
                  variant="danger"
                  className="mx-2"
                  onClick={getIsBlocked() ? unblockAction : blockAction}
                >
                  Confirm
                </Button>
                {cancelButton}
              </>
            )
          }
          className="text-danger"
        >
          {getIsBlocked() ? "Unblock" : "Block"}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BlockReportMenu;
