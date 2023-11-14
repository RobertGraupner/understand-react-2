import styles from './App.module.css';
import { Panel } from './components/Panel/Panel';
import { Button } from './components/Button/Button';
import { useState, useCallback } from 'react';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Timer } from './components/Timer/Timer';

function App() {
	const [isPanelShown, setIsPanelShown] = useState(true);
	const [error, setError] = useState(null);

	// funkcja, która wyświetla błąd i po 3 sekundach go usuwa. Wywołujemy ją w catch. Używamy useCallback, żeby nie tworzyć jej za każdym razem, gdy komponent się renderuje
	const handleError = useCallback((e) => {
		setError(e.message);
		setTimeout(() => {
			setError(null);
		}, 3000);
	}, []);

	return (
		<main className={styles.main}>
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<Button
				onClick={() => {
					setIsPanelShown(!isPanelShown);
				}}>
				{isPanelShown ? 'Schowaj panel' : 'Pokaż panel'}
			</Button>
			{isPanelShown && <Panel onError={handleError} />}
			<Timer />
		</main>
	);
}

export default App;
