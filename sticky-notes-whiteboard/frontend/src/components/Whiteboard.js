import React, { useContext, useEffect, useMemo, useState ,useCallback} from "react";
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import StickyNoteComponent from "./StickyNoteComponent";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import API_ROUTES from "../services/api";

const Whiteboard=()=> {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newNodeTitle, setNewNodeTitle] = useState("");
  const [newNodeContent, setNewNodeContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedFlow, setSelectedFlow] = useState(null); 
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  


  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_ROUTES.FLOWS.FLOW}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = response.data; // Assuming the response returns an array of nodes
        console.log(data);

        // Map the API response to the format expected by React Flow
        const nodesArray = data.map((note) => ({
          id: note.id.toString(),
          type: "stickyNote",
          data: {
            title: note.title,
            content: note.content.text, // Assuming `text` is the content property
          },
          position: {
            x: Math.random() * 800, // Random x position within a width of 800px
            y: Math.random() * 600,
          },
          draggable: true,
        }));
        // console.log(nodesArray)

        setNodes(nodesArray);
        // console.log(nodes)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  const addFlow = async (newFlow) => {
    try {
      const response = await axios.post(`${API_ROUTES.FLOWS.FLOW}`, newFlow, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const createdFlow = {
        id: response.data.id.toString(),
        type: "stickyNote",
        data: {
          title: newFlow.title,
          content: newFlow.content.text,
        },
        position: {
          x: Math.random() * 800,
          y: Math.random() * 600,
        },
        draggable: true,
      };

      setNodes((prevNodes) => [...prevNodes, createdFlow]);
    } catch (error) {
      console.error("Error adding flow:", error);
    }
  };

  const deleteFlow = useCallback(
    async (id) => {
      try {
        await axios.delete(`${API_ROUTES.FLOWS.FLOW}/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      } catch (error) {
        console.error("Error deleting flow:", error);
      }
    },
    [authToken]
  );

const handleNodeClick = (event,node) => {
  // Navigate to the FlowDetailsPage with the clicked node's id
  navigate("/flow-details", { state: { id: node.id }  });
};

  const nodeTypes = useMemo(
    () => ({
      stickyNote: (props) => (
        <StickyNoteComponent {...props} deleteFlow={deleteFlow} />
      ),
    }),
    [deleteFlow]
  );

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const handleAddNode = () => {
    if (newNodeTitle && newNodeContent) {
      const newFlow = {
        title: newNodeTitle,
        content: {
          text: newNodeContent,
        },
      };
      addFlow(newFlow);
    } else {
      alert("Please enter both title and content for the note.");
    }
  };

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeClick={handleNodeClick}
      >
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
      {/* Input form to add a new node */}
      {showForm && (
        <div className="absolute top-0 left-0 w-full bg-white p-4 border border-gray-200">
          <h2 className="text-lg font-bold mb-2">Add New Note</h2>
          <div>
            <input
              type="text"
              placeholder="Title"
              value={newNodeTitle}
              onChange={(e) => setNewNodeTitle(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <textarea
              placeholder="Content"
              value={newNodeContent}
              onChange={(e) => setNewNodeContent(e.target.value)}
              className="border p-2 w-full mb-2"
            ></textarea>
            <button
              onClick={handleAddNode}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Node
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="absolute bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Note
        </button>
      )}
    </div>
  );
};


export default Whiteboard;
