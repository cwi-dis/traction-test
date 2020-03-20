import * as React from "react";

interface LogoutButtonProps {
  logoutSuccess: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = (props) => {
  const { logoutSuccess } = props;

  const sendLogout = async () => {
    const response = await fetch("/logout", {
      method: "POST"
    });

    if (response.ok) {
      logoutSuccess();
    }
  };

  return (
    <button className="button is-info" onClick={sendLogout}>Logout</button>
  );
};

export default LogoutButton;
