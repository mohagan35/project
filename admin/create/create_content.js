/*global alert: true */
/*global createHeader: true */
/*global createFormElement: true */
/*global createTable: true */
/*global createTrial: true */
/*global createNumberInput: true */
/*global replaceRow: true */
/*global efSelected: true */
/*global getNumberInputValue: true*/

/**
* Set footers' inital Y position
*/
window.onload = function () {
    "use strict";
    var footer = document.getElementById("footer"),
        footerRect = footer.getBoundingClientRect(),
        diffY = window.innerHeight - footerRect.top - 84;
    
    document.getElementById("footer").style.top = diffY + 'px';
};

/**
 *General Settings Block
 */
var ef_select = document.createElement("div");
ef_select.className = "form_element";
ef_select.id = "efTest";
ef_select.innerHTML = "<p>Choose an Executive Function to test: <p>" +
                    "<select id='efSelect' onchange='efChanged()'>" +
                        "<option id='select_option' value='Select'>...</option>" +
                        "<option value='Inhibition'>Inhibition</option>" +
                        "<option value='Switching'>Switching</option>" +
                        "<!--<option value='Updating'>Updating</option>--></select>";

/**
 *
 ** FUNCTIONS
 *
 */
function addHeader(name) {
    "use strict";
    var create_form = document.getElementById("create_form"),
        container = createFormElement(name, "_container", "container"),
        divbreak = document.createElement("div");
    divbreak.className = "break";
    
    if (document.getElementById(name + "_container") === null) {
        create_form.appendChild(createHeader(name));
        create_form.appendChild(divbreak);
        if (name === "Example" || name === "Practice") {
            container.appendChild(createFormElement(name, "", "prompt"));
        } else if (name === "Trials") {
            container.appendChild(createFormElement(name, "", "instructions_type", "Introduce the real trials: "));
            container.appendChild(createFormElement(name + "_instructions_type", "_container", "container"));
        } else if (name === "Results") {
            container.appendChild(createFormElement(name, "", "prompt"));
        } else if (name === "Submit") {
            container.appendChild(createFormElement(name, "", "instructions_type", "Leave a message: "));
            container.appendChild(createFormElement(name + "_instructions_type", "_container", "container"));
        }
        create_form.appendChild(container);
    }
}

function isCharacter(keynum) {
    "use strict";
    if ((keynum > 47 && keynum < 91) || (keynum > 95 && keynum < 112) || (keynum > 185)) {
        return true;
    }
    
    return false;
}
function keycodeToASCII(keynum) {
    "use strict";
    var output;
    
    if (keynum === 186) {
        output = String.fromCharCode(keynum - 127);
    } else if (keynum === 187) {
        output = String.fromCharCode(keynum - 126);
    } else if (keynum >= 188 && keynum <= 191) {
        output = String.fromCharCode(keynum - 144);
    } else if (keynum === 192) {
        output = String.fromCharCode(keynum - 153);
    } else if (keynum >= 219 && keynum <= 221) {
        output = String.fromCharCode(keynum - 128);
    } else if (keynum === 222) {
        output = String.fromCharCode(keynum - 187);
    } else {
        output = String.fromCharCode(keynum);
    }
    
    return output.toUpperCase();
}
function keyInputFocus(input) {
    "use strict";
    var pairID,
        row = parseInt(input.id.substring(23, 24), 10);
    
    if (row % 2 === 0) {
        row -= 1;
    } else {
        row += 1;
    }
    
    pairID = input.id.substring(0, 23) + row + input.id.substring(24, input.id.length);
    
    if (document.getElementById(pairID)) {
        if (document.getElementById(pairID).value !== "BLANK") {
            input.value = "BLANK";
        } else {
            input.value = "";
        }
    } else {
        input.value = "";
    }
}
function keyPressInput(e, input) {
    "use strict";
    var keynum,
        upperKey = input.value,
        pairID,
        row = parseInt(input.id.substring(23, 24), 10);
    
    if (row % 2 === 0) {
        row -= 1;
    } else {
        row += 1;
    }
    
    pairID = input.id.substring(0, 23) + row + input.id.substring(24, input.id.length);
    
    if (window.event) { // IE					
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera					
        keynum = e.which;
    }
    
    if (keynum) {
        if (isCharacter(keynum)) {
            upperKey = keycodeToASCII(keynum);
        } else if (keynum === 37) { //left
            upperKey = "\u25C4";
        } else if (keynum === 38) { //up
            upperKey = "\u25B2";
        } else if (keynum === 39) { //right 
            upperKey = "\u25BA";
        } else if (keynum === 40) { //down
            upperKey = "\u25BC";
        } else if (keynum === 32) {
            upperKey = "SPACE";
        } else if (keynum === 13) {
            upperKey = "ENTER";
        }
    }
    
    if (document.getElementById(pairID)) {
        if (upperKey !== document.getElementById(pairID).value) {
            input.value = upperKey;
        }
    } else {
        input.value = upperKey;
    }
    
    if (keynum !== 9) {
        event.returnValue = false;
    }
}
function folderInput(name, e) {
    "use strict";
    var keynum,
        i,
        bannedNonShiftKeyNums = [189, 187, 220, 191, 219, 221, 188, 190],
        bannedShiftKeyNums = [48, 49, 50, 53, 54, 55, 56, 57, 186, 187, 188, 190, 219, 221, 220, 191];
    
    if (window.event) { // IE					
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera					
        keynum = e.which;
    }
    
    if (e.shiftKey === false) {
        for (i = 0; i < bannedShiftKeyNums.length; i += 1) {
            if (keynum === bannedNonShiftKeyNums[i]) {
                event.returnValue = false;
            }
        }
    } else {
        for (i = 0; i < bannedShiftKeyNums.length; i += 1) {
            if (keynum === bannedShiftKeyNums[i]) {
                event.returnValue = false;
            }
        }
    }
}
function numberTextInput(e) {
    "use strict";
    var keynum,
        i,
        allowedKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
                       96, 97, 98, 99, 100, 101, 102, 103, 104, 105,
                       8, 9, 37, 38, 39, 40, 45, 46 ];
    
    if (window.event) { // IE					
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera					
        keynum = e.which;
    }
    
    for (i = 0; i < allowedKeys.length; i += 1) {
        if (keynum === allowedKeys[i]) {
            event.returnValue = true;
            return;
        }
    }
    event.returnValue = false;
}

function alterStimuli(name, row, col, input) {
    "use strict";
    var i,
        n,
        taskDiv,
        valueSelect,
        valueOption1,
        valueOption2,
        leftElement = document.getElementById("General_stim_number_left"),
        rightElement = document.getElementById("General_stim_number_right");
    
    if (leftElement) {
        n = 10 * parseInt(leftElement.value, 10) + parseInt(rightElement.value, 10);
        
        if ((input.value !== "" && col === 0) || (col > 0)) {
            for (i = 1; i <= n; i += 1) {
                if (document.getElementById("General_stim_" + row + "_" + col + "_" + i)) {
                    if (col === 0) {
                        document.getElementById("General_stim_" + row + "_" + col + "_" + i).innerHTML = input.value + ": ";
                    } else {
                        document.getElementById("General_stim_" + row + "_" + col + "_" + i).innerHTML = input.value;
                    }
                } else if (document.getElementById("General_task_table_td_" + row + "_0_input").value !== "" && document.getElementById("General_task_table_td_" + row + "_1_input").value !== "" && document.getElementById("General_task_table_td_" + row + "_2_input").value !== "") {
                    taskDiv = document.createElement("div");
                    taskDiv.className = "empty";
                    taskDiv.id = "General_stim_" + row + "_0_" + i;
                    taskDiv.innerHTML = document.getElementById("General_task_table_td_" + row + "_0_input").value + ": ";
                    document.getElementById("General_stim_task_" + row + "_" + i).appendChild(taskDiv);
                    

                    if (document.getElementById("General_stim_select_" + row + "_" + i) === null) {
                        valueSelect = document.createElement("select");
                        valueSelect.id = "General_stim_select_" + row + "_" + i;
                        valueOption1 = document.createElement("option");
                        valueOption2 = document.createElement("option");
                        valueOption1.id = "General_stim_" + row + "_1_" + i;
                        valueOption2.id = "General_stim_" + row + "_2_" + i;
                        valueOption1.text = document.getElementById("General_task_table_td_" + row + "_1_input").value;
                        valueOption2.text = document.getElementById("General_task_table_td_" + row + "_2_input").value;
                        valueSelect.add(valueOption1);
                        valueSelect.add(valueOption2);
                        
                        document.getElementById("General_stim_task_" + row + "_" + i).innerHTML += " ";
                        document.getElementById("General_stim_task_" + row + "_" + i).appendChild(valueSelect);
                    }
                }
            }
        } else {
            for (i = 1; i <= n; i += 1) {
                if (document.getElementById("General_stim_" + row + "_0_" + i) && col === 0) {
                    document.getElementById("General_stim_select_" + row + "_" + i).parentNode.removeChild(document.getElementById("General_stim_select_" + row + "_" + i));
                    document.getElementById("General_stim_" + row + "_0_" + i).parentNode.removeChild(document.getElementById("General_stim_" + row + "_0_" + i));
                }
            }
        }
        
    }
    
}
function addStimuli(name, n) {
    "use strict";
    var i,
        container = document.getElementById(name + "_stim_container");
    
    for (i = n + 1; i < 101; i += 1) {
        if (document.getElementById(name + "_stim_" + i)) {
            document.getElementById(name + "_stim_" + i).parentNode.removeChild(document.getElementById(name + "_stim_" + i));
        }
    }
    
    for (i = 1; i <= n; i += 1) {
        if (document.getElementById(name + "_stim_" + i) === null) {
            container.appendChild(createFormElement(name, "_center", "stim", i));
        }
    }
}
function addTrials(name, n) {
    "use strict";
    var i,
        container = document.getElementById(name + "_trial_container");
    
    for (i = n + 1; i < 101; i += 1) {
        if (document.getElementById(name + "_trial_" + i)) {
            document.getElementById(name + "_trial_" + i).parentNode.removeChild(document.getElementById(name + "_trial_" + i));
        }
    }
    
    for (i = 1; i <= n; i += 1) {
        if (document.getElementById(name + "_trial_" + i) === null) {
            container.appendChild(createTrial(name, "", i, getNumberInputValue("General", "stim")));
        }
    }
}
function alterTrials(name, typeChanged) {
    "use strict";
    var i,
        j,
        select1,
        select2,
        selectedOption1,
        selectedOption2,
        trialN = getNumberInputValue(name, "trial"),
        selectTask;
    
    if (typeChanged === "stim") {
        for (i = 1; i <= trialN; i += 1) {
            select1 = document.getElementById(name + "_trial_select_left_" + i);
            select2 = document.getElementById(name + "_trial_select_right_" + i);
            selectedOption1 = select1.options[select1.selectedIndex].value;
            selectedOption2 = select1.options[select2.selectedIndex].value;
            select1.innerHTML = "";
            select2.innerHTML = "";
            
            for (j = 1; j <= getNumberInputValue("General", "stim"); j += 1) {
                select1.innerHTML += "<option>Stimulus " + j + "</option>";
                select2.innerHTML += "<option>Stimulus " + j + "</option>";
            }
            
            try {
                select1.value =  selectedOption1;
                select2.value =  selectedOption2;
            } catch (e) {}
        }
    } else if (typeChanged === "task") {
        for (i = 1; i <= trialN; i += 1) {
            selectTask = document.getElementById(name + "_trial_select_task_" + i);
            try {
                selectedOption1 = selectTask.options[selectTask.selectedIndex].value;
            } catch (eO) {}
            selectTask.innerHTML = "";
            
            for (j = 1; j < 5; j += 1) {
                if (document.getElementById("General_task_table_td_" + j + "_0_input").value !== "") {
                    selectTask.innerHTML += "<option>" + document.getElementById("General_task_table_td_" + j + "_0_input").value + "</option>";
                }
            }
            
            try {
                selectTask.value =  selectedOption1;
            } catch (eT) {}
        }
    }
}
function alterSeriesTable(n, type) {
    "use strict";
    var count = 1,
        start = 1;
    
    if (document.getElementById("General_enter_" + type + "_" + n + "_input")) {
        while (document.getElementById("General_enter_" + type + "_" + (n + count) + "_input")) {
            document.getElementById("General_enter_" + type + "_" + (n + count) + "_input").parentNode.removeChild(document.getElementById("General_enter_" + type + "_" + (n + count) + "_input"));
            count += 1;
        }
        count = 1;
    } else {
        while (document.getElementById("General_enter_" + type + "_" + start + "_input")) {
            start += 1;
        }
        while (start <= n) {
            document.getElementById("General_enter_" + type).innerHTML += "<p><input id='General_enter_" + type + "_" + start + "_input' type='text' maxlength='2' onkeydown=\"numberTextInput(event, '" + type + "'," + start + ")\">";
            start += 1;
        }
    }
}

function appendNext(container, nextElement, nextContainer) {
    "use strict";
    var divbreak = document.createElement("div"),
        divbreak2 = document.createElement("div");
    
    divbreak.className = "break";
    divbreak2.className = "break";
    
    if (nextElement && document.getElementById(nextElement.id) === null) {
        divbreak.id = nextElement.id + "_break";
        container.appendChild(divbreak);
        container.appendChild(nextElement);
    }
    if (nextContainer && document.getElementById(nextContainer.id) === null) {
        divbreak2.id = nextContainer.id + "_break";
        container.appendChild(divbreak2);
        container.appendChild(nextContainer);
    }
}

function cueTypeChanged(name, type) {
    "use strict";
    var container = document.getElementById(name + "_container"),
        task1Container,
        task2Container,
        task3Container,
        task4Container,
        tasksArray = [],
        inputContainer = document.getElementById(name + "_cue_container"),
        nextElement,
        nextContainer,
        cueSwitch,
        cue_image_check = document.getElementById(name + "_cue_image_check"),
        cue_audio_check = document.getElementById(name + "_cue_audio_check"),
        i,
        taskIndex = document.getElementById("General_task_select").selectedIndex,
        divbreaks = [document.createElement("div"), document.createElement("div"), document.createElement("div"), document.createElement("div")];
    
    for (i = 0; i < divbreaks.length; i += 1) {
        divbreaks[i].className = "minbreak";
    }
    
    if (efSelected === "Switching") {
        cueSwitch = document.getElementById(name + "_cue_switch");
    }
    
    if (document.getElementById(name + "_task1_container")) {
        task1Container = document.getElementById(name + "_task1_container");
    } else {
        task1Container = createFormElement(name + "_task1", "_container", "container");
        inputContainer.appendChild(task1Container);
    }
    tasksArray.push(task1Container);
    if (cueSwitch) {
        if (cueSwitch.checked) {
            if (taskIndex > 0) {
                if (document.getElementById(name + "_task2_container")) {
                    task2Container = document.getElementById(name + "_task2_container");
                } else {
                    task2Container = createFormElement(name + "_task2", "_container", "container");
                    inputContainer.appendChild(task2Container);
                }
                tasksArray.push(task2Container);
            }
            if (taskIndex > 1) {
                if (document.getElementById(name + "_task3_container")) {
                    task3Container = document.getElementById(name + "_task3_container");
                } else {
                    task3Container = createFormElement(name + "_task3", "_container", "container");
                    inputContainer.appendChild(task3Container);
                }
                tasksArray.push(task3Container);
            }
            if (taskIndex > 2) {
                if (document.getElementById(name + "_task4_container")) {
                    task4Container = document.getElementById(name + "_task4_container");
                } else {
                    task4Container = createFormElement(name + "_task4", "_container", "container");
                    inputContainer.appendChild(task4Container);
                }
                tasksArray.push(task4Container);
            }
        }
    }
    
    if (type === "task") {
        for (i = 0; i < tasksArray.length; i += 1) {
            if (document.getElementById(name + "_cue_" + i + "_sub_title")) {
                document.getElementById(name + "_cue_" + i + "_sub_title").parentNode.replaceChild(createFormElement(name + "_cue_" + i, "_left", "sub_title", "<b>" + document.getElementById("General_task_table_td_" + (i + 1) + "_0_input").value + ": </b>"), document.getElementById(name + "_cue_" + i + "_sub_title"));
            } else {
                tasksArray[i].appendChild(createFormElement(name + "_cue_" + i,
                                                            "_left", "sub_title", "<b>" + document.getElementById("General_task_table_td_" + (i + 1) + "_0_input").value + ": </b>"));
                divbreaks[i].id = name + "_cue_sub_title_" + i + "_break";
                tasksArray[i].appendChild(divbreaks[i]);
            }

            if (cue_image_check.checked === true) {
                if (document.getElementById(name + "_cue_" + i + "_image") === null) {
                    tasksArray[i].appendChild(createFormElement(name + "_cue_" + i, "_left", "image"));
                }
            }
            if (cue_audio_check.checked === true) {
                if (document.getElementById(name + "_cue_" + i + "_audio") === null) {
                    tasksArray[i].appendChild(createFormElement(name + "_cue_" + i, "_left", "audio"));
                }
            }
        }
        return;
    } else {
        for (i = 0; i < tasksArray.length; i += 1) {
            if (tasksArray[i].innerHTML === "") {
                tasksArray[i].appendChild(createFormElement(name + "_cue_" + i,
                                                            "_left", "sub_title", "<b>" + document.getElementById("General_task_table_td_" + (i + 1) + "_0_input").value + ": </b>"));
                divbreaks[i].id = name + "_cue_sub_title_" + i + "_break";
                tasksArray[i].appendChild(divbreaks[i]);
            }

            if (type === "image") {
                if (document.getElementById(name + "_cue_" + i + "_image") === null) {
                    tasksArray[i].appendChild(createFormElement(name + "_cue_" + i, "_left", "image"));
                } else if (document.getElementById(name + "_cue_" + i + "_audio") === null) {
                    cue_image_check.checked = true;
                } else if (cue_image_check.checked === false) {
                    tasksArray[i].removeChild(document.getElementById(name + "_cue_" + i + "_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_cue_" + i + "_audio") === null) {
                    tasksArray[i].appendChild(createFormElement(name + "_cue_" + i, "_left", "audio"));
                } else if (document.getElementById(name + "_cue_" + i + "_image") === null) {
                    cue_audio_check.checked = true;
                } else if (cue_audio_check.checked === false) {
                    tasksArray[i].removeChild(document.getElementById(name + "_cue_" + i + "_audio"));
                }
            }
        }
    }
    
    nextElement = createFormElement(name, "", "feedback_prompt");
    nextContainer = createFormElement(name + "_feedback", "_container", "container");
    appendNext(container, nextElement, nextContainer);
    
    document.getElementById(name + "_cue_type").scrollIntoView();
}

function taskInput(name, row, col, input) {
    "use strict";
    var calcRow = (parseInt(row, 10) - 1) * 2 + parseInt(col, 10),
        i,
        key = document.getElementById(name + "_value_table" + "_td_" + calcRow + "_1");
    
    if (col > 0) {
        document.getElementById(name + "_value_table" + "_td_" + calcRow + "_0").innerHTML = input.value;
        if (key) {
            if (input.value !== "") {
                key.innerHTML = "<input class='key' id='" + name + "_value_table_td_" + calcRow + "_1_input' onfocus='keyInputFocus(this)' onkeydown='keyPressInput(event, this)' readonly>";
            } else {
                key.innerHTML = "";
            }
        }
    } else {
        if (document.getElementById("Practice_cue_0_sub_title")) {
            cueTypeChanged("Practice", "task");
        }
        if (document.getElementById("Trials_cue_0_sub_title")) {
            cueTypeChanged("Trials", "task");
        }
    }
    alterStimuli(name, parseInt(row, 10), parseInt(col, 10), input);
    
    if (document.getElementById("Example_trial_number")) {
        alterTrials("Example", "task");
    }
}
function numberPressInput(e, dir, name, type) {
    "use strict";
    var leftNum = 0,
        rightNum,
        tempNum,
        keynum,
        outputNum,
        minNum,
        maxNum,
        maxLeft,
        maxRight,
        diff,
        rightElement = document.getElementById(name + "_" + type + "_number_right"),
        leftElement = document.getElementById(name + "_" + type + "_number_left");

    if (window.event) { // IE					
        keynum = e.keyCode;
    } else if (e.which) { // Netscape/Firefox/Opera					
        keynum = e.which;
    }
    
    if (type === "stim" || type === "cue") {
        minNum = 1;
    } else if (type === "trial") {
        if (name === "Example") {
            minNum = 1;
        } else {
            minNum = 2;
        }
        maxNum = 99;
    } else if (type === "switches") {
        minNum = 0;
        maxNum = 10 * parseInt(document.getElementById(name + "_trial_number_left").value, 10) +
                    parseInt(document.getElementById(name + "_trial_number_right").value, 10) - 1;
    } else if (type === "congruent") {
        minNum = 0;
        maxNum = 10 * parseInt(document.getElementById(name + "_trial_number_left").value, 10) +
                    parseInt(document.getElementById(name + "_trial_number_right").value, 10);
    } else if (type === "diff_lengths") {
        minNum = 1;
    }
    
    rightNum = minNum;
    maxLeft = parseInt(maxNum / 10, 10);
    maxRight = maxNum % 10;
    
    //subtract 48 to convert ascii to int
    tempNum = keynum - 48;
    
    if (dir === "right") {
        if (parseInt(leftElement.value, 10) === 0) {
            if (tempNum > (minNum - 1) && tempNum < 10) {
                rightNum = tempNum;
            }
        } else if (tempNum >= 0 && tempNum < 10) {
            rightNum = tempNum;
        }
        
        if (parseInt(leftElement.value, 10) * 10 + tempNum > maxNum) {
            rightNum = maxRight;
        }
    } else if (tempNum >= 0 && tempNum < 10) {
        leftNum = tempNum;
        if (parseInt(rightElement.value, 10) < minNum) {
            rightElement.value = minNum;
        }
        
        if (tempNum * 10 + parseInt(rightElement.value, 10) > maxNum) {
            leftNum = maxLeft;
            rightElement.value = maxRight;
        }
    }
        
    if (dir === "left") {
        leftElement.value = leftNum;
    } else if (dir === "right") {
        rightElement.value = rightNum;
    }
    
    outputNum = 10 * parseInt(leftElement.value, 10) + parseInt(rightElement.value, 10);
    
    if (type === "stim") {
        addStimuli(name, outputNum);
        if (document.getElementById("Example_trial_number")) {
            alterTrials("Example", "stim");
        }
    } else if (type === "trial") {
        if (name === "Example") {
            addTrials(name, outputNum);
        } else {
            if (efSelected === "Switching") {
                if (parseInt(document.getElementById(name + "_switches_number_left").value, 10) * 10 + parseInt(document.getElementById(name + "_switches_number_right").value, 10) - 1 > outputNum) {
                    maxLeft = parseInt((outputNum - 1) / 10, 10);
                    maxRight = (outputNum - 1) % 10;
                    document.getElementById(name + "_switches_number_left").value = maxLeft;
                    document.getElementById(name + "_switches_number_right").value = maxRight;
                }
            }
            if (parseInt(document.getElementById(name + "_congruent_number_left").value, 10) * 10 + parseInt(document.getElementById(name + "_congruent_number_right").value, 10) > outputNum) {
                maxLeft = parseInt(outputNum / 10, 10);
                maxRight = outputNum % 10;
                tempNum = 10 * maxLeft + maxRight;
                document.getElementById(name + "_congruent_number_left").value = maxLeft;
                document.getElementById(name + "_congruent_number_right").value = maxRight;
                document.getElementById(name + "_incongruent_sub_title").innerHTML = "<br><br><i>Number of incongruent: " + (outputNum - tempNum) + "</i>";
            } else {
                document.getElementById(name + "_incongruent_sub_title").innerHTML = "<br><br><i>Number of incongruent: " + (outputNum - getNumberInputValue(name, "congruent")) + "</i>";
            }
        }
    } else if (type === "congruent") {
        document.getElementById(name + "_incongruent_sub_title").innerHTML = "<br><br><i>Number of incongruent: " + (maxNum - outputNum) + "</i>";
    } else if (type === "diff_lengths") {
        maxLeft = parseInt(outputNum / 10, 10);
        maxRight = outputNum % 10;
        tempNum = 10 * maxLeft + maxRight;
        alterSeriesTable(tempNum, "lengths");
        alterSeriesTable(tempNum, "frequencies");
    }
    
    document.getElementById(name + "_" + type + "_number").scrollIntoView();
}

function genericInput(name, type) {
    "use strict";
    var container = document.getElementById(name + "_container"),
        nextElement,
        nextContainer,
        scrollTo = document.getElementById(name + "_" + type),
        divbreak = document.createElement("div");
    
    divbreak.className = "break";
    
    if (name === "Example") {
        if (type === "correct_stim") {
            nextElement = createFormElement("Example", "", "feedback_prompt");
            scrollTo = document.getElementById("Example_1_stimage");
        }
    } else if (type === "random_prompt") {
        nextElement = createNumberInput(name, "", "trial");
        nextContainer = createFormElement(name + "_trial", "_container", "container");
        appendNext(container, nextElement, nextContainer);
        
        nextContainer = createFormElement(name + "_switches", "_container", "container");
        if (efSelected === "Switching") {
            nextContainer.appendChild(createNumberInput(name, "", "switches"));
        }
        appendNext(container, nextElement, nextContainer);
        
        nextContainer = createFormElement(name + "_trial_congruent", "_container", "container");
        nextContainer.appendChild(createNumberInput(name, "", "congruent"));
        nextContainer.appendChild(createFormElement(name + "_incongruent", "_center", "sub_title", "<br><br><i>Number of incongruent: 1</i>"));
        appendNext(container, nextElement, nextContainer);
        
        nextElement = createFormElement(name, "", "response_time", "stimuli");
        
        if (name === "Practice") {
            addHeader("Trials");
        } else if (name === "Trials") {
            addHeader("Submit");
        }
    }
    
    appendNext(container, nextElement, nextContainer);
    scrollTo.scrollIntoView();
}

function seriesPrompt() {
    "use strict";
    var create_form = document.getElementById("create_form"),
        divbreak = document.createElement("div"),
        divbreak2 = document.createElement("div"),
        introduction_container = createFormElement("Introduction", "_container", "container");
    
    divbreak.className = "break";
    divbreak2.className = "break";
    
    if (document.getElementById("General_series_prompt_yes").checked) {
        if (document.getElementById("General_diff_lengths_number") === null) {
            document.getElementById("General_series_container").appendChild(createNumberInput("General", "", "diff_lengths"));
            document.getElementById("General_series_container").appendChild(divbreak);
            document.getElementById("General_series_container").appendChild(createFormElement("General", "_center", "enter_lengths", 1));
            document.getElementById("General_series_container").appendChild(createFormElement("General", "_center", "enter_frequencies", 1));
        }
    } else if (document.getElementById("General_series_prompt_no").checked && document.getElementById("Introduction_header") === null) {
        document.getElementById("General_series_container").innerHTML = "";
        create_form.appendChild(divbreak);
        create_form.appendChild(createHeader("Introduction"));
        create_form.appendChild(divbreak2);
        introduction_container.appendChild(createFormElement("Introduction", "", "instructions_type", "Introduce the test: "));
        introduction_container.appendChild(createFormElement("Introduction_instructions_type", "_container", "container"));
        create_form.appendChild(introduction_container);
    } else if (document.getElementById("General_series_prompt_no").checked) {
        document.getElementById("General_series_container").innerHTML = "";
    }
    
    document.getElementById("General_series_prompt").scrollIntoView();
}

function backgroundToggle(name, toggle) {
    "use strict";
    var background_container = document.getElementById(name + "_background_container"),
        container = document.getElementById(name + "_container"),
        nextElement,
        nextContainer,
        taskTable,
        valueTable,
        divbreak = document.createElement("div"),
        divbreak2 = document.createElement("div");
    
    divbreak.className = "break";
    
    if (name === "General") {
        nextElement = createFormElement(name, "", "task");
        taskTable = createTable(name, "_center", "task", 5, 3, [ '<b>Task Name</b>', '<b>Value 1</b>', '<b>Value 2</b>']);
        valueTable = createTable(name, "_center", "value", 9, 2, [ '<b>Value Name</b>', '<b>Key Press</b>']);
        nextContainer = createFormElement(name + "_task", "_container", "container");
        nextContainer.appendChild(taskTable);
        nextContainer.appendChild(valueTable);
        nextContainer.appendChild(divbreak2);
        nextContainer.appendChild(ef_select);
    } else {
        if (name === "Introduction") {
            nextElement = createFormElement(name, "", "instructions_type", "Introduce the test: ");
        } else if (name === "Trials") {
            nextElement = createFormElement(name, "", "instructions_type", "Introduce the real trials: ");
        } else {
            nextElement = createFormElement(name, "", "instructions_type", "Introduce the " + name + " trials: ");
        }
        nextContainer = createFormElement(name + "_instructions_type", "_container", "container");
    }
    
    if (toggle === "yes" && document.getElementById(name + "_background_image") === null) {
        background_container.appendChild(divbreak);
        background_container.appendChild(createFormElement(name + "_background", "_center", "image"));
    } else if (toggle === "no") {
        background_container.innerHTML = "";
    }
    
    appendNext(container, nextElement, nextContainer);
    
    if (name === "Introduction") {
        document.getElementById("Introduction_header").scrollIntoView();
    } else {
        document.getElementById(name + "_background_prompt").scrollIntoView();
    }
}

function efChanged() {
    "use strict";
    var efSelect = document.getElementById("efSelect"),
        divbreak3 = document.createElement("div"),
        cueNames = ["Example", "Practice", "Trials"],
        taskIndex = document.getElementById("General_task_select").selectedIndex,
        i,
        setSelected = -1,
        nextElement,
        nextContainer,
        general_container = document.getElementById("General_container");
    
    efSelected = efSelect.options[efSelect.selectedIndex].value;
    divbreak3.className = "break";
    
    if (efSelected !== "Select" && document.getElementById("General_series_prompt") === null) {
        document.getElementById("select_option").parentNode.removeChild(document.getElementById("select_option"));
        
        nextElement = createNumberInput("General", "", "stim");
        nextContainer = createFormElement("General_stim", "_container", "container");
        nextContainer.appendChild(createFormElement("General", "_center", "stim", "1"));
        nextContainer.appendChild(createFormElement("General", "_center", "stim", "2"));
        nextContainer.appendChild(createFormElement("General", "_center", "stim", "3"));
        nextContainer.appendChild(createFormElement("General", "_center", "stim", "4"));
        appendNext(general_container, nextElement, nextContainer);
        
        nextElement = createFormElement("General", "", "series_prompt");
        nextContainer = createFormElement("General_series", "_container", "container");
        appendNext(general_container, nextElement, nextContainer);
        
        document.getElementById("efTest").scrollIntoView();
    } else {
        for (i = 0; i < cueNames.length; i += 1) {
            if (efSelected === "Inhibition") {
                if (document.getElementById(cueNames[i] + "_switches_number")) {
                    document.getElementById(cueNames[i] + "_switches_number").parentNode.removeChild(document.getElementById(cueNames[i] + "_switches_number"));
                }
                
                if (document.getElementById(cueNames[i] + "_task4_container")) {
                    document.getElementById(cueNames[i] + "_task4_container").innerHTML = "";
                }
                if (document.getElementById(cueNames[i] + "_task3_container")) {
                    document.getElementById(cueNames[i] + "_task3_container").innerHTML = "";
                }
                if (document.getElementById(cueNames[i] + "_task2_container")) {
                    document.getElementById(cueNames[i] + "_task2_container").innerHTML = "";
                }
            } else if (efSelected === "Switching") {
                if (document.getElementById(cueNames[i] + "_trial_container") && document.getElementById(cueNames[i] + "_switches_number") === null) {
                    document.getElementById(cueNames[i] + "_trial_container").appendChild(createNumberInput(cueNames[i], "", "switches"));
                }
            }
            
            if (document.getElementById(cueNames[i] + "_cue_switch")) {
                if (document.getElementById(cueNames[i] + "_cue_switch").checked) {
                    setSelected = 1;
                }
            }
            
            if (document.getElementById(cueNames[i] + "_cue_prompt")) {
                if (document.getElementById(cueNames[i] + "_cue_trial").checked) {
                    setSelected = 0;
                } else if (document.getElementById(cueNames[i] + "_cue_never").checked) {
                    setSelected = 2;
                }
                
                document.getElementById(cueNames[i] + "_cue_prompt").parentNode.replaceChild(createFormElement(cueNames[i], "", "cue_prompt"), document.getElementById(cueNames[i] + "_cue_prompt"));
            }
            if (i > 0 && document.getElementById(cueNames[i] + "_cue_container")) {
                if (setSelected === 0) {
                    document.getElementById(cueNames[i] + "_cue_trial").checked = true;
                    if (document.getElementById(cueNames[i] + "_cue_number") === null) {
                        document.getElementById(cueNames[i] + "_cue_container").appendChild(createNumberInput(cueNames[i], "", "cue"));
                        document.getElementById(cueNames[i] + "_cue_container").appendChild(divbreak3);
                        document.getElementById(cueNames[i] + "_cue_container").appendChild(createFormElement(cueNames[i], "", "cue_type"));
                    }
                } else if (setSelected === 1) {
                    document.getElementById(cueNames[i] + "_cue_trial").checked = true;
                    if (document.getElementById(cueNames[i] + "_cue_number") === null) {
                        document.getElementById(cueNames[i] + "_cue_container").appendChild(createNumberInput(cueNames[i], "", "cue"));
                        document.getElementById(cueNames[i] + "_cue_container").appendChild(divbreak3);
                        document.getElementById(cueNames[i] + "_cue_container").appendChild(createFormElement(cueNames[i], "", "cue_type"));
                    }
                } else if (setSelected === 2) {
                    document.getElementById(cueNames[i] + "_cue_never").checked = true;
                }
            }
        }
    }
}

function dropDown(name, type, dropdown) {
    "use strict";
    var i,
        j,
        temp,
        value = dropdown.options[dropdown.selectedIndex].value,
        divbreak = document.createElement("div");
    
    if (type === "task") {
        for (i = 1; i < 5; i += 1) {
            for (j = 0; j < 3; j += 1) {
                temp = document.getElementById(name + "_" + type + "_table_td_" + i + "_" + j + "_input");
                
                if (value === "1") {
                    if (i > 1) {
                        temp.disabled = true;
                        temp.value = "";
                        taskInput(name, i, j, temp);
                    }
                } else if (value === "2") {
                    if (i === 2) {
                        temp.disabled = false;
                    } else if (i > 2) {
                        temp.disabled = true;
                        temp.value = "";
                        taskInput(name, i, j, temp);
                    }
                } else if (value === "3") {
                    if (i <= 3) {
                        temp.disabled = false;
                    } else if (i === 4) {
                        temp.disabled = true;
                        temp.value = "";
                        taskInput(name, i, j, temp);
                    }
                } else if (value === "4") {
                    temp.disabled = false;
                }
            }
        }
    }
    
    document.getElementById(name + "_" + type).scrollIntoView();
}

function instructionsTypeChanged(name, type, pageNum) {
    "use strict";
    var container = document.getElementById(name + "_container"),
        instructions_input_text,
        instructions_audio,
        instructions_image,
        nextElement,
        nextContainer,
        pageAppend = "",
        divbreak = document.createElement("div"),
        divbreak2 = document.createElement("div");
    
    divbreak.className = "break";
    divbreak2.className = "break";
    
    if (pageNum) {
        pageAppend += "_" + pageNum;
    }
    
    if (name === "Introduction") {
        if (pageNum) {
            nextElement = createFormElement(name, "", "page_prompt", pageNum + 1);
        } else {
            nextElement = createFormElement(name, "", "page_prompt", 2);
        }
    } else if (name === "Results") {
        nextElement = createFormElement(name, "", "results_type");
    } else if (name === "Submit") {
        nextElement = createFormElement(name, "_left", "input_textline", "<br><br><br><button class='proceed' type='button' onmouseup='validateForm()'>SUBMIT</button><div class='break'></div><div class='break'></div><div class='break'></div><div id='dlLink'></div><p><br><i>NOTE: Place the downloaded html file in any new folder on your local server.<br>All assets must be placed in a folder called 'assets' within this folder.<p>Place your jQuery library and jsPsych library in a folder called 'js' in your chosen folder.<br>Make sure your jQuery and jsPsych folders are named 'jquery' and 'jspsych'. I.e. remove any version numbering from the name.</i>");
    } else {
        nextElement = createFormElement(name, "", "cue_prompt");
        nextContainer = createFormElement(name + "_cue", "_container", "container");
    }
    
    if (document.getElementById(name + "_instructions_type" + pageAppend + "_container") === null) {
        document.getElementById(name + "_container").appendChild(divbreak);
        document.getElementById(name + "_container").appendChild(createFormElement(name + "_instructions_type" + pageAppend, "_container", "container"));
    }
    
    instructions_input_text = document.getElementById(name + "_instructions_input_textarea" + pageAppend);
    instructions_audio = document.getElementById(name + "_instructions_audio" + pageAppend);
    instructions_image = document.getElementById(name + "_instructions_image" + pageAppend);
            
    if (type === "text") {
        if (instructions_input_text !== null) {
            if (instructions_audio !== null || instructions_image !== null) {
                instructions_input_text.parentNode.removeChild(instructions_input_text);
            } else {
                document.getElementById(name + "_instructions_text_check" + pageAppend).checked = true;
            }
        } else if (document.getElementById(name + "_instructions_input_textarea" + pageAppend) === null) {
            document.getElementById(name + "_instructions_type" + pageAppend + "_container").appendChild(createFormElement(name + "_instructions", "_center", "input_textarea", pageNum));
        }
    } else if (type === "audio") {
        if (instructions_audio !== null) {
            if (instructions_input_text !== null || instructions_image !== null) {
                instructions_audio.parentNode.removeChild(instructions_audio);
            } else {
                document.getElementById(name + "_instructions_audio_check" + pageAppend).checked = true;
            }
        } else if (document.getElementById(name + "_instructions_audio" + pageAppend) === null) {
            document.getElementById(name + "_instructions_type"  + pageAppend + "_container").appendChild(createFormElement(name + "_instructions", "_center", "audio", pageNum));
        }
    } else if (type === "image") {
        if (instructions_image !== null) {
            if (instructions_input_text !== null || instructions_audio !== null) {
                instructions_image.parentNode.removeChild(instructions_image);
            } else {
                document.getElementById(name + "_instructions_image_check" + pageAppend).checked = true;
            }
        } else if (document.getElementById(name + "_instructions_image" + pageAppend) === null) {
            document.getElementById(name + "_instructions_type"  + pageAppend + "_container").appendChild(createFormElement(name + "_instructions", "_center", "image", pageNum));
        }
    }
    
    appendNext(container, nextElement, nextContainer);
    
    if (document.getElementById("Introduction_page_prompt_" + (pageNum + 1)) && document.getElementById("Example_header")) {
        document.getElementById("Introduction_page_prompt_no_" + (pageNum + 1)).checked = true;
    }
    
    if (name === "Trials" || name === "Submit" || (name === "Introduction" && pageNum === undefined)) {
        document.getElementById(name + "_header").scrollIntoView();
    } else {
        document.getElementById(name + "_instructions_type" + pageAppend).scrollIntoView();
    }
}

function promptToggle(name, toggle) {
    "use strict";
    var create_form = document.getElementById("create_form"),
        container = document.getElementById(name + "_container"),
        introduction_container = createFormElement(name + "_instructions", "_container", "container");
    
    if (document.getElementById(name + "_background_prompt") === null && toggle === "yes") {
        if (name === "Trials") {
            introduction_container.appendChild(createFormElement(name, "", "instructions_type", "Introduce the real trials: "));
        } else if (name === "Results") {
            introduction_container.appendChild(createFormElement(name, "", "instructions_type", "Leave a message: "));
        } else {
            introduction_container.appendChild(createFormElement(name, "", "instructions_type", "Introduce the " + name + " trials: "));
        }
        introduction_container.appendChild(createFormElement(name + "_instructions_type", "_container", "container"));
        container.appendChild(introduction_container);
        document.getElementById(name + "_header").scrollIntoView();
    } else if (toggle === "no") {
        container.innerHTML = "";
        container.appendChild(createFormElement(name, "", "prompt"));
        document.getElementById(name + "_prompt_no").checked = true;
        if (name === "Example") {
            addHeader("Practice");
        } else if (name === "Practice") {
            addHeader("Trials");
        } else if (name === "Results") {
            addHeader("Submit");
        }
        document.getElementById(name + "_prompt").scrollIntoView();
    }
}

function pagePromptToggle(name, toggle, pageNum) {
    "use strict";
    var container = document.getElementById("Introduction_container"),
        i,
        nextElement;
    
    if (toggle === "yes") {
        nextElement = createFormElement("page_" + pageNum, "_container", "container");
        nextElement.appendChild(createFormElement("Introduction", "", "instructions_type", pageNum));
        nextElement.appendChild(createFormElement("Introduction_instructions_type_" + pageNum, "_container", "container"));
        appendNext(container, nextElement);
    } else if (toggle === "no") {
        addHeader("Example");
        i = 1;
        if (document.getElementById(name + "_page_prompt_" + (pageNum + i))) {
            while (document.getElementById(name + "_page_prompt_" + (pageNum + i))) {
                if (document.getElementById("page_" + (pageNum + i) + "_container")) {
                    document.getElementById("page_" + (pageNum + i) + "_container").parentNode.removeChild(document.getElementById("page_" + (pageNum + i) + "_container"));
                    document.getElementById("page_" + (pageNum + i) + "_container_break").parentNode.removeChild(document.getElementById("page_" + (pageNum + i) + "_container_break"));
                }
                document.getElementById(name + "_page_prompt_" + (pageNum + i)).parentNode.removeChild(document.getElementById(name + "_page_prompt_" + (pageNum + i)));
                document.getElementById(name + "_page_prompt_" + (pageNum + i) + "_break").parentNode.removeChild(document.getElementById(name + "_page_prompt_" + (pageNum + i) + "_break"));
                i += 1;
            }
            document.getElementById("page_" + pageNum + "_container").parentNode.removeChild(document.getElementById("page_" + pageNum + "_container"));
            document.getElementById("page_" + pageNum + "_container_break").parentNode.removeChild(document.getElementById("page_" + pageNum + "_container_break"));
            
        } else {
            if (document.getElementById("page_" + pageNum + "_container")) {
                document.getElementById("page_" + pageNum + "_container").parentNode.removeChild(document.getElementById("page_" + pageNum + "_container"));
                document.getElementById("page_" + pageNum + "_container_break").parentNode.removeChild(document.getElementById("page_" + pageNum + "_container_break"));
            }
        }
    }
    
    document.getElementById(name + "_page_prompt_" + pageNum).scrollIntoView();
}

function feedbackTypeChanged(name, type) {
    "use strict";
    var container = document.getElementById(name + "_container"),
        nextElement,
        nextContainer,
        inputContainer = document.getElementById(name + "_feedback_input_container"),
        correctContainer,
        incorrectContainer,
        slowContainer,
        timingContainer,
        feedback_image_check = document.getElementById(name + "_feedback_image_check"),
        feedback_audio_check = document.getElementById(name + "_feedback_audio_check"),
        feedback_both,
        feedback_correct = document.getElementById(name + "_feedback_correct"),
        feedback_incorrect = document.getElementById(name + "_feedback_incorrect"),
        feedback_slow,
        divbreak = document.createElement("div"),
        divbreak2 = document.createElement("div"),
        divbreak3 = document.createElement("div"),
        divbreak4 = document.createElement("div");
    
    divbreak.className = "minbreak";
    divbreak2.className = "minbreak";
    divbreak3.className = "minbreak";
    
    if (name === "Example") {
        feedback_both = document.getElementById(name + "_feedback_both");
    } else {
        feedback_slow = document.getElementById(name + "_feedback_slow");
    }
    
    if (document.getElementById(name + "_feedback_correct_container")) {
        correctContainer = document.getElementById(name + "_feedback_correct_container");
    } else {
        correctContainer = createFormElement(name + "_feedback_correct", "_container", "container");
        inputContainer.appendChild(correctContainer);
    }
    if (document.getElementById(name + "_feedback_incorrect_container")) {
        incorrectContainer = document.getElementById(name + "_feedback_incorrect_container");
    } else {
        incorrectContainer = createFormElement(name + "_feedback_incorrect", "_container", "container");
        inputContainer.appendChild(incorrectContainer);
    }
    if (document.getElementById(name + "_feedback_slow_container")) {
        slowContainer = document.getElementById(name + "_feedback_slow_container");
    } else if (name !== "Example") {
        slowContainer = createFormElement(name + "_feedback_slow", "_container", "container");
        inputContainer.appendChild(slowContainer);
    }
    if (document.getElementById(name + "_feedback_timing_container") === null) {
        timingContainer = createFormElement(name + "_feedback_timing", "_container", "container");
        timingContainer.appendChild(createFormElement(name, "_left", "response_time", "feedback"));
        timingContainer.appendChild(divbreak4);
        inputContainer.appendChild(timingContainer);
    }
        
    if (feedback_both !== undefined) {
        if (feedback_both.checked) {
            if (correctContainer.innerHTML === "") {
                correctContainer.appendChild(createFormElement(name + "_feedback_sub_title_correct",
                                                            "_left", "sub_title", "<b>Correct Feedback: </b>"));
                divbreak.id = name + "_feedback_sub_title_correct_break";
                correctContainer.appendChild(divbreak);
            }
            if (incorrectContainer.innerHTML === "") {
                incorrectContainer.appendChild(createFormElement(name + "_feedback_sub_title_incorrect",
                                                            "_left", "sub_title", "<b>Incorrect Feedback: </b>"));
                divbreak2.id = name + "_feedback_sub_title_incorrect_break";
                incorrectContainer.appendChild(divbreak2);
            }

            if (type === "image") {
                if (document.getElementById(name + "_feedback_correct_image") === null) {
                    correctContainer.appendChild(createFormElement(name + "_feedback_correct", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_correct_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    correctContainer.removeChild(document.getElementById(name + "_feedback_correct_image"));
                }
                
                if (document.getElementById(name + "_feedback_incorrect_image") === null) {
                    incorrectContainer.appendChild(createFormElement(name + "_feedback_incorrect", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_incorrect_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    incorrectContainer.removeChild(document.getElementById(name + "_feedback_incorrect_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_feedback_correct_audio") === null) {
                    correctContainer.appendChild(createFormElement(name + "_feedback_correct", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_correct_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    correctContainer.removeChild(document.getElementById(name + "_feedback_correct_audio"));
                }
                
                if (document.getElementById(name + "_feedback_incorrect_audio") === null) {
                    incorrectContainer.appendChild(createFormElement(name + "_feedback_incorrect", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_incorrect_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    incorrectContainer.removeChild(document.getElementById(name + "_feedback_incorrect_audio"));
                }
            }
        } else if (feedback_correct.checked) {
            if (correctContainer.innerHTML === "") {
                correctContainer.appendChild(createFormElement(name + "_feedback_sub_title_correct",
                                                            "_left", "sub_title", "<b>Correct Feedback: </b>"));
                divbreak.id = name + "_feedback_sub_title_correct_break";
                correctContainer.appendChild(divbreak);
            }

            if (type === "image") {
                if (document.getElementById(name + "_feedback_correct_image") === null) {
                    correctContainer.appendChild(createFormElement(name + "_feedback_correct", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_correct_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    correctContainer.removeChild(document.getElementById(name + "_feedback_correct_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_feedback_correct_audio") === null) {
                    correctContainer.appendChild(createFormElement(name + "_feedback_correct", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_correct_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    correctContainer.removeChild(document.getElementById(name + "_feedback_correct_audio"));
                }
            }
        } else if (feedback_incorrect.checked) {
            if (incorrectContainer.innerHTML === "") {
                incorrectContainer.appendChild(createFormElement(name + "_feedback_sub_title_incorrect",
                                                            "_left", "sub_title", "<b>Incorrect Feedback: </b>"));
                divbreak.id = name + "_feedback_sub_title_incorrect_break";
                incorrectContainer.appendChild(divbreak2);
            }

            if (type === "image") {
                if (document.getElementById(name + "_feedback_incorrect_image") === null) {
                    incorrectContainer.appendChild(createFormElement(name + "_feedback_incorrect", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_incorrect_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    incorrectContainer.removeChild(document.getElementById(name + "_feedback_incorrect_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_feedback_incorrect_audio") === null) {
                    incorrectContainer.appendChild(createFormElement(name + "_feedback_incorrect", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_incorrect_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    incorrectContainer.removeChild(document.getElementById(name + "_feedback_incorrect_audio"));
                }
            }
        }
        
    } else {
        if (feedback_correct.checked) {
            if (correctContainer.innerHTML === "") {
                correctContainer.appendChild(createFormElement(name + "_feedback_sub_title_correct",
                                                            "_left", "sub_title", "<b>Correct Feedback: </b>"));
                divbreak.id = name + "_feedback_sub_title_correct_break";
                correctContainer.appendChild(divbreak);
            }

            if (type === "image") {
                if (document.getElementById(name + "_feedback_correct_image") === null) {
                    correctContainer.appendChild(createFormElement(name + "_feedback_correct", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_correct_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    correctContainer.removeChild(document.getElementById(name + "_feedback_correct_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_feedback_correct_audio") === null) {
                    correctContainer.appendChild(createFormElement(name + "_feedback_correct", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_correct_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    correctContainer.removeChild(document.getElementById(name + "_feedback_correct_audio"));
                }
            }
        }
        if (feedback_incorrect.checked) {
            if (incorrectContainer.innerHTML === "") {
                incorrectContainer.appendChild(createFormElement(name + "_feedback_sub_title_incorrect",
                                                            "_left", "sub_title", "<b>Incorrect Feedback: </b>"));
                divbreak2.id = name + "_feedback_sub_title_incorrect_break";
                incorrectContainer.appendChild(divbreak2);
            }

            if (type === "image") {
                if (document.getElementById(name + "_feedback_incorrect_image") === null) {
                    incorrectContainer.appendChild(createFormElement(name + "_feedback_incorrect", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_incorrect_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    incorrectContainer.removeChild(document.getElementById(name + "_feedback_incorrect_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_feedback_incorrect_audio") === null) {
                    incorrectContainer.appendChild(createFormElement(name + "_feedback_incorrect", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_incorrect_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    incorrectContainer.removeChild(document.getElementById(name + "_feedback_incorrect_audio"));
                }
            }
        }
        if (feedback_slow.checked) {
            if (slowContainer.innerHTML === "") {
                slowContainer.appendChild(createFormElement(name + "_feedback_sub_title_slow",
                                                            "_left", "sub_title", "<b>Too Slow Feedback: </b>"));
                divbreak3.id = name + "_feedback_sub_title_slow_break";
                slowContainer.appendChild(divbreak3);
            }

            if (type === "image") {
                if (document.getElementById(name + "_feedback_slow_image") === null) {
                    slowContainer.appendChild(createFormElement(name + "_feedback_slow", "_left", "image"));
                } else if (document.getElementById(name + "_feedback_slow_audio") === null) {
                    feedback_image_check.checked = true;
                } else if (feedback_image_check.checked === false) {
                    slowContainer.removeChild(document.getElementById(name + "_feedback_slow_image"));
                }
            } else if (type === "audio") {
                if (document.getElementById(name + "_feedback_slow_audio") === null) {
                    slowContainer.appendChild(createFormElement(name + "_feedback_slow", "_left", "audio"));
                } else if (document.getElementById(name + "_feedback_slow_image") === null) {
                    feedback_audio_check.checked = true;
                } else if (feedback_audio_check.checked === false) {
                    slowContainer.removeChild(document.getElementById(name + "_feedback_slow_audio"));
                }
            }
        }
    }
    
    if (name !== "Example") {
        nextElement = createFormElement(name, "", "random_prompt");
    } else {
        nextElement = createNumberInput(name, "", "trial");
        nextContainer = createFormElement(name + "_trial", "_container", "container");
        nextContainer.appendChild(createTrial(name, "", 1, getNumberInputValue("General", "stim")));
        addHeader("Practice");
    }
    
    appendNext(container, nextElement, nextContainer);
    
    
    document.getElementById(name + "_feedback_type").scrollIntoView();
}

function feedbackResponse(name, type, toggle) {
    "use strict";
    var container = document.getElementById(name + "_container"),
        nextElement,
        nextContainer,
        divbreak = document.createElement("div"),
        divbreak2 = document.createElement("div"),
        divbreak3 = document.createElement("div"),
        scrollTo;
    
    divbreak.className = "break";
    divbreak2.className = "break";
    divbreak3.className = "break";
    
    if (toggle === "neither" || toggle === "none") {
        if (document.getElementById(name + "_" + type + "_type")) {
            document.getElementById(name + "_" + type + "_type").parentNode.removeChild(document.getElementById(name + "_" + type + "_type"));
        }
        if (document.getElementById(name + "_" + type + "_type_break")) {
            document.getElementById(name + "_" + type + "_type_break").parentNode.removeChild(document.getElementById(name + "_" + type + "_type_break"));
        }
        if (document.getElementById(name + "_feedback_input_container")) {
            document.getElementById(name + "_feedback_input_container").innerHTML = "";
        }
    }
    if (type !== "cue" && document.getElementById(name + "_" + type + "_type" + "_container") === null) {
        container.appendChild(divbreak);
        container.appendChild(createFormElement(name + "_" + type + "_type", "_container", "container"));
    }
    
    if (document.getElementById(name + "_feedback_input_container")) {
        if (name === "Example") {
            if (document.getElementById(name + "_feedback_correct_container") && toggle === "incorrect") {
                document.getElementById(name + "_feedback_correct_container").innerHTML = "";
            } else if (document.getElementById(name + "_feedback_incorrect_container") && toggle === "correct") {
                document.getElementById(name + "_feedback_incorrect_container").innerHTML = "";
            }
        } else {
            if (document.getElementById(name + "_feedback_correct").checked === false && document.getElementById(name + "_feedback_incorrect").checked === false && document.getElementById(name + "_feedback_slow").checked === false) {
                document.getElementById(name + "_feedback_none").checked = true;
                if (document.getElementById(name + "_" + type + "_type")) {
                    document.getElementById(name + "_" + type + "_type").parentNode.removeChild(document.getElementById(name + "_" + type + "_type"));
                }
                if (document.getElementById(name + "_" + type + "_type_break")) {
                    document.getElementById(name + "_" + type + "_type_break").parentNode.removeChild(document.getElementById(name + "_" + type + "_type_break"));
                }
                if (document.getElementById(name + "_feedback_input_container")) {
                    document.getElementById(name + "_feedback_input_container").innerHTML = "";
                }
            } else if (document.getElementById(name + "_feedback_correct").checked === false && toggle === "correct") {
                document.getElementById(name + "_feedback_correct_container").innerHTML = "";
            } else if (document.getElementById(name + "_feedback_incorrect").checked === false && toggle === "incorrect") {
                document.getElementById(name + "_feedback_incorrect_container").innerHTML = "";
            } else if (document.getElementById(name + "_feedback_slow").checked === false && toggle === "slow") {
                document.getElementById(name + "_feedback_slow_container").innerHTML = "";
            }
        }
        
        if (document.getElementById(name + "_feedback_image_check")) {
            if (document.getElementById(name + "_feedback_image_check").checked) {
                feedbackTypeChanged(name, "image");
            }
        }
        if (document.getElementById(name + "_feedback_audio_check")) {
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                feedbackTypeChanged(name, "audio");
            }
        }
    } else if (type === "feedback") {
        container.appendChild(divbreak2);
        container.appendChild(createFormElement(name + "_feedback_input", "_container", "container"));
    }
    
    if (toggle !== "neither" && toggle !== "never" && toggle !== "none") {
        if (type !== "cue") {
            if (document.getElementById(name + "_feedback_correct").checked || document.getElementById(name + "_feedback_incorrect").checked) {
                if (document.getElementById(name + "_" + type + "_type") === null) {
                    document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name, "", type + "_type"));
                }
                if (document.getElementById(name + "_feedback_none")) {
                    document.getElementById(name + "_feedback_none").checked = false;
                }
            } else if (document.getElementById(name + "_feedback_slow")) {
                if (document.getElementById(name + "_feedback_slow").checked) {
                    if (document.getElementById(name + "_" + type + "_type") === null) {
                        document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name, "", type + "_type"));
                    }
                    if (document.getElementById(name + "_feedback_none")) {
                        document.getElementById(name + "_feedback_none").checked = false;
                    }
                }
            } else if (document.getElementById(name + "_feedback_both")) {
                if (document.getElementById(name + "_feedback_both").checked) {
                    if (document.getElementById(name + "_" + type + "_type") === null) {
                        document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name, "", type + "_type"));
                    }
                    if (document.getElementById(name + "_feedback_none")) {
                        document.getElementById(name + "_feedback_none").checked = false;
                    }
                }
            }
        } else {
            if (document.getElementById(name + "_cue_trial").checked) {
                if (document.getElementById(name + "_cue_number") === null) {
                    document.getElementById(name + "_cue_container").innerHTML = "";
                    document.getElementById(name + "_" + type + "_container").appendChild(createNumberInput(name, "", "cue"));
                    document.getElementById(name + "_" + type + "_container").appendChild(divbreak3);
                    document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name, "", "cue_type"));
                    document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name + "_" + type + "_type", "_container", "container"));
                }
            } else if (document.getElementById(name + "_cue_switch")) {
                if (document.getElementById(name + "_cue_switch").checked) {
                    document.getElementById(name + "_cue_container").innerHTML = "";
                    document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name, "", "cue_type"));
                    document.getElementById(name + "_" + type + "_container").appendChild(createFormElement(name + "_" + type + "_type", "_container", "container"));
                }
            }
        }
    } else if (toggle === "never") {
        nextElement = createFormElement(name, "", "feedback_prompt");
        nextContainer = createFormElement(name + "_feedback", "_container", "container");
        
        if (document.getElementById(name + "_cue_container") && type === "cue") {
            document.getElementById(name + "_cue_container").innerHTML = "";
        }
    } else if (toggle === "neither" || toggle === "none") {
        if (name !== "Example") {
            nextElement = createFormElement(name, "", "random_prompt");
            if (toggle === "none") {
                document.getElementById(name + "_feedback_slow").checked = false;
                document.getElementById(name + "_feedback_correct").checked = false;
                document.getElementById(name + "_feedback_incorrect").checked = false;
            }
        } else {
            nextElement = createNumberInput(name, "", "trial");
            nextContainer = createFormElement(name + "_trial", "_container", "container");
            nextContainer.appendChild(createTrial(name, "", 1, getNumberInputValue("General", "stim")));
            addHeader("Practice");
        }
    }
    
    appendNext(container, nextElement, nextContainer);
    
    scrollTo = document.getElementById(name + "_" + type + "_prompt");
    scrollTo.scrollIntoView();
}

function resultsTypeChanged(type) {
    "use strict";
    if (type === "rt") {
        if (!document.getElementById("Results_results_correct_check").checked) {
            document.getElementById("Results_results_rt_check").checked = true;
        }
    } else if (type === "correct") {
        if (!document.getElementById("Results_results_rt_check").checked) {
            document.getElementById("Results_results_correct_check").checked = true;
        }
    }
    
    addHeader("Submit");
    document.getElementById("Results_results_type").scrollIntoView();
}