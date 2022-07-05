import React from "react";
import { supabaseClient } from "../../config/supabase-client";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { Gear } from "react-bootstrap-icons";

const Setting = () => {
  const navigate = useNavigate();

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
