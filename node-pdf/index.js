const pdf = require('html-pdf');
const Handlebars = require('handlebars');
const handleError = require('cli-error-handler');

module.exports = (doc, options) => {
	return new Promise((resolve, reject) => {
		if (!doc || !doc.html || !doc.data) {
			reject(new Error('Some, or all, options are missing.'));
		}
		if (doc.type === 'pdf') {
			
			// Create PDF from html template generated by handlebars
			// Output will be PDF file
			let html = Handlebars.compile(doc.html)(doc.data);
			let filepath = doc.path;
			pdf.create(html).toFile(filepath, function (err, res) {
				if (err) handleError('error in creating file', err);
				console.log('file generated:', res.filename);
				resolve(res);
			});
		} else {
			reject('only pdf file type supported');
		}
	});
};