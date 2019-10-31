import { useState, useEffect } from 'react';
import { createStage } from '../gameHelper';
import { usePlayer, player } from './usePlayer';
import { playMusic } from '../music'

export const useStage = (player, resetPlayer) => {
    const [stage, setStage] = useState(createStage());
    const [rowCleared, setRowCleared] = useState(0);
    useEffect(() => {
        setRowCleared(0);

        const sweepRows = newStage => {

            return newStage.reduce((ack, row) => {
                if (row.findIndex(cell => cell[0] === 0) === -1) {
                    setRowCleared(prev => prev + 1);
                    playMusic("CLEAR");
                    ack.unshift(new Array(newStage[0].length).fill([0, 'clear']));
                    return ack;
                }
                ack.push(row);
                return ack;
            }, []);
        }
        const updateStage = (prevStage) => {
            // first flush the stage
            const newStage = prevStage.map(row => {
                return row.map(cell => (cell[1] === 'clear' ? [0, 'clear'] : cell))
            })

            // then draw the tetromino
            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        newStage[y + player.pos.y][x + player.pos.x] = [
                            value,
                            `${player.collided ? 'merged' : 'clear'}`
                        ];
                    }
                });
            });
            // check if we collided
            if (player.collided) {
                resetPlayer();

                const finalStage = sweepRows(newStage);

                return finalStage;
            }
            return newStage;
        };
        setStage(prev => updateStage(prev));
    }, [player, resetPlayer, rowCleared])


    return [stage, setStage, rowCleared];
}