import React, { useState, useEffect } from 'react';
import styles from './engine.module.scss';
import { useEvent } from '../../hooks';

function CreateEngine(setState) {
    this.settings = {
        tile: 100
    };

    this.stage = 0;

    this.repaint = () => {
        this.stage += this.settings.tile;
        setState({ stage: this.stage });
        return requestAnimationFrame(this.repaint);
    };

    this.repaint();
    return () => ({
        
    });
}

export default function Engine() {
    const [gameState, setGameState] = useState({ stage: 0 });
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
            <div className={styles.stage}
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