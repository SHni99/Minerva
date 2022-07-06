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
import {
  ChatDots,
  ExclamationCircle,
  PersonCheck,
  PersonX,
} from "react-bootstrap-icons";

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
  const uid = supabaseClient.auth.user().id;

  // Check for authorisation, then get reports if authorised.
  useEffect(() => {
    (async () => {
      try {
        // Check permissions
        let { data, error } = await supabaseClient
          .from("profiles")
          .select("permissions")
          .eq("id", uid)
          .single();
        if (error) throw error;

        // Get relevant report data
        if (data.permissions >= ADMIN_THRESHOLD) {
          let { data, error } = await supabaseClient
            .from("reports")
            .select(
              `id, description, status, reporter(id, username, avatar_url), reported(id, username, avatar_url), assigned(id, username)`
            );
          if (error) throw error;

          // Check if the two users have an existing conversation
          const newReports = await Promise.all(
            data.map(async (report) => {
              let { data: hasConvo, error: hasConvoError } =
                await supabaseClient.rpc("has_convo", {
                  id1: report.reporter.id,
                  id2: report.reported.id,
                });
              if (hasConvoError) throw hasConvoError;
              return { ...report, hasConvo };
            })
          );

          setReports(newReports);
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
      } finally {
        setLoading(false);
      }
    })();
  }, [ADMIN_THRESHOLD, setToastOptions, navigate, uid]);

  // Generate action buttons tied to the reported user's id.
  const generateActions = ({
    status,
    assigned,
    reporter,
    reported,
    hasConvo,
  }) => {
    return (
      <div className={`p-0 m-0`}>
        <div className={ReportStyles.tooltip}>
          <Button disabled={!(status === "unassigned")}>
            {status === "assigned" && assigned.id === uid ? (
              <PersonX />
            ) : (
              <PersonCheck />
            )}
          </Button>
          {(status === "unassigned" || assigned?.id === uid) && (
            <span className={ReportStyles.tooltiptext}>
              {status === "unassigned"
                ? "Assign Yourself"
                : "Remove Assignment"}
            </span>
          )}
        </div>
        <div className={ReportStyles.tooltip}>
          <Button
            variant="light"
            className="mx-2"
            onClick={() =>
              navigate("/chatlogs", {
                state: {
                  recepient: reporter,
                  sender: reported,
                },
              })
            }
            disabled={!hasConvo}
          >
            <ChatDots />
          </Button>
          <span className={ReportStyles.tooltiptext}>
            {hasConvo ? "View Chat Log" : "No Started Chats"}
          </span>
        </div>
        <div className={ReportStyles.tooltip}>
          <Button variant="danger" className="mx-2">
            <ExclamationCircle />
          </Button>
          <span className={ReportStyles.tooltiptext}>
            Ban {reported.username}
          </span>
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
        <td>{generateActions(data)}</td>
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
