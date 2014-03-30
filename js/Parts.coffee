class App.Part
	@new: (subClassName, master, container, className, id) ->
		return new App["Part" + subClassName]?(master, container, className, id)

	constructor: (@_master, container, @_className, @_id) ->
		if container not instanceof jQuery
			@_container = $ container
		else
			@_container = container

	makeContainer: () ->
		return $ "<div id='#{@_id}' class='#{@_className}' />"
	
	draw: () ->
		throw new Error("Override this method to implement it!")


##########
# DRUMKITS
class App.PartDrumkits extends App.Part
	constructor: (master, container, className, id) ->
		super master, container, className, id
	
	draw: () ->
		div			= @_container.find(".#{@_id}")
		firstDraw	= div.length is 0
		master		= @_master

		if firstDraw
			div = @makeContainer()

		div.empty()
		for kitName, kitFiles of master.getDrumkits()
			for instrumentName, filePath of kitFiles
				div.append """<div class="instrument" data-kitname="#{kitName}" data-instrumentname="#{instrumentName}">
								<div class="label" style="margin-top: 2px;">#{instrumentName}</div>
							</div>"""

		div.find(".instrument").draggable {
			cursor: "move"
			revert: "invalid"
			revertDuration: 200
			# start: (ev, ui) ->
			# 	ui.helper.addClass "dragging"
			# stop: (ev, ui) ->
			# 	ui.helper.removeClass "dragging"
		}

		if firstDraw
			@_container.append div

		return @


#############
# INSTRUMENTS
class App.PartInstruments extends App.Part
	constructor: (master, container, className, id) ->
		super master, container, className, id
	
	draw: () ->
		div			= @_container.find(".#{@_id}")
		firstDraw	= div.length is 0
		master		= @_master

		if firstDraw
			div = @makeContainer()

		div.empty()
		for instrument, idx in master.getInstruments()
			if instrument?
				name = instrument.getName()
				temp = $ """<div class="instrument">
								<input class="label" value="#{name}" />
								<!--span class="edit" title="rename instrument" /-->
								<span class="close" data-idx="#{idx}" title="delete instrument">&#10006;</span>
						</div>"""
				# temp.find(".edit").click () ->
				# 	elem = $(@)
				# 	elem.siblings(".label")
				# 		.prop "disabled", (i, oldProp) ->
				# 			return !oldProp
				# 		.focus()

				temp.find(".close").click () ->
					master.removeInstrument parseInt( @getAttribute("data-idx"), 10 )
					return false
			else
				name = "Drop drumkit here to add"
				temp = $ """<div class="droppableArea"><div class="instrument add"><div class="label" style="margin-top: 2px;">#{name}</div></div></div>"""
				# make it droppable
				temp.droppable {
					accept: "#drumkits .instrument"
					over: (ev, ui) ->
						temp.animate "padding-top": "34px", 200
						return @
					out: (ev, ui) ->
						temp.animate "padding-top": "0px", 200
						return @
					# add dropped instrument to all measures
					drop: (ev, ui) ->
						instrumentDiv = ui.draggable
						# get instrument info
						kitName = instrumentDiv.attr "data-kitname"
						instrumentName = instrumentDiv.attr "data-instrumentname"
						instrument = master.getDrumkits()[kitName][instrumentName]

						# instrument is ok => add to measures
						if instrument?
							master.addInstrument instrument

						# move originally dropped div back to the list => reset its positioning
						instrumentDiv.animate {
							left: 0
							top: 0
						}, 200

						return @
				}

			div.append temp

		if firstDraw
			@_container.append div

		return @


##############################
# PLAY BUTTONS & EXPORT BUTTON
class App.PartPlayButtons extends App.Part
	constructor: (master, container, className, id) ->
		super master, container, className, id

	# override
	makeContainer: () ->
		return $ "<div id='#{@_id}' class='#{@_className}' />"
	
	draw: () ->
		self		= @
		div			= @_container.find(".#{@_id}")
		master		= @_master

		if div.length > 0
			return @

		container = @makeContainer()
		div = container
				.append("<div class='playbutton play' /><div class='playbutton stop' /><div class='clear' /><button class='import'>Import</button><button class='export'>Export</button>")

		# toggle play/pause
		div.find(".play").click () ->
			t = $ @
			# resume playing
			if not master.isPlaying()
				t.addClass "pause"
				master.startPlaying()
			# pause
			else
				t.removeClass "pause"
				master.pause()

			return @
		# stop playing
		div.find(".stop").click () ->
			master.stop()
			div.find(".play").removeClass "pause"
			return @

		# import json
		div.find(".import").click () ->
			master.showPopup()
			return @
		# export json
		div.find(".export").click () ->
			master.export()
			return @

		@_container.append container

		return @


#######
# NOTES
class App.PartNotes extends App.Part
	constructor: (master, container, className, id) ->
		super master, container, className, id
	
	draw: () ->
		div			= @_container.find(".#{@_id}")
		firstDraw	= div.length is 0
		master		= @_master

		if firstDraw
			div = @makeContainer()

		div.empty()

		idx = 0
		for measure in master.getMeasures()
			mDiv = measure.draw().getDiv()

			mDiv.find(".column").each () ->
				$(@).attr("data-absidx", idx++)

			div.append mDiv

		if firstDraw
			@_container.append div

		return @

#################
# IMPORT / EXPORT
class App.PartImportExport extends App.Part
	constructor: (master, container, className, id) ->
		super master, container, className, id
		@_div = null
		@_text = ""
	
	draw: () ->
		div			= @_container.find(".#{@_id}")
		firstDraw	= div.length is 0
		master		= @_master

		if firstDraw
			div = @makeContainer().append	"""	<textarea id="copyFrom" class="text" />
												<!--button class="copy" data-clipboard-target="copyFrom" title="Click to copy data">copy</button-->
												<button class="import" title="import">import</button>
												<button class="close" title="close popup">close</button>
											"""

			div.find("button.import").click () =>
				master.import()
				return @
			div.find("button.close").click () ->
				master.hidePopup()
				return @

			@_div = div
			master.setPopup @_div
			@_container.append div
		return @

	# GETTERS & SETTERS
	getDiv: () ->
		return @_div
