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
var newComputerName= "Apple Mac "+(Math.random().toString(36).substr(2, 4)); // generates a 4 digit alphanumeric string;
var editComputerName= "Apple Mac "+(Math.random().toString(36).substr(2, 4)); // generates a 4 digit alphanumeric string;
var introducedDate="";
var destroyedDate="";
var companyNameIndex="";
let lastPaginationIndex=0;
var EC=protractor.ExpectedConditions; // conditional check for visibility or presence or clickability of an element in the DOM

describe('Computers Database:CRUD Flow validation',function(){
	/*In this smoke test, critical functionalities of the application is tested. For an instance, verification of page load, navigation to 
       add new computer page on clicking "Add a new computer" in home page and navigation to Edit/Delete a computer page on clicking any computer name 
	   in home page is validated here*/
	it('should validate add a computer flow',function(){
		//1. Launch the browser URL
		browser.get(computerJSONObject.homePageUrl);
		browser.manage().window().maximize();
		 
		//2.validation to check the url is not getting redirected to any other page
		expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,'Failure Reason:It is redirecting to a different page');

		
		//3. Add a new Computer button should be displayed
		homePage.getAddNewComputerButton().isDisplayed().then(function(isDisplayed){
			expect(isDisplayed).toBe(true,"Failure Reason:Result section is missing in home page");
		});
		
		//4. Verify navigation to add new computer page occurs on clicking "Add a new phone button"
		homePage.getAddNewComputerButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.addPageUrl,"Failure Reason:Redirection to add computer page is failed");
			expect(addPage.getAddComputerHeaderValue().getText()).toBe("Add a computer");
		});
		
		//5.Enter Valid Computer Name, Introduced Data, Discontinued Date, Company
		 
		addPage.getComputerNameField().sendKeys(newComputerName);
		addPage.getIntroducedDateField().sendKeys(computerJSONObject.validIntroducedDate);
		addPage.getDestroyedDateField().sendKeys(computerJSONObject.validDestroyedDate);
		addPage.selectAllCompany().then(function(AllCompanies){
			AllCompanies.forEach(function(companyName,companyCounter){
				companyName.getText().then(function(companyNameValue){
					if(companyNameValue === computerJSONObject.companyName){
						companyNameIndex=companyCounter;
					}
				});
			});
		});
		addPage.getDestroyedDateField().getText().then(function(){
			addPage.selectACompany(companyNameIndex).click().then(function(){
				console.log("Company Name is selected");
					
			});
		});
	     
		//6. Click on "Create this computer" button after entering the valid details
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		})
		
		//7. On clicking "Create this computer" button, an entry should be created in database and url should redirect to homePage
		expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,"redirection to homepage from add new computer page is failed");
		
		//9. Validate the message notification
		homePage.getAlertMessageWarning().getText().then(function(alertMessageWarning){
			expect(alertMessageWarning).toBe("Done! Computer "+newComputerName+" has been created");
		});
		
		//9. Search for the newly created computer in database by using filter
		 homePage.getSearchBox().clear().sendKeys(newComputerName);
	   
	    //10.click on the "Filter by Name" button
		homePage.getFilterByNameButton().click().then(function(){
			console.log("Filter by Name button is clicked");
		});
		
		//11. validate the Computer Name, Introduced Data, Discontinued Date, Company name in database table 
		homePage.getComputerNameArrayFromTable().then(function(computerNameArray){
			
			computerNameArray.forEach(function(computerNameObj, computerNameCount){
				computerNameObj.all(by.tagName('td')).get(0).getText().then(function(computerName){
					console.log(computerName);
					expect(computerName.toLowerCase()).toContain(newComputerName.toLowerCase());
				});
				computerNameObj.all(by.tagName('td')).get(1).getText().then(function(introducedDate){
					console.log(introducedDate);
					expect(introducedDate).toContain(convertDateFormat(computerJSONObject.validIntroducedDate));
				});
				computerNameObj.all(by.tagName('td')).get(2).getText().then(function(destroyedDate){
					console.log(destroyedDate);
					expect(destroyedDate).toContain(convertDateFormat(computerJSONObject.validDestroyedDate));
				});
				computerNameObj.all(by.tagName('td')).get(3).getText().then(function(companyName){
					console.log(destroyedDate);
					expect(companyName).toContain(computerJSONObject.companyName);
				});
			});
			
			
		});
		
		// 12.validate the filtered number of computers result is same as it is mentioned in results section below the header
		homePage.getComputerResultsCount().then(function(count){
			homePage.getResultsSection().getText().then(function(resultSectionMessage){
				totalNumberOfFilteredComputers = count;
				var numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
				expect(totalNumberOfFilteredComputers.toString()).toEqual(numberOfComputersFromResultSection);
			});
			});
		
		//13.validated the number of results displayed in pagination section should be equal to fitered computers count
		homePage.getPaginationCurrentSection().getText().then(function(displayedText){
			expect(displayedText).toEqual('Displaying 1 to '+totalNumberOfFilteredComputers+' of '+totalNumberOfFilteredComputers);
		});
		
		//14.validate previous button is disabled
		homePage.getDisabledPreviousButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Failure Reason:Previous button is enabled");
		});
		
		//15.validate previous button is disabled
		homePage.getDisabledNextButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Failure Reason:Next button is enabled");
		});
		
	});
	
	it('should validate edit a computer that got recently created flow',function(){
		//1.click on the newly created computer name link in computers database table
		homePage.getComputerNameFromTableByPosition(1).getAttribute('href').then(function(computerIndex){
			homePage.getComputerNameFromTableByPosition(1).click().then(function(){
				//3. validate redirection to edit or delete page is successful
			expect(browser.getCurrentUrl()).toBe(computerIndex,"Failure Reason:Redirection to add computer page is failed");
			});
		});
		
		//2. Validate the computer name, introducedDate, destroyedDate and companyName in their respective fields
		editPage.getComputerNameField().getAttribute('value').then(function(editComputerName){
			expect(editComputerName).toBe(newComputerName);
		});
		editPage.getIntroducedDateField().getAttribute('value').then(function(editIntroducedDateField){
			expect(editIntroducedDateField).toBe(computerJSONObject.validIntroducedDate);
		});
		editPage.getDestroyedDateField().getAttribute('value').then(function(editDestroyedDateField){
			expect(editDestroyedDateField).toBe(computerJSONObject.validDestroyedDate);
		});
		editPage.getCompanyNameValue().getAttribute('value').then(function(editCompanyName){
			expect(editCompanyName).toBe(companyNameIndex.toString());
		});
		
		//3.Edit the computername and click on "Save this computer button"
		editPage.getComputerNameField().clear().sendKeys(editComputerName);
		editPage.getSaveThisComputerButton().click().then(function(){
			console.log("Edited computed is saved successfully");
		});
		
		//4. On clicking "Save this computer" button, an entry should be created in database and url should redirect to homePage
		expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,"redirection to homepage from add new computer page is failed");
		
		//5. Validate the message notification
		homePage.getAlertMessageWarning().getText().then(function(alertMessageWarning){
			expect(alertMessageWarning).toBe("Done! Computer "+editComputerName+" has been updated");
		})
		
		//6. Search for the newly created computer in database by using filter
		 homePage.getSearchBox().clear().sendKeys(editComputerName);
	   
	    //7.click on the "Filter by Name" button
		homePage.getFilterByNameButton().click().then(function(){
			console.log("Filter by Name button is clicked");
		});
		
		//8. validate the Computer Name, Introduced Data, Discontinued Date, Company name in database table 
		homePage.getComputerNameArrayFromTable().then(function(computerNameArray){
			
			computerNameArray.forEach(function(computerNameObj, computerNameCount){
				computerNameObj.all(by.tagName('td')).get(0).getText().then(function(computerName){
					console.log(computerName);
					expect(computerName.toLowerCase()).toContain(editComputerName.toLowerCase());
				});
				computerNameObj.all(by.tagName('td')).get(1).getText().then(function(introducedDate){
					console.log(introducedDate);
					expect(introducedDate).toContain(convertDateFormat(computerJSONObject.validIntroducedDate));
				});
				computerNameObj.all(by.tagName('td')).get(2).getText().then(function(destroyedDate){
					console.log(destroyedDate);
					expect(destroyedDate).toContain(convertDateFormat(computerJSONObject.validDestroyedDate));
				});
				computerNameObj.all(by.tagName('td')).get(3).getText().then(function(companyName){
					console.log(destroyedDate);
					expect(companyName).toContain(computerJSONObject.companyName);
				});
			});
	
		});
		
		// 9.validate the filtered number of computers result is same as it is mentioned in results section below the header
		homePage.getComputerResultsCount().then(function(count){
			homePage.getResultsSection().getText().then(function(resultSectionMessage){
				totalNumberOfFilteredComputers = count;
				var numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
				expect(totalNumberOfFilteredComputers.toString()).toEqual(numberOfComputersFromResultSection);
			});
			});
		
		//10.validated the number of results displayed in pagination section should be equal to fitered computers count
		homePage.getPaginationCurrentSection().getText().then(function(displayedText){
			expect(displayedText).toEqual('Displaying 1 to '+totalNumberOfFilteredComputers+' of '+totalNumberOfFilteredComputers);
		});
		
		//11.validate previous button is disabled
		homePage.getDisabledPreviousButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Failure Reason:Previous button is enabled");
		});
		
		//12.validate previous button is disabled
		homePage.getDisabledNextButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Failure Reason:Next button is enabled");
		});
		
	});
	
	it('should validate delete a computer that got recently created and edited',function(){
		//1.click on the newly created computer name link in computers database table
		homePage.getComputerNameFromTableByPosition(1).getAttribute('href').then(function(computerIndex){
			homePage.getComputerNameFromTableByPosition(1).click().then(function(){
				//3. validate redirection to edit or delete page is successful
			expect(browser.getCurrentUrl()).toBe(computerIndex,"Failure Reason:Redirection to add computer page is failed");
			});
		});
		
		//2. Click on delete this computer button
		editPage.getDeleteThisComputerButton().click().then(function(){
			console.log("delete this computer button is clicked");
		})
		
		//3. On clicking "Save this computer" button, an entry should be created in database and url should redirect to homePage
		expect(browser.getCurrentUrl()).toBe(computerJSONObject.homePageUrl,"redirection to homepage from add new computer page is failed");
		
		//4. Validate the delete message notification
		homePage.getAlertMessageWarning().getText().then(function(alertMessageWarning){
			expect(alertMessageWarning).toBe("Done! Computer has been deleted");
		});
		
		//5. Search for the edited computer in database by using filter
		 homePage.getSearchBox().clear().sendKeys(editComputerName);
	   
	    //6.click on the "Filter by Name" button
		homePage.getFilterByNameButton().click().then(function(){
			console.log("Filter by Name button is clicked");
		});
		
		//7.The message below the table should be "Nothing to display"
		homePage.getNothingtoDisplay().getText().then(function(tableMessage){
			expect(tableMessage).toEqual("Nothing to display");
		});
		
	});
});

function convertDateFormat(inputDate){
	var givenDate = new Date(inputDate);
	var convDate =
    givenDate.toLocaleString("en", { day: "numeric" }) + ' ' +
    givenDate.toLocaleString("en", { month: "short"  }) + ' ' +
    givenDate.toLocaleString("en", { year: "numeric"});
	
	return convDate;
}
