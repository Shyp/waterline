.PHONY: install test bail clean

circle-install:
	curl --remote-name https://raw.githubusercontent.com/Shyp/set-node-npm/master/set-node-npm
	chmod +x set-node-npm
	./set-node-npm

install:
	npm install

test:
	node --version
	./node_modules/.bin/mocha test --recursive

bail:
	mocha test --recursive --bail

clean:
	rm -rf node_modules
