# PECKER
Pecker is a modern assets management framework for your web application development.

## Features
* Assets watcher
* Fine-grained control for triggering per-file builds
* Cache-buster
* Versioning through content-hashing
* Full-featured APIs for both server-side and client-side scripts

## Quickstart
The easiest and quickest way to start using Pecker is through the CLI by installing it as a global module

```
npm install pecker -g 	// install globally for CLI
cd path/to/your/project	// navigate to your project
pecker init 				// initialize configuration file
pecker					// run build
```

### Congratulations! You have just configured your project and build your assets!
Continue reading the documentation explore more ways to leverage Pecker to your advantage in your web application development.


-----
## Installation
You can choose to install Pecker as either a global or local NodeJS module, or both!

To install it as a global module:

```
npm install pecker -g
```

To install it as a local module within your project directory:

```
cd /path/to/your/project
npm install pecker
```

## Usages
Besides using the Pecker CLI program, there are many ways to use Pecker for your project.
* as a CLI program
* as a gulp task
* as a local NodeJS module
* as a client-side script
* 

## Tests
To run tests

```
git clone https://github.com/sogko/pecker.git
cd pecker
npm install
npm test
```

## Contributing to Pecker development
### Issues, enhancement and pull requests are welcome!
We welcome contributions of any kind to the project =) (Just be kind)

### Workflow
* We strongly encourage TDD/BDD workflows and would be happy if PRs (pull requests) come with accompanying tests.
* This project uses Gulp for its build workflow
* Ensure that the project pass the following before submitting a PR:
	* JSHint: ```gulp jshint```
	* Tests: ```npm test```


