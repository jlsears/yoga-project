'use strict';

$(document).ready(function() {

	var button = $("#findYoga");

	var Crawler = require("js-crawler");

	function gettingYoga(e) {
		e.preventDefault();

		new Crawler().configure({depth: 3}).crawl("http://www.steadfastandtrueyoga.com", function onSuccess(page) {
			console.log("This page: " + page.url);
		});
	};
	button.click(gettingYoga);
});