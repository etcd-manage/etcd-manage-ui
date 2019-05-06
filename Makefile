default:
	@echo 'Usage of make: [ build | run | go | clean ]'

build: 
	npm run build

run:
	npm run dev

go: build
	@cp -r dist tpls && cd tpls && ./compile.sh

clean: 
	@rm -f ./dist
	@rm -f ./tpls/dist
	@rm -f ./tpls/tpls.go

.PHONY: default build run go clean