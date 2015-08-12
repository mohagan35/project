/*global alert: true */

var efSelected = "Select";
/**
* Create div function
*/
function createHeader(name) {
    "use strict";
    var header = document.createElement("div");
    header.className = "subheader";
    header.id = name + "_header";
    header.innerHTML = "<h2>" + name + "</h2>";
    
    return header;
}

function createTrial(name, align, index, n) {
    "use strict";
    var element = document.createElement("div"),
        selectStim = document.createElement("select"),
        selectTask = document.createElement("select"),
        i;
    
    element.className = "form_element" + align;
    element.id = name + "_trial";
    
    selectStim.id = name + "_trial_select_stim_" + index;
    selectTask.id = name + "_trial_select_task_" + index;
    
    for (i = 1; i <= n; i += 1) {
        selectStim.innerHTML += "<option>Stimulus " + i + "</option>";
    }
    for (i = 1; i < 5; i += 1) {
        if (document.getElementById("General_task_table_td_" + i + "_0_input").value !== "") {
            selectTask.innerHTML += "<option>" + document.getElementById("General_task_table_td_" + i + "_0_input").value + "</option>";
        }
    }
        
    element.innerHTML = "<b>" + name + " Trial " + index + ":</b><br><br>" +
                "Stimulus: " + selectStim.outerHTML + "<p>Task: " + selectTask.outerHTML +
                "<p>Choose an audio file (mp3) to upload: <p><input type='file' id='" + element.id + "_file_" + index + "'>";

    element.id += "_" + index;
    
    return element;
}

function createNumberInput(name, align, type) {
    "use strict";
    var element = document.createElement("div"),
        val = 1;
    
    element.className = "form_element" + align;
    element.id = name + "_" + type + "_number";
        
    if (type === "stim") {
        element.innerHTML = "Choose a number of stimuli:";
        val = 4;
    } else if (type === "trial") {
        if (name !== "Trials") {
            element.innerHTML = "Choose a number of " + name + " trials:";
        } else {
            element.innerHTML = "Choose a number of trials:";
        }
        if (name === "Practice" || name === "Trials") {
            val = 2;
        }
    } else if (type === "congruent") {
        element.innerHTML = "How many trials should be congruent?";
    } else if (type === "switches") {
        element.innerHTML = "How many task switches should there be?";
        val = 0;
    } else if (type === "cue") {
        element.innerHTML = "Before how many trials should each cue be fired?";
    } else if (type === "diff_lengths") {
        element.innerHTML = "How many different series lengths should there be?";
    }
    
    element.innerHTML += "<p><input class='key' id='" + element.id + "_left' type='text' readonly value='0'" +    "onkeypress=\"numberPressInput(event, 'left', '" + name + "', '" + type + "')\">" +
                        "<input class='key' id='" + element.id + "_right' type='text' readonly value='" + val + "' onkeypress=\"numberPressInput(event, 'right', '" + name + "', '" + type + "')\">";
    
    return element;
}

function replaceRow(id, type, rowIndex, col, str) {
    "use strict";
    var i;
    
    for (i = 0; i < col; i += 1) {
        if (type === "input") {
            str[i] = str[i].substring(0, 6) + " id='" + id + "_td_" + rowIndex + "_" + i + "_input'" + str[i].substring(7, str[i].length - 1);
        }
        document.getElementById(id + "_td_" + rowIndex + "_" + i).innerHTML = str[i];
    }
}

function createTable(name, align, type, row, col, headings) {
    "use strict";
    var id = name + "_" + type + "_table",
        i,
        j,
        modRow,
        modCol,
        table = document.createElement("table"),
        tableRow = new [].constructor(row),
        tableCol = new [].constructor(col),
        element = document.createElement("div");
    
    element.className = "form_element" + align;
    element.id = id;
    
    for (i = 0; i < row; i += 1) {
        tableRow[i] = document.createElement("tr");
        
        for (j = 0; j < col; j += 1) {
            tableCol[j] = document.createElement("td");
            tableCol[j].id = id + "_td_" + i + "_" + j;
            tableRow[i].appendChild(tableCol[j]);
            
            if (i === 0) {
                tableCol[j].innerHTML = headings[j];
            } else if (type === "task") {
                if (i === 1) {
                    tableCol[j].innerHTML = "<input id='" + id + "_td_" + i + "_" + j + "_input' enabled maxlength='12' onkeyup=\"taskInput('" + name + "', '" + i + "', '" + j + "', this, event)\" onkeydown=\"folderInput('" + name + "', event)\">";
                } else {
                    tableCol[j].innerHTML = "<input id='" + id + "_td_" + i + "_" + j + "_input' disabled maxlength='12' onkeyup=\"taskInput('" + name + "', '" + i + "', '" + j + "', this, event)\" onkeydown=\"folderInput('" + name + "', event)\">";
                }
            } else if (type === "value") {
                tableCol[j].style.width = 172 + 'px';
            }
        }
        
        table.appendChild(tableRow[i]);
    }
    
    element.appendChild(table);
    return element;
}

function createFormElement(name, align, type, str) {
    "use strict";
    var element = document.createElement("div"),
        vowelFix = "",
        i,
        j,
        stim_options = "";
    element.className = "form_element" + align;
    element.id = name + "_" + type;
    
    if (/[aeiouAEIOU]/.test(name.charAt(0))) {
        vowelFix = "n";
    }
    
    if (type === "image") {
        if (str) {
            element.id += "_" + str;
        }
        element.innerHTML = "Choose an image (jpg, png) to upload:" +
                    "<p><input type='file' id='" + element.id + "_file'>";
        
        if (name.indexOf("feedback") > -1) {
            element.style.width = 385 + 'px';
        }
        
    } else if (type === "instructions_type") {
        if (str.length > 1) {
            element.innerHTML += str +
                     "<p>Audio <input id='" + name + "_instructions_audio_check' type='checkbox' name='" + name + "_instructions_type' onclick=\"instructionsTypeChanged('" + name + "', 'audio')\">" +
                    "<p>Image <input id='" + name + "_instructions_image_check' type='checkbox' name='" + name + "_instructions_type' onclick=\"instructionsTypeChanged('" + name + "', 'image')\">" +
                    "<p>Text <input id='" + name + "_instructions_text_check' type='checkbox' name='" + name + "_instructions_type' onclick=\"instructionsTypeChanged('" + name + "', 'text')\">";
        } else {
            element.id += "_" + str;
            element.innerHTML += "<b>Page " + str + " contents:</b>" +
                 "<p>Audio <input id='" + name + "_instructions_audio_check_" + str + "' type='checkbox' name='" + name + "_instructions_type_" + str + "' onclick=\"instructionsTypeChanged('" + name + "', 'audio', " + str + ")\">" +
                "<p>Image <input id='" + name + "_instructions_image_check_" + str + "' type='checkbox' name='" + name + "_instructions_type_" + str + "' onclick=\"instructionsTypeChanged('" + name + "', 'image', " + str + ")\">" +
                "<p>Text <input id='" + name + "_instructions_text_check_" + str + "' type='checkbox' name='" + name + "_instructions_type_" + str + "' onclick=\"instructionsTypeChanged('" + name + "', 'text', " + str + ")\">";
        }
        
    } else if (type === "input_textarea") {
        if (str) {
            element.id += "_" + str;
        }
        element.innerHTML = "Type in some instructions text: <p><textarea id='" + element.id + "_textarea'></textarea>";
        
    } else if (type === "input_textline") {
        element.innerHTML = "Type in a test name: <input id='" + element.id + "_folder' type='text' onkeydown=\"folderInput('" + name + "', event)\"></input>" + str;
        
    } else if (type === "audio") {
        if (str) {
            element.id += "_" + str;
        }
        element.innerHTML = "Choose an audio file (mp3) to upload:" +
                    "<p><input type='file' id='" + element.id + "_file'>";
        
        if (name.indexOf("feedback") > -1) {
            element.style.width = 385 + 'px';
        }
        
    } else if (type === "background_prompt") {
        element.innerHTML = "Would you like to override the master background image?" +
                    "<p>Yes<input type='radio' name='" + element.id + "' value='yes' onclick=\"backgroundToggle('" + name + "', 'yes')\">" +
                    "<p>No<input type='radio' name='" + element.id + "' value='no' onclick=\"backgroundToggle('" + name + "', 'no')\">";
        
    } else if (type === "prompt") {
        element.innerHTML = "Would you like to add a" + vowelFix + " " + name + " block?" +
                    "<p>Yes <input type='radio' id='" + name + "_prompt_yes' name='" + name + "_yesno' value='yes' onclick=\"promptToggle('" + name + "', 'yes')\">" +
                    "<p>No <input type='radio' id='" + name + "_prompt_no' name='" + name + "_yesno' value='no' onclick=\"promptToggle('" + name + "', 'no')\">";
        
    } else if (type === "page_prompt") {
        element.id += "_" + str;
        element.innerHTML = "Would you like to add another page?" +
                    "<p>Yes <input type='radio' id='" + name + "page_prompt_yes_" + str + "' name='" + name + "_page_yesno_" + str + "' value='yes' onclick=\"pagePromptToggle('" + name + "', 'yes', " + str + ")\">" +
                    "<p>No <input type='radio' id='" + name + "_page_prompt_no_" + str + "' name='" + name + "_page_yesno_" + str + "' value='no' onclick=\"pagePromptToggle('" + name + "', 'no', " + str + ")\">";
        
    } else if (type === "correct_stim") {
        element.innerHTML = "Which stimulus is the correct response?" +
                "<p>Left <input type='radio' name='" + name + "_leftright' value='left' onclick=\"genericInput('" + name + "', '" + type + "')\">" +
                "<p>Right <input type='radio' name='" + name + "_leftright' value='right' onclick=\"genericInput('" + name + "', '" + type + "')\">";
        
    } else if (type === "stim") {
        for (i = 1; i < 5; i += 1) {
            if (document.getElementById("General_task_table_td_" + i + "_0_input").value !== "" && document.getElementById("General_task_table_td_" + i + "_1_input").value !== "" && document.getElementById("General_task_table_td_" + i + "_2_input").value !== "") {
                stim_options += "<td class='task' id='" + name + "_stim_task_" + i + "_" + str + "'><div class='empty' id='" + name + "_stim_" + i + "_0_" + str + "'>" + document.getElementById("General_task_table_td_" + i + "_0_input").value + ": </div> <select id='" + name + "_stim_select_" + i + "_" + str + "'>";
                
                for (j = 1; j < 3; j += 1) {
                    if (document.getElementById("General_task_table_td_" + i + "_" + j + "_input").value !== "") {
                        stim_options += "<option id='" + name + "_stim_" + i + "_" + j + "_" + str + "'>" + document.getElementById("General_task_table_td_" + i + "_" + j + "_input").value + "</option>";
                    }
                }
                
                stim_options += "</select></td>";
            } else {
                stim_options += "<td class='task' id='" + name + "_stim_task_" + i + "_" + str + "'></td>";
            }
        }
        element.innerHTML = "<b>Stimulus " + str + ":</b><br><br>Choose an image (jpg, png) to upload:" +
                    "<p><input type='file' id='" + element.id + "_file_" + str + "'>" +
                    "<p><table><tr>" + stim_options + "</tr></table>" +
                    "<p><table><tr><td>Congruent: <select id='" + element.id + "_congruent_select_" + str + "'>" +
                    "<option>Yes</option><option>No</option></td></tr></table>";
        element.id += "_" + str;
        
    } else if (type === "feedback_prompt") {
        if (name === "Example") {
            element.innerHTML = "For which responses would you like to provide feedback?" +
                    "<p>Both <input type='radio' id='" + name + "_feedback_both' name='" + name + "_feedback_options' value='both' onclick=\"feedbackResponse('" + name + "', 'feedback', 'both')\">" +
                    "<p>Only Correct <input type='radio' id='" + name + "_feedback_correct' name='" + name + "_feedback_options' value='correct' onclick=\"feedbackResponse('" + name + "', 'feedback', 'correct')\">" +
                    "<p>Only Incorrect <input type='radio' id='" + name + "_feedback_incorrect' name='" + name + "_feedback_options' value='incorrect' onclick=\"feedbackResponse('" + name + "', 'feedback', 'incorrect')\">" +
                    "<p>Neither <input type='radio' id='" + name + "_feedback_neither' name='" + name + "_feedback_options' value='neither' onclick=\"feedbackResponse('" + name + "', 'feedback', 'neither')\">";
        } else {
            element.innerHTML = "For which responses would you like to provide feedback?" +
                    "<p>Correct <input type='checkbox' id='" + name + "_feedback_correct' name='" + name + "_feedback_options' value='correct' onclick=\"feedbackResponse('" + name + "', 'feedback', 'correct')\">" +
                    "<p>Incorrect <input type='checkbox' id='" + name + "_feedback_incorrect' name='" + name + "_feedback_options' value='incorrect' onclick=\"feedbackResponse('" + name + "', 'feedback', 'incorrect')\">" +
                    "<p>Too slow <input type='checkbox' id='" + name + "_feedback_slow' name='" + name + "_feedback_options' value='slow' onclick=\"feedbackResponse('" + name + "', 'feedback', 'slow')\">" +
                    "<p>None <input type='checkbox' id='" + name + "_feedback_none' name='" + name + "_feedback_options' value='none' onclick=\"feedbackResponse('" + name + "', 'feedback', 'none')\">";
        }
        
    } else if (type === "feedback_type") {
        element.innerHTML = "Choose a feedback type:" +
                    "<p>Image <input id='" + name + "_feedback_image_check' type='checkbox' name='" + name + "_feedback_type' onclick=\"feedbackTypeChanged('" + name + "', 'image')\">" +
            "<p>Audio <input id='" + name + "_feedback_audio_check' type='checkbox' name='" + name + "_feedback_type' onclick=\"feedbackTypeChanged('" + name + "', 'audio')\">";
        
    } else if (type === "cue_type") {
        element.innerHTML = "Choose a trials cue type:" +
                    "<p>Image <input id='" + name + "_cue_image_check' type='checkbox' name='" + name + "_cue_type' onclick=\"cueTypeChanged('" + name + "', 'image')\">" +
            "<p>Audio <input id='" + name + "_cue_audio_check' type='checkbox' name='" + name + "_cue_type' onclick=\"cueTypeChanged('" + name + "', 'audio')\">";
        
    } else if (type === "sub_title") {
        element.innerHTML = str;
        element.style.width = 283 + 'px';
        
    } else if (type === "random_prompt") {
        element.innerHTML = "Would you like the trials to be randomized?" +
                    "<p>Yes <input type='radio' id='" + element.id + "_yes' name='" + element.id + "' value='yes' onclick=\"genericInput('" + name + "', '" + type + "')\">" +
                    "<p>No <input type='radio' id='" + element.id + "_no' name='" + element.id + "' value='no' onclick=\"genericInput('" + name + "', '" + type + "')\">";
        
    } else if (type === "task") {
        element.innerHTML = "Choose the number of tasks: <p>" +
                    "<select id='" + name + "_" + type + "_select' onchange=\"dropDown('" + name + "', 'task', this)\">" +
                        "<option id='" + name + "_" + type + "_one' value='1'>One</option>" +
                        "<option id='" + name + "_" + type + "_two' value='2'>Two</option>" +
            "<option id='" + name + "_" + type + "_three' value='3'>Three</option>" +
            "<option id='" + name + "_" + type + "_four' value='4'>Four</option></select>";
        
    } else if (type === "cue_prompt") {
        element.innerHTML = "When would you like to provide trial cues?" +
                "<p>Before every X trials <input type='radio' id='" + name + "_cue_trial' name='" + name + "_cue_options' value='trial' onclick=\"feedbackResponse('" + name + "', 'cue', 'trial')\">";
        
        if (efSelected === "Switching") {
            element.innerHTML += "<p>Before every task switch <input type='radio' id='" + name + "_cue_switch' name='" + name + "_cue_options' value='switch' onclick=\"feedbackResponse('" + name + "', 'cue', 'switch')\">";
        }
        
        element.innerHTML += "<p>Never <input type='radio' id='" + name + "_cue_never' name='" + name + "_cue_options' value='never' onclick=\"feedbackResponse('" + name + "', 'cue', 'never')\">";
        
    } else if (type === "results_type") {
        element.innerHTML = "What results would you like to display?" +
                "<p>Response time <input id='" + name + "_results_rt_check' type='checkbox' name='" + name + "_results_type' onclick=\"resultsTypeChanged('rt')\">" +
            "<p>Correct responses <input id='" + name + "_results_correct_check' type='checkbox' name='" + name + "_results_type' onclick=\"resultsTypeChanged('correct')\">";
        
    } else if (type === "response_time") {
        element.id += "_" + str;
        if (str === "stimuli" && document.getElementById(name + "_cue_never").checked === false) {
            element.innerHTML = "How long should the " + str + " and cues be shown for?";
        } else {
            element.innerHTML = "How long should the " + str + " be shown for?";
        }
        element.innerHTML += "<p><input id='" + name + "_" + type + "_" + str + "_input' type='text' maxlength='4' onkeydown=\"numberTextInput(event)\"> ms";
        
    } else if (type === "series_prompt") {
        element.innerHTML = "Would you like to use stimuli series?" +
                    "<p>Yes <input type='radio' id='" + element.id + "_yes' name='" + element.id + "' value='yes' onclick=\"seriesPrompt()\">" +
                    "<p>No <input type='radio' id='" + element.id + "_no' name='" + element.id + "' value='no' onclick=\"seriesPrompt()\">";
        
    } else if (type === "enter_lengths") {
        element.innerHTML = "Enter the possible series lengths: ";
        for (i = 1; i <= str; i += 1) {
            element.innerHTML += "<p><input id='" + element.id + "_" + i + "_input' type='text' maxlength='2' onkeydown=\"numberTextInput(event, 'length" + i + "')\">";
        }
        
    } else if (type === "enter_frequencies") {
        element.innerHTML = "Enter a frequency for each series length: ";
        for (i = 1; i <= str; i += 1) {
            element.innerHTML += "<p><input id='" + element.id + "_" + i + "_input' type='text' maxlength='2' onkeydown=\"numberTextInput(event, 'frequency" + i + "')\">";
        }
        
    }
    
    return element;
}