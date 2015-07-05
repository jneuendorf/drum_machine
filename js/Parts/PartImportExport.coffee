#################
# IMPORT / EXPORT
class App.PartImportExport extends App.Part
    constructor: (master, container, className, id) ->
        super(master, container, className, id)
        @_div = null
        @_text = ""

    draw: () ->
        div         = @_container.find(".#{@_id}")
        firstDraw   = div.length is 0
        master      = @_master

        if firstDraw
            div = @makeContainer().append  """<textarea id="copyFrom" class="text" />
                                                <!--button class="copy" data-clipboard-target="copyFrom" title="Click to copy data">copy</button-->
                                                <button class="import" title="import">import</button>
                                                <button class="close" title="close popup">close</button>"""

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

    setText: (text, updateButton = true) ->
        @_text = text
        if updateButton is true
            @_div.find(".copy").attr "data-clipboard-text", @_text
        return @
