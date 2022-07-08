import React, { useContext, useEffect, useState } from "react";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import BanPageStyles from "./banPage.module.css";
import { Button, Container, Modal, Row, Spinner } from "react-bootstrap";
import { supabaseClient } from "config/supabase-client";
import Skeleton from "react-loading-skeleton";
import AuthContext from "util/AuthContext";

const BanPage = () => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [banData, setBanData] = useState(null);
  const [appealMsg, setAppealMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { authData } = useContext(AuthContext);

  // Fetch ban data, only once at the start.
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from("banned")
          .select("*")
          .eq("id", authData.id)
          .single();
        if (error) throw error;
        setBanData(data);
        if (data.appeal.message) {
          setAppealMsg(data.appeal.message);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authData]);

  // Generates status text, located under the Reason section
  const generateStatusText = () => {
    // Return empty string if banData is empty.
    if (!banData) return "";
    const {
      appeal: { status, reply },
    } = banData;
    const embedText = (top, bottom) => (
      <>
        <h2>{top}</h2>
        <h3 className="pb-2">{bottom}</h3>
      </>
    );

    switch (status) {
      case "submitted":
        return embedText(
          "Appeal Status: In Progress",
          "Our admins will get back to you shortly."
        );
      case "replied":
        return embedText(
          <>
            Appeal Status: Rejected <br />
            <div className="pt-2 pb-4">Reason: {reply}</div>
          </>,
          "You can submit another appeal below."
        );
      default:
        return embedText("Is this a mistake?", "Let us know:");
    }
  };

  // Handles sending of appeal message
  const sendAppeal = async (msg) => {
    try {
      if (!banData.id) {
        alert("No user id found!");
        return;
      }

      const { data, error } = await supabaseClient
        .from("banned")
        .update({ appeal: { status: "submitted", message: msg, reply: "" } })
        .eq("id", banData.id)
        .single();
      if (error) throw error;

      // Successful submission, update state
      setBanData(data);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <Container className="text-center pb-5">
        <Row>
          <h1 className="text-center fw-bold py-3">
            Your account has been restricted.
          </h1>
        </Row>
        <Row className="py-4">
          <h2>Reason:</h2>
          <p className="text-danger fs-5">
            {banData?.reason || <Skeleton width="50%" count={2} />}
          </p>
        </Row>
        <Row className="pt-2">
          {loading ? (
            <Skeleton width="25%" height="20px" count={2} className="py-3" />
          ) : (
            generateStatusText()
          )}
          {loading ? (
            <Skeleton width="75%" height="15vh" />
          ) : (
            <textarea
              className="w-75 mx-auto rounded-3 border-secondary fs-5"
              id="appeal-reason"
              style={{ minHeight: "15vh" }}
              disabled={banData && banData.appeal.status === "submitted"}
              onChange={(e) => setAppealMsg(e.target.value)}
              value={appealMsg}
            />
          )}
        </Row>
        <Row className="my-4">
          {loading ? (
            <Skeleton width="50%" height="40px" />
          ) : (
            <Button
              className="w-50 mx-auto"
              disabled={
                appealMsg.length === 0 ||
                (banData && banData.appeal.status === "submitted")
              }
              onClick={() => setShowModal(true)}
            >
              Submit Appeal
            </Button>
          )}
        </Row>
      </Container>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Appeal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure? Your message cannot be edited after submission.
        </Modal.Body>
        <Modal.Footer>
          {sending ? (
            <Spinner animation="border" />
          ) : (
            <>
              <Button
                onClick={async () => {
                  setSending(true);
                  await sendAppeal(
                    document.getElementById("appeal-reason").value
                  );
                  setSending(false);
                  setShowModal(false);
                }}
              >
                Confirm
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <FooterBar />
    </div>
  );
};

export default BanPage;
