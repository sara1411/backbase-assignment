# Backbase Assignment
This repository contains manual and protractor test cases to perform smoke and functional testing on computers database web application

## Prerequisites
Softwares required pull this repository to local and to run the protractor tests 
* [Java 1.8 or higher](https://www.java.com/en/download/windows-64bit.jsp) - Recommended
* [Node.js](https://nodejs.org/en/download/) - Install the latest or recommended version
* [Git Bash](https://git-scm.com/downloads)

Once the installation is done, please run `java -version`, `node --version` and `git --version` from command line to make sure JDK, NodeJS environment and Git Bash is installed properly.

## Note
* **npm - node packager manager** will be available once Node.js is installed.

## Protractor Setup

Please use below command to install protractor globally
```
npm install protractor -g
```
* Run `protractor --version` to make sure protractor is installed properly. `webdriver-manager` will also get installed along with protractor

To install selenium standalone server and browers binaries, please run
```
webdriver-manager update
```

To start up a sever instance on port 4444(**default port**), please run
```
webdriver-manager start
```
**"Selenium Server is up and running on port 4444"** message confirms selenium server is running successfully.

## Pull protractor tests from Git Repository to local machine
* Open Git bash window and from any workspace and run command `git clone https://github.com/sara1411/backbase-assignment.git` or you can download by clicking on `Clone or Download` button and click on `Download ZIP` option

## Running the tests
Navigate to `<workspace>/backbase-assignment/protractor_test` and to execute automated smoke and functional tests, please run
```
npm test
```
Smoke test validates the critical functionality of the application and function test automation perform CRUD and edge case validations.


Functionalities validated:
```
* Search/Filter computer name/s
* Pagination navigation 
* Sort computer database table by column header 
* Add a new computer information
* Edit/Delete the computer information
* URL Redirection validation
* Boundary conditions validation
```
## Author

* **Saravana Kannan Kaliappapillai Ragunathan** - [Github profile](https://github.com/sara1411/)







