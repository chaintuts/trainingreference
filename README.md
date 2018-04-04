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
* Available collections: Premade Programs, Program Templates, Freeweight Movements, and Bodyweight Movements
* Show all data in a collection
* Search collections based on metadata like program/movement names, etc.
* See metadata suggestions (all available metadata keys for a collection)
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
* Visit a collection URL to see all data: /premadeprograms, /programtemplates, /freeweightmovements, /bodyweightmovements
* Visit collection/key/value to query a collection based on desired metadata
* Visit collection/suggestions/key to see all available metadata values for the desired key

