/*global alert: true */
/*global getNumberInputValue: true */
/*global createTest: true */

var highlighted = [];
var sections = [];
var scrollToArray = [];

var scrollTo = null;
var headers = ["General", "Introduction", "Example", "Practice", "Trials", "Results", "Submit"];

function checkFileExtension(str, type) {
    "use strict";
    var filename = str.split(/(\\|\/)/g).pop(),
        ext = filename.substring(filename.length - 4, filename.length),
        i,
        imageExt = [".png", ".PNG", ".jpg", ".JPG"],
        audioExt = [".mp3", ".MP3"];
    
    if (type === "image") {
        for (i = 0; i < imageExt.length; i += 1) {
            if (imageExt[i] === ext) {
                return true;
            }
        }
    } else if (type === "audio") {
        for (i = 0; i < audioExt.length; i += 1) {
            if (audioExt[i] === ext) {
                return true;
            }
        }
    }
    
    return false;
}

function clearHighlighted() {
    "use strict";
    var i;
    
    if (highlighted.length === 0) {
        return false;
    }
    
    for (i = 0; i < highlighted.length; i += 1) {
        highlighted[i].setAttribute("style", "border: 0px solid rgb(255, 255, 255)");
    }
    
    highlighted = [];
    sections = [];
    scrollToArray = [];
    scrollTo = null;
    
    return true;
}
function addHighlight(sectionIndex, element, scroll) {
    "use strict";
    if (element.style.borderColor !== "rgb(247, 143, 30)") {
        element.setAttribute("style", "border: 4px solid rgb(247, 143, 30)");
        highlighted.push(element);
        sections.push(sectionIndex);
        if (scroll !== undefined) {
            scrollToArray.push(scroll);
        } else {
            scrollToArray.push(element);
        }
        return true;
    } else {
        return false;
    }
}

function doScrollTo() {
    "use strict";
    var i,
        j;
    
    if (highlighted.length > 0 && sections.length > 0) {
        for (j = 0; j < 7; j += 1) {
            for (i = 0; i < highlighted.length; i += 1) {
                if (sections[i] === j) {
                    scrollTo = scrollToArray[i];
                    scrollTo.scrollIntoView();
                    return;
                }
            }
        }
    }
}

function validateForm() {
    "use strict";
    clearHighlighted();
    var i,
        j,
        congruentCheck = false,
        incongruentCheck = false,
        taskSelected,
        taskCount = parseInt(document.getElementById("General_task_select").options[document.getElementById("General_task_select").selectedIndex].value, 10);
    

    /**
    *Background images input check
    *Block introductions checks (text, image and audio)
    *Block cue checks (image and audio)
    *Block feedback checks (rt, image and audio)
    */
    for (i = 0; i < headers.length; i += 1) {
        if (document.getElementById(headers[i] + "_background_image_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_background_image_file").value, "image")) {
                addHighlight(i, document.getElementById(headers[i] + "_background_container"), document.getElementById(headers[i] + "_background_prompt"));
            }
        }
        if (document.getElementById(headers[i] + "_instructions_input_textarea")) {
            if (document.getElementById(headers[i] + "_instructions_input_textarea_textarea").value === "") {
                addHighlight(i, document.getElementById(headers[i] + "_instructions_input_textarea"), document.getElementById(headers[i] + "_instructions_type"));
            }
        }
        if (document.getElementById(headers[i] + "_instructions_audio_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_instructions_audio_file").value, "audio")) {
                addHighlight(i, document.getElementById(headers[i] + "_instructions_audio"), document.getElementById(headers[i] + "_instructions_type"));
            }
        }
        if (document.getElementById(headers[i] + "_instructions_image_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_instructions_image_file").value, "image")) {
                addHighlight(i, document.getElementById(headers[i] + "_instructions_image"), document.getElementById(headers[i] + "_instructions_type"));
            }
        }
        if (document.getElementById(headers[i] + "_cue_image_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_cue_image_file").value, "image")) {
                addHighlight(i, document.getElementById(headers[i] + "_cue_image"), document.getElementById(headers[i] + "_cue_type"));
            }
        }
        if (document.getElementById(headers[i] + "_cue_audio_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_cue_audio_file").value, "audio")) {
                addHighlight(i, document.getElementById(headers[i] + "_cue_audio"), document.getElementById(headers[i] + "_cue_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_correct_image_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_feedback_correct_image_file").value, "image")) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_correct_image"), document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_incorrect_image_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_feedback_incorrect_image_file").value, "image")) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_incorrect_image"), document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_slow_image_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_feedback_slow_image_file").value, "image")) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_slow_image"), document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_correct_audio_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_feedback_correct_audio_file").value, "audio")) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_correct_audio"), document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_incorrect_audio_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_feedback_incorrect_audio_file").value, "audio")) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_incorrect_audio"), document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_slow_audio_file")) {
            if (!checkFileExtension(document.getElementById(headers[i] + "_feedback_slow_audio_file").value, "audio")) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_slow_audio"), document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_feedback_type")) {
            if (document.getElementById(headers[i] + "_feedback_audio_check").checked === false && document.getElementById(headers[i] + "_feedback_image_check").checked === false) {
                addHighlight(i, document.getElementById(headers[i] + "_feedback_type"));
            }
        }
        if (document.getElementById(headers[i] + "_response_time_feedback_input")) {
            if (document.getElementById(headers[i] + "_response_time_feedback_input").value === "") {
                addHighlight(i, document.getElementById(headers[i] + "_response_time_feedback"));
            }
        }
        if (document.getElementById(headers[i] + "_response_time_stimuli_input")) {
            if (document.getElementById(headers[i] + "_response_time_stimuli_input").value === "") {
                addHighlight(i, document.getElementById(headers[i] + "_response_time_stimuli"));
            }
        }
    }
    
    /**
    * Introduction pages checks
    */
    i = 2;
    while (document.getElementById("page_" + i + "_container")) {
        if (document.getElementById("Introduction_instructions_input_textarea_" + i + "_textarea")) {
            if (document.getElementById("Introduction_instructions_input_textarea_" + i + "_textarea").value === "") {
                addHighlight(1, document.getElementById("Introduction_instructions_input_textarea_" + i), document.getElementById("Introduction_instructions_type_" + i));
            }
        }
        if (document.getElementById("Introduction_instructions_audio_" + i + "_file")) {
            if (!checkFileExtension(document.getElementById("Introduction_instructions_audio_" + i + "_file").value, "audio")) {
                addHighlight(1, document.getElementById("Introduction_instructions_audio_" + i), document.getElementById("Introduction_instructions_type_" + i));
            }
        }
        if (document.getElementById("Introduction_instructions_image_" + i + "_file")) {
            if (!checkFileExtension(document.getElementById("Introduction_instructions_image_" + i + "_file").value, "image")) {
                addHighlight(1, document.getElementById("Introduction_instructions_image_" + i), document.getElementById("Introduction_instructions_type_" + i));
            }
        }
        if (!document.getElementById("Introduction_instructions_text_check_" + i).checked && !document.getElementById("Introduction_instructions_audio_check_" + i).checked && !document.getElementById("Introduction_instructions_image_check_" + i).checked) {
            addHighlight(1, document.getElementById("Introduction_instructions_type_" + i));
        }
        i += 1;
    }
    
    /**
     *Task table checks:
     */
    for (i = 1; i <= taskCount; i += 1) {
        for (j = 0; j < 3; j += 1) {
            if (document.getElementById("General_task_table_td_" + i + "_" + j + "_input").value === "") {
                addHighlight(0, document.getElementById("General_task_table"), document.getElementById("General_task"));
            }
        }
        if (i > 1) {
            for (j = 1; j < i; j += 1) {
                if (document.getElementById("General_task_table_td_" + i + "_0_input").value === document.getElementById("General_task_table_td_" + j + "_0_input").value) {
                    addHighlight(0, document.getElementById("General_task_table"), document.getElementById("General_task"));
                }
            }
        }
        if (document.getElementById("General_task_table_td_" + i + "_1_input").value === document.getElementById("General_task_table_td_" + i + "_2_input").value) {
            addHighlight(0, document.getElementById("General_task_table"), document.getElementById("General_task"));
        }
    }
    
    /**
     *Value table checks
     */
    for (i = 1; i <= taskCount * 2; i += 1) {
        if (document.getElementById("General_value_table_td_" + i + "_1_input")) {
            if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "") {
                addHighlight(0, document.getElementById("General_value_table"), document.getElementById("General_task"));
            }
        }
    }
    
    /**
    * Stimuli image checks
    */
    if (document.getElementById("General_stim_container")) {
        for (i = 1; i <= getNumberInputValue("General", "stim"); i += 1) {
            if (document.getElementById("General_stim_file_" + i).value === "") {
                addHighlight(0, document.getElementById("General_stim_" + i));
            }
        }
    }
    
    /**
    * Example Trials' tasks' check
    */
    if (document.getElementById("Example_trial_container")) {
        for (i = 1; i <= getNumberInputValue("Example", "trial"); i += 1) {
            if (document.getElementById("Example_trial_select_task_" + i)) {
                try {
                    taskSelected = document.getElementById("Example_trial_select_task_" + i).options[document.getElementById("Example_trial_select_task_" + i).selectedIndex].value;
                } catch (e) {
                    taskSelected = "";
                }
            }

            if (taskSelected === "") {
                addHighlight(2, document.getElementById("Example_trial_" + i));
            }
        }
    }
    
    /**
    * Submit input name check
    */
    if (document.getElementById("Submit_input_textline_folder").value === "") {
        addHighlight(6, document.getElementById("Submit_input_textline_folder"), document.getElementById("Submit_header"));
    }
    
    /**
    * Congruent Trials stimuli check
    */
    for (i = 1; i <= getNumberInputValue("General", "stim"); i += 1) {
        if (document.getElementById("General_stim_congruent_select_" + i).selectedIndex === 0) {
            congruentCheck = true;
            break;
        }
    }
    for (i = 1; i <= getNumberInputValue("General", "stim"); i += 1) {
        if (document.getElementById("General_stim_congruent_select_" + i).selectedIndex === 1) {
            incongruentCheck = true;
            break;
        }
    }
    if (getNumberInputValue("Trials", "congruent") > 0 && congruentCheck === false) {
        addHighlight(4, document.getElementById("Trials_trial_congruent_container"));
    } else if (getNumberInputValue("Trials", "trial") - getNumberInputValue("Trials", "congruent") > 0 && incongruentCheck === false) {
        addHighlight(4, document.getElementById("Trials_trial_congruent_container"));
    }
    if (document.getElementById("Practice_trial_number")) {
        if (getNumberInputValue("Practice", "congruent") > 0 && congruentCheck === false) {
            addHighlight(3, document.getElementById("Practice_trial_congruent_container"));
        } else if (getNumberInputValue("Practice", "trial") - getNumberInputValue("Practice", "congruent") > 0 && incongruentCheck === false) {
            addHighlight(3, document.getElementById("Practice_trial_congruent_container"));
        }
    }
    
    doScrollTo();
    if (scrollTo === null) {
        createTest();
    }
}