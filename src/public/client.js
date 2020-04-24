// https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/

const allTextInput = document.querySelectorAll('.validate input[type="text"]');

allTextInput.forEach(input => {
	input.addEventListener('input', function () {
		input.setCustomValidity('');
		input.checkValidity();
	});

	input.addEventListener('invalid', function (event) {
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
	postType.addEventListener('change', function (event) {
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

const dropdownAll = document.getElementById('dropdown-all');
document.addEventListener('click', function(event) {
	const dropdownContent = document.getElementById('dropdown-content');
	if (dropdownAll.contains(event.target)) {
		console.log('clicked');
		dropdownContent.classList.remove('hidden');
	} else {
		dropdownContent.classList.add('hidden');
	}
});

const categoryRequestForm = document.querySelector('#categoryRequestForm');
if (categoryRequestForm) {
	categoryRequestForm.addEventListener('submit', function (event) {
		event.preventDefault();
		console.log(categoryRequestForm.childNodes[1]);
		const suggestion = categoryRequestForm.childNodes[0].value;
		categoryRequestForm.innerHTML = "Thank you for suggestion!";
	});
}

const upvoteButtons = document.querySelectorAll('#upvote'); 
if (upvoteButtons) {
	for (const btn of upvoteButtons) {
		if (btn.hasAttribute('data-upvoted')) {
			btn.classList.add('text-red-600');
		} else {
			btn.classList.remove('text-red-600');
		}
		btn.addEventListener('click', function (event) {
			// Indicate whether user upvoted
			btn.toggleAttribute('data-upvoted');

			// Change style accordingly
			btn.classList.toggle('text-red-600');

			const postId = btn.querySelector('#objId').value;
			console.log('clicked', postId);
			event.preventDefault();

			// Update post's list of upvoted users (either to add or remove current user)
			const xhr = new XMLHttpRequest();
			xhr.open('POST', '/upvote');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			xhr.addEventListener('load', function() {
				if (xhr.status === 302) {
					window.location = '/register';
				} else if (xhr.status >= 200 && xhr.status < 400) {
					const scoreElem = btn.parentElement.querySelector('#score');
					const origScore = parseInt(scoreElem.textContent.trim());
					let newScore;
					console.log(btn.hasAttribute('data-upvoted'));
					if (btn.hasAttribute('data-upvoted')) {
						console.log("upvote increased!");
						newScore = origScore+1;
					} else {
						// User revoked upvote
						console.log("upvote revoked!");
						newScore = origScore-1;
					}
					scoreElem.textContent = newScore;
				}
			});
			xhr.addEventListener('error', function(error) {
				console.log('there was an error');
				console.log(error);
			});
			xhr.send(`postId=${postId}&upvoted=${btn.hasAttribute('data-upvoted')}`);
		});
	}
}
