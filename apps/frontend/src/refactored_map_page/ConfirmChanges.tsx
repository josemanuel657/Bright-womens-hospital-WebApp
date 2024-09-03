import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMapContext } from "./MapContext.ts";
import {
  AddEdgesOptionsRequest,
  AddNodesOptionsRequest,
  DeleteEdgesOptionsRequest,
  DeleteNodesOptionsRequest,
  EditorMode,
  OldNewEdge,
  OldNewNode,
  RefactorEdgesOptionsRequest,
  RefactorNodesOptionsRequest,
} from "common/src/types/map_page_types.ts";
import { Node } from "common/src/data_structures/Node.ts";
import { Edge } from "common/src/data_structures/Edge.ts";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

export default ConfirmChanges;

function ConfirmChanges() {
  const {
    editorMode,
    nodesToBeDeleted,
    setNodesToBeDeleted,
    nodesToBeEdited,
    setNodesToBeEdited,
    edgesToBeDeleted,
    setEdgesToBeDeleted,
    edgesToBeEdited,
    setEdgesToBeEdited,
    nodesToBeAdded,
    setNodesToBeAdded,
    edgesToBeAdded,
    setEdgesToBeAdded,
    unsavedChanges,
    setUnsavedChanges,
  } = useMapContext();

  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const deleteNodes = async () => {
    try {
      const deleteNodesOptionsRequest: DeleteNodesOptionsRequest = {
        nodes: nodesToBeDeleted,
      };
      await axios.delete("/api/delete-nodes-and-associated-edges", {
        data: deleteNodesOptionsRequest,
      });
      setNodesToBeDeleted(new Array<Node>());
    } catch (error) {
      console.error("Failed to delete nodes data:", error);
    }
  };

  const editNodes = async () => {
    if (nodesToBeEdited.length > 0) {
      try {
        const refactorNodesOptionsRequest: RefactorNodesOptionsRequest = {
          oldNewNodes: nodesToBeEdited,
        };
        await axios.post("/api/refactor-nodes", refactorNodesOptionsRequest);
        setNodesToBeEdited(new Array<OldNewNode>());
      } catch (error) {
        console.error("Failed to refactor nodes data:", error);
      }
    }
  };

  const addNodes = async () => {
    if (nodesToBeAdded.length > 0) {
      try {
        const addNodesOptionsRequest: AddNodesOptionsRequest = {
          nodes: nodesToBeAdded,
        };
        await axios.post("/api/add-nodes", addNodesOptionsRequest);
        setNodesToBeAdded(new Array<Node>());
      } catch (error) {
        console.error("Failed to add nodes data:", error);
      }
    }
  };

  const deleteEdges = async () => {
    try {
      const deleteEdgesOptionsRequest: DeleteEdgesOptionsRequest = {
        edges: edgesToBeDeleted,
      };
      // Not setup yet
      await axios.delete("/api/delete-edges", {
        data: deleteEdgesOptionsRequest,
      });
      setEdgesToBeDeleted(new Array<Edge>());
    } catch (error) {
      console.error("Failed to delete edges data:", error);
    }
  };

  const editEdges = async () => {
    if (edgesToBeEdited.length > 0) {
      try {
        const refactorEdgesOptionsRequest: RefactorEdgesOptionsRequest = {
          oldNewEdges: edgesToBeEdited,
        };
        await axios.post("/api/refactor-edges", refactorEdgesOptionsRequest);
        setEdgesToBeEdited(new Array<OldNewEdge>());
      } catch (error) {
        console.error("Failed to refactor edges data:", error);
      }
    }
  };

  const addEdges = async () => {
    if (edgesToBeAdded.length > 0) {
      try {
        const addEdgesOptionsRequest: AddEdgesOptionsRequest = {
          newEdges: edgesToBeAdded,
        };
        await axios.post("/api/add-edges", addEdgesOptionsRequest);
        setEdgesToBeAdded(new Array<Edge>());
      } catch (error) {
        console.log("Failed to add edges data:", error);
      }
    }
  };

  const handleConfirm = async () => {
    if (nodesToBeAdded.length > 0) {
      await addNodes();
    }
    if (nodesToBeEdited.length > 0) {
      await editNodes();
    }
    if (nodesToBeDeleted.length > 0) {
      await deleteNodes();
    }
    if (edgesToBeAdded.length > 0) {
      await addEdges();
    }
    if (edgesToBeEdited.length > 0) {
      await editEdges();
    }
    if (edgesToBeDeleted.length > 0) {
      await deleteEdges();
    }
    setUnsavedChanges(false);
    setDialogueOpen(false);
    setSnackbarOpen(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!unsavedChanges) return;
      event.preventDefault();
      event.returnValue =
        "You have unsaved changes. Are you sure you want to leave?";
    };

    if (unsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [unsavedChanges]);

  if (editorMode === EditorMode.disabled) {
    return <></>;
  }

  return (
    <>
      <Button
        variant={"contained"}
        sx={{
          position: "absolute",
          height: "6vh",
          // width: "12vw",
          fontSize: "1rem",
          right: 0,
          marginRight: "1vw",
          marginTop: "2vh",
          fontWeight: "bold",
          textTransform: "capitalize",
          backgroundColor: "#012d5a",
          boxShadow: 7,
          zIndex: 4,
        }}
        onClick={() => setDialogueOpen(true)}
      >
        Confirm Changes
      </Button>
      <Dialog open={dialogueOpen} onClose={() => setDialogueOpen(false)}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will send all edited node data to the database and remove nodes
            you deleted. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDialogueOpen(false)}
            sx={{
              color: "black",
              fontWeight: "bold",
              fontFamily: "inter",
              textTransform: "capitalize",
            }}
          >
            Cancel
          </Button>
          <Button
            endIcon={<CheckRoundedIcon />}
            onClick={handleConfirm}
            variant={"contained"}
            sx={{
              // backgroundColor: "#1665c0",
              fontWeight: "bold",
              textTransform: "capitalize",
            }}
          >
            Confirm Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => {
          setSnackbarOpen(false);
        }}
        message={"Nodes Changed Successfully"}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </>
  );
}
