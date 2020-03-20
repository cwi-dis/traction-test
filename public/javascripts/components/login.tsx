import * as React from "react";
import { useState } from "react";

interface LoginProps {
  loginSuccess: () => void;
}

const Login: React.FC<LoginProps> = (props) => {
  const { loginSuccess } = props;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async () => {
    const response = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      loginSuccess();
    }
  }

  return (
    <div>
      <div>
        <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button
          className="button is-info"
          disabled={username.length === 0 || password.length === 0}
          onClick={onSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Login
