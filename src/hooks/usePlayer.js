import { useState, useCallback } from 'react';
import { genTetromio, TETROMINOS } from '../tetrominos';
import { STAGE_WIDTH, checkCollision } from '../gameHelper';

export const usePlayer = () => {
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS[0].shape,
        collided: false,

    });

    const updatePlayerPos = ({ x, y, collided }) => {
        setPlayer(prev => ({
            ...prev,
            pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
            collided,
        }))
    }
    const resetPlayer = useCallback(
        () => {
            setPlayer({
                pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
                tetromino: genTetromio().shape,
                collided: false,
            })
        },
        [],
    )
    const rotate = (matrix, dir) => {
        // Make all rows to become cols
        const rotateTetro = matrix.map((_, index) => {
            return matrix.map(col => col[index]);
        });
        // Reverse each row to get a rotated matrix
        if (dir > 0) return rotateTetro.map(row => row.reverse());
        return rotateTetro.reverse();
    }

    const playerRotate = (stage, dir) => {
        // Deep copy
        const clonedPlayer = JSON.parse(JSON.stringify(player));

        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const posX = clonedPlayer.pos.x;
        let offset = 1;
        // Check if can rote player
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = - (offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = posX;
                return;
            }
        }
        setPlayer(clonedPlayer);
    }
    return [player, updatePlayerPos, resetPlayer, playerRotate];
}