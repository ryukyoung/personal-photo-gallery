import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function SignupPage() {
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
      await api.post("/api/auth/signup", form);
      navigate("/login");
    } catch {
      alert("Sign up failed.");
    }
  };

  return (
    <div className="form-page">
      <h1>Sign Up</h1>

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

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
