import React, { useEffect, useState } from "react";
import NavBar from "components/NavBar/navBar";
import FooterBar from "components/FooterBar/footerBar";
import { supabaseClient } from "config/supabase-client";
import { useNavigate, Link } from "react-router-dom";
import ReportStyles from "./viewReportsPage.module.css";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import {
  ChatDots,
  CheckCircle,
  ExclamationCircle,
  JournalPlus,
  PersonCheck,
  PersonX,
} from "react-bootstrap-icons";

const ViewReportsPage = ({ setToastOptions }) => {
  // Minimum permission level required to be considered an admin.
  const ADMIN_THRESHOLD = 1;
  const [modalState, setModalState] = useState({ show: false });

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <NavBar />
      <ReportsBody
        ADMIN_THRESHOLD={ADMIN_THRESHOLD}
        setToastOptions={setToastOptions}
        setModalState={setModalState}
      />
      <ViewReportsModal
        modalState={modalState}
        onHide={() => setModalState({ show: false })}
      />
      <FooterBar />
    </div>
  );
};

export default ViewReportsPage;

const ReportsBody = ({ ADMIN_THRESHOLD, setToastOptions, setModalState }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [getResolved, setGetResolved] = useState(false);
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
              `id, description, status, reporter(id, username, avatar_url), reported(id, username, avatar_url, permissions), assigned(id, username)`
            )
            .order("id", { ascending: true });
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

          // Set up listener for Reports table
          const fetchExtra = async (reportId) => {
            let { data, error } = await supabaseClient
              .from("reports")
              .select(
                `id, description, status, reporter(id, username, avatar_url), reported(id, username, avatar_url, permissions), assigned(id, username)`
              )
              .eq("id", reportId)
              .single();
            if (error) throw error;
            return data;
          };
          const reportsSub = supabaseClient
            .from("reports")
            .on("INSERT", async (payload) => {
              const reportId = payload.new.id;
              const inserted = await fetchExtra(reportId);
              setReports((old) =>
                [...old, inserted].sort((a, b) => a.id - b.id)
              );
            })
            .on("DELETE", (payload) => {
              const reportId = payload.old.id;
              setReports((old) =>
                old
                  .filter((report) => report.id !== reportId)
                  .sort((a, b) => a.id - b.id)
              );
            })
            .on("UPDATE", async (payload) => {
              const reportId = payload.new.id;
              const updated = await fetchExtra(reportId);
              setReports((old) =>
                [
                  ...old.filter((report) => report.id !== reportId),
                  updated,
                ].sort((a, b) => a.id - b.id)
              );
            })
            .subscribe();

          return () => supabaseClient.removeSubscription(reportsSub);
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

  const updateAssignment = async (reportId, assignedId) => {
    try {
      let { error } = await supabaseClient
        .from("reports")
        .update({
          assigned_id: assignedId,
          status: assignedId ? "assigned" : "unassigned",
        })
        .eq("id", reportId);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleAssignClick = (status, id) => {
    console.log(id);
    const index = status === "unassigned" ? 0 : 1;
    const cancelButton = (
      <Button
        variant="secondary"
        onClick={() => setModalState({ show: false })}
      >
        Cancel
      </Button>
    );
    const modalTitle = ["Confirm Assignment", "Confirm Dismissal"];
    const modalContent = [
      `Assign yourself to report #${id}?`,
      `Remove assignment from report #${id}?`,
    ];

    const modalTemp = {
      show: true,
      titleContent: modalTitle[index],
      bodyContent: modalContent[index],
    };

    setModalState({
      ...modalTemp,
      footerContent: (
        <>
          <Button
            onClick={async () => {
              setModalState({
                ...modalTemp,
                footerContent: <Spinner animation="border" />,
              });
              await updateAssignment(id, [uid, null][index]);
              setModalState({ show: false });
            }}
          >
            Confirm
          </Button>
          {cancelButton}
        </>
      ),
    });
  };

  const updateTaskStatus = async (reportId, status) => {
    try {
      let { error } = await supabaseClient
        .from("reports")
        .update({ status })
        .eq("id", reportId);
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    }
  };

  const handleResolveClick = async (reportId, status, assigned) => {
    const isResolved = status === "resolved";
    const modalTemplate = {
      show: true,
      titleContent: isResolved ? "Reopen Report" : "Resolve Issue",
      bodyContent: isResolved
        ? `Reopen report #${reportId}?`
        : `Mark report #${reportId} as resolved?`,
    };

    setModalState({
      ...modalTemplate,
      footerContent: (
        <>
          <Button
            onClick={async () => {
              setModalState({
                ...modalTemplate,
                footerContent: <Spinner animation="border" />,
              });
              await updateTaskStatus(
                reportId,
                isResolved ? (assigned ? "assigned" : "unassigned") : "resolved"
              );
              setModalState({ show: false });
            }}
          >
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => setModalState({ show: false })}
          >
            Cancel
          </Button>
        </>
      ),
    });
  };

  const handleBanClick = (reported) => {
    const { id, username, permissions } = reported;
    const isBanned = permissions < 0;
    const cancelButton = (
      <Button
        variant="secondary"
        onClick={() => setModalState({ show: false })}
      >
        Cancel
      </Button>
    );
    const modalTemplate = {
      show: true,
      titleContent: `${isBanned ? "Unban" : "Ban"} ${username}`,
    };
    const bodyContent = [
      <p className="text-danger fw-bold">
        {isBanned
          ? `Are you sure? ${username} will regain full access to the site.`
          : `Are you sure? ${username}'s access will be severely restricted.`}
      </p>,
      <p>
        Please enter the reason for the ban:
        <textarea
          className="rounded-3 border-secondary w-100"
          id="ban-reason"
        />
      </p>,
    ];

    const updateBanStatus = async (userId, reason, banUser) => {
      try {
        // Update permissions
        const { error: permsError } = await supabaseClient
          .from("profiles")
          .update({ permissions: banUser ? -1 : 0 })
          .eq("id", userId)
          .single();
        if (permsError) throw permsError;
        // Update local state
        setReports((old) => {
          const newReports = [...old];
          const updateIndex = newReports.findIndex(
            (report) => report.reported.id === userId
          );
          newReports[updateIndex].reported.permissions = banUser ? -1 : 0;
          return newReports;
        });

        // Update ban reason
        if (banUser) {
          const { error: banError } = await supabaseClient
            .from("banned")
            .insert({ id: userId, reason });
          if (banError) throw banError;
        } else {
          const { error: banError } = await supabaseClient
            .from("banned")
            .delete()
            .eq("id", userId);
          if (banError) throw banError;
        }
      } catch (error) {
        alert(error.message);
      }
    };

    const handleConfirmClick = async () => {
      if (!isBanned) {
        // If user not already banned, proceed to confirm ban reason
        setModalState({
          ...modalTemplate,
          bodyContent: bodyContent[1],
          footerContent: (
            <>
              <Button
                variant="danger"
                onClick={async () => {
                  const reason = document.getElementById("ban-reason").value;
                  if (!reason) {
                    alert("Please enter a reason for the ban!");
                    return;
                  }
                  setModalState({
                    ...modalTemplate,
                    bodyContent: bodyContent[1],
                    footerContent: <Spinner animation="border" />,
                  });

                  await updateBanStatus(id, reason, true);

                  setModalState({ show: false });
                }}
              >
                Submit
              </Button>
              {cancelButton}
            </>
          ),
        });
      } else {
        // User is already banned. Unban user upon confirmation.
        setModalState({
          ...modalTemplate,
          bodyContent: bodyContent[0],
          footerContent: <Spinner animation="border" />,
        });

        await updateBanStatus(id, null, false);

        setModalState({ show: false });
      }
    };

    setModalState({
      ...modalTemplate,
      bodyContent: bodyContent[0],
      footerContent: (
        <>
          <Button
            variant={isBanned ? "primary" : "danger"}
            onClick={handleConfirmClick}
          >
            Confirm
          </Button>
          {cancelButton}
        </>
      ),
    });
  };

  // Generate action buttons tied to the reported user's id.
  const generateActions = ({
    id,
    status,
    assigned,
    reporter,
    reported,
    hasConvo,
  }) => {
    const wrapperClasses = "p-0 m-0 d-flex justify-evenly";

    // Wrap all buttons in a create function to only generate them when needed.
    const createAssignButton = () => (
      <div className={ReportStyles.tooltip}>
        <Button
          disabled={
            !(
              status === "unassigned" ||
              (status === "assigned" && assigned?.id === uid)
            )
          }
          className="m-1 my-lg-0"
          onClick={() => handleAssignClick(status, id)}
        >
          {status === "assigned" && assigned?.id === uid ? (
            <PersonX />
          ) : (
            <PersonCheck />
          )}
        </Button>
        <span className={ReportStyles.tooltiptext}>
          {status === "assigned" && assigned?.id !== uid
            ? "Already Assigned"
            : status === "unassigned"
            ? "Assign Yourself"
            : "Remove Assignment"}
        </span>
      </div>
    );
    const createChatLogsButton = () => (
      <div className={ReportStyles.tooltip}>
        <Button
          variant="secondary"
          className="m-1 my-lg-0"
          onClick={() =>
            navigate("/chatlogs", {
              state: {
                recepient: reporter,
                sender: reported,
              },
            })
          }
          disabled={!(assigned?.id === uid && hasConvo)}
        >
          <ChatDots />
        </Button>
        <span className={ReportStyles.tooltiptext}>
          {hasConvo ? "View Chat Log" : "No Started Chats"}
        </span>
      </div>
    );

    const createBanButton = () => (
      <div className={ReportStyles.tooltip}>
        <Button
          variant={reported.permissions < 0 ? "info" : "danger"}
          className="m-1 my-lg-0"
          disabled={assigned?.id !== uid}
          onClick={() => handleBanClick(reported)}
        >
          <ExclamationCircle />
        </Button>
        <span className={ReportStyles.tooltiptext}>
          {reported.permissions < 0 ? "Unban" : "Ban"} {reported.username}
        </span>
      </div>
    );

    const createResolveButton = () => (
      <div className={ReportStyles.tooltip} onClick={() => {}}>
        <Button
          variant={status === "resolved" ? "warning" : "success"}
          className="m-1 my-lg-0"
          onClick={() => handleResolveClick(id, status, assigned)}
          disabled={!(assigned?.id === uid)}
        >
          {status === "resolved" ? <JournalPlus /> : <CheckCircle />}
        </Button>
        <span className={ReportStyles.tooltiptext}>
          {assigned?.id === uid
            ? status === "resolved"
              ? "Reopen Issue"
              : "Mark As Resolved"
            : "Not Assigned To You"}
        </span>
      </div>
    );

    // If report is already resolved, only show resolve/reopen button
    if (status === "resolved") {
      return <div className={wrapperClasses}>{createResolveButton()}</div>;
    }

    // If report is assigned to current user, show all action buttons
    if (status === "assigned" && assigned?.id === uid) {
      return (
        <div className={wrapperClasses}>
          {createAssignButton()}
          {createChatLogsButton()}
          {createBanButton()}
          {createResolveButton()}
        </div>
      );
    }

    // If report not assigned to current user, only show assignment button
    // Also set to the default display if previous cases are not met
    return <div className={wrapperClasses}>{createAssignButton()}</div>;
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
        <td
          className={`${assigned || "text-danger"} ${
            assigned?.id === uid && "fw-bold"
          }`}
        >
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
        <>
          <Pagination>
            <Pagination.Item
              active={!getResolved}
              onClick={() => setGetResolved(false)}
            >
              Unresolved
            </Pagination.Item>
            <Pagination.Item
              active={getResolved}
              onClick={() => setGetResolved(true)}
            >
              Resolved
            </Pagination.Item>
          </Pagination>
          <Row>
            <Table
              bordered
              hover
              responsive
              className="m-auto"
              style={{ width: "95%" }}
            >
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
              <tbody>
                {reports
                  .filter(
                    ({ status }) => (status === "resolved") === getResolved
                  )
                  .map(createTr)}
              </tbody>
            </Table>
          </Row>
        </>
      )}
    </Container>
  );
};

const ViewReportsModal = ({ modalState, onHide }) => {
  const { show, titleContent, bodyContent, footerContent } = modalState;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{titleContent}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{bodyContent}</Modal.Body>

      <Modal.Footer>{footerContent}</Modal.Footer>
    </Modal>
  );
};
