// https://css-tricks.com/form-validation-part-2-constraint-validation-api-javascript/
// https://stackoverflow.com/questions/169625/regex-to-check-if-valid-url-that-ends-in-jpg-png-or-gif

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
		console.log('before:', postBody);
		if (postType.value === 'text') {
			postBody.type = 'text';
			postBody.placeholder = 'Enter post content here';
		} else if (postType.value === 'image') {
			postBody.type = 'url';
			postBody.placeholder = 'Enter url to image here';
			postBody.pattern = '^https?://(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|gif|png|jpeg)$';
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

function vote(url) {

}

function handleUpvoteClick(event) {
	event.stopPropagation();
	event.preventDefault();
	console.log('upvote clicked');

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

				if (response.setUpvoteUI) {
				
				} else {
			
				}
				if (response.setDownvoteUI) {
		
				} else {
					
				}
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
			console.log('response text', xhr.responseText);
			const response = JSON.parse(xhr.responseText);
			if (response.success) {
				const newScore = JSON.parse(xhr.responseText).score;
				const score = event.target.parentElement.querySelector('#score');
				console.log('parentElement', event.target.parentElement);
				score.textContent = newScore;

				if (response.setUpvoteUI) {
					console.log(event.target.querySelector('span'));
					event.target.querySelector('span').classList.add('text-red-600');
				} else {
					console.log(event.target.querySelector('span'));
					event.target.querySelector('span').classList.remove('text-red-600');
				}
				if (response.setDownvoteUI) {
					event.target.querySelector('span').classList.add('text-blue-600');
				} else {
					event.target.querySelector('span').classList.remove('text-red-600');
				}
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

