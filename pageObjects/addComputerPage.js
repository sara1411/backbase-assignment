'use strict';
(function(){

var addComputerPage = function(){
	
	this.getAddComputerHeaderValue = function(){
	  return element(by.id('main')).element(by.tagName('h1'));
	};
	
	this.getCancelButton = function(){
		return element(by.css('.actions')).element(by.tagName('a'));
	};
	
	this.getFilterByNameButton = function(){
		return element(by.id('searchsubmit'));
	};
	
	this.getComputerNameFromTableByIndex = function(){
		return element(by.css('[class="computers zebra-striped"]')).element(by.tagName('tbody')).all(by.tagName('tr')).get(0).all(by.tagName('td')).get(0);
	};
	
	this.getComputerNameArrayFromTable = function(){
		return element(by.css('[class="computers zebra-striped"]')).element(by.tagName('tbody')).all(by.tagName('tr'));
	};
	
	this.getComputerResultsCount = function(){
		return element(by.css('[class="computers zebra-striped"]')).element(by.tagName('tbody')).all(by.tagName('tr')).count();
	};
	
	this.getResultsSection = function(){
		return element(by.id('main')).element(by.tagName('h1'));
	};
	
	this.getPaginationCurrentSection = function(){
		return element(by.css('.current')).element(by.tagName('a'));
	};
	
	this.getDisabledPreviousButton = function(){
		return element(by.css('[class="prev disabled"]'));
	};
	
	this.getPreviousButton = function(){
		return element(by.css('.prev'));
	};
	
	
	this.getDisabledNextButton = function(){
		return element(by.css('[class="next disabled"]'));
	};
	
	this.getNextButton = function(){
		return element(by.css('.next'));
	};
	
	this.getAddNewComputerButton = function(){
		return element(by.id('add'));
	};
	
	this.getComputerDataBaseTable = function(){
		return element('[class="computers zebra-striped"]');
	};
};

module.exports = function(){
   return new addComputerPage();
};
}());