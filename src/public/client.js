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

const posts = document.querySelectorAll('#post');
if (posts) {
	for (const post of posts) {
		const upvoteBtn = post.querySelector('#upvote');
		const downvoteBtn = post.querySelector('#downvote');
		upvoteBtn.addEventListener('click', handleUpvoteClick);
		downvoteBtn.addEventListener('click', handleDownvoteClick);
	}
}

function handleUpvoteClick(event) {
	event.preventDefault();
	console.log('upvote clicked');

	/* Update UI */
	// Update color of button
	// Update score

	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/upvote');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.addEventListener('load', function() {
		if (xhr.status >= 300 && xhr.status < 400) {
			window.location = '/register';
		} else if (xhr.status >= 200 && xhr.status < 300) {
			console.log('response text', xhr.responseText);
			const response = JSON.parse(xhr.responseText);
			if (response.success) {
				const newScore = JSON.parse(xhr.responseText).score;
				const score = event.target.parentElement.querySelector('#score');
				score.textContent = newScore;
			} else {
				console.log('failure');
			}
		}
	});
	xhr.addEventListener('error', function(error) {
		console.log(error);
	});
	xhr.send(`postId=${this.querySelector('#objId').value}`);
}

function handleDownvoteClick(event) {
	event.preventDefault();
	console.log('downvote clicked');

	const xhr = new XMLHttpRequest();
	xhr.open('POST', '/downvote');
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.addEventListener('load', function() {
		if (xhr.status >= 300 && xhr.status < 400) {
			window.location = '/register';
		} else if (xhr.status >= 200 && xhr.status < 300) {
			const response = JSON.parse(xhr.responseText);
			if (response.success) {
				const newScore = JSON.parse(xhr.responseText).score;
				const score = event.target.parentElement.querySelector('#score');
				score.textContent = newScore;
			} else {
				console.log('failure');
			}
		}
	});
	xhr.addEventListener('error', function(error) {
		console.log(error);
	});
	xhr.send(`postId=${this.querySelector('#objId').value}`);
}

