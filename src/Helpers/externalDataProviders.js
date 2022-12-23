import axios from "axios";

export const loadPropertyRequiredDocumentsState = async (fullPropertyAddress) => {
	let propertyRequiredDocumentsState;
	await fetch(`http://localhost:8080/property/${fullPropertyAddress}`, {
		mode: 'cors',
	}).then((response) => response.json())
	.then((data) => {
		propertyRequiredDocumentsState = data;
	}).catch((error) => {
		console.error('Error:', error);
	});

	return propertyRequiredDocumentsState;
};