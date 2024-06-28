// Buscar dados no JSON 
var overlay = document.querySelector('.overlay');

fetch('json/dados.json')
    .then(response => response.json())
    .then(data => {
        data.notes.forEach(note => {
            renderizarNota(note.id, note.title, note.text, note.controls, note.labels, note.archived);
        });
        resizeAllNotesHeight();
        
        addEventListenersToNotes();
    });

function getRandomNumber() {
    return Math.floor(Math.random() * 4) + 1;
}

const colorClasses = {
    1: 'notes-color-one',
    2: 'notes-color-two',
    3: 'notes-color-three',
    4: 'notes-color-four',
}

// Renderizar a ntao
const renderizarNota = (id, title, text, controls, labels = [], archived = false) => {
    const notaHtml = document.createElement('div');
    notaHtml.classList.add('notes');
    notaHtml.classList.add(colorClasses[getRandomNumber()]);
    notaHtml.setAttribute('data-labels', labels.join(','));
    notaHtml.setAttribute('data-archived', archived);
    notaHtml.addEventListener('click', (e) => {
        overlay.style.display = 'block';
        if (Array.from(e.target.classList).indexOf('notes') === -1) {
            e.target.closest('.notes').classList.add('expandida');
        } else {
            e.target.classList.add('expandida');
        }
        addEventListenersToControls(e.target.closest('.notes') || e.target);
    });

    const notesContent = document.createElement('div');
    notesContent.classList.add('notes-content');

    const idInput = document.createElement('input');
    idInput.setAttribute('type', 'hidden');
    idInput.classList.add('id-nota');
    idInput.value = id;

    const titleElement = document.createElement('h1');
    titleElement.classList.add('notes-title');
    titleElement.textContent = title;

    const textElement = document.createElement('p');
    textElement.classList.add('notes-text');
    textElement.textContent = text;

    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('notes-controls');

    controls.forEach(control => {
        const controlButton = document.createElement('button');
        controlButton.textContent = control;
        controlButton.classList.add('btn-notes-fechar');
        controlsContainer.appendChild(controlButton);
    });

    const archiveButton = document.createElement('button');
    archiveButton.textContent = 'Arquivar';
    archiveButton.classList.add('btn-notes-archive');
    archiveButton.addEventListener('click', (e) => {
        e.stopPropagation();
        archiveNote(id);
    });
    controlsContainer.appendChild(archiveButton);

    notaHtml.appendChild(notesContent);
    notesContent.appendChild(idInput);
    notesContent.appendChild(titleElement);
    notesContent.appendChild(textElement);
    notesContent.appendChild(controlsContainer);

    document.querySelector('.container-notes').appendChild(notaHtml);
}

// Arquivar a nota
const archiveNote = (id) => {
    const note = document.querySelector(`.notes .id-nota[value="${id}"]`).closest('.notes');
    note.setAttribute('data-archived', true);
    note.style.display = 'none';
}

// Função para adicionar eventos aos botões de controle
const addEventListenersToControls = (note) => {
    const closeButton = note.querySelectorAll(".btn-notes-fechar");

    closeButton.forEach(button => {
        button.addEventListener("click", function(e) {
            e.stopPropagation();
            var expandedNote = document.querySelector(".notes.expandida");

            if (expandedNote) {
                expandedNote.classList.remove("expandida"); 
                overlay.style.display = 'none';

                var controls = expandedNote.querySelector(".notes-controls");
                var content = expandedNote.querySelector(".notes-content");

                controls.classList.add("controls-off");
                controls.classList.remove("controls-on");
                setTimeout(() => {
                    resizeAllNotesHeight();
                }, 500);
            }
        });
    });
}

// Função para adicionar evento às notas
const addEventListenersToNotes = () => {
    var notes = document.querySelectorAll(".notes");

    notes.forEach(note => {
        note.addEventListener("mouseenter", () => {
            var controls = note.querySelector(".notes-controls");
            if (controls && !note.classList.contains('expandida')) {
                controls.classList.add("controls-on");
                controls.classList.remove("controls-off");
                setTimeout(() => {
                    resizeAllNotesHeight();
                }, 500);
            }
        });

        note.addEventListener("mouseleave", () => {
            var controls = note.querySelector(".notes-controls");
            if (controls && !note.classList.contains('expandida')) {
                controls.classList.add("controls-off");
                controls.classList.remove("controls-on");
                setTimeout(() => {
                    resizeAllNotesHeight();
                }, 500);
            }
        });
        addEventListenersToControls(note);
    });

    if (overlay) {             
        overlay.addEventListener('click', () => {
            overlay.style.display = 'none';
            notes.forEach(note => {
                note.classList.remove('expandida');
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    addEventListenersToNotes();
});