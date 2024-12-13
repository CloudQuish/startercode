import React from "react";

const StickyNoteComponent = ({ id, data, deleteFlow }) => {

    const handleDelete = (e) => {
      e.stopPropagation(); // Prevent event bubbling
      console.log(`Attempting to delete node with id: ${id}`);

      console.log("Current node details:", { id, data });

      deleteFlow(id)
        .then(() => console.log(`Successfully deleted node ${id}`))
        .catch((error) => {
          console.error(`Failed to delete node ${id}:`, error);
          // Optionally, show user-friendly error message
          alert(`Could not delete note: ${error.message}`);
        });
    };

  return (
    <div className="relative bg-yellow-200 p-4 rounded-lg shadow-lg border-2 border-yellow-300 w-64">
      {/* Delete Button */}
      <button
        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow hover:bg-red-600"
        onClick={handleDelete}
      >
        ✕
      </button>
      {/* Node Content */}
      <div className="font-bold mb-2 text-red-500">{data.title}</div>
      <p className="text-sm">{data.content}</p>
    </div>
  );
};

export default StickyNoteComponent;
