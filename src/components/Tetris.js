import React, { useState } from 'react'

import Stage from './Stage'
import Display from './Display'
import StartButton from './StartButton'

import { StyledTetrisWrapper, StyledTetris } from '../components/styles/StyledTetris'

// custom hooks
import { useInterval } from '../hooks/useInterval'
import { useStage } from '../hooks/useStage'
import { usePlayer } from '../hooks/usePlayer'
import { useGameStatus } from '../hooks/useGameStatus';

import { createStage, checkCollision } from '../gameHelper'

import { playMusic } from '../music'

const Tetris = () => {
    const [dropTime, setDropTime] = useState(null);
    const [gameOver, setGameOver] = useState(false);

    const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
    const [stage, setStage, rowsCleared] = useStage(player, resetPlayer);

    const [score, setScore, rows, setRows, level, setLevel] = useGameStatus(rowsCleared);

    const movePlayer = dir => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0 })
        }
    }
    const startGame = () => {
        playMusic("START_GAME");
        setDropTime(1000 / (level + 1) + 200);
        setStage(createStage());
        resetPlayer();
        setGameOver(false);
        setLevel(0);
        setRows(0);
        setScore(0);
    }
    const drop = () => {
        // Increase level when play has cleared 10 rows
        if (rows > (level + 1) * 10) {
            setLevel(prev => prev + 1);
            // Increase speed
            setDropTime(1000 / (level + 1) + 200);
        }

        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false })
        } else {
            // game over
            if (player.pos.y < 1) {
                playMusic("GAME_OVER");
                setGameOver(true);
                setDropTime(null);
            }
            updatePlayerPos({ x: 0, y: 0, collided: true });
        }
    }
    const keyUp = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 40) {
                setDropTime(1000 / (level + 1) + 200);
            }
        }
    }
    const dropPlayer = () => {
        setDropTime(null);
        drop();
    }
    const move = ({ keyCode }) => {
        if (!gameOver) {
            if (keyCode === 37) {
                playMusic("MOVE");
                movePlayer(-1);
            }
            if (keyCode === 39) {
                playMusic("MOVE");
                movePlayer(1);
            }
            if (keyCode === 40) {
                playMusic("MOVE");
                dropPlayer();
            }
            if (keyCode === 38) {
                playMusic("ROTATE");
                playerRotate(stage, 1);
            }
        }
    }
    useInterval(() => {
        drop();
    }, dropTime)
    return (
        <>
            < StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={e => move(e)} onKeyUp={keyUp}>
                <StyledTetris>
                    <Stage stage={stage} />
                    <aside>
                        {gameOver ? (<Display gameOver={gameOver} text="Game over" />) : (
                            <div>
                                <Display text={`Score: ${score}`} />
                                <Display text={`Rows: ${rows}`} />
                                <Display text={`Level: ${level + 1}`} />

                            </div>
                        )}
                        <StartButton callback={startGame} />
                    </aside>
                </StyledTetris>
            </StyledTetrisWrapper >
        </>
    )
}

export default Tetris
