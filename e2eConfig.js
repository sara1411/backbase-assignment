exports.config = {
	//run selenium webdriver locally in port 4444 by using command webdriver-manager start 
	seleniumAddress:'http://localhost:4444/wd/hub',
	
	//configuration to run tests in chrome browser
	capabilities: {
		browserName:'chrome'
	},
	
	specs:['./computer_database_homePage_TestSpec.js'],
	
	framework:'jasmine2',
	
	// to make protractor to ignore looking for angular components in a non-angular application
	onPrepare:function(){
		browser.ignoreSynchronization=true;
	},
	
	jasmineNodeOpts: {
	defaultTimeoutInterval: 100000,
    showColors: true, // Use colors in the command line report.
	}
};