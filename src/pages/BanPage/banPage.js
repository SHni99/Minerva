import React, { useContext, useEffect, useState } from "react";
import FooterBar from "components/FooterBar/footerBar";
import NavBar from "components/NavBar/navBar";
import { Button, Container, Row } from "react-bootstrap";
import { supabaseClient } from "config/supabase-client";
import Skeleton from "react-loading-skeleton";
import AuthContext from "util/AuthContext";

const BanPage = () => {
  const [loading, setLoading] = useState(false);
  const [banData, setBanData] = useState(null);
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
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authData]);

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
          <h2>Is this a mistake?</h2>
          <h3 className="pb-2">Let us know:</h3>
          {loading ? (
            <Skeleton width="75%" height="15vh" />
          ) : (
            <textarea
              className="w-75 mx-auto rounded-3 border-secondary fs-5"
              id="appeal-reason"
              style={{ minHeight: "15vh" }}
              disabled={banData && banData.reason.status === "submitted"}
              defaultValue={banData && banData.reason.message}
            />
          )}
        </Row>
        <Row className="my-4">
          {loading ? (
            <Skeleton width="50%" height="40px" />
          ) : (
            <Button
              className="w-50 mx-auto"
              disabled={banData && banData.reason.status === "submitted"}
            >
              Submit Appeal
            </Button>
          )}
        </Row>
      </Container>
      <FooterBar />
    </div>
  );
};

export default BanPage;
