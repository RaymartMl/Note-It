class Note {
  constructor(title, body) {
    this.id = guidGenerator();
    this.title = title;
    this.body = body;
  }
}

class Store {
  static getNotes() {
    let notes;
    if (localStorage.getItem("notes") === null) {
      notes = [];
    } else {
      notes = JSON.parse(localStorage.getItem("notes"));
    }

    return notes;
  }

  static addNote(note) {
    const notes = Store.getNotes();
    notes.unshift(note);
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  static removeNote(id) {
    console.log(id);
    const notes = Store.getNotes();

    notes.forEach((note, index) => {
      if (note.id === id) {
        notes.splice(index, 1);
      }
    });

    localStorage.setItem("notes", JSON.stringify(notes));
  }
}

class UI {
  static displayNotes() {
    const notes = Store.getNotes();
    notes.forEach((note) => UI.addNoteToList(note));
  }

  static addNoteToList(note) {
    const list = document.querySelector("#note-list");
    const noteDiv = document.createElement("div");
    noteDiv.classList.add("note-info");

    noteDiv.innerHTML = `
    <div style="display: none;">${note.id}</div>
        <svg
          class="note-icon delete"
          stroke="currentColor"
          fill="none"
          stroke-width="2"
          viewBox="0 0 24 24"
          stroke-linecap="round"
          stroke-linejoin="round"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path
            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          ></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>

        <div class="note-title">${note.title}</div>

        <textarea readonly class="note-body">${note.body}</textarea>
        <!-- modal here -->
    `;

    list.appendChild(noteDiv);
  }

  static deleteNote(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${className}`;
    alert.appendChild(document.createTextNode(message));
    const container = document.querySelector(".alert-group");
    container.appendChild(alert);

    // Vanish in 2 seconds
    setTimeout(() => document.querySelector(".alert").remove(), 2000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#body").value = "";
  }
  here;
}

// Event: Display Notes
document.addEventListener("DOMContentLoaded", UI.displayNotes);

// Event: Add a Note
document.querySelector("#note-form").addEventListener("submit", (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;

  // Validate
  if (title === "" || body === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instantiate note
    const note = new Note(title, body);

    // Add Note to UI
    UI.addNoteToList(note);

    // Add Note to store
    Store.addNote(note);

    // Show success message
    UI.showAlert("Note Added", "success");

    // Clear fields
    UI.clearFields();
  }
});

// Event: Remove a Note
document.querySelector("#note-list").addEventListener("click", (e) => {
  // Remove Note from UI
  if (!e.target.classList.contains("delete")) return;
  UI.deleteNote(e.target);

  // Show success message
  UI.showAlert("Note Removed", "success");

  // Remove Note from store
  Store.removeNote(e.target.previousElementSibling.textContent);
});

function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}
