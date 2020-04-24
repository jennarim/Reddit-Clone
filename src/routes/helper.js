function ensureLoggedIn(req, res, next) {
	if (req.user) {
		next();
	} else {
		res.redirect(302, '/register');
	}
}

function ensureLoggedOut(req, res, next) {
	if (!req.user) {
		next();
	} else {
		res.redirect('/');
	}
}

function comparePostsByDate(a, b) {
	if (a.createdAt.getTime() < b.createdAt.getTime()) {
		return -1;
	} else if  (a.createdAt.getTime() > b.createdAt.getTime()) {
		return 1;
	} else {
		return 0;
	}
}

function handleError(res, path, err) {
	console.log(err);
	res.render(path, {err});
}

function log(name, content) {
	console.log(name, ":");
	console.log(content);
	console.log("##########");
}

module.exports = {
	ensureLoggedIn,
	ensureLoggedOut,
	comparePostsByDate,
	handleError,
	log
};