//Song Class: Represents a song
class Song {
    constructor(name, artist, genre) {
        this.name = name;
        this.artist = artist;
        this.genre = genre;
    }
}

// UI class: handle UI task

class UI {
    static displaySongs() {
        const songs = Store.getSongs();

        songs.forEach((song) => UI.addSongToList(song));
    }

    static addSongToList(song) {
        const list = document.querySelector('#song-list');

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${song.name}</td>
        <td>${song.artist}</td>
        <td>${song.genre}</td>
        <td><a href="#" class="btn btn-primary btn-sm delete">X</a></td>
        `;

        list.appendChild(row);

    }

    static deleteSong(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }




    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#song-form');
        container.insertBefore(div, form);

        //Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(),
            3000);
    }


    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#artist').value = '';
        document.querySelector('#genre').value = '';
    }
}

//Store class: Handles storage
class Store {
    static getSongs() {
        let songs;
        if (localStorage.getItem('songs') === null) {
            songs = [];
        } else {
            songs = JSON.parse(localStorage.getItem('songs'));
        }

        return songs;
    }

    static addSong(song) { 
        const songs = Store.getSongs();
        songs.push(song);
        localStorage.setItem('songs', JSON.stringify(songs));
    }

    static removeSong(genre) {
        const songs = Store.getSongs();

        songs.forEach((song, index) => {
            if (song.genre === genre) {
                songs.splice(index, 1);
            }
        });

        localStorage.setItem('songs', JSON.stringify(songs));
    }
}

// Event: Display Songs
document.addEventListener('DOMContentLoaded', UI.displaySongs);

//Event: Add a song 
document.querySelector('#song-form').addEventListener('submit', (e) => {
    //Prevent actual submit
    e.preventDefault();
    //Get form values
    const name = document.querySelector('#name').value;
    const artist = document.querySelector('#artist').value;
    const genre = document.querySelector('#genre').value;

    //validate
    if (name === '' || artist === '' || genre === '') {
        UI.showAlert('fill in the fields', 'danger');
    } else {
        //Instantiat song
        const song = new Song(name, artist, genre);

        //Add song to UI
        UI.addSongToList(song);

        //Add song to store 
        Store.addSong(song);

        //Success Message
        UI.showAlert('Song Added', 'success');

        //Clear Fields
        UI.clearFields();
    }


});
// Event: Remove a song
document.querySelector('#song-list').addEventListener('click', (e) => {


    // Remove song from UI
    UI.deleteSong(e.target);

    //show success message
    UI.showAlert('Song Removed', 'success');


    //Remove song from store
    Store.removeSong(e.target.parentElement.previousElementSibling.textContent);



})

