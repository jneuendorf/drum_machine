JQUERY = "includes/jquery-2.1.1.min.js"
NUMERAL = "includes/numeraljs/numeral.min.js"

INCLUDES = $(JQUERY) $(NUMERAL)



PROJECT_NAME = DrumMachine
FILES = js/setup.coffee js/drumkits.coffee js/Instrument.coffee js/Measure.coffee js/Parts.coffee js/DrumMachine.coffee js/init.coffee

make:
	cat $(FILES) | coffee --compile --stdio > $(PROJECT_NAME).js

# test:
# 	cat $(FILES) Test.coffee | coffee --compile --stdio > $(PROJECT_NAME).js

production: make
	uglifyjs $(PROJECT_NAME).js -o $(PROJECT_NAME).min.js -c -m drop_console=true -d DEBUG=false
