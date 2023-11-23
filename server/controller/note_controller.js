const note_modal = require("../model/note_modal");

module.exports =
{
  getAllNotes: async (req, res) => {
    try {
      //מביאה את כל המסמכים מהמסד נתונים
      const data = await note_modal.find();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  },
  addNote: async (req, res) => {
    try {
      const { note_txt, note_date, note_time } = req.body;

      //מייצרים אובייקט עם מאפיינים תואמים למידע שנמצא במסד הנתונים
      const new_note = new note_modal({
        note_txt,
        note_time,
        note_date,
      });

      //שמירה במסד נתונים
      await new_note.save();
      //החזרה ללקוח שהמידע נוסף בהצלחה
      res.status(200).json({
        message: "add note successfully",
        id: new_note.id
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "error in get note",
        error: error,
      });
    }
  },
  getNoteById: async (req, res) => {
    try {
      //שלחתי בקשה אל המסד נתונים להביא לי את הפתק לפי הID
      const note = await note_modal.findById(req.params.id);
      //מחזיר אל המשתמש בצד לקוח
      res.status(200).json(note)
    }
    catch (err) {
      console.log(err);
      res.status(500).json({
        message: "error in get note",
        error: err
      })
    }
  },
  deleteNote: async (req, res) => {
    try {
      //שלחתי בקשה אל המסד נתונים להביא לי את הפתק לפי הID
      await note_modal.findByIdAndDelete(req.params.id);
      //מחזיר אל המשתמש בצד לקוח
      res.status(200).json({
        success: true,
        message: "success to delete note"
      })
    }
    catch (err) {
      console.log(err);
      res.status(500).json({
        message: "error in delete note",
        error: err
      })
    }
  },
  updateNote: async (req, res) => {
    try {
      //לקבל את הID כדי לאתר את המסמך
      const id = req.params.id;
      //לקבל את המאפיניים שאני רוצה לשנות
      const data_to_update = {
        note_txt: req.body.note_txt
      }
      //פניתי אל המסד נתונים ומצאתי לפי ID ועדכנתי את הפתק לפי המאפיין שהעברתי
      const note_updated = await note_modal.findByIdAndUpdate(id, data_to_update);

      res.status(200).json({
        message: "success to update product",
        note_updated
      })
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "error in update note",
        error: err
      })
    }
  }
};