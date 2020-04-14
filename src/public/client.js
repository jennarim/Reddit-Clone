// https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/

const allTextInput = document.querySelectorAll('.validate input[type="text"]');

allTextInput.forEach(input => {
	input.addEventListener('input', () => {
		input.setCustomValidity('');
		input.checkValidity();
	});

	input.addEventListener('invalid', (event) => {
		const field = event.target;
		const validityState = field.validity;

		if (validityState.valueMissing) {
			input.setCustomValidity('Enter the field.');
		}

		if (validityState.patternMismatch) {
			input.setCustomValidity('Alphanumeric only.');	
		} 

		if (validityState.tooShort) {
			input.setCustomValidity(`Too short. Should be at least ${field.getAttribute('minLength')} characters.`);
		}

		if (validityState.tooLong) {
			input.setCustomValidity(`Too short. Should be at most ${field.getAttribute('maxLength')} characters.`);	
		}

		if (validityState.typeMistmatch && field.type === 'url') {
			input.setCustomValidity('Please enter a url.');	
		}
	});
});


const postType = document.querySelector('#post-type');
if (postType) {
	const postBody = document.querySelector('#post-body');
	postType.addEventListener('change', (event) => {
		console.log('before:', postBody);
		if (postType.value === 'text') {
			postBody.type = 'text';
			postBody.placeholder = 'Enter post content here';
		} else if (postType.value === 'image') {
			postBody.type = 'url';
			postBody.placeholder = 'Enter url to image here';
		}
		console.log('after:', postBody);
	});
}