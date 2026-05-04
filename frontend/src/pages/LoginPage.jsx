import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { saveUser } from "../utils/auth";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/api/auth/login", form);
      saveUser(res.data.user);
      navigate("/");
      window.location.reload();
    } catch {
      alert("Sign in failed.");
    }
  };

  return (
    <div className="form-page">
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit} className="form-box">
        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default LoginPage;
