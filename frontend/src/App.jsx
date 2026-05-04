import { Routes, Route } from "react-router-dom";
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
