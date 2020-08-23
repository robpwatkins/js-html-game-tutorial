import React, { useState, useEffect } from 'react';
import styles from './engine.module.scss';
import { useEvent } from '../../hooks';

const BLOCKS = [
    140,
    250,
    390
];

const JUMP_VELOCITY = 1.4;

function CreateEngine(setState) {
    this.settings = {
        tile: 10
    };

    this.stage = 0;
    this.jump = false;
    this.direction = 'up';
    this.position = 0;
    this.max = this.settings.tile * 40;
    this.blocks = BLOCKS.map(b => (b * this.settings.tile));

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
            this.position += this.settings.tile;
        } else {
            this.position -= this.settings.tile;
        }
    }

    this.repaint = () => {
        this.stage += this.settings.tile;
        doJump();
        setState({ stage: this.stage, jump: this.position });
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

export default function Engine() {
    const [gameState, setGameState] = useState({ stage: 0, jump: 0 });
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
                    state => setGameState(state)
                )
            );
        }
    });

    return (
        <div
            className={styles.container}
        >
            <div 
                className={styles.stage}
                style={{
                    transform: `translate(${gameState.stage}px, 0px)`
                }}
            >
                <span
                    className={styles.character}
                    style={{
                        transform: `translate(-${gameState.stage}px, 0px)`
                    }}
                />
            </div>
        </div>
    );
}