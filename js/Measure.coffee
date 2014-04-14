class App.Measure
	@maxBPM: 480
	# how much will a quarter note be split? (4ths, 8ths, 16ths, 32nds, 64ths)
	@modes:		[1, 2, 4, 8, 16]
	# how big is the step size from one column to the next
	@stepSizes:	[16, 8, 4, 2, 1]

	count = 0
	@getID: () ->
		return "measure" + count++

	constructor: (@_drumMachine, @_instruments, quarterSplit, @_beats, @_bpm) ->
		modes = App.Measure.modes

		@_noteIndex = 0
		@_div = null
		@_id = App.Measure.getID()
		
		idx = App.Measure.modes.indexOf quarterSplit
		# set default to 8th notes
		if idx < 0
			idx = 1
		@_stepSize = App.Measure.stepSizes[idx]

		# init data
		data = []

		# init with null values
		xMax = @_beats * modes[modes.length - 1]
		yMax = _instruments.length
		for x in [0...xMax]
			# init column
			col = []
			col.push(null) for y in [0...yMax]
			data[x] = col

		@_data = data

	drawSettings: () ->
		# inner functions
		resetBPM = (ev, textfield) =>
			@setBPM parseInt(textfield.value, 10)
			return @

		resetStepSize = (ev, select) =>
			@setStepSize parseInt(select.value, 10)
			@draw()
			return @

		drawOptions = () =>
			res = ""
			for val, i in App.Measure.stepSizes
				# select current mode
				if @_stepSize isnt val
					res += "<option value='#{val}'>#{App.Measure.modes[i] * 4}th</option>"
				else
					res += "<option value='#{val}' selected>#{App.Measure.modes[i] * 4}th</option>"
			return res
		# end of inner functions


		settings = $ """<div class="measureSettings">
							<div class="split setting">
								<select class="select">
									#{do drawOptions}
								</select>
								notes,
							</div>
							<div class="bpm setting">
								BPM: <input class="bpm" type="number" value="#{@_bpm}" min="1" max="#{App.Measure.maxBPM}" />
							</div>
							<div class="close setting">
								&#10006;
							</div>
							<div class="clear" />
						</div>"""

		settings.find(".select").change (ev) ->
			return resetStepSize( ev, @ )

		settings.find("input.bpm").change (ev) ->
			return resetBPM( ev, @ )

		settings.find(".close").click (ev) =>
			return @remove()

		return settings

	draw: () ->
		div = @_div
		firstDraw = div not instanceof jQuery

		if firstDraw
			div = $ "<div class='measure' id='#{@_id}' />"

		# draw measure settings
		div.empty().append @drawSettings()

		for col, idx in @_data by @_stepSize
			# clone = instruments.clone()
			column = $ "<div class='column' data-colidx='#{idx}' />"

			# ignore last instrument because it's a pseudo instrument (drop area for new instruments)
			for i in [0...(col.length - 1)]
				note = col[i]
				note = $ "<div class='instrument note#{if note? then " active" else ""}' />"
				# click on note
				do (i, note, idx) =>
					note.click () =>
						@toggleNote(idx, i)
						if @noteIsActive(idx, i)
							note.addClass "active"
						else
							note.removeClass "active"
				column.append note

			div.append column
		
		# clear both after last column
		div.append "<div class='clear' />"

		if firstDraw
			@_div = div

		return @

	remove: () ->
		@_drumMachine.removeMeasure(@)
		return @

	toggleNote: (x, y) ->
		if @_data[x][y] instanceof App.Instrument
			@_data[x][y] = null
		else
			@_data[x][y] = @_instruments[y]

		return @

	noteIsActive: (x, y) ->
		return @_data[x][y] instanceof App.Instrument

	getDiv: () ->
		return @_div

	getNextColumn: (activeNotes = true, cycle = false) ->
		if @_noteIndex is @_data.length - 1
			if not cycle
				return @getColumnAtIndex(activeNotes, -1)
			# first column again
			else
				@_noteIndex = 0
		else
			@_noteIndex += @_stepSize

		return @getCurrentColumn(activeNotes)

	resetPosition: () ->
		@_noteIndex = 0
		return @

	getCurrentColumn: (activeNotes = true) ->
		return @getColumnAtIndex activeNotes, @_noteIndex

	getColumnAtIndex: (activeNotes, idx) ->
		# invalid index
		if idx < 0 or idx >= @_data.length
			return null
		# filter active notes
		if activeNotes is true
			return (instrument for instrument in @_data[idx] when instrument?)
		# entire column
		return @_data[idx]

	getIntervalDelay: () ->
		return ((@_beats * 60000) / @_bpm) / @getVisibleLength()

	getColumnDivs: () ->
		return @_div.find(".column")

	getCurrentColumnDiv: () ->
		# noteIndex is the index in @_data => adjust index for visible notes
		return @getColumnDivs().eq( @_noteIndex / @_stepSize )

	addInstumentToData: (instrument) ->
		# @_instruments.push instrument
		for col in @_data
			col.push null
		return @

	removeInstrumentFromData: (index) ->
		# the following is not necessary because the measure's instruments are just a reference to the drummachine's instrumens
		# @_instruments.splice index, 1
		for col in @_data
			col.splice index, 1
		return @

	serialize: () ->
		data = []
		for col in @_data
			temp = []
			for note in col
				if note?
					temp.push 1
				else
					temp.push 0
			data.push temp

		return {
			beats:	@_beats
			bpm:	@_bpm
			data:	data
		}

	########################
	# SETTERS
	setBPM: (bpm) ->
		if 1 <= bpm <= App.Measure.maxBPM
			@_bpm = Math.floor bpm
		else
			@_bpm = 120
		return @

	setStepSize: (stepSize) ->
		if stepSize in App.Measure.stepSizes
			@_stepSize = stepSize
		else
			@_stepSize = 2 # default is 8th notes
		return @

	setInstruments: (instruments) ->
		@_instruments = instruments
		return @

	setData: (data) ->
		@_data = data
		return @

	# GETTERS
	getDrumMachine: () ->
		return @_drumMachine

	getInstruments: () ->
		return @_instruments

	getVisibleLength: () ->
		return @_data.length / @_stepSize

	getBeats: () ->
		return @_beats

	getLength: () ->
		return @_data.length

	getID: () ->
		return @_id

	getNoteIndex: () ->
		return @_noteIndex

	getBPM: () ->
		return @_bpm