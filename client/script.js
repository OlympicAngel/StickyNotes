const api = "/notes";
let noteList = [];
const appendNotesTo = document.getElementById("notes"); //new notes will be added to this

//set current time as the min time for timedate input
/** @type {HTMLDateT} */
const dateTimeInput = document.getElementById("dateTime_input")
const MessageInput = document.getElementById("note_input")
//format current time
dateTimeInput.value = currentDateTime();
dateTimeInput.min = currentDateTime();

getNotesFromDB();
/**
 * Get  data from DB & create for each note in arr a Note instance
 */
async function getNotesFromDB() {
    const res = await fetch(api);
    const noteData = await res.json();

    noteData.forEach(obj => {
        new Note(obj._id,
            obj.note_txt,
            obj.note_date + " " + obj.note_time)
    });
}

/**
 * on new form submit
 * @param {SubmitEvent} event 
 */
function newNote(event) {
    event.preventDefault();
    const dateVal = dateTimeInput.value;

    //create new note;
    let newNote = new Note(Math.random(), MessageInput.value, dateTimeInput.value, true)
    MessageInput.value = "" //reset textarea input


    fetch(api + "/add_note", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            note_txt: MessageInput.value,
            note_date: dateVal.split(/ |T/)[0],
            note_time: dateVal.split(/ |T/)[1]
        })
    }).then(r => r.json().then(j => newNote.id = j.id)) //get id from response and update the new created note from its current rnd id
        .catch(error => console.log(error));

    //resets current time
    dateTimeInput.value = currentDateTime();
    dateTimeInput.min = currentDateTime();
}

function searchNotes(e) {
    const value = e.target.value.toLowerCase();
    noteList.forEach(note => {
        if (value == "") {
            note.show();
            return;
        }
        note[note.body.toLowerCase().includes(value) ? "show" : "hide"]()
    })
}

function currentDateTime() {
    return new Date().toISOString().split(":").slice(0, 2).join(":");
}

class Note {
    constructor(id, body, date) {
        this.id = id;
        this.body = body;
        this.date = date;

        //create html note
        this.el = document.createElement("div");
        this.el.innerHTML = `<input type=checkbox name="noteSelection" id="${id}">
        <label class="note" for="${id}">
            <span class="noteDelete">X</span>
            <p contenteditable="true">${this.body}</p>
            <span class="noteDate">${new Date(this.date).toLocaleString()}</span>
        </label>`;

        //hook remove note event
        this.el.querySelector("span.noteDelete").addEventListener("click", this.deleteNote.bind(this), { "once": true })
        const p = this.el.querySelector(".note p");
        p.addEventListener("click", this.p_click.bind(this))
        p.addEventListener("blur", () => {
            this.updateNote(p.innerText);
        })


        appendNotesTo.appendChild(this.el); //add to html dom

        //add & save note array
        noteList.push(this);
    }

    updateNote(newContent) {
        fetch(api + '/update_note/' + this.id,
            {
                method: "put",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ note_txt: newContent })
            }).catch(error => console.log(error));

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

        fetch(api + '/delete_note/' + this.id, { method: "delete" }).catch(error => console.log(error));
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