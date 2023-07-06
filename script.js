const noteList = [];
const appendNotesTo = document.getElementById("notes"); //new notes will be added to this

//set current time as the min time for timedate input
/** @type {HTMLDateT} */
const dateTimeInput = document.getElementById("dateTime_input")
const MessageInput = document.getElementById("note_input")
//format current time
dateTimeInput.value = currentDateTime();
dateTimeInput.min = currentDateTime();

/**
 * on new form submit
 * @param {SubmitEvent} event 
 */
function newNote(event) {
    event.preventDefault();
    //create new note;
    new Note(MessageInput.value, dateTimeInput.value)
    MessageInput.value = "" //reset textarea input

    //resets current time
    dateTimeInput.value = currentDateTime();
    dateTimeInput.min = currentDateTime();
}

function searchNotes(e) {
    const value = e.target.value;
    noteList.forEach(note => {
        if (value == "") {
            note.show();
            return;
        }
        note[note.body.includes(value) ? "show" : "hide"]()
    })
}

function currentDateTime() {
    return new Date().toISOString().split(":").slice(0, 2).join(":");
}

class Note {
    constructor(body, date) {
        this.body = body;
        this.date = date;
        const rndID = (Math.random() + Math.random()).toString(20).replace(".", "");

        //create html note
        this.el = document.createElement("div");
        this.el.innerHTML = `<input type=checkbox name="noteSelection" id="${rndID}">
        <label class="note" for="${rndID}">
            <span class="noteDelete">X</span>
            <p contenteditable="true">${this.body}</p>
            <span class="noteDate">${new Date(this.date).toLocaleString()}</span>
        </label>`;

        //hook remove note event
        this.el.querySelector("span.noteDelete").addEventListener("click", this.deleteNote.bind(this), { "once": true })
        const p = this.el.querySelector(".note p");
        p.addEventListener("click", this.p_click.bind(this))
        p.addEventListener("blur", () => {
            this.body = p.innerText;
            localStorage.noteList = JSON.stringify(noteList);
        })


        appendNotesTo.appendChild(this.el); //add to html dom

        //add & save note array
        noteList.push(this);
        localStorage.noteList = JSON.stringify(noteList);
    }

    deleteNote() {
        this.el.remove();//remove html content
        //remove from global list 
        noteList.find((aNote, index) => {
            const isCurrentNote = (aNote == this); //match current note
            if (isCurrentNote) //if current
                noteList.splice(index, 1) //remove from array
            return isCurrentNote; //return true if current prevent iterating over other items
        });
        localStorage.noteList = JSON.stringify(noteList);
    }

    p_click(e) {
        const checkbox = this.el.querySelector("input[name=noteSelection]");
        const isFullscreen = checkbox.checked;
        if (isFullscreen) {
            e.preventDefault();

        }
    }

    hide() {
        this.el.classList.add("hidden")
    }

    show() {
        this.el.classList.remove("hidden")
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