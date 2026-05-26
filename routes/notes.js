const express = require("express");
const { getNoteId, getNote, addNote, replaceNote, updateNote, delNote, getNoteQuery } = require("../controllers/notes_controller");
const router = express.Router()

router.get("/", getNote);
router.get("/:id", getNoteId);
router.post("/", addNote)
router.put("/:id", replaceNote)
router.patch("/:id", updateNote)
router.delete("/:id", delNote)

module.exports = router