hterm.defaultStorage = new lib.Storage.Memory();
var modifierTable = {
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false
};

function sendInputMessage(str) {
    const handler = window.webkit.messageHandlers.UTMSendInput;
    handler.postMessage(str);
}

function writeData(data) {
    const term = window.term;
    const str = String.fromCharCode.apply(null, data);
    term.io.print(str);
}

function focusTerminal() {
//    const term = window.term;
//    term.scrollPort_.focus()
    var element = document.getElementById("terminal");
    element.focus();
}

function modifierDown(keyName) {
    modifierTable[keyName] = true;
}

function modifierUp(keyName) {
    modifierTable[keyName] = false;
}

function programmaticKeyDown(keyCode) {
    var eventData = {
        keyCode: keyCode,
        altKey: modifierTable.altKey,
        ctrlKey: modifierTable.ctrlKey,
        metaKey: modifierTable.metaKey,
        shiftKey: modifierTable.shiftKey
    };
    var keyDownEvent = new KeyboardEvent("keydown", eventData);
    const term = window.term;
    term.keyboard.onKeyDown_(keyDownEvent);
}

function programmaticKeyUp(keyCode) {
    var eventData = {
        keyCode: keyCode,
        altKey: modifierTable.altKey,
        ctrlKey: modifierTable.ctrlKey,
        metaKey: modifierTable.metaKey,
        shiftKey: modifierTable.shiftKey
    };
    var keyUpEvent = new KeyboardEvent("keyup", eventData);
    const term = window.term;
    term.keyboard.onKeyUp_(keyDownEvent);
}

function captureKeydownHandler(event) {
    if (!event.wasSanitized) {
        
        event.stopPropagation();
    }
}

function terminalSetup() {
    const term = new hterm.Terminal();
    // theme
    term.getPrefs().set('background-color', 'transparent');
    
    term.onTerminalReady = function() {
        const io = this.io.push();
        io.onVTKeystroke = function (str) {
            sendInputMessage(str);
        }
        
        io.sendString = function (str) {
            sendInputMessage(str);
        }
       
        function printPrompt() {
          io.print(
            '\x1b[38:2:51:105:232mh' +
            '\x1b[38:2:213:15:37mt' +
            '\x1b[38:2:238:178:17me' +
            '\x1b[38:2:51:105:232mr' +
            '\x1b[38:2:0:153:37mm' +
            '\x1b[38:2:213:15:37m>' +
            '\x1b[0m ');
        }
        printPrompt();
        this.setCursorVisible(true);
        console.log("Whatever");
    }
    term.decorate(document.querySelector("#terminal"));
    term.installKeyboard()
    window.term = term;
    console.log(term);
};

window.onload = function() {
    //window.addEventListener("keydown", captureKeydownHandler, true)
    lib.init(terminalSetup);
};
