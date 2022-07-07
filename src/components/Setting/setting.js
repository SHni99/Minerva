import React, { useState, useEffect } from "react";
import { supabaseClient } from "../../config/supabase-client";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { Gear } from "react-bootstrap-icons";
import { ChevronRight } from "react-bootstrap-icons";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import settingStyles from "./setting.module.css";

const Setting = ({ showModal, onHide }) => {
  const navigate = useNavigate();
  const user = supabaseClient.auth.user();
  const [fullBlockedData, setFullBlockeddata] = useState("");

  useEffect(() => {
    const checkBlockedUsers = async () => {
      try {
        if (!user) return;
        const { data: currentData, error } = await supabaseClient
          .from("profiles")
          .select("blocked")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (currentData.blocked === null) {
          currentData.blocked = [];
        }

        const newBlockedData = await Promise.all(
          currentData.blocked.map(async (id) => {
            let {
              data: { avatar_url: avatar, username },
              error,
              status,
            } = await supabaseClient
              .from("profiles")
              .select("username, avatar_url")
              .eq("id", id)
              .single();

            if (error && status !== 406) throw error;

            if (avatar === "") return;

            const { publicURL: avatarURL, error: publicUrlError } =
              supabaseClient.storage.from("avatars").getPublicUrl(avatar);

            if (publicUrlError) throw publicUrlError;
            return {
              avatarURL,
              username,
              id,
            };
          })
        );
        setFullBlockeddata(newBlockedData);
        //console.log(newBlockedData);
      } catch (error) {
        alert(error.message);
      }
    };

    checkBlockedUsers();
  }, [user]);

  //log user out and redirect to landing page
  const handleLogout = async (navigate, e) => {
    e.preventDefault();
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      //input logout popup
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const blockedList = () => {
    return (
      <React.Fragment>
        {fullBlockedData.map(({ avatarURL, username, id: creator_id }) => {
          return (
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-3">
                    <img
                      className="rounded-pill"
                      src={avatarURL}
                      alt="img"
                    ></img>
                  </div>
                  <div className="col-4 d-flex justify-center nunitosans-bold-black-32px">
                    {username}
                  </div>
                  <div className="col-5 d-flex justify-end">
                    <Button
                      className={settingStyles["tooltip"]}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/profile", { state: { creator_id } });
                        onHide();
                      }}
                    >
                      <span className={settingStyles["tooltiptext"]}>
                        View profile
                      </span>
                      <ChevronRight size={30} />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <Dropdown className="d-flex justify-end">
      <Dropdown.Toggle variant="secondary">
        <Gear size={20} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item
          eventKey="editprofile"
          onClick={(e) => {
            e.preventDefault();
            navigate("/loginmainpage");
          }}
        >
          Edit profile
        </Dropdown.Item>
        <Dropdown.Item
          eventKey="blockeduser"
          onClick={() => {
            showModal("List of blocked users", blockedList());
          }}
        >
          View blocked users
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Item
          eventKey="logout"
          onClick={(e) => {
            handleLogout(navigate, e);
          }}
          className="text-primary"
        >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Setting;
