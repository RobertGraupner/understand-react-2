import { useState, useEffect } from 'react';
import { List } from '../List/List';
import { Form } from '../Form/Form';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { FilterButton } from '../FilterButton/FilterButton';
import styles from './Panel.module.css';

// zapisaliśmy adres do API w zmiennej, żeby nie powtarzać go w wielu miejscach
const url = 'http://localhost:3000/words';

export function Panel() {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		// jeśli category jest null, to zwracamy pusty string (bez parametru category) i pobieramy wszystkie słowa
		const params = selectedCategory ? `?category=${selectedCategory}` : '';
		fetch(`${url}${params}`)
			.then((res) => res.json())
			.then((res) => {
				setData(res);
				setIsLoading(false);
			});
	}, [selectedCategory]);

	// nie potrzebujemy już tej funkcji, w useEffect mamy zależność od selectedCategory
	// function handleLoadData() {
	// 	fetch('http://localhost:3000/words')
	// 		.then((res) => res.json())
	// 		.then((res) => {
	// 			setData(res);
	// 			setIsLoading(false);
	// 		});
	// }

	function handleFormSubmit(formData) {
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		})
			.then((res) => res.json())
			.then((res) => {
				if (!selectedCategory || selectedCategory === res.category) {
					setData((prevData) => [...prevData, res]);
				}
			});
	}

	function handleDeleteItem(id) {
		fetch(`${url}/${id}`, {
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

	function handleFilterButtonClick(category) {
		// ustawiamy wybraną kategorię
		setSelectedCategory(category);
	}

	if (isLoading) {
		return <p>Ładowanie...</p>;
	}

	return (
		<>
			{error && <ErrorMessage>{error}</ErrorMessage>}
			<section className={styles.section}>
				<Form onFormSubmit={handleFormSubmit} />
				<div className={styles.filters}>
					<FilterButton
						active={selectedCategory === null}
						onClick={() => handleFilterButtonClick(null)}>
						Wszystkie
					</FilterButton>
					<FilterButton
						active={selectedCategory === 'verb'}
						onClick={() => handleFilterButtonClick('verb')}>
						Czasowniki
					</FilterButton>
					<FilterButton
						active={selectedCategory === 'noun'}
						onClick={() => handleFilterButtonClick('noun')}>
						Rzeczownik
					</FilterButton>
				</div>
				<List data={data} onDeleteItem={handleDeleteItem} />
			</section>
		</>
	);
}
