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
	
	this.getDestroyedDateField = function(){
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
	}
};

module.exports = function(){
   return new editOrDeleteComputerPage();
};
}());