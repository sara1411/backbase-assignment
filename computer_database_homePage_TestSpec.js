var computersHomePage = require('./pageObjects/computersHomePage.js');
var homePage = new computersHomePage(); // an instance for computersHomePage
var addComputerPage = require('./pageObjects/addComputerPage.js');
var addPage = new addComputerPage(); // an instance for addComputerPage
var computerJSONObject = require('./constants/userDefinedConstants.json'); // to maintain all constant values in a centralized location.
var totalNumberOfFilteredComputers=0;
var numberOfComputersFromResultSection=0;
var EC=protractor.ExpectedConditions; // conditional check for visibility or presence or clickability of an element in the DOM

describe('Computers Database:Smoke validation',function(){
	/*In this smoke test, critical functionalities of the application is tested. For an instance, verification of page load, navigation to 
       add new computer page on clicking "Add a new computer" in home page and navigation to Edit/Delete a computer page on clicking any computer name 
	   in home page is validated here*/
	it('should launch the url and validate the critical functionalities of the application',function(){
		browser.get(computerJSONObject.homePageUrl);
		browser.manage().window().maximize();
		 
		// 1.validation to check the url is not getting redirected to any other page
		expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,'It is redirecting to a different page');
		
		//2.validate header name is equal to "Play sample application — Computer database"
		homePage.getHomePageHeader().getText().then(function(homePageHeaderName){
			expect(homePageHeaderName).toBe(computerJSONObject.homePageHeaderValue,"Title value is not same as expected");
		});
		
		//3.previous button should be disabled initially
		homePage.getDisabledPreviousButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Previous button is enabled");
		});
		
		//4.Result section should be present on intial page load
		homePage.getResultsSection().isDisplayed().then(function(isDisplayed){
			expect(isDisplayed).toBe(true,"Result section is missing in home page");
		});
		
		//5. Add a new Computer button should be displayed
		homePage.getAddNewComputerButton().isDisplayed().then(function(isDisplayed){
			expect(isDisplayed).toBe(true,"Result section is missing in home page");
		});
		
		//6. Verify navigation to add new computer page occurs on clicking "Add a new phone button"
		homePage.getAddNewComputerButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.addPageUrl,"Redirection to add computer page is failed");
			expect(addPage.getAddComputerHeaderValue().getText()).toBe("Add a computer");
		});
		
		//7.Verify navigation back to home page by clicking on cancel button
		addPage.getCancelButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,'Redirection to home page is failed');
		});
		
		//8.Verify successful navigation to edit/delete computer page on clicking any computer name is database entry
		homePage.getComputerNameFromTableByPosition(1).click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.editOrDeletePageUrl,"Redirection to add computer page is failed");
		})
		
		
		
		
		
		
		
	});
});
describe('Computers Database:Search Functionality validation',function(){	
	it('should validate the filter functionality by searching with computer name "'+computerJSONObject.validComputerNameForSearch+'" which has less than or equal to 10 entries in the table',function(){
		// 1.enter the valid computer name in search field
		browser.get(computerJSONObject.homePageUrl);
		homePage.getSearchBox().sendKeys(computerJSONObject.validComputerNameForSearch);
		
		// 2.click on the "Filter by Name" button
		homePage.getFilterByNameButton().click().then(function(){
			console.log("Filter by Name button is clicked");
		});
			
		//3.validate that the all computers in the table should contain the search text
		homePage.getComputerNameArrayFromTable().then(function(computerNameArray){
			
			computerNameArray.forEach(function(computerNameObj, computerNameCount){
				computerNameObj.all(by.tagName('td')).get(0).getText().then(function(computerName){
					console.log(computerName);
					expect(computerName.toLowerCase()).toContain(computerJSONObject.validComputerNameWithMoreThanTenResults.toLowerCase());
				});
			});
			
			
		});
		
		// 4.validate the filtered number of computers result is same as it is mentioned in results section below the header
		homePage.getComputerResultsCount().then(function(count){
			homePage.getResultsSection().getText().then(function(resultSectionMessage){
				totalNumberOfFilteredComputers = count;
				var numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
				expect(totalNumberOfFilteredComputers.toString()).toEqual(numberOfComputersFromResultSection);
			});
			});
		
		//5.validated the number of results displayed in pagination section should be equal to fitered computers count
		homePage.getPaginationCurrentSection().getText().then(function(displayedText){
			expect(displayedText).toEqual('Displaying 1 to '+totalNumberOfFilteredComputers+' of '+totalNumberOfFilteredComputers);
		});
		
		//6.validate previous button is disabled
		homePage.getDisabledPreviousButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Previous button is enabled");
		});
		
		//7.validate previous button is disabled
		homePage.getDisabledNextButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Next button is enabled");
		});
	});
	
	it('should validate the filter functionality by searching with computer name "'+computerJSONObject.validComputerNameWithMoreThanTenResults+'" which has more than 10 entries in the table',function(){
		// 1.enter the valid computer name in search field
		homePage.getSearchBox().clear().sendKeys(computerJSONObject.validComputerNameWithMoreThanTenResults);
		
		
		// 2.click on the "Filter by Name" button
		homePage.getFilterByNameButton().click().then(function(){
			console.log("Filter by Name button is clicked");
		});
			
		//3.validate that the all computers in the table should contain the search text and naviagate by clicking on next pagination and validate the same
		homePage.getResultsSection().getText().then(function(resultSectionMessage){
				
			numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
			console.log(numberOfComputersFromResultSection);
			for(var i=0; i<=numberOfComputersFromResultSection;i+10){
				let intialValue = i+1;
				let finalValue =  i+10;
				let remainder = numberOfComputersFromResultSection%10;
				console.log(intialValue+remainder-1);
				i=i+10;
				 	
			homePage.getNextButton().getAttribute('class').then(function(isDisabled){
				
				if(isDisabled.indexOf('disabled')>-1 && intialValue+remainder-1!=numberOfComputersFromResultSection){
					
					expect(isDisabled).not.toContain('disabled',"Next button is disabled");
				}
				else{
					//4.validate that the all computers in the table should contain the search text
			homePage.getComputerNameArrayFromTable().then(function(computerNameArray){	
				computerNameArray.forEach(function(computerNameObj, computerNameCount){
					
						computerNameObj.all(by.tagName('td')).get(0).getText().then(function(computerName){
						console.log(computerName);
						expect(computerName.toLowerCase()).toContain(computerJSONObject.validComputerNameWithMoreThanTenResults.toLowerCase(),
						"The searched string is missing in computer name");
						
						
					});
					
					
				});
				
				//5.validate the number of results displayed in pagination section should be equal to fitered computers count
				homePage.getPaginationCurrentSection().getText().then(function(displayedText){
					
				expect(displayedText).toEqual('Displaying '+intialValue+' to '+parseInt(intialValue+computerNameArray.length-1)+' of '+numberOfComputersFromResultSection);
				
				});
				
				//6.Validate the total number of result remains constant through out the page navigation
				homePage.getResultsSection().getText().then(function(resultSectionMessage){
				var numberOfComputersAtEachNavigation = resultSectionMessage.split(" ")[0];
				expect(numberOfComputersFromResultSection).toEqual(numberOfComputersAtEachNavigation);
				});
				
				//7. click on Next button in pagination if it is enabled
				browser.wait(EC.elementToBeClickable(homePage.getNextButton().element(by.tagName('a'))),5000);
				homePage.getNextButton().element(by.tagName('a')).click();
			});
			
			}
				
			});
			
			}
		});
		
		
	});
	
	
});