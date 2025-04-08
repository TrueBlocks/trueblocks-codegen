update:
	@go get "github.com/TrueBlocks/trueblocks-sdk/v5@latest"
	@go get github.com/TrueBlocks/trueblocks-core/src/apps/chifra@latest
	@go mod tidy
	@cd frontend ; yarn upgrade --latest ; cd -

lint:
	@yarn lint
