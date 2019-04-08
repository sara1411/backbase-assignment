'use strict';
(function(){

var editOrDeleteComputerPage = function(){
	
	this.getAddComputerHeaderValue = function(){
	  return element(by.id('main')).element(by.tagName('h1'));
	};
	
	this.getCancelButton = function(){
		return element(by.css('.actions')).element(by.tagName('a'));
	};
	
	this.getComputerNameField = function(){
		return element(by.id('name'));
	};
	
	this.getIntroducedDateField = function(){
		return element(by.id('introduced'));
	};
	
	this.getDiscontinuedDateField = function(){
		return element(by.id('discontinued'));
	};
	
	this.selectAllCompany = function(){
		return element.all(by.tagName('option'));
	};
	
	this.selectACompany = function(index){
		return element.all(by.tagName('option')).get(index);
	};
	
	this.getSaveThisComputerButton = function(){
		return element.all(by.css('input[type="submit"]')).get(0);
	};
	
	this.getDeleteThisComputerButton = function(){
		return element(by.css('[value="Delete this computer"]'));
	};
	
	this.getCompanyNameValue = function(){
		return element(by.id('company'));
	};
	
	this.computerNameSectionError = function(){
		return element(by.css('[for="name"]')).element(by.xpath('..'))
	};
	
	this.introducedDateSectionError = function(){
		return element(by.css('[for="introduced"]')).element(by.xpath('..'))
	};
	
	this.discontinuedDateSectionError = function(){
		return element(by.css('[for="discontinued"]')).element(by.xpath('..'))
	};
	
};

module.exports = function(){
   return new editOrDeleteComputerPage();
};
}());