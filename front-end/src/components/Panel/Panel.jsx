import { useState, useEffect } from 'react';
import { List } from '../List/List';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import styles from './Panel.module.css';

export function Panel() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		handleLoadData();
	}, []);

	function handleLoadData() {
		fetch('http://localhost:3000/words')
			.then((res) => res.json())
			.then((res) => {
				setData(res);
				setIsLoading(false);
			});
	}

	function handleFormSubmit(formData) {
		fetch('http://localhost:3000/words', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then((res) => res.json())
			.then((res) => {
				setData((prevData) => [...prevData, res]);
			});
	}

	function handleDeleteItem(id) {
		fetch(`http://localhost:3000/words/${id}`, {
			method: 'DELETE',
		})
			.then((res) => {
				// jeśli odpowiedź jest ok, to usuwamy element z tablicy
				if (res.ok) {
					setData((prevData) => prevData.filter((item) => item.id !== id));
				} else {
					throw new Error('Błąd sieci!');
				}
			})
			// catch łapie błędy z then, wywołuje się, gdy w then pojawi się błąd
			.catch((e) => {
				setError(e.message);
				// usuwamy komunikat o błędzie po 3 sekundach
				setTimeout(() => {
					setError(null);
				}, 3000);
			});
	}

	if (isLoading) {
		return <p>Ładowanie...</p>;
	}

	return (
		<>
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<section className={styles.section}>
				<Form onFormSubmit={handleFormSubmit} />
				<List data={data} onDeleteItem={handleDeleteItem} />
			</section>
		</>
	);
}
