import { Howl, Howler } from 'howler'
import { getMusicChunk } from './gameHelper'
const sound = new Howl({
    src: ['music.mp3'],
    sprite: {
        START_GAME: [3720.2, 3622.4],
        ROTATE: [2247.1, 80.7],
        GAME_OVER: [8127.6, 1143.7],
        CLEAR: [0, 767.5],
        FALL: [1255.8, 354.6],
        MOVE: [2908.8, 143.7]
    }
});

const playMusic = (type) => {
    sound.play(type);
}

export { playMusic };