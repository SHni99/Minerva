import React, { useEffect, useState } from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { supabaseClient } from "config/supabase-client";
import { useNavigate, Link } from "react-router-dom";
import ReportStyles from "./viewReportsPage.module.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { ChatDots, ExclamationCircle } from "react-bootstrap-icons";

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
  const [reports, setReports] = useState([]);

  // Check for authorisation, then get reports if authorised.
  useEffect(() => {
    (async () => {
      try {
        // Check permissions
        let { data, error } = await supabaseClient
          .from("profiles")
          .select("permissions")
          .eq("id", supabaseClient.auth.user().id)
          .single();
        if (error) throw error;

        if (data.permissions >= ADMIN_THRESHOLD) {
          setLoading(false);
          let { data, error } = await supabaseClient
            .from("reports")
            .select(
              `id, description, status, reporter(id, username), reported(id, username, avatar_url), assigned(id, username)`
            );
          if (error) console.log(error);

          let { data: testData, error: testError } = await supabaseClient
            .from("messages")
            .select("sender_id, payload");
          if (testError) throw testError;
          console.log(testData);
          setReports(data);
        } else {
          // User not authorised, redirect to landing page
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
        // alert(error.message);
        console.log(error);
      }
    })();
  }, [ADMIN_THRESHOLD, setToastOptions, navigate]);

  // Generate action buttons tied to the reported user's id.
  const generateActions = ({ id, username, avatar_url }) => {
    return (
      <div className={`p-0 m-0`}>
        <div className={ReportStyles.tooltip}>
          <Button
            variant="light"
            className="mx-2"
            onClick={() =>
              navigate("/chats", {
                state: {
                  startChatData: {
                    user_id: id,
                    name: username,
                    src: supabaseClient.storage
                      .from("avatars")
                      .getPublicUrl(avatar_url).publicURL,
                  },
                },
              })
            }
          >
            <ChatDots />
          </Button>
          <span className={ReportStyles.tooltiptext}>View Chat Logs</span>
        </div>
        <div className={ReportStyles.tooltip}>
          <Button variant="danger" className="mx-2">
            <ExclamationCircle />
          </Button>
          <span className={ReportStyles.tooltiptext}>Ban {username}</span>
        </div>
      </div>
    );
  };

  const createTr = (data) => {
    const { id, description, reporter, reported, assigned } = data;
    return (
      <tr key={`report-${id}`}>
        <td>{id}</td>
        <td>{description}</td>
        <td>
          <Link to="/profile" state={{ creator_id: reporter.id }}>
            {reporter.username}
          </Link>
        </td>
        <td>
          <Link to="/profile" state={{ creator_id: reported.id }}>
            {reported.username}
          </Link>
        </td>
        <td className={assigned || "text-danger"}>
          {assigned ? assigned.username : "None"}
        </td>
        <td>{generateActions(reported)}</td>
      </tr>
    );
  };

  return (
    <Container
      className={loading && "d-flex justify-center align-center my-auto"}
    >
      {loading ? (
        <Spinner size="xl" animation="grow" />
      ) : (
        <Row>
          <Table bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{reports.map(createTr)}</tbody>
          </Table>
        </Row>
      )}
    </Container>
  );
};
