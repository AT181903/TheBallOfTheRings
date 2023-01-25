import {Engine} from "./engine/engine.js";
import {ShadersManager} from "./engine/shadersManager.js";

// Engine
let engine = new Engine("canvas");

// Add gui elements
document.getElementById("gui").append(ShadersManager.generateGuiControls().domElement)

// Sound effects
const bouncing = document.getElementById("bouncing");
const soundtracks = document.getElementById("soundtracks");
const mainThemeSrc = "sound_effects/main_theme.mp3";
const rohanSrc = "sound_effects/rohan.mp3";
const theShireSrc = "sound_effects/the_Shire.mp3";

// Counter
let counter;
const counterElem = document.querySelector('#counter');

const startTimerButton = document.getElementById('startTimerButton');
startTimerButton.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('start'))
});

function changeSoundtracks(src) {
    if (shouldMusicBePlayed()) {
        soundtracks.src = src
        soundtracks.play();
    }
}

window.addEventListener('hit', async (e) => {
    if (shouldMusicBePlayed()) {
        bouncing.play()
    }
})

window.addEventListener('point', async (e) => {
    counter++;
    console.log(counter)
    counterElem.textContent = counter;

    switch (counter) {
        case 5:
            changeSoundtracks(mainThemeSrc)
            break;
        case 10:
            changeSoundtracks(rohanSrc)
            break;
    }
})

window.addEventListener('game_over', async (e) => {
    if (document.getElementById('stopOnFloorReached').checked) {
        startTimerButton.value = "Start"
        engine.stop()
        alert("Il tuo punteggio è " + counter)
        counter = 0
    } else {
        counter--

    }

    counterElem.textContent = counter;
})

// FPS Listener
const fpsDomElement = document.getElementById('fpsID');
fpsDomElement.addEventListener("change", () => {
    engine.setFPS(fpsDomElement.value)
});

window.addEventListener('start', async (e) => {
    restartGame()
})

function restartGame(){
    startTimerButton.value = "Restart"

    engine.stop()

    counter = 0;

    counterElem.textContent = counter;

    engine.start(fpsDomElement.value)

    changeSoundtracks(theShireSrc)
}

const playMusic = document.getElementById('playMusic')

function shouldMusicBePlayed() {
    return playMusic.checked
}

playMusic.addEventListener('change', () => {
    if (shouldMusicBePlayed()) {
        changeSoundtracks(theShireSrc)
    } else {
        soundtracks.pause()
    }
});

// Hidden Menu
let pressTimer;

$("#gameTitle").mouseup(function(){
    clearTimeout(pressTimer);
    return false;
}).mousedown(function(){
    pressTimer = window.setTimeout(() => {
        engine.toggleDynamicSpeeds()
    },1000);
    return false;
});