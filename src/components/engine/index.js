import React, { useState, useEffect } from 'react';
import styles from './engine.module.scss';
import { useEvent } from '../../hooks';

const BLOCKS = [
    140,
    250,
    390
];

const charWidth = 100;
const charHeight = 100;

const blockWidth = 80;
const blockHeight = 200;




const JUMP_VELOCITY = 1.4;

function CreateEngine(setState) {
    this.settings = {
        tile: 10
    };


    this.game = 'start';
    this.stage = 0;
    this.jump = false;
    this.direction = 'up';
    this.position = 0;
    this.max = this.settings.tile * 40;
    this.blocks = BLOCKS.map(b => (b * this.settings.tile));

    const checkBlocks = () => {
        const charXPos = this.stage + 200;
        const charYPos = this.position;


        if (charXPos > this.blocks[this.blocks.length - 1] + 200 && this.position <= 0) {
            this.game = 'win';
        }

        this.blocks.forEach((block) => {

            if (
                charXPos + charWidth >= block
                && charYPos <= blockHeight
                && charYPos + charHeight >= 0
                && charXPos <= block + blockWidth
            ) {
                this.game = 'fail';
            }
        });
    };

    const doJump = () => {

        if (!this.jump) {
            this.position = 0;
            this.direction = 'up';
            return;
        }


        if (this.direction === 'down' && this.position <= 0) {
            this.jump = false;
            this.position = 0;
            this.direction = 'up';
            return;
        }


        if (this.position >= this.max) this.direction = 'down';


        if (this.direction === 'up') {
            this.position += (this.settings.tile * JUMP_VELOCITY);
        } else {
            this.position -= (this.settings.tile * JUMP_VELOCITY);
        }
    }


    this.repaint = () => {

        this.stage += this.settings.tile;


        checkBlocks();


        doJump();


        setState({ 
            stage: this.stage, 
            jump: this.position,
            blocks: this.blocks,
            status: this.game
        });


        if (this.game !== 'start') {

            this.game = 'start';
            this.stage = 0;
            this.jump = false;
            this.direction = 'up';
            this.position = 0;
            return null;
        }


        return requestAnimationFrame(this.repaint);
    };


    this.repaint();
    return () => ({
        jump: () => {

            if (!this.jump) {
                this.jump = true;
            }
        }
    });
}

const initialState = {
    stage: 0,
    jump: 0,
    blocks: [],
    status: 'start'
};

export default function Engine() {

    const [gameState, setGameState] = useState(initialState);


    const [start, setStart] = useState(false);


    const [started, setStarted] = useState(false);


    const [engine, setEngine] = useState(null);

    const handleKeyPress = (e) => {

        if (e.key === ' ') {

            if (!started && !start) {
                setStart(true);
            }


            if (engine === null) return;


            engine.jump();
        }
    };

    useEvent('keyup', handleKeyPress);

    useEffect(() => {
        if (start) {
            setStarted(true);
            setStart(false);

            setEngine(
                new CreateEngine(

                    state => setGameState(state),
            ),
        );
    }

    if (gameState.status === 'fail' && started) {
        setStarted(false);
        alert('You lost! Try again?');
        setGameState(initialState);
        setStart(true);
    }

    if (gameState.status === 'win' && started) {
        setStarted(false);
        alert('You won! Play again?');
        setGameState(initialState);
        setStart(true);
    }
});

    return (
        <div
            className={styles.container}
        >
            <div 
                className={styles.stage}
                style={{
                    transform: `translate(-${gameState.stage}px, 0px)`
                }}
            >
                <span
                    className={styles.character}
                    style={{
                        transform: `translate(${gameState.stage + 200}px, -${gameState.jump}px)`,
                        height: charHeight,
                        width: charWidth
                    }}
                />
                {
                    gameState.blocks.map(
                        block => (
                            <span
                                className={styles.block}
                                key={block}
                                style={{
                                    transform: `translate(${block}px, 0px)`,
                                    height: blockHeight,
                                    width: blockWidth
                                }}
                            />
                        )
                    )
                }
            </div>
        </div>
    );
}