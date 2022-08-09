import React, { useState, useEffect, useContext } from "react";
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
import AuthContext from "util/AuthContext";
import ToastContext from "util/ToastContext";

const Setting = ({ showModal, onHide, blockedArray, setOption, option }) => {
  const navigate = useNavigate();
  const { handleLogout } = useContext(AuthContext);
  const { showSimpleToast } = useContext(ToastContext);
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

            const avatarURL =
              avatar === ""
                ? "/images/img_avatarDefault.jpg"
                : supabaseClient.storage.from("avatars").getPublicUrl(avatar)
                    .publicURL;

            return {
              avatarURL,
              username,
              id,
            };
          })
        );
        setFullBlockeddata(newBlockedData);
      } catch (error) {
        alert(error.message);
      }
    };
    checkBlockedUsers();
  }, [user, blockedArray]);

  const blockedList = () => {
    return (
      <React.Fragment>
        {fullBlockedData.map(({ avatarURL, username, id: creator_id }) => {
          return (
            <Card className="my-3" key={creator_id}>
              <Card.Body>
                <div className="row">
                  <div className="col-auto">
                    <img
                      className="rounded-pill"
                      src={avatarURL}
                      style={{ width: "60px", height: "60px" }}
                      alt="img"
                    ></img>
                  </div>
                  <div className="col-auto d-flex align-items-center">
                    <label className="fs-4">{username}</label>
                  </div>
                  <div className="col-auto d-flex ms-auto">
                    <Button
                      className={`${settingStyles["tooltip"]} px-1`}
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
      {
        value: 3,
        label: "Show gender",
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
      <Dropdown.Toggle variant="secondary" id="setting">
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
            showModal(
              "List of blocked users",
              blockedArray.length === 0 ? (
                <div className="text-center poppins-semi-bold-black-24px">
                  Nothing here!
                </div>
              ) : (
                blockedList()
              )
            );
          }}
        >
          View blocked users
        </Dropdown.Item>
        <Dropdown.Item
          style={{ display: "none" }}
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
          onClick={() => handleLogout(showSimpleToast, navigate)}
          className="text-primary"
        >
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Setting;
