pre-build:
	# 使用淘宝npm包
	npm install --registry=https://registry.npm.taobao.org

win-pre-buid:
	npm install --no-bin-links --registry=https://registry.npm.taobao.org

build:
	npm run build

dev:
	npm run dev

.PHONY: build