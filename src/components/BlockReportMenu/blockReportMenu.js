import React, { useState } from "react";
import { ThreeDotsVertical } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { supabaseClient } from "../../config/supabase-client";
import { useEffect } from "react";

// Requires 3 props
//
// showModal: Function that displays a modal by taking
// three parameters -- titleContent, bodyContent and footerContent
//
// hideModal: Function that hides modal when called
//
// target_id: ID of the user who is being reported/blocked

const BlockReportMenu = ({ showModal, hideModal, target_id }) => {
  const [loading, setLoading] = useState(false);
  const user = supabaseClient.auth.user();
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
    checkBlockedStatus();
  });

  const checkBlockedStatus = async () => {
    try {
      const { data: currentData, error } = await supabaseClient
        .from("profiles")
        .select("blocked")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      if (currentData.blocked === null) {
        currentData.blocked = [];
      }
      const current = currentData.blocked;
      const checkUsername = (element) => element === target_id;
      setLoading(current.some(checkUsername) || null);
    } catch (error) {
      alert(error.message);
    }
  };

  const unblockAction = async () => {
    try {
      const { data, error } = await supabaseClient
        .from("profiles")
        .select("blocked")
        .eq("id", user.id)
        .single();

      const blockedUpdate = data.blocked.filter((i) => i !== target_id);

      if (error) throw error;

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
      const { data: prevData, error: blockedError } = await supabaseClient
        .from("profiles")
        .select("blocked")
        .eq("id", user.id)
        .single();

      if (blockedError) throw blockedError;
      if (prevData.blocked === null) {
        prevData.blocked = [];
      }
      const prev = prevData.blocked;

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
              modalTitle[loading ? 2 : 1],
              modalBody[loading ? 2 : 1],

              <>
                <Button
                  variant="danger"
                  className="mx-2"
                  onClick={loading ? unblockAction : blockAction}
                >
                  Confirm
                </Button>
                {cancelButton}
              </>
            )
          }
          className="text-danger"
        >
          {loading ? "Unblock" : "Block"}
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BlockReportMenu;
