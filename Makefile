.PHONY: install test

install:
	npm install

test:
	mocha test --recursive
