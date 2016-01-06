.PHONY: install test bail

install:
	npm install

test:
	mocha test --recursive

bail:
	mocha test --recursive --bail
