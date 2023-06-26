const noteList = [];
const appendNotesTo = document.getElementById("notes"); //new notes will be added to this

//set current time as the min time for timedate input
/** @type {HTMLInputElement} */
const dateTimeInput = document.getElementById("dateTime_input")
const MessageInput = document.getElementById("note_input")
//format current time
const now = new Date().toISOString().split(".")[0]
dateTimeInput.min = now;
dateTimeInput.value = now;

/**
 * on new form submit
 * @param {SubmitEvent} event 
 */
function newNote(event) {
    event.preventDefault();
    //create new note;
    new Note(MessageInput.value, dateTimeInput.value)
    MessageInput.value = ""
    dateTimeInput.value = ""

}

class Note {
    constructor(body, date) {
        this.body = body;
        this.date = date;

        //create html note
        this.el = document.createElement("div");
        this.el.className = "note";
        this.el.innerHTML = `<span class="noteDelete">X</span>
        <p>${this.body}</p>
        <span class="noteDate">${new Date(this.date).toLocaleString()}</span>`;

        //hook remove note event
        this.el.querySelector("span.noteDelete").addEventListener("click", this.deleteNote.bind(this), { "once": true })

        appendNotesTo.appendChild(this.el); //add to html dom

        //add & save note array
        noteList.push(this);
        localStorage.noteList = JSON.stringify(noteList);
    }

    deleteNote() {
        this.el.remove();//remove html content
        //remove from global list 
        noteList.find((aNote, index) => {
            const isCurrentNote = aNote == this; //match current note
            if (isCurrentNote) //if current
                noteList.splice(index, 1) //remove from array
            return isCurrentNote; //return true if current prevent iterating over other items
        });
        localStorage.noteList = JSON.stringify(noteList);
    }
}

//load notes from memory
{
    //if no note in memory
    if (localStorage.noteList) {
        const memoNoteList = JSON.parse(localStorage.noteList); //gets & parse list
        //for each jsoned note convert to real note
        memoNoteList.forEach(json_note => {
            new Note(json_note.body, json_note.date)
        });
    }
}