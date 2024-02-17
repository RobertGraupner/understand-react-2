import { useState } from 'react';
import styles from './Timer.module.css';
import { Button } from '../Button/Button';
import { useRef } from 'react';

function secondsToMinutes(seconds) {
	let minutes = Math.floor(seconds / 60);
	let remainingSeconds = seconds % 60;

	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (remainingSeconds < 10) {
		remainingSeconds = '0' + remainingSeconds;
	}

	return `${minutes}:${remainingSeconds}`;
}

export function Timer() {
	const [time, setTime] = useState(0);
	// useRef pozwala nam zapamiętać wartość, która będzie się zmieniać, ale nie będzie powodować rerendera komponentu
	// useRef jest używane do przechowywania wartości, które nie powodują zmiany wyglądu komponentu
	// wartosc jest aktualizowana na bieżąco
	const intervalRef = useRef(null);

	function handleStartClick() {
		// jeśli intervalRef.current jest null, uruchamiamy interwał. Rerendery nie będą powodowały ponownego uruchamiania interwału
		// useRef tworzy obiekt, ktory ma pole current, ktore moze przechowywac dowolna wartosc
		if (intervalRef.current === null) {
			intervalRef.current = setInterval(() => {
				setTime((prevTime) => prevTime + 1);
			}, 1000);
		}
	}

	function handleStopClick() {
		clearInterval(intervalRef.current);
		intervalRef.current = null;
	}

	return (
		<section className={styles.section}>
			<span className={styles.title}>Zacznij sesję!</span>
			<div className={styles.buttons}>
				<Button onClick={handleStartClick}>Start</Button>
				<Button onClick={handleStopClick}>Stop</Button>
			</div>
			<span className={styles.time}>{secondsToMinutes(time)}</span>
		</section>
	);
}
