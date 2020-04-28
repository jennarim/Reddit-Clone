// https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/
// https://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif
// http://shebang.mintern.net/foolproof-html-escaping-in-javascript/

// Add validation on all inputs
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

		if (validityState.patternMismatch && field.type === 'url') {
			// ensures link ends with jpeg,jpg,gif,png (doesn't guarantee it's a url)
			input.setCustomValidity('Link does not lead to an image.');
		} 

		if (validityState.tooShort) {
			input.setCustomValidity(`Too short. Should be at least ${field.getAttribute('minLength')} characters.`);
		}

		if (validityState.tooLong) {
			input.setCustomValidity(`Too short. Should be at most ${field.getAttribute('maxLength')} characters.`);	
		}

		if (validityState.typeMismatch && field.type === 'url') {
			// ensures link is a valid url
			input.setCustomValidity('Please enter a valid url.');	
		}
	});
});

// When creating a new post, change the form elements depending on post type
const postType = document.querySelector('#post-type');
if (postType) {
	const postBody = document.querySelector('#post-body');
	postType.addEventListener('change', function (event) {
		if (postType.value === 'text') {
			postBody.type = 'text';
			postBody.placeholder = 'Enter post content here';
		} else if (postType.value === 'image') {
			postBody.type = 'url';
			postBody.placeholder = 'Enter url to image here';
			postBody.pattern = '^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png|jpeg)$';
		}
	});
}

// When clicking outside the dropdown, close it (i.e. hide it)
const dropdownAll = document.getElementById('dropdown-all');
document.addEventListener('click', function(event) {
	const dropdownContent = document.getElementById('dropdown-content');
	if (dropdownAll.contains(event.target)) {
		dropdownContent.classList.remove('hidden');
	} else {
		dropdownContent.classList.add('hidden');
	}
});

// Safely escapes html to prevent XSS
function escapeHtml(str) {
	const div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
}

// Displays user's suggestion 
const categoryRequestForm = document.querySelector('#categoryRequestForm');
if (categoryRequestForm) {
	categoryRequestForm.addEventListener('submit', function (event) {
		event.preventDefault();
		const suggestion = escapeHtml(categoryRequestForm.childNodes[1].value);
		categoryRequestForm.textContent = `You suggested: ${suggestion}. Thank you for suggestion!`;
	});
}

// Updates score on the DOM based on response text
function updateScore(btn, text) {
	const scoreDiv = btn.parentElement.querySelector('#score');
	const newScore = JSON.parse(text).score;
	scoreDiv.textContent = newScore;
}

// Adds styling to upvote and downvote buttons depending on user's vote
function displayUI(response, upvoteBtn, downvoteBtn) {
	if (response.setUpvoteUI) {
		upvoteBtn.classList.add('text-red-600');
		downvoteBtn.classList.remove('text-blue-600');
	} else {
		upvoteBtn.classList.remove('text-red-600');
	}
	if (response.setDownvoteUI) {
		downvoteBtn.classList.add('text-blue-600');
		upvoteBtn.classList.remove('text-red-600');
	} else {
		downvoteBtn.classList.remove('text-blue-600');
	}
}

// AJAX that handles upvotes and downvotes (sends request to server and updates UI)
function post(url, handleLoad, handleError, bodyStr, event) {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.addEventListener('load', handleLoad.bind(this, xhr, event));
	xhr.addEventListener('error', handleError);
	xhr.send(bodyStr);
}

// Gets handler for either upvote button click or downvote button click
function getHandlerFor(vote) {
	function handleLoad(xhr, event) {
		const clickedBtn = event.target;
		if (xhr.status >= 300 && xhr.status < 400) {
			window.location = '/register';
		} else if (xhr.status >= 200 && xhr.status < 300) {
			console.log('response text', xhr.responseText);
			const response = JSON.parse(xhr.responseText);

			if (response.success) {
				updateScore(clickedBtn, xhr.responseText);
				let upvoteBtn, downvoteBtn;
				if (clickedBtn.id === 'upvote') {
					upvoteBtn = clickedBtn;
					downvoteBtn = upvoteBtn.parentElement.querySelector('#downvote');
				} else {
					downvoteBtn = clickedBtn;
					upvoteBtn = downvoteBtn.parentElement.querySelector('#upvote');
				}
				displayUI(response, upvoteBtn, downvoteBtn);
			} else {
				console.log('failure');
			}
		}
	}

	function handleError() {
		console.log(error);
	}

	if (vote === 'upvote') {
		return function(event) {
			event.stopPropagation();
			event.preventDefault();
			post('/upvote', handleLoad, handleError, `postId=${this.querySelector('#objId').value}`, event);
		}
	} else {
		return function(event) {
			event.stopPropagation();
			event.preventDefault();
			post('/downvote', handleLoad, handleError, `postId=${this.querySelector('#objId').value}`, event);
		}
	}
}

// Adds click listeners to all up/downvote buttons of every post
const posts = document.querySelectorAll('#post');
if (posts) {
	for (const post of posts) {
		const upvoteBtn = post.querySelector('#upvote'),
			  downvoteBtn = post.querySelector('#downvote');

		const handleUpvoteClick = getHandlerFor('upvote'),
			  handleDownvoteClick = getHandlerFor('downvote');

		upvoteBtn.addEventListener('click', handleUpvoteClick);
		downvoteBtn.addEventListener('click', handleDownvoteClick);
	}
}

