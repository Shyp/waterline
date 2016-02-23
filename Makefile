.PHONY: install test bail clean

install:
	npm install

test:
	mocha test --recursive

bail:
	mocha test --recursive --bail

clean:
	rm -rf node_modules
