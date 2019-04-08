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
			expect(isDisabled).toBe(true,"Failure Reason:Previous button is enabled");
		});
		
		//7.validate previous button is disabled
		homePage.getDisabledNextButton().isDisplayed().then(function(isDisabled){
			expect(isDisabled).toBe(true,"Failure Reason:Next button is enabled");
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
						expect(computerName.toLowerCase()).toContain(computerJSONObject.validComputerNameWithMoreThanTenResults.toLowerCase());
						
						
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
	
	it("should return 'Nothing to display',if filtered a random string which is not present in computer database", function(){
	   
	   let randomComputerName = Math.random().toString(36).substr(2, 10); // generates a 10 digit alphanumeric string
	   
	   // 1.enter the valid computer name in search field
	   homePage.getSearchBox().clear().sendKeys(randomComputerName);
	   
	    // 2.click on the "Filter by Name" button
	   homePage.getFilterByNameButton().click().then(function(){
			console.log("Filter by Name button is clicked");
		});
		
		//3.Results section message should be "No computers found"
		homePage.getResultsSection().getText().then(function(resultSectionMessage){
			expect(resultSectionMessage).toEqual("No computers found");
		});
		
		//4.The message below the table should be "Nothing to display"
		homePage.getNothingtoDisplay().getText().then(function(tableMessage){
			expect(tableMessage).toEqual("Nothing to display");
		});
	});
	/* Boundary testing: query p with negative number and a number greater than last pagination index*/
	it("should validate by launching homepage url with pagination query p=-1", function(){
	    //1. launch the home page url with pagination query p=-1(a negative number)
		browser.get(computerJSONObject.homePageUrl+"?p=-1");
		
		//2. validation pagination section display result contains "Displaying 1 to 10"
		homePage.getResultsSection().getText().then(function(resultSectionMessage){
				var numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
			homePage.getPaginationCurrentSection().getText().then(function(displayedText){
			expect(displayedText).toEqual('Displaying 1 to 10 of '+numberOfComputersFromResultSection);
		});
		});
	});
	
	it("should validate by launching homepage url with pagination query p greater than the last pagination index", function(){
	    
		//1. Store the last pagination index value into variable lastPaginationIndex
		homePage.getResultsSection().getText().then(function(resultSectionMessage){
				var numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
				lastPaginationIndex = parseInt(numberOfComputersFromResultSection/10);
			   
			   //2. Launch the home page url with pagination query p greater than last pagination index
				browser.get(computerJSONObject.homePageUrl+"?p="+(lastPaginationIndex+1));
		});
		
		//3.The message below the table should be "Nothing to display"
		homePage.getNothingtoDisplay().getText().then(function(tableMessage){
			expect(tableMessage).toEqual("Nothing to display");
		});
		
	});
});
describe('Computers Database:Sorting Functionality validation',function(){
	it("should validate ascending and descending sorting of table by clicking on computer name header",function(){
		//1. Launch the home page url
		browser.get(computerJSONObject.homePageUrl);
		
		//2. Capture the total number of computers from the result section
		homePage.getResultsSection().getText().then(function(resultSectionMessage){
				var numberOfComputersFromResultSection = resultSectionMessage.split(" ")[0];
				lastPaginationIndex = parseInt(numberOfComputersFromResultSection/10);
			   
			   //3. Launch the home page url with pagination query p to navigate to the last page of the table
				browser.get(computerJSONObject.homePageUrl+"?p="+(lastPaginationIndex));
		});
		
		//4. Navigate to the last page of the database table and capture the last computer name
		homePage.getComputerNameArrayFromTable().then(function(computerNameArray){
				
				// iterate though the computer name array to get the last computer name
				computerNameArray.forEach(function(computerNameObj, computerNameCount){
					
						computerNameObj.all(by.tagName('td')).get(0).getText().then(function(computerName){
						if(computerNameCount == computerNameArray.length-1){
							console.log(computerName);
							//5. store the last computer name into lastComputerName variable
							 lastComputerName= computerName;
						}
					});		
				});	
		});
		
		browser.get(computerJSONObject.homePageUrl);
		//5.click on computer name link in the to sort in descending order and validate that 
		// the table got sorted in descending alphaba numeric order.
		homePage.getComputerNameHeaderFromTable().click().then(function(){
			
			expect(homePage.getComputerNameFromTableByPosition(1).getText()).toBe(lastComputerName,"sorting by computer name is not working");
		});
		
		
	});
});