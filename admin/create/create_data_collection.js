/*jslint es5: true */
/*global Blob: true */
/*global console: true */
/*jslint continue: true */

var keyChoices,
    imageScale = "\" style=\"margin-top: -75px; width: 100%; max-height:100%;\" />",
    imageScaleF = "\" style=\"margin-top: -7px; width: 100%; max-height:100%;\" />",
    audio,
    stimNum,
    output,
    html1,
    html2,
    html3,
    html4,
    html4a,
    html5;

function initializeVars() {
    "use strict";
    keyChoices = [];
    audio = [];
    stimNum = null;
    
    output = "";
    html1 = "<!doctype html><html><head><title>";
    html2 = "</title> \
            <script src='js/jquery.js'></script> \
            <script src='js/jspsych/jspsych.js'></script> \
            <script src='js/jspsych/plugins/jspsych-single-stim.js'></script> \
            <script src='js/jspsych/plugins/jspsych-multi-stim-multi-response.js'></script> \
            <script src='js/jspsych/plugins/jspsych-categorize.js'></script> \
            <script src='js/jspsych/plugins/jspsych-text.js'></script> \
            <script src='js/jspsych/plugins/jspsych-instructions.js'></script> \
            <script>var ppi; \
                if (localStorage.getItem('ppi')) { \
                    ppi = parseFloat(localStorage.getItem('ppi')); \
                } else { \
                    ppi = 120; \
                    alert('PPI setting not found. Using ppi of 120.'); \
                }";
    html3 = "</script><link href='js/jspsych/css/jspsych.css' rel='stylesheet' type='text/css'></link> \
            <script>var css = '.jspsych-display-element { width:' + (ppi * 9) + 'px; margin: 75px auto 0px auto; text-align: center; }', \
        style = document.createElement('style'); \
    style.type = 'text/css'; \
    style.appendChild(document.createTextNode(css)); \
    document.head.appendChild(style); \
    </script></head><body id='body' ";
    html4 = "><div id='textBox' class='jspsych-display-element'></div></body><script>var images = [";
    html4a = "var audio = [";
    html5 = "var i = 0; \
        var a, d, z, j; \
        if (audio.length > 0) { \
            document.getElementById(\"body\").innerHTML += '<audio id=\"a0\" preload=\"auto\" hidden><source src=\"' + audio[0] + '\"></audio>'; \
            var myInterval = window.setInterval(loadAudio, 200); \
            var audioContainer = document.createElement('div'); \
        } \
        else {\
            onAudioLoad(); \
        } \
        function loadAudio() { \
            a = document.getElementById('a' + i); \
            d = a.duration; \
            try { \
                z = a.buffered.end(0); \
            } catch (e) {} \
            document.getElementById('textBox').innerHTML = '' + i + ' of ' + audio.length + ' audio files loaded.'; \
            if ((z === d && z !== undefined) || (z > 50)) { \
                i += 1; \
                z = 0; \
                if (i < audio.length) { \
                    document.getElementById(\"body\").innerHTML += '<audio id=\"a' + i + '\" preload=\"auto\" hidden><source src=\"' + audio[i] + '\"></audio>'; \
                } \
                else if (i === audio.length) { \
                    window.clearInterval(myInterval); \
                    for (j = 0; j < audio.length; j += 1) { \
                        audioContainer.appendChild(document.getElementById('a' + j)); \
                    } \
                    onAudioLoad(); \
                } \
            } \
        } \
        function onAudioLoad() { \
            jsPsych.preloadImages(images, function(){ startExperiment(); }, \
            function(nLoaded) { updateLoadedCount(nLoaded); }); \
            function updateLoadedCount(nLoaded){    document.getElementById('textBox').innerHTML = '' + nLoaded + ' of ' + images.length + ' image files loaded.';\
            } \
            function startExperiment() { \
                jsPsych.init({         experiment_structure: blocks,         on_finish: function() {                   jsPsych.data.displayData();         }     }); \
            } \
        } \
    </script> </html>";
}

function setKeyChoices() {
    "use strict";
    var i,
        taskNum = document.getElementById("General_task_select").selectedIndex + 1;
    
    for (i = 1; i <= 2 * taskNum; i += 1) {
        if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "\u25C4") {
            keyChoices.push(37);
        } else if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "\u25B2") {
            keyChoices.push(38);
        } else if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "\u25BA") {
            keyChoices.push(39);
        } else if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "\u25BC") {
            keyChoices.push(40);
        } else if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "BLANK") {
            keyChoices.push(-1);
        } else if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "SPACE") {
            keyChoices.push(32);
        } else if (document.getElementById("General_value_table_td_" + i + "_1_input").value === "ENTER") {
            keyChoices.push(13);
        } else {
            keyChoices.push(document.getElementById("General_value_table_td_" + i + "_1_input").value.charCodeAt(0));
        }
    }
}
function makeStringSafe(str) {
    "use strict";
    var output;
    output = str.replace("'", "&#39;");
    output = output.replace('"', "&quot;");
    return output;
}
function addAsset(str, type) {
    "use strict";
    if (type === "image") {
        if (html4.indexOf(str) === -1) {
            if (html4.charAt(html4.length - 2) === ';') {
                html4 = html4.substr(0, html4.length - 3);
            }
            if (html4.charAt(html4.length - 1) !== '[') {
                html4 += ",";
            }
            html4 += "'" + str + "'];\n";
        }
    } else if (type === "audio") {
        if (html4a.indexOf(str) === -1) {
            if (html4a.charAt(html4a.length - 2) === ';') {
                html4a = html4a.substr(0, html4a.length - 3);
            }
            if (html4a.charAt(html4a.length - 1) !== '[') {
                html4a += ",";
            }
            html4a += "'" + str + "'];\n";
            audio.push(str);
        }
    }
}
function getAudioId(str) {
    "use strict";
    var i;
    
    for (i = 0; i < audio.length; i += 1) {
        if (audio[i] === "assets/" + str) {
            return i;
        }
    }
}
function getNumberInputValue(name, type) {
    "use strict";
    var leftNum = 0,
        rightNum,
        outputNum,
        rightElement = document.getElementById(name + "_" + type + "_number_right"),
        leftElement = document.getElementById(name + "_" + type + "_number_left");
    
    if (rightElement !== null && leftElement !== null) {
        outputNum = 10 * parseInt(leftElement.value, 10) + parseInt(rightElement.value, 10);
    } else {
        outputNum = -1;
    }
    
    return outputNum;
}

function downloadTextFile(text) {
    "use strict";
    var data = new Blob([text], {type: 'text/plain'}),
        textFile = null,
        dlLink = document.createElement("a");

    textFile = window.URL.createObjectURL(data);

    dlLink.setAttribute('download', 'index.html');
    dlLink.setAttribute('href', textFile);
    dlLink.innerHTML = "Click here to download.";
    
    document.getElementById("dlLink").innerHTML = dlLink.outerHTML;
}

function generateIntroBlock(name) {
    "use strict";
    var str = "var " + name + "_introduction_block = { type: 'text', text: '",
        audioId;
    
    if (document.getElementById(name + "_instructions_audio_check").checked) {
        addAsset("assets/" + makeStringSafe(document.getElementById(name + "_instructions_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
        audioId = getAudioId(makeStringSafe(document.getElementById(name + "_instructions_audio_file").value.split(/(\\|\/)/g).pop()));
        str += "<script>document.getElementById(\"body\").appendChild(audioContainer.querySelector(\"#a" + audioId + "\")); document.getElementById(\"a" + audioId + "\").play();</scr' + 'ipt><p>";
    }
    if (document.getElementById(name + "_instructions_image_check").checked) {
        str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_instructions_image_file").value.split(/(\\|\/)/g).pop()) + imageScale + "<p>";
        addAsset("assets/" + makeStringSafe(document.getElementById(name + "_instructions_image_file").value.split(/(\\|\/)/g).pop()), "image");
    }
    if (document.getElementById(name + "_instructions_text_check").checked) {
        str += makeStringSafe(document.getElementById(name + "_instructions_input_textarea_textarea").value);
    }
    str += "' };\n";
    
    return str;
}
function generateTestBlock(name) {
    "use strict";
    var str,
        audioId,
        stimTime = 1000,
        feedbackTime = 1000;
    
    if (document.getElementById(name + "_response_time_feedback_input")) {
        feedbackTime = parseInt(document.getElementById(name + "_response_time_feedback_input").value, 10);
    }
    if (document.getElementById(name + "_response_time_stimuli_input")) {
        stimTime = parseInt(document.getElementById(name + "_response_time_stimuli_input").value, 10);
    }
    
    if (document.getElementById(name + "_feedback_none").checked) {
        str = "var " + name + "_test_block = {" +
                                "type: 'categorize'," +
                                "stimuli: stim" + name + "Images," +
                                "key_answer: answers" + name + "," +
                                "text_answer: ''," +
                                "data: stim" + name + "Data," +
                                "choices: [" + keyChoices[0] + ", " + keyChoices[1] + "]," +
                                "correct_text: '', incorrect_text: ''," +
                                "is_html: true," +
                                "timing_response: " + stimTime + "," +
                                "timing_feedback_duration: 1," +
                                "show_stim_with_feedback: false," +
                                "timeout_message: '<b></b>'," +
                                "timing_stim: " + stimTime + " };\n";
        
    } else {
        str = "var " + name + "_test_block = {" +
            "type: 'categorize'," +
            "stimuli: stim" + name + "Images," +
            "key_answer: answers" + name + "," +
            "text_answer: ''," +
            "data: stim" + name + "Data," +
            "choices: [" + keyChoices[0] + ", " + keyChoices[1] + "],";
        
        if (document.getElementById(name + "_feedback_correct").checked) {
            str += "correct_text: '";
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById(name + "_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById(name + "_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "', ";
        } else {
            str += "correct_text: '', ";
        }
        
        if (document.getElementById(name + "_feedback_incorrect").checked) {
            str += "incorrect_text: '";
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById(name + "_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById(name + "_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "',";
        } else {
            str += "incorrect_text: '', ";
        }
        
        if (document.getElementById(name + "_feedback_slow").checked) {
            str += "timeout_message: '";
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_slow_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById(name + "_feedback_slow_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById(name + "_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_feedback_slow_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_slow_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "',";
        } else {
            str += "timeout_message: '<b></b>', ";
        }
        
        str += "is_html: true," +
                "timing_feedback_duration: " + feedbackTime + "," +
                "timing_response: " + stimTime + "," +
                "timing_stim: " + stimTime + " };\n";
    }
    
    return str;
}

function generateSeriesTestBlock(name) {
    "use strict";
    var str,
        audioId,
        stimTime = 1000,
        feedbackTime = 1000;
    
    if (document.getElementById(name + "_response_time_feedback_input")) {
        feedbackTime = parseInt(document.getElementById(name + "_response_time_feedback_input").value, 10);
    }
    if (document.getElementById(name + "_response_time_stimuli_input")) {
        stimTime = parseInt(document.getElementById(name + "_response_time_stimuli_input").value, 10);
    }
    
    if (document.getElementById(name + "_feedback_none").checked) {
        str = "var " + name + "_test_block = {" +
                                "type: 'multi-stim-multi-response'," +
                                "stimuli: stimSeries" + name + "Images," +
                                "data: stimSeries" + name + "Data," +
                                "choices: [" + keyChoices[0] + ", " + keyChoices[1] + "]," +
                                //"correct_text: '', incorrect_text: ''," +
                                "is_html: true," +
                                "timing_response: " + stimTime + "," +
                                "timing_feedback_duration: 1," +
                                "show_stim_with_feedback: false," +
                                "timing_stim: " + stimTime + " };\n";
        
    } else {
        str = "var " + name + "_test_block = {" +
            "type: 'categorize'," +
            "stimuli: stim" + name + "Images," +
            "key_answer: answers" + name + "," +
            "text_answer: ''," +
            "data: stim" + name + "Data," +
            "choices: [" + keyChoices[0] + ", " + keyChoices[1] + "],";
        
        if (document.getElementById(name + "_feedback_correct").checked) {
            str += "correct_text: '";
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById(name + "_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById(name + "_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "', ";
        } else {
            str += "correct_text: '', ";
        }
        
        if (document.getElementById(name + "_feedback_incorrect").checked) {
            str += "incorrect_text: '";
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById(name + "_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById(name + "_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "',";
        } else {
            str += "incorrect_text: '', ";
        }
        
        if (document.getElementById(name + "_feedback_slow").checked) {
            str += "timeout_message: '";
            if (document.getElementById(name + "_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_slow_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById(name + "_feedback_slow_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById(name + "_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById(name + "_feedback_slow_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById(name + "_feedback_slow_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "',";
        } else {
            str += "timeout_message: '<b></b>', ";
        }
        
        str += "is_html: true," +
                "timing_feedback_duration: " + feedbackTime + "," +
                "timing_response: " + stimTime + "," +
                "timing_stim: " + stimTime + " };\n";
    }
    
    return str;
}

function generateArraysJS(name) {
    "use strict";
    var i,
        j,
        k,
        cueNum = getNumberInputValue(name, "cue"),
        trialsNum = getNumberInputValue(name, "trial"),
        congruentNum = getNumberInputValue(name, "congruent"),
        incongruentNum = trialsNum - congruentNum,
        switchesNum = getNumberInputValue(name, "switches"),
        switchCount,
        switchIndex = 0,
        congruentNumbers = [0],
        incongruentNumbers = [0],
        taskIndex = document.getElementById("General_task_select").selectedIndex,
        stimImagesJS = "var stim" + name + "Images = [",
        stimDataJS = "var stim" + name + "Data = [",
        answersJS = "var answers" + name + " = [",
        stimSeriesImagesJS = "var stimSeries" + name + "Images = [",
        stimSeriesDataJS = "var stimSeries" + name + "Data = [",
        congruencyRatio = incongruentNum / trialsNum,
        stimCycleIndex,
        stimCycleCount = 0,
        cueCount = cueNum,
        taskNumIndex = 0,
        taskNum = taskIndex + 1,
        temp;
    
    if (switchesNum > -1) {
        switchCount = trialsNum / (switchesNum + 1);
        switchIndex = switchCount;
    } else {
        switchCount = trialsNum + 1;
        taskNumIndex = 1;
    }
    
    for (i = 1; i <= stimNum; i += 1) {
        if (document.getElementById("General_stim_congruent_select_" + i).selectedIndex === 0) {
            congruentNumbers.push(i);
        } else {
            incongruentNumbers.push(i);
        }
    }
    
    for (i = 1; i <= trialsNum; i += 1) {
        if (stimCycleCount === stimNum) {
            stimCycleCount = 1;
            for (j = 1; j <= stimNum; j += 1) {
                if (document.getElementById("General_stim_congruent_select_" + j).selectedIndex === 0) {
                    if (congruentNum > 0) {
                        congruentNumbers.push(j);
                    }
                } else if (incongruentNum > 0) {
                    incongruentNumbers.push(j);
                }
            }
        } else {
            stimCycleCount += 1;
        }
        
        if (switchIndex === switchCount) {
            switchIndex = 0;
            if (taskNumIndex < taskNum) {
                taskNumIndex += 1;
            } else {
                taskNumIndex = 1;
            }
            stimImagesJS += "cue" + name + (taskNumIndex - 1) + ".image";
            stimDataJS += "cue" + name + (taskNumIndex - 1) + ".data";
            answersJS += "0";
            trialsNum += 1;
            if (i < trialsNum) {
                stimImagesJS += ", ";
                stimDataJS += ", ";
                answersJS += ", ";
            }
            continue;
        }
        switchIndex += 1;
        
        if (cueNum > -1 && cueCount === cueNum) {
            stimImagesJS += "cue" + name + "0.image";
            stimDataJS += "cue" + name + "0.data";
            answersJS += "0";
            cueCount = 0;
            trialsNum += 1;
        } else {
            if (document.getElementById(name + "_random_prompt_no").checked) {
                if (document.getElementById("General_stim_congruent_select_" + stimCycleCount).selectedIndex === 0 && congruentNum > 0) {
                    stimImagesJS += "stim" + (stimCycleCount + stimNum * (taskNumIndex - 1)) + ".image";
                    stimDataJS += "stim" + (stimCycleCount + stimNum * (taskNumIndex - 1)) + ".data";
                    answersJS += keyChoices[(2 * taskNumIndex) - 2 + document.getElementById("General_stim_select_" + taskNumIndex + "_" + stimCycleCount).selectedIndex];
                    congruentNum -= 1;
                } else if (document.getElementById("General_stim_congruent_select_" + stimCycleCount).selectedIndex === 1 && incongruentNum > 0) {
                    stimImagesJS += "stim" + (stimCycleCount + stimNum * (taskNumIndex - 1)) + ".image";
                    stimDataJS += "stim" + (stimCycleCount + stimNum * (taskNumIndex - 1)) + ".data";
                    answersJS += keyChoices[(2 * taskNumIndex) - 2 + document.getElementById("General_stim_select_" + taskNumIndex + "_" + stimCycleCount).selectedIndex];
                    incongruentNum -= 1;
                } else {
                    trialsNum += 1;
                    continue;
                }
            } else {
                if (congruentNumbers.length > 1 && congruentNum > 0 && (Math.random() > congruencyRatio || incongruentNumbers.length < 2 || incongruentNum < 1)) {
                    temp = parseInt((Math.random() * (congruentNumbers.length - 1)) + 1, 10);
                    stimCycleIndex = congruentNumbers[temp];
                    stimImagesJS += "stim" + (stimCycleIndex + stimNum * (taskNumIndex - 1)) + ".image";
                    stimDataJS += "stim" + (stimCycleIndex + stimNum * (taskNumIndex - 1)) + ".data";
                    answersJS += keyChoices[(2 * taskNumIndex) - 2 + document.getElementById("General_stim_select_" + taskNumIndex + "_" + stimCycleIndex).selectedIndex];
                    congruentNumbers.splice(temp, 1);
                    congruentNum -= 1;
                } else if (incongruentNumbers.length > 1 && incongruentNum > 0) {
                    temp = parseInt((Math.random() * (incongruentNumbers.length - 1)) + 1, 10);
                    stimCycleIndex = incongruentNumbers[temp];
                    stimImagesJS += "stim" + (stimCycleIndex + stimNum * (taskNumIndex - 1)) + ".image";
                    stimDataJS += "stim" + (stimCycleIndex + stimNum * (taskNumIndex - 1)) + ".data";
                    answersJS += keyChoices[(2 * taskNumIndex) - 2 + document.getElementById("General_stim_select_" + taskNumIndex + "_" + stimCycleIndex).selectedIndex];
                    incongruentNumbers.splice(temp, 1);
                    incongruentNum -= 1;
                } else {
                    trialsNum += 1;
                    continue;
                }
            }
            
            cueCount += 1;
        }
        
        if (i < trialsNum) {
            stimImagesJS += ", ";
            stimDataJS += ", ";
            answersJS += ", ";
        }
    }
    stimImagesJS += "];\n";
    stimDataJS += "];\n";
    answersJS += "];\n";
    
    if (document.getElementById("General_series_prompt_yes").checked) {
        for (i = 1; i <= getNumberInputValue("General", "diff_lengths"); i += 1) {
            for (j = 1; j <= document.getElementById("General_series_stim_" + i + "_container").childElementCount; j += 1) {
                stimSeriesImagesJS += "[";
                stimSeriesDataJS += "[";
                for (k = 1; k <= parseInt(document.getElementById("General_enter_lengths_" + i + "_input").value, 10); k += 1) {
                    stimSeriesImagesJS += "stim" + (document.getElementById("General_series_select_stim_" + parseInt(document.getElementById("General_enter_lengths_" + i + "_input").value, 10) + "." + j + "_" + k).selectedIndex + 1) + ".image";
                    stimSeriesDataJS += "stim" + (document.getElementById("General_series_select_stim_" + parseInt(document.getElementById("General_enter_lengths_" + i + "_input").value, 10) + "." + j + "_" + k).selectedIndex + 1) + ".data";
                    if (k < parseInt(document.getElementById("General_enter_lengths_" + i + "_input").value, 10)) {
                        stimSeriesImagesJS += ",";
                        stimSeriesDataJS += ",";
                    }
                }
                stimSeriesImagesJS += "]";
                stimSeriesDataJS += "]";
                if (j < document.getElementById("General_series_stim_" + i + "_container").childElementCount) {
                    stimSeriesImagesJS += ",";
                    stimSeriesDataJS += ",";
                }
            }
        }
    }
    stimSeriesImagesJS += "];\n";
    stimSeriesDataJS += "];\n";
    
    return [stimImagesJS, stimDataJS, answersJS, stimSeriesImagesJS, stimSeriesDataJS];
}

function generateExampleTestBlock() {
    "use strict";
    var str,
        audioId,
        pauseAll = "for(i = 0; i < audioContainer.childElementCount; i += 1) {" +
                        "audioContainer.childNodes[i].pause(); }",
        feedbackTime = 1000;
    
    if (document.getElementById("Example_response_time_feedback_input")) {
        feedbackTime = parseInt(document.getElementById("Example_response_time_feedback_input").value, 10);
    }
    if (document.getElementById("Example_feedback_neither").checked) {
        str = "var Example_test_block = {" +
                                "type: 'categorize'," +
                                "stimuli: stimExampleImages," +
                                "key_answer: answersExample," +
                                "text_answer: ''," +
                                "data: stimExampleData," +
                                "choices: [" + keyChoices[0] + ", " + keyChoices[1] + "]," +
                                "correct_text: '<script>" + pauseAll + "</scr\' + \'ipt>'," +
                                "incorrect_text: '<script>" + pauseAll + "</scr\' + \'ipt>'," +
                                "is_html: true };\n";
        
    } else {
        str = "var Example_test_block = {" +
            "type: 'categorize'," +
            "stimuli: stimExampleImages," +
            "key_answer: answersExample," +
            "text_answer: ''," +
            "data: stimExampleData," +
            "choices: [" + keyChoices[0] + ", " + keyChoices[1] + "],";
        
        if (document.getElementById("Example_feedback_correct").checked) {
            str += "correct_text: '<script>" + pauseAll + "</scr\' + \'ipt>";
            if (document.getElementById("Example_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById("Example_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>" + pauseAll + "audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById("Example_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById("Example_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "', incorrect_text: '<script>document.getElementById(\"audioExample\").pause();</scr\' + \'ipt>',";
            
        } else if (document.getElementById("Example_feedback_incorrect").checked) {
            str += "correct_text: '<script>" + pauseAll + "</scr\' + \'ipt>', incorrect_text: '<script>" + pauseAll + "</scr\' + \'ipt>";
            if (document.getElementById("Example_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = makeStringSafe(document.getElementById("Example_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop());
                str += "<script>" + pauseAll + "audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById("Example_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById("Example_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "',";
            
        } else if (document.getElementById("Example_feedback_both").checked) {
            str += "correct_text: '<script>" + pauseAll + "</scr\' + \'ipt>";
            if (document.getElementById("Example_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById("Example_feedback_correct_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>" + pauseAll + "audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById("Example_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById("Example_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_correct_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "', incorrect_text: '<script>" + pauseAll + "</scr\' + \'ipt>";
            if (document.getElementById("Example_feedback_audio_check").checked) {
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                audioId = getAudioId(makeStringSafe(document.getElementById("Example_feedback_incorrect_audio_file").value.split(/(\\|\/)/g).pop()));
                str += "<script>" + pauseAll + "audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
            }
            if (document.getElementById("Example_feedback_image_check").checked) {
                str += "<img src=\"assets/" + makeStringSafe(document.getElementById("Example_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()) + imageScaleF;
                addAsset("assets/" + makeStringSafe(document.getElementById("Example_feedback_incorrect_image_file").value.split(/(\\|\/)/g).pop()), "image");
            }
            str += "',";
        }
        
        str += "timing_feedback_duration: " + feedbackTime + "," +
            "is_html: true };\n";
    }
    
    return str;
}
function generateExamplesJS() {
    "use strict";
    var i,
        j,
        audioId,
        trialsNum = getNumberInputValue("Example", "trial"),
        stimImagesJS = "var stimExampleImages = [",
        stimDataJS = "var stimExampleData = [",
        answersJS = "var answersExample = [",
        temp;
    
    for (i = 1; i <= trialsNum; i += 1) {
        addAsset("assets/" + makeStringSafe(document.getElementById("Example_trial_file_" + i).value.split(/(\\|\/)/g).pop()), "audio");
        addAsset("assets/" + makeStringSafe(document.getElementById("General_stim_file_" + (document.getElementById("Example_trial_select_stim_" + i).selectedIndex + 1)).value.split(/(\\|\/)/g).pop()), "image");
        audioId = getAudioId(makeStringSafe(document.getElementById("Example_trial_file_" + i).value.split(/(\\|\/)/g).pop()));
        
        stimImagesJS += "'<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>" +
            "<img src=\"assets/" + makeStringSafe(document.getElementById("General_stim_file_" + (document.getElementById("Example_trial_select_stim_" + i).selectedIndex + 1)).value.split(/(\\|\/)/g).pop()) + imageScale;
        
        stimDataJS += "stim" + (document.getElementById("Example_trial_select_stim_" + i).selectedIndex + 1) + ".data";
        answersJS += keyChoices[document.getElementById("General_stim_select_1_" + (document.getElementById("Example_trial_select_stim_" + i).selectedIndex + 1)).selectedIndex];
            
        if (i < trialsNum) {
            stimImagesJS += ", ";
            stimDataJS += ", ";
            answersJS += ", ";
        }
    }
    
    stimImagesJS += "];\n";
    stimDataJS += "];\n";
    answersJS += "];\n";
    
    return [stimImagesJS, stimDataJS, answersJS];
}


function createTest() {
    "use strict";
    var i,
        j,
        temp,
        stimJS = "",
        cuesJS = "",
        answersJS = "",
        stimImagesJS = "",
        stimDataJS = "",
        stimSeriesImagesJS = "",
        stimSeriesDataJS = "",
        blocksJS = "var blocks = [Introduction_introduction_block, ",
        introBlockJS,
        practiceIntroBlockJS,
        exampleIntroBlockJS,
        testBlockJS,
        practiceBlockJS,
        exampleBlockJS,
        trialsIntroBlockJS,
        finalMessageBlockJS,
        audioId,
        taskIndex = document.getElementById("General_task_select").selectedIndex,
        testBlockHeaders = ["Practice", "Trials"],
        pagesArrayJS = "var pagesArray = [",
        pagesJS = "",
        outputJS = "";
    
    initializeVars();
    stimNum = getNumberInputValue("General", "stim");
    setKeyChoices();
    
    /**
    * Set background image
    * Preload image
    */
    if (document.getElementById("General_background_image_file")) {
        html3 += " style=\"background:url('assets/" + makeStringSafe(document.getElementById("General_background_image_file").value.split(/(\\|\/)/g).pop()) + "'); background-repeat: no-repeat; background-size: cover;\"";
        addAsset("assets/" + makeStringSafe(document.getElementById("General_background_image_file").value.split(/(\\|\/)/g).pop()), "image");
    }
    
    /**
    * Generate introduction pages if needed
    * Preload any assets.
    */
    if (document.getElementById("page_2_container")) {
        introBlockJS = "var Introduction_introduction_block = { type: 'instructions', pages: pagesArray, allow_backward: false };\n";
        pagesJS += "var page1 = '";
    
        if (document.getElementById("Introduction_instructions_audio_check").checked) {
            addAsset("assets/" + makeStringSafe(document.getElementById("Introduction_instructions_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
            audioId = getAudioId(makeStringSafe(document.getElementById("Introduction_instructions_audio_file").value.split(/(\\|\/)/g).pop()));
            pagesJS += "<script>document.getElementById(\"body\").appendChild(audioContainer.querySelector(\"#a" + audioId + "\")); document.getElementById(\"a" + audioId + "\").play();</scr' + 'ipt><p>";
        }
        if (document.getElementById("Introduction_instructions_image_check").checked) {
            pagesJS += "<img src=\"assets/" + makeStringSafe(document.getElementById("Introduction_instructions_image_file").value.split(/(\\|\/)/g).pop()) + imageScale + "<p>";
            addAsset("assets/" + makeStringSafe(document.getElementById("Introduction_instructions_image_file").value.split(/(\\|\/)/g).pop()), "image");
        }
        if (document.getElementById("Introduction_instructions_text_check").checked) {
            pagesJS += makeStringSafe(document.getElementById("Introduction_instructions_input_textarea_textarea").value);
        }
        pagesJS += "';\n";
        pagesArrayJS += "page1, ";
        
    } else {
        introBlockJS = generateIntroBlock("Introduction");
        pagesArrayJS += "];\n";
    }
    
    i = 2;
    while (document.getElementById("page_" + i + "_container")) {
        pagesJS += "var page" + i + " = '";
    
        if (document.getElementById("Introduction_instructions_audio_check_" + i).checked) {
            addAsset("assets/" + makeStringSafe(document.getElementById("Introduction_instructions_audio_" + i + "_file").value.split(/(\\|\/)/g).pop()), "audio");
            audioId = getAudioId(makeStringSafe(document.getElementById("Introduction_instructions_audio_" + i + "_file").value.split(/(\\|\/)/g).pop()));
            pagesJS += "<script>document.getElementById(\"body\").appendChild(audioContainer.querySelector(\"#a" + audioId + "\")); document.getElementById(\"a" + audioId + "\").play();</scr' + 'ipt><p>";
        }
        if (document.getElementById("Introduction_instructions_image_check_" + i).checked) {
            pagesJS += "<img src=\"assets/" + makeStringSafe(document.getElementById("Introduction_instructions_image_" + i + "_file").value.split(/(\\|\/)/g).pop()) + imageScale + "<p>";
            addAsset("assets/" + makeStringSafe(document.getElementById("Introduction_instructions_image_" + i + "_file").value.split(/(\\|\/)/g).pop()), "image");
        }
        if (document.getElementById("Introduction_instructions_text_check_" + i).checked) {
            pagesJS += makeStringSafe(document.getElementById("Introduction_instructions_input_textarea_" + i + "_textarea").value);
        }
        pagesJS += "';\n";
        pagesArrayJS += "page" + i;
        if (document.getElementById("page_" + (i + 1) + "_container")) {
            pagesArrayJS += ", ";
        } else {
            pagesArrayJS += "];\n";
        }
        
        i += 1;
    }
    /**
    * Generate JS for blocks array
    * Generate JS for introductions blocks and final message block
    * Generate JS for test blocks
    * Generate JS for stimImages, stimData and answers
    */
    finalMessageBlockJS = generateIntroBlock("Submit");
    
    if (document.getElementById("Example_prompt_yes").checked) {
        blocksJS += "Example_introduction_block, Example_test_block, ";
        exampleIntroBlockJS = generateIntroBlock("Example");
        exampleBlockJS = generateExampleTestBlock();
        temp = generateExamplesJS();
        stimImagesJS += temp[0];
        stimDataJS += temp[1];
        answersJS += temp[2];
    }
    if (document.getElementById("Practice_prompt_yes").checked) {
        blocksJS += "Practice_introduction_block, Practice_test_block, ";
        practiceIntroBlockJS = generateIntroBlock("Practice");
        
        if (document.getElementById("General_series_prompt_yes").checked === false) {
            practiceBlockJS = generateTestBlock("Practice");
        } else {
            practiceBlockJS = generateSeriesTestBlock("Practice");
        }
        temp = generateArraysJS("Practice");
        stimImagesJS += temp[0];
        stimDataJS += temp[1];
        answersJS += temp[2];
        stimSeriesImagesJS += temp[3];
        stimSeriesDataJS += temp[4];
    }
    
    blocksJS += "Trials_introduction_block, Trials_test_block, ";
    if (document.getElementById("General_series_prompt_yes").checked === false) {
        testBlockJS = generateTestBlock("Trials");
    } else {
        testBlockJS = generateSeriesTestBlock("Trials");
    }
    trialsIntroBlockJS = generateIntroBlock("Trials");
    temp = generateArraysJS("Trials");
    stimImagesJS += temp[0];
    stimDataJS += temp[1];
    answersJS += temp[2];
    stimSeriesImagesJS += temp[3];
    stimSeriesDataJS += temp[4];
    
    blocksJS += "Submit_introduction_block];";
    
    
    /**
    * Generate JS for stimuli
    */
    for (i = 1; i <= stimNum * (taskIndex + 1); i += 1) {
        if (i > stimNum * 3) {
            temp = i - (stimNum * 3);
        } else if (i > stimNum * 2) {
            temp = i - (stimNum * 2);
        } else if (i > stimNum) {
            temp = i - stimNum;
        } else {
            temp = i;
        }
        
        stimJS += "var stim" + i + " = { " +
            "image: '<img src=\"assets/" + makeStringSafe(document.getElementById("General_stim_file_" + temp).value.split(/(\\|\/)/g).pop()) + imageScale + "'," +
            "data: { ";
        if (i <= stimNum) {
            stimJS += document.getElementById("General_task_table_td_1_0_input").value + ": '" + document.getElementById("General_stim_select_1_" + temp).options[document.getElementById("General_stim_select_1_" + temp).selectedIndex].value + "', ";
        } else if (i <= stimNum * 2) {
            stimJS += document.getElementById("General_task_table_td_2_0_input").value + ": '" + document.getElementById("General_stim_select_2_" + temp).options[document.getElementById("General_stim_select_2_" + temp).selectedIndex].value + "', ";
        } else if (i <= stimNum * 3) {
            stimJS += document.getElementById("General_task_table_td_3_0_input").value + ": '" + document.getElementById("General_stim_select_3_" + temp).options[document.getElementById("General_stim_select_3_" + temp).selectedIndex].value + "', ";
        } else {
            stimJS += document.getElementById("General_task_table_td_4_0_input").value + ": '" + document.getElementById("General_stim_select_4_" + temp).options[document.getElementById("General_stim_select_4_" + temp).selectedIndex].value + "', ";
        }
        stimJS += "Congruent: '" + document.getElementById("General_stim_congruent_select_" + temp).options[document.getElementById("General_stim_congruent_select_" + temp).selectedIndex].value + "' } };\n";
        addAsset("assets/" + makeStringSafe(document.getElementById("General_stim_file_" + temp).value.split(/(\\|\/)/g).pop()), "image");
    }
    
    /**
    * Generate JS for cues
    */
    for (i = 0; i < testBlockHeaders.length; i += 1) {
        for (j = 0; j <= taskIndex; j += 1) {
            if (document.getElementById(testBlockHeaders[i] + "_cue_never")) {
                if (document.getElementById(testBlockHeaders[i] + "_cue_never").checked === false) {
                    cuesJS += "var cue" + testBlockHeaders[i] + j + " = { image: '";
                    if (document.getElementById(testBlockHeaders[i] + "_cue_" + j + "_image_file")) {
                        addAsset("assets/" + makeStringSafe(document.getElementById(testBlockHeaders[i] + "_cue_" + j + "_image_file").value.split(/(\\|\/)/g).pop()), "image");
                        cuesJS += "<img src=\"assets/" + makeStringSafe(document.getElementById(testBlockHeaders[i] + "_cue_" + j + "_image_file").value.split(/(\\|\/)/g).pop()) + imageScale;
                    }
                    if (document.getElementById(testBlockHeaders[i] + "_cue_" + j + "_audio_file")) {
                        addAsset("assets/" + makeStringSafe(document.getElementById(testBlockHeaders[i] + "_cue_" + j + "_audio_file").value.split(/(\\|\/)/g).pop()), "audio");
                        audioId = getAudioId(makeStringSafe(document.getElementById(testBlockHeaders[i] + "_cue_" + j + "_audio_file").value.split(/(\\|\/)/g).pop()));
                        cuesJS += "<script>audioContainer.querySelector(\"#a" + audioId + "\").play();</scr' + 'ipt>";
                    }
                    cuesJS += "', data: { isACue: true } }; ";
                }
            }
        }
    }
    
    /**
    * Make sure audio array is closed if empty
    */
    if (html4a.length === 13) {
        html4a += "];";
    }
    
    /**
    * Create the complete JS code
    */
    outputJS = pagesJS + pagesArrayJS + stimJS + cuesJS + stimImagesJS + stimDataJS + answersJS + stimSeriesImagesJS  + stimSeriesDataJS + introBlockJS;
    if (exampleBlockJS !== undefined) {
        outputJS += exampleIntroBlockJS + exampleBlockJS;
    }
    if (practiceBlockJS !== undefined) {
        outputJS += practiceIntroBlockJS + practiceBlockJS;
    }
    outputJS += trialsIntroBlockJS + testBlockJS + finalMessageBlockJS + blocksJS;
    
    /**
    * Create and download the html file
    */
    output = html1 + document.getElementById("Submit_input_textline_folder").value + html2 + outputJS + html3 + html4 + html4a + html5;
    downloadTextFile(output);
}