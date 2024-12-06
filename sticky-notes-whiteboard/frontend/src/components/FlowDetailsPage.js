// src/components/FlowDetailsPage.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_ROUTES from "../services/api";

const FlowDetailsPage = () => {
  const [flow, setFlow] = useState(null);
  const { state } = useLocation();
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    if (state && state.id) {
      const fetchFlow = async () => {
        try {
          const response = await axios.get(
            `${API_ROUTES.FLOWS.FLOW}/${state.id}`,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setFlow(response.data);
        } catch (error) {
          console.error("Error fetching flow details:", error);
        }
      };

      fetchFlow();
    }
  }, [state, authToken]);

  if (!flow) {
    return (
      <div className="loading-screen">
        <p>Loading flow details...</p>
      </div>
    );
  }

  return (
    <div className="flow-details-container p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Flow Details</h2>
      <div className="details-content">
        <p className="mb-2">
          <strong className="text-gray-700">Title:</strong> {flow.title}
        </p>
        <p className="mb-2">
          <strong className="text-gray-700">Content:</strong>{" "}
          {flow.content.text}
        </p>
      </div>
    </div>
  );
};

export default FlowDetailsPage;
