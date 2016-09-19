## General
____________

### Author
* Josh McIntyre

### Website
* jmcintyre.net

### Overview
* TrainingReference provides resistance training information via REST

## Development
________________

### Git Workflow
* master for releases (merge development)
* development for bugfixes and new features

### Building
* make build
Build the application
* make load
Load the database
* make clean
Clean the build and data directories

### Features
* Show all exercises or programs in a collection
* Search exercises or programs based on metadata
* Return the results as JSON

### Requirements
* Requires a web browser or a command line url retrieval utility

### Platforms
* Firefox
* Chrome

## Usage
____________

### GET usage
* See the root url / for collection, url, and key information
* Visit /programs or /exercises to see all items
* Visit /programs/key/value or /exercises/key/value to search by metadata
