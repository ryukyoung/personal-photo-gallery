import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import api from "./api/api";
import { saveUser, removeUser } from "./utils/auth";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PhotoListPage from "./pages/PhotoListPage";
import UploadPhotoPage from "./pages/UploadPhotoPage";
import EditPhotoPage from "./pages/EditPhotoPage";
import SearchPage from "./pages/SearchPage";
import MessagesPage from "./pages/MessagesPage";
import SendMessagePage from "./pages/SendMessagePage";

function App() {
  const [ready, setReady] = useState(false);

  // Ask the server who we actually are, then sync local state to it.
  // This prevents the UI from starting "logged in" off a stale
  // localStorage record when the server session is already gone.
  useEffect(() => {
    api
      .get("/api/auth/me")
      .then((res) => {
        if (res.data.user) {
          saveUser(res.data.user);
        } else {
          removeUser();
        }
      })
      .catch(() => {
        removeUser();
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <div className="container">Loading…</div>;
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/photos" element={<PhotoListPage />} />
          <Route path="/photos/upload" element={<UploadPhotoPage />} />
          <Route path="/photos/edit/:photoId" element={<EditPhotoPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route
            path="/messages/send/:receiverId"
            element={<SendMessagePage />}
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
