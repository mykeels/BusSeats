function doText(elem, val) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    if (val == "") {
        doc.setError(elem);
        return false;
    }
    else {
        doc.remError(elem);
        return true;
    }
}

function doNumber(elem, val) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    if (val._isNumeric()) {
        doc.remError(elem);
        return true;
    }
    else {
        doc.setError(elem);
        return false;
    }
}

function doEmail(elem, val) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    if (val.search(/.+@.+\..+/i) >= 0 && val.length > 0) {
        doc.remError(elem);
        return true;
    }
    else {
        doc.setError(elem);
        return false;
    }
}

function doPhone(elem, val) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    if (!val._isNumeric()) elem.value = elem.value._chompRight(1);
    if (val.search(/(\d+)([0-9]{9})$/) < 0) {
        doc.setError(elem);
        return false;
    }
    else {
        doc.remError(elem);
        return true;
    }
}

function doMinChars(elem, val, count) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    if (val.length >= count) {
        doc.remError(elem);
        return true;
    }
    else {
        doc.setError(elem);
        return false;
    }
}

function doCombo(elem, def_index) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (def_index == undefined) def_index = true;
    if (def_index) {
        if (elem.selectedIndex == 0) {
            doc.setError(elem);
            return false;
        }
        else {
            doc.remError(elem);
            return true;
        }
    }
    else {
        doc.remError(elem);
        return true;
    }
}

function doTypeNumber(elem) {
    if (typeof elem == "string") elem = doc.get(elem);
    //if (elem.getAttribute("type").toLowerCase() != "number") return;
    if (Number.isNaN(Number(elem.value))) {
        //elem.value = elem.getAttribute("min");
        var str = elem.value;
        while (!str._isNumeric()) {
            //str = str._chompRight(1);
            str = str._chompRight(1);
        }
        if (str == '') str = 0;
        elem.value = str;
    }
    if (elem.getAttribute("max")) {
        if (Number(elem.value) > Number(elem.getAttribute("max"))) {
            elem.value = elem.getAttribute("max");
        }
    }
    if (elem.getAttribute("min")) {
        if (elem.value < elem.getAttribute("min")) {
            elem.value = elem.getAttribute("min");
        }
    }
    
}

function doAlpha(elem, val) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    if (val._isAlpha() == false) {
        doc.setError(elem);
        return false;
    }
    else {
        doc.remError(elem);
        return true;
    }
}

function doRegex(elem, regex, val) {
    if (typeof elem == "string") elem = doc.get(elem);
    if (val == undefined) val = elem.value;
    regex = regex || /(\w*)/
    if (val.search(regex) < 0) {
        doc.setError(elem);
        return false;
    }
    else {
        doc.remError(elem);
        return true;
    }
}

function doDate(elem, correct, defaultdate) {
    var b = doRegex(elem, /^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (correct == true) {
        if (b == false) {
            var d = new Date();
            elem.value = defaultdate || d.getDate().pad(2) + "/" + Number(d.getMonth() + 1).pad(2) + "/" + d.getFullYear().pad(4);
            doRegex(elem, /^(\d{2})\/(\d{2})\/(\d{4})$/);
        }
    }
    return b;
}