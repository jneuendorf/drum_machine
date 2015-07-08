DM.Utils =
    arrayDiff: (arr1, arr2) ->
        res =
            added:      []
            removed:    []
            equal:      []

        arr1 = arr1.slice(0)
        arr2 = arr2.slice(0)


        for elem1 in arr1
            idx = arr2.indexOf elem1
            if idx >= 0
                res.equal.push elem1
                arr2.splice idx, 1
            else if idx is -1
                res.removed.push elem1

        # whatever remains in arr2 must have been added
        res.added = arr2

        return res
    getInstrumentAbbreviation: (instrumentName) ->
        words = instrumentName.split " "
        res = ""
        for word in words when isNaN(parseInt(word, 10))
            res += word.charAt(0).toUpperCase()
        return res
