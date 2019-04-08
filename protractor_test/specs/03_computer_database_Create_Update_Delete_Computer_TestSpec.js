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
var newComputerName= "Apple Mac "+(Math.random().toString(36).substr(2, 4)); // generates a 4 characters of alphanumeric string;
var editComputerName= "Apple Mac "+(Math.random().toString(36).substr(2, 4)); //generates a 4 characters of alphanumeric string;
var valueToRepeat = 'a'
var computerNameMoreThanThreshold= valueToRepeat.repeat(10000); // generates a 10000 digit alphanumeric string;
var introducedDate="";
var destroyedDate="";
var companyNameIndex="";
let lastPaginationIndex=0;
var EC=protractor.ExpectedConditions; // conditional check for visibility or presence or clickability of an element in the DOM

describe('Computers Database:CRUD Flow validation',function(){
	//In this functional test, creation, updation and deletion of a computer entry and its impact on other functionalities is covered
	it('should validate add a computer flow',function(){
		//1. Launch the home page URL
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
		addPage.getDiscontinuedDateField().sendKeys(computerJSONObject.validDiscontinuedDate);
		addPage.selectAllCompany().then(function(AllCompanies){
			AllCompanies.forEach(function(companyName,companyCounter){
				companyName.getText().then(function(companyNameValue){
					if(companyNameValue === computerJSONObject.companyName){
						companyNameIndex=companyCounter;
					}
				});
			});
		});
		addPage.getDiscontinuedDateField().getText().then(function(){
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
					expect(destroyedDate).toContain(convertDateFormat(computerJSONObject.validDiscontinuedDate));
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
		editPage.getDiscontinuedDateField().getAttribute('value').then(function(editDiscontinuedDateField){
			expect(editDiscontinuedDateField).toBe(computerJSONObject.validDiscontinuedDate);
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
					expect(destroyedDate).toContain(convertDateFormat(computerJSONObject.validDiscontinuedDate));
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

describe('Computers Database: Edge cases of CRUD Flow', function(){
	
	it('should validate that the error should be thrown if computer name field is left empty while clicking on create this computer button',function(){
		//1. Launch the home page URL
		browser.get(computerJSONObject.homePageUrl);
		
		//2. Verify navigation to add new computer page occurs on clicking "Add a new phone button"
		homePage.getAddNewComputerButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.addPageUrl,"Failure Reason:Redirection to add computer page is failed");
			expect(addPage.getAddComputerHeaderValue().getText()).toBe("Add a computer");
		});
		
		//3. Enter the valid introducedDate, destroyedDate and select company name by leaving computer name field empty
		addPage.getIntroducedDateField().sendKeys(computerJSONObject.validIntroducedDate);
		addPage.getDiscontinuedDateField().sendKeys(computerJSONObject.validDiscontinuedDate);
		addPage.selectAllCompany().then(function(AllCompanies){
			AllCompanies.forEach(function(companyName,companyCounter){
				companyName.getText().then(function(companyNameValue){
					if(companyNameValue === computerJSONObject.companyName){
						companyNameIndex=companyCounter;
					}
				});
			});
		});
		addPage.getDiscontinuedDateField().getText().then(function(){
			addPage.selectACompany(companyNameIndex).click().then(function(){
				console.log("Company Name is selected");
				
					
			});
		});
		
		//4.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
		//5. Computer field section should be highlighted with red background
		editPage.computerNameSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			editPage.computerNameSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	});
	
	it('should validate that the error should be thrown if date format other than yyyy-MM-dd is entered and add this computer button is clicked',function(){
	  //1. enter a valid computer name
	  addPage.getComputerNameField().sendKeys(newComputerName);
	  
	  //2. enter an invalid introduce date as "1999/12/12"
	  addPage.getIntroducedDateField().clear().sendKeys("1999/12/12");
	  
	  //3.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	  //4. Introduced date section should be highlighted with red background
		addPage.introducedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.introducedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	  //5.enter an invalid introduce date as "12 December 1999"
		addPage.getIntroducedDateField().clear().sendKeys("12 December 1999");
	  
	  //6.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	  //7. Introduced date section should be highlighted with red background
		addPage.introducedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.introducedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	   //7.enter an invalid introduce date as "1999.12.12"
		addPage.getIntroducedDateField().clear().sendKeys("1999.12.12");
	  
	   //8.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	   //9.Introduced date section should be highlighted with red background
		addPage.introducedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.introducedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	   //10.enter an invalid introduce date as "12* 12* 1999"
		addPage.getIntroducedDateField().clear().sendKeys("12* 12* 1999");
	  
	   //11.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	   //12.Introduced date section should be highlighted with red background
		addPage.introducedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.introducedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
			  //13. enter an invalid discontinue date as "1999-31-12"
	  addPage.getDiscontinuedDateField().clear().sendKeys("1999-31-12");
	  
	  //14.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	  //15. Introduced date section should be highlighted with red background
		addPage.discontinuedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.discontinuedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	  //16.enter an invalid discontinue date as "12 Dec 1999"
		addPage.getDiscontinuedDateField().clear().sendKeys("12 Dec 1999");
	  
	  //17.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	  //18. Introduced date section should be highlighted with red background
		addPage.discontinuedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.discontinuedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	   //19.enter an invalid discontinue date as "12/12/1999"
		addPage.getDiscontinuedDateField().clear().sendKeys("12/12/1999");
	  
	   //20.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	   //21.Introduced date section should be highlighted with red background
		addPage.discontinuedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.discontinuedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
	   //22.enter an invalid discontinue date as "1999 Dec 12"
		addPage.getDiscontinuedDateField().clear().sendKeys("1999 Dec 12");
	  
	   //23.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	   //24.Introduced date section should be highlighted with red background
		addPage.discontinuedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.discontinuedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
		//25.enter an invalid year with Feb 29 in introduce date as "1999 Dec 12"
		addPage.getIntroducedDateField().clear().sendKeys("1999-02-29");
		//26.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	   //27.Introduced date section should be highlighted with red background
		addPage.introducedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.discontinuedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
		//28.enter an invalid year with Feb 29 in introduce date as "1999 Dec 12"
		addPage.getDiscontinuedDateField().clear().sendKeys("1999-02-29");
		//23.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		
	   //29.Introduced date section should be highlighted with red background
		addPage.discontinuedDateSectionError().isDisplayed().then(function(isError){
			expect(isError).toBe(true,"The computer name field is not highlighted with red color");
			addPage.discontinuedDateSectionError().getCssValue('background-color').then(function(backgroundColor){
				expect(backgroundColor).toBe(computerJSONObject.errorBackgroundColor,"The computer name field is not highlighted with red color");
			});
		});
		
		//30.enter an valid year with Feb 29 in introduce date as "2000 Dec 12"
		addPage.getIntroducedDateField().clear().sendKeys("2000-02-29");
		//31.enter an invalid year with Feb 29 in introduce date as "1999 Dec 12"
		addPage.getDiscontinuedDateField().clear().sendKeys("2000-02-29");
		
		//32.enter computer name with more than 10000 character
		addPage.getComputerNameField().clear().sendKeys(newComputerName);
		
		//33.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		browser.sleep(5000);
		
		//34. Validate message notification for new computer entry creation
		homePage.getAlertMessageWarning().getText().then(function(alertMessageWarning){
			expect(alertMessageWarning).toBe("Done! Computer "+newComputerName+" has been created");
		});
		
		//35. Verify navigation to add new computer page occurs on clicking "Add a new phone button"
		homePage.getAddNewComputerButton().click().then(function(){
			expect(browser.getCurrentUrl()).toBe(computerJSONObject.addPageUrl,"Failure Reason:Redirection to add computer page is failed");
			expect(addPage.getAddComputerHeaderValue().getText()).toBe("Add a computer");
		});
		
		//36. Enter the valid introducedDate, destroyedDate and select company name by leaving computer name field empty
		addPage.getComputerNameField().clear().sendKeys(newComputerName);
		
		//37. enter the introduced date value which is greater than discontinued data value
		addPage.getIntroducedDateField().sendKeys("2020-02-29");
		addPage.getDiscontinuedDateField().sendKeys("2000-02-29");
		
		//38. enter a valid company name
		addPage.selectAllCompany().then(function(AllCompanies){
			AllCompanies.forEach(function(companyName,companyCounter){
				companyName.getText().then(function(companyNameValue){
					if(companyNameValue === computerJSONObject.companyName){
						companyNameIndex=companyCounter;
					}
				});
			});
		});
		addPage.getDiscontinuedDateField().getText().then(function(){
			addPage.selectACompany(companyNameIndex).click().then(function(){
				console.log("Company Name is selected");
				
					
			});
		});
		
		//39.Click on create this computer button
		addPage.getCreateThisComputerButton().click().then(function(){
			console.log("create this computer button is clicked");
		});
		browser.sleep(5000);
		
		//34. Validate that no message notifcation should be present as introduced date is greater than discontinued data
		homePage.getAlertMessageWarning().getText().then(function(alertMessageWarning){
			expect(alertMessageWarning).not.toBe("Done! Computer "+newComputerName+" has been created","No message notifcation should be present as introduced date is greater than discontinued data");
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
