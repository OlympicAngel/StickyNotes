const express = require("express");
const app = express();
//יצרנו אינטרקציה עם מודול שמטפל במשתנים סביבתיים
require('dotenv').config();
//מודול שדואג שכל בקשה שתשלח אל השרת תתקבל
var cors = require('cors');
//מייבא את הקובץ קונפגיורציה של המסד נתונים
const db = require('./db/mongoose');
db();
//ייבאנו את הראוטרים שמטפלים בבקשות שנשלחות אל השרת
const notes_router = require("./routes/notes");
const users_router = require("./routes/users");

app.use(express.json());
app.use(cors());
//העברנו את הבקשה במידל וואר שמטפל בבקשות מהשרת
app.use('/notes', notes_router);
app.use('/users', users_router);

app.use(express.static("./client"))

//ENV - ניגשנו אל משתנה סביבתי
const port = process.env.PORT;
app.listen(port, () => console.log(`server is running on port ${port}`))