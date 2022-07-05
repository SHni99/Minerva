import React, { useEffect, useState } from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { supabaseClient } from "config/supabase-client";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

const ViewReportsPage = ({ setToastOptions }) => {
  // Minimum permission level required to be considered an admin.
  const ADMIN_THRESHOLD = 1;

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ReportsBody
        ADMIN_THRESHOLD={ADMIN_THRESHOLD}
        setToastOptions={setToastOptions}
      />
      <FooterBar />
    </div>
  );
};

export default ViewReportsPage;

const ReportsBody = ({ ADMIN_THRESHOLD, setToastOptions }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Check for authorisation
  useEffect(() => {
    // IIFE that redirects users if not authorised.
    (async () => {
      try {
        let { data, error } = await supabaseClient
          .from("profiles")
          .select("permissions")
          .eq("id", supabaseClient.auth.user().id)
          .single();
        if (error) throw error;

        if (data.permissions >= ADMIN_THRESHOLD) {
          setLoading(false);
        } else {
          navigate("/");
          setToastOptions({
            show: true,
            closeButton: false,
            position: "bottom-end",
            containerClasses: "p-4",
            variant: "danger",
            autohide: true,
            delay: 3000,
            headerContent: "Unauthorised User",
            bodyContent: "You are not authorised to access this page.",
          });
        }
      } catch (error) {
        alert(error.message);
      }
    })();
  }, [ADMIN_THRESHOLD, setToastOptions, navigate]);

  return (
    <Container
      className={loading && "d-flex justify-center align-center my-auto"}
    >
      {loading ? <Spinner size="xl" animation="grow" /> : <h1> REPORT</h1>}
    </Container>
  );
};
