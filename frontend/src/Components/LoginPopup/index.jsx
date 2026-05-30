// components/LoginPopup/index.jsx
import { useRouter } from "next/router";


export default function LoginPopup({ onClose }) {
  const router = useRouter();

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        backgroundColor: "white", padding: "2rem", borderRadius: "10px",
        textAlign: "center", maxWidth: "400px", width: "90%"
      }}>
        <h2>Please Login First</h2>
        <p style={{ color: "gray", margin: "10px 0" }}>
          You need to login to perform this action
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "1rem" }}>
          <button
            onClick={() => router.push("/login")}
            style={{
              padding: "10px 20px", backgroundColor: "#0070f3",
              color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
            }}
          >
            Login
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px", backgroundColor: "gray",
              color: "white", border: "none", borderRadius: "5px", cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}