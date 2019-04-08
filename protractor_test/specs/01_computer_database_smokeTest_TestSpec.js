var computersHomePage = require('../pageObjects/computersHomePage.js');
var homePage = new computersHomePage(); // an instance for computersHomePage
var addComputerPage = require('../pageObjects/addComputerPage.js');
var addPage = new addComputerPage(); // an instance for addComputerPage
var editOrDeleteComputerPage = require('../pageObjects/editOrDeleteComputerPage.js');
var editPage = new editOrDeleteComputerPage(); // an instance for addComputerPage
var computerJSONObject = require('../constants/userDefinedConstants.json'); // to maintain all constant values in a centralized location.
var totalNumberOfFilteredComputers=0;
var numberOfComputersFromResultSection=0;
var lastComputerName="";
let lastPaginationIndex=0;
var EC=protractor.ExpectedConditions; // conditional check for visibility or presence or clickability of an element in the DOM

describe('Computers Database:Smoke validation',function(){
	/*In this smoke test, critical functionalities of the application is tested. For an instance, verification of page load, navigation to 
       add new computer page on clicking "Add a new computer" in home page and navigation to Edit/Delete a computer page on clicking any computer name 
	   in home page is validated here*/
	it('should launch the url and validate the critical functionalities of the application',function(){
		browser.get(computerJSONObject.homePageUrl);
		browser.manage().window().maximize();
		 
		// 1.validation to check the url is not getting redirected to any other page
		expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,'Failure Reason:It is redirecting to a different page');
		
		//2.validate header name is equal to "Play sample application — Computer database"
		homePage.getHomePageHeader().getText().then(function(homePageHeaderName){
			expect(homePageHeaderName).toBe(computerJSONObject.homePageHeaderValue,"Failure Reason:Title value is not same as expected");
		});
		
		//3.previous button should be disabled initially
		homePage.getDisabledPreviousButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Failure Reason:Previous button is enabled");
		});
		
		//4.Result section should be present on intial page load
		homePage.getResultsSection().isDisplayed().then(function(isDisplayed){
			expect(isDisplayed).toBe(true,"Failure Reason:Result section is missing in home page");
		});
		
		//5. Add a new Computer button should be displayed
		homePage.getAddNewComputerButton().isDisplayed().then(function(isDisplayed){
			expect(isDisplayed).toBe(true,"Failure Reason:Result section is missing in home page");
		});
		
		//6. Verify navigation to add new computer page occurs on clicking "Add a new phone button"
		homePage.getAddNewComputerButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.addPageUrl,"Failure Reason:Redirection to add computer page is failed");
			expect(addPage.getAddComputerHeaderValue().getText()).toBe("Add a computer");
		});
		
		//7.Verify navigation back to home page by clicking on cancel button in add computer page
		addPage.getCancelButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,'Failure Reason:Redirection to home page is failed');
		});
		
		//8.Verify successful navigation to edit/delete computer page on clicking any computer name is database entry
		homePage.getComputerNameFromTableByPosition(1).getAttribute('href').then(function(computerIndex){
			homePage.getComputerNameFromTableByPosition(1).click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerIndex,"Failure Reason:Redirection to add computer page is failed");
			});
		});
		
		//9.Verify navigation back to home page by clicking on cancel button in edit ot delete computer page
		editPage.getCancelButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,'Failure Reason:Redirection to home page is failed');
		});
		
	});
});
