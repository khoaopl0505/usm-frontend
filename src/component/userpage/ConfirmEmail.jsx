import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const ConfirmEmail = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Lấy token từ URL
  const query = new URLSearchParams(useLocation().search);
  const tokenMail = query.get("tokenMail");

  useEffect(() => {
    if (tokenMail) {
      // Gửi yêu cầu xác nhận email
      axios
        .get(`http://localhost:8080/confirm?tokenMail=${tokenMail}`)
        .then((response) => {
          setMessage(response.data.message || "Email confirmed successfully!");
        })
        .catch((error) => {
          setMessage(error.response?.data?.message || "Failed to confirm email.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMessage("Invalid or missing token.");
      setLoading(false);
    }
  }, [tokenMail]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
};

export default ConfirmEmail;
