PREFIX ?= /usr/local
LIB_PREFIX = ~/.node_libraries

DOCS = docs/index.md \
		docs/install.md \
		docs/api.md \
		docs/tutorial-prowl.md \
		docs/aws_install.md \
		docs/install_joyent.md \
		docs/configuration.md \
		docs/cron-jobs.md \
		docs/editor.md \
		docs/webhooks.md \
		docs/redirect-url.md \
		docs/simpleflow.md \
		docs/stack.md \
		docs/tutorial-postbin.md \
		docs/tutorial-mailhooks.md \
		docs/custom-modules.md \
		docs/custom-modules-ui.md \
		docs/custom-modules-js.md \
		docs/custom-modules-packages.md \
		docs/contribute.md \
		docs/activities.md \
		docs/public-run.md \
		docs/templates.md \
		docs/tutorial-wordpress.md 

HTMLDOCS =$(DOCS:.md=.html)

docs: $(HTMLDOCS)
	@ echo "... generating TOC"

%.html: %.md
	@echo "... $< -> $@"
	@ronn -5 --pipe --fragment $< \
	  | cat docs/layout/head.html - docs/layout/foot.html \
	  | sed 's/NAME/Webhookit/g' \
	  > $@

docclean:
	rm -f docs/*.html

test:
	@NODE_ENV=test expresso \
		-I lib \
		-I app \
		$(TESTFLAGS) \
		test/*.test.js

test-cov:
	@TESTFLAGS=--cov $(MAKE) test

.PHONY: docs docclean test test-cov