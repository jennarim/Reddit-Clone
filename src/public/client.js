// https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/
// https://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif
// http://shebang.mintern.net/foolproof-html-escaping-in-javascript/

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

const dropdownAll = document.getElementById('dropdown-all');
document.addEventListener('click', function(event) {
	const dropdownContent = document.getElementById('dropdown-content');
	if (dropdownAll.contains(event.target)) {
		dropdownContent.classList.remove('hidden');
	} else {
		dropdownContent.classList.add('hidden');
	}
});

function escapeHtml(str) {
	const div = document.createElement('div');
	div.appendChild(document.createTextNode(str));
	return div.innerHTML;
}

const categoryRequestForm = document.querySelector('#categoryRequestForm');
if (categoryRequestForm) {
	categoryRequestForm.addEventListener('submit', function (event) {
		event.preventDefault();
		const suggestion = categoryRequestForm.childNodes[1].value;
		console.log(escapeHtml(suggestion));
		categoryRequestForm.textContent = `You suggested: ${suggestion}. Thank you for suggestion!`;
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

function post(url, handleLoad, handleError, bodyStr) {
	const xhr = new XMLHttpRequest();
	xhr.open('POST', url);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	xhr.addEventListener('load', handleLoad.bind(this, xhr));
	xhr.addEventListener('error', handleError);
	xhr.send(bodyStr);
}

function displayUI(response, upvoteBtn, downvoteBtn) {
	console.log(upvoteBtn);
	console.log(downvoteBtn);
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

function updateScore(btn, parse, text) {
	const scoreDiv = btn.parentElement.querySelector('#score');
	const newScore = parse(text).score;
	scoreDiv.textContent = newScore;
}

function handleUpvoteClick(event) {
	function handleLoad(xhr) {
		if (xhr.status >= 300 && xhr.status < 400) {
			window.location = '/register';
		} else if (xhr.status >= 200 && xhr.status < 300) {
			console.log('response text', xhr.responseText);
			const response = JSON.parse(xhr.responseText);

			if (response.success) {
				updateScore(event.target, JSON.parse, xhr.responseText);
				const upvoteBtn = event.target;
				const downvoteBtn = upvoteBtn.parentElement.querySelector('#downvote');
				displayUI(response, upvoteBtn, downvoteBtn);
			} else {
				console.log('failure');
			}
		}
	}

	function handleError() {
		console.log(error);
	}

	event.stopPropagation();
	event.preventDefault();
	console.log('upvote clicked');


	post('/upvote', handleLoad, handleError, `postId=${this.querySelector('#objId').value}`);
}

function handleDownvoteClick(event) {
	function handleLoad(xhr) {
		if (xhr.status >= 300 && xhr.status < 400) {
			window.location = '/register';
		} else if (xhr.status >= 200 && xhr.status < 300) {
			console.log('response text', xhr.responseText);
			const response = JSON.parse(xhr.responseText);

			if (response.success) {
				updateScore(event.target, JSON.parse, xhr.responseText);
				const downvoteBtn = event.target;
				const upvoteBtn = downvoteBtn.parentElement.querySelector('#upvote');
				displayUI(response, upvoteBtn, downvoteBtn);
			} else {
				console.log('failure');
			}
		}
	}

	function handleError() {
		console.log(error);
	}

	event.stopPropagation();
	event.preventDefault();
	console.log('downvote clicked');

	post('/downvote', handleLoad, handleError, `postId=${this.querySelector('#objId').value}`);
}

