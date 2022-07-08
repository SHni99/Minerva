import React, { useState, useEffect } from "react";
import { supabaseClient } from "../../config/supabase-client";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { Gear } from "react-bootstrap-icons";
import { ChevronRight } from "react-bootstrap-icons";
import { Card } from "react-bootstrap";
import { Button } from "react-bootstrap";
import settingStyles from "./setting.module.css";
import makeAnimated from "react-select/animated";
import Select from "react-select";

const Setting = ({ showModal, onHide, blockedArray, setOption, option }) => {
  const navigate = useNavigate();
  const user = supabaseClient.auth.user();
  const animatedComponents = makeAnimated();
  const [fullBlockedData, setFullBlockeddata] = useState("");

  useEffect(() => {
    const checkBlockedUsers = async () => {
      try {
        const newBlockedData = await Promise.all(
          blockedArray.map(async (id) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  //log user out and redirect to landing page
  const handleLogout = async (navigate, e) => {
    e.preventDefault();
    try {
      navigate("/");
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      //input logout popup
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

  const preferenceList = () => {
    const preferences = [
      {
        value: 1,
        label: "Show email",
      },
      {
        value: 2,
        label: "Show bio",
      },
    ];

    const handler = (e) => {
      setOption(e.map((x) => x.label));
    };

    return (
      <Select
        name="form-field-name"
        closeMenuOnSelect={false}
        onChange={handler}
        defaultValue={option}
        isMulti
        components={animatedComponents}
        options={preferences}
      />
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
        <Dropdown.Item
          eventKey="preference"
          onClick={() => {
            showModal(
              "",
              preferenceList(),
              "please clear input box before selecting"
            );
          }}
        >
          Customize display preference
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
