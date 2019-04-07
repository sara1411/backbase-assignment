'use strict';
(function(){

var computerHomePage = function(){
	
	this.getHomePageHeader = function(){
	  return element(by.css('.fill'));
	};
	
	this.getSearchBox = function(){
		return element(by.id('searchbox'));
	};
	
	this.getFilterByNameButton = function(){
		return element(by.id('searchsubmit'));
	};
	
	this.getComputerNameFromTableByPosition = function(position){
		return element(by.css('[class="computers zebra-striped"]')).element(by.tagName('tbody')).all(by.tagName('tr')).get(position-1).all(by.tagName('td')).get(0).element(by.tagName('a'));
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
   return new computerHomePage();
};
}());