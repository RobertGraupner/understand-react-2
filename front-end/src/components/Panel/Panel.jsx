import { useState, useEffect, useMemo } from 'react';
import { List } from '../List/List';
import { Form } from '../Form/Form';
import { FilterButton } from '../FilterButton/FilterButton';
import { Info } from '../Info/Info';
import styles from './Panel.module.css';
import { getCategoryInfo } from '../../utils/getCategoryInfo';

// zapisaliśmy adres do API w stałej, żeby nie powtarzać go w wielu miejscach
const url = 'http://localhost:3000/words';

export function Panel({ onError }) {
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	// Przenosimy do App.jsx. Inne komponenty będą mogły korzystać z tego błędu, więc przenosimy go do najwyższego komponentu
	// const [error, setError] = useState(null);
	const [selectedCategory, setSelectedCategory] = useState(null);

	useEffect(() => {
		// jeśli category jest null, to zwracamy pusty string (bez parametru category) i pobieramy wszystkie słowa
		const params = selectedCategory ? `?category=${selectedCategory}` : '';
		fetch(`${url}${params}`)
			.then((res) => {
				if (res.ok) {
					return res.json();
				}
				throw new Error('Błąd ładowania danych!');
			})
			.then((res) => {
				setData(res);
				setIsLoading(false);
			})
			.catch((e) => {
				onError(e);
			});
	}, [selectedCategory, onError]);

	// useMemo pozwala nam zapamiętać wartość, która będzie się zmieniać tylko wtedy, gdy zmieni się selectedCategory
	// pozwala to na uniknięcie zbędnego wywoływania funkcji getCategoryInfo, gdy selectedCategory się nie zmienia (czyli wtedy, gdy wywołujemy funkcję getCategoryInfo z tą samą wartością, co poprzednio). Jeśli dodamy lub usuniemy słowo, to selectedCategory się nie zmienia, więc getCategoryInfo nie będzie wywoływane ponownie mimo zmiany w data
	const categoryInfo = useMemo(
		() => getCategoryInfo(selectedCategory),
		[selectedCategory]
	);

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
				// jeśli wybrano kategorię i nie zgadza się z kategorią nowego słowa, to nie dodajemy go do tablicy
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
				onError(e);
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
			<section className={styles.section}>
				<Info>{categoryInfo}</Info>
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
