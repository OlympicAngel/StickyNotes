const express = require('express');
const router = express.Router();
const { getAllNotes , addNote , getNoteById , deleteNote , updateNote} = require('../controller/note_controller');

// MVC
// Model
// view - routes
// controller

router.get('/',getAllNotes);
router.get('/get_by_id/:id',getNoteById);
router.post('/add_note',addNote);
router.delete('/delete_note/:id',deleteNote);
router.put('/update_note/:id',updateNote);


module.exports = router;