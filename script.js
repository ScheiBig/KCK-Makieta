/**
 * Selects clicked icon in activity bar and opens matching side panel
 * @param {Event} e
 */

function activityIconSelect(e) {
    /** @type {SVGElement} */
    const t = e.currentTarget;

    if (t.classList.contains("selected")) { return; }

    document.querySelectorAll(`.activity svg:not([data-id='${t.dataset.id}'])`)
        .forEach(v => v.classList.remove("selected"));
    
    document.querySelectorAll(`div.side:not([data-id='${t.dataset.id}'])`)
        .forEach(v => v.classList.remove("opened"));

    
    document.querySelector(`svg[data-id='${t.dataset.id}']`)
        .classList
        .add("selected");
    
    document.querySelector(`div.side[data-id='${t.dataset.id}']`)
        ?.classList
        ?.add("opened");
    
    
    lightChange(undefined, true);

    if (t.dataset.id === "keyboard") {
        document.querySelector("#overlayKeyboard").className = "";
        document.querySelector("#keyboard").className = "";
    } else {
        document.querySelector("#overlayKeyboard").className = "hidden";
        document.querySelector("#keyboard").className = "hidden";
    }

    document.querySelectorAll(".side[data-id='keyboard'] > div")
        .forEach(v => v.innerHTML = "");
    
    set_c.clear();
    set_a.clear();
    set_ca.clear();
    set_cs.clear();
    set_as.clear();
    set_cas.clear();

    if (t.dataset.id === "run") {
        document.querySelector("section").className = "runnable";
        document.getElementById("overlayCoffee").className = "";
    } else {
        document.querySelector("section").className = "";
        document.getElementById("overlayCoffee").className = "hidden";
    }
}

/**
 * Register above event listener to icons
 */
document.querySelectorAll(".activity svg")
    .forEach(v => v.addEventListener("click", activityIconSelect));

/**
 * Activate one of icons at start
 */
document.querySelector(".activity [data-id='light']")
    .classList
    .add("selected");
/*
 * And its panel
 */
document.querySelector("div.side[data-id='light']")
    .classList
    .add("opened");

/**
 * Reacts to changes in light
 * @param {Event} e
 * @param {boolean} [r] if `true`, then state is reset
 */

function lightChange(e, r) {
    /** @type {HTMLInputElement} */
    const temp = document.querySelector("#temperature");
    /** @type {HTMLInputElement} */
    const ints = document.querySelector("#intensity");

    if (r) {
        temp.value = 4000;
        ints.value = 320;
    }

    document.querySelector("#temperature + span").innerText = `${temp.value} K`;
    document.querySelector("#intensity + span").innerText = `${ints.value} LUX`;

    console.log(temp.value, ints.value);

    const sec = document.querySelector("section");

    if (ints.value < 250) {
        temp.disabled = true;
        if (ints.value < 125) {
            sec.className = "";
            sec.classList.add("v4");
        } else {
            sec.className = "";
            sec.classList.add("v3");
        }
    } else {
        temp.disabled = false;
        if (temp.value > 3250) {
            sec.className = "";

        } else {
            sec.className = "";
            sec.classList.add("v2");
        }
    }
}

/**
 * Register above event listener to sliders
 */
document.querySelectorAll("p.row > input[type='range']")
    .forEach(v => v.addEventListener("input", (e) => lightChange(e)))


/**
 * Maps value from range x1..y1 to x2..y2
 * @param {number} value 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns {number}
 */
const mapVal = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

/**
 * Maps random value (0..1) to range x..y
 * @param {number} value 
 * @param {number} x 
 * @param {number} y
 * @returns {number}
 * @see {@link Math.random} 
 */
const mapRand = (value, x, y) => mapVal(value, 0, 1, x, y);

/**
 * Gets elements in row of health readings
 * @param {string} id 
 * @returns {[SVGElement, HTMLMeterElement, HTMLSpanElement]}
 */
function getReading(id) {
    const readingRow = document.querySelector(`p[data-id='${id}']`);

    return [...readingRow.children];
}

/**
 * Register random events
 */
setInterval(() => {

    // Heartbeat changing
    const hb = getReading("heartbeat");
    const rHb = Math.max(Math.min(hb[ 1 ].value + mapRand(Math.random(), -5, 5), hb[ 1 ].max), hb[ 1 ].min);
    hb[ 1 ].value = rHb;
    hb[ 2 ].innerText = `${Math.round(rHb)} BPM`;

    // Stress changing
    const st = getReading("stress");
    const rSt = Math.max(Math.min(st[ 1 ].value + mapRand(Math.random(), -5, 5), st[ 1 ].max), st[ 1 ].min);
    st[ 1 ].value = rSt;
    st[ 2 ].innerText = `${Math.round(rSt)} %`;

    // Blood pressure changing
    const bp = getReading("bloodpressure");
    const rBp = Math.max(Math.min(bp[ 1 ].value + mapRand(Math.random(), -5, 5), bp[ 1 ].max), bp[ 1 ].min);
    bp[ 1 ].value = rBp;
    bp[ 2 ].innerText = `${Math.round(rBp)}/${Math.round(rBp * 2 / 3)} mmHg`;

    // Blood oxygen changing
    const bo = getReading("bloodoxygen");
    const rBo = Math.max(Math.min(bo[ 1 ].value + mapRand(Math.random(), -1, 1), bo[ 1 ].max), bo[ 1 ].min);
    bo[ 1 ].value = rBo;
    bo[ 2 ].innerText = `${Math.round(rBo)} %`;


}, 1000)


/**
 * Handles change of assistant mode
 * @param {Event} e
 */
function changeMode(e) {
    const mode = document.getElementById("mode");
    const assistant = document.getElementById("assistant");
    if (assistant.dataset.busy === "true") { return; }

    if (mode.dataset.mode === "txt") { 
        mode.dataset.mode = "cmd";
        mode.querySelector("span:nth-child(2)").innerText = "Kursor i polecenia";
    } else {
        mode.dataset.mode = "txt";
        mode.querySelector("span:nth-child(2)").innerText = "Wprowadzanie tekstu";
    }
}

/**
 * Register above event listener to "button"
 */
document.getElementById("mode")
    .addEventListener("click", changeMode);

const lorems = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Nulla dictum lacinia lectus sodales condimentum.",
    "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
    "Maecenas eget est efficitur ex congue placerat sed et augue.",
    "Sed auctor sapien sed convallis efficitur.",
    "Nulla sed ornare mauris.",
    "Etiam tempus sollicitudin consectetur.",
    "Quisque consectetur arcu sit amet massa ultrices tristique.",
    "Donec vel diam vitae elit congue euismod vel non libero.",
    "Maecenas placerat nisi sagittis nisi condimentum sodales.",
    "Sed et massa sed est imperdiet vestibulum quis vel magna.",
    "Praesent facilisis, metus et mattis elementum, velit odio varius ligula, gravida iaculis velit sapien id metus.",
    "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    "In nunc ante, interdum id nunc id, mollis efficitur enim.",
    "In suscipit arcu non dui pellentesque consectetur.",
    "Vestibulum cursus gravida dui eget gravida.",
    "Phasellus tincidunt, eros id venenatis cursus, elit metus cursus ex, sit amet sollicitudin velit massa a erat.",
    "Morbi aliquet dignissim ligula pulvinar scelerisque.",
    "Mauris scelerisque nec nisl eu tincidunt.",
    "Integer convallis lorem et nibh elementum, et imperdiet nunc tincidunt.",
    "Quisque ultricies vel nisi ac porta.",
    "Quisque feugiat a orci et porttitor.",
    "Vivamus elementum, metus ut molestie volutpat, arcu metus semper augue, vitae iaculis elit mauris non velit.",
    "Aliquam arcu lectus, pharetra non cursus ac, ullamcorper in arcu.",
    "Nullam felis nibh, tempor eu tristique quis, consectetur non turpis."
];

const commands = [
    "get",
    "set",
    "add",
    "window",
    "view"
]

/**
 * Waits
 * @param {Number} time Miliseconds of wait
 * @returns Promise that resolves to callback of setTimeout (should await `void`)
 */
const delay = (time) => new Promise((resolve, reject) => setTimeout(resolve, time));

/**
 * Handles activation of voice assistant
 * @param {Event} e
 */
async function activateAssistant(e) {
    const assistant = document.getElementById("assistant");
    if (assistant.dataset.busy === "true") { return; }
    assistant.dataset.busy = "true";
    const result = document.getElementById("result");
    result.innerText = "";

    const mode = document.getElementById("mode").dataset.mode;
    const decorations = document.getElementById("decorations");
    
    decorations.className = "";
    
    await delay(4000);
    decorations.className = "hidden";

    if (mode === "txt") {
        const lorum = lorems[ Math.round(mapRand(Math.random(), 0, lorems.length - 1)) ];
        await delay(150);
        result.innerText = "Wykryty tekst:\n";
        for (c of lorum) {
            result.innerText += c;
            await delay(mapRand(Math.random(), 10, 50));
        }
    } else {
        const command = commands[ Math.round(mapRand(Math.random(), 0, commands.length - 1)) ];
        const overlay = document.getElementById("overlayCommand");

        await delay(250);
        overlay.style.backgroundImage = `url(img/command_${command}.png)`;
        overlay.className = "";
    }
    assistant.dataset.busy = "false";

}


/**
 * Register above event listener to assistant
 */
document.getElementById("assistant")
    .addEventListener("click", activateAssistant, false);


/**
 * Register events that hide overlays
 */
document.getElementById("overlayCommand")
    .addEventListener("click", e => e.currentTarget.className = "hidden");

/**
 * Register events that open modals
 */
document.querySelectorAll("meter")
    .forEach(v => v.addEventListener("click", e => {
        console.log(`#overlayModal [data-id='${e.currentTarget.dataset.id}']`);
        document.querySelector(`#overlayModal [data-id='${e.currentTarget.dataset.id}']`)
            .className = "";
        document.getElementById("overlayModal").classList = "";
    }));

/**
 * Register events that close modals
 */
document.querySelectorAll("button[data-id]")
    .forEach(v => v.addEventListener("click", e => {
        const btn = e.currentTarget;
        const parent = e.currentTarget.parentElement.parentElement;
        switch (btn.dataset.id) {
            case "ok":
                parent.classList = "hidden";
                document.getElementById("overlayModal").classList = "hidden";
                break;
            case "finish":
                parent.classList = "hidden";
                document.getElementById("overlayModal").classList = "hidden";
                /** @type {HTMLMeterElement} */
                const meter = document.querySelector(`meter[data-id='${parent.dataset.id}']`);
                meter.value = meter.optimum;
                meter.dispatchEvent(new Event('input'));
                document.querySelector("video").pause();
                break;
            case "continue":
                parent.classList = "hidden";
                document.querySelector(`#overlayModal [data-id='${parent.dataset.id}'][data-contd]`)
                    .className = "";
                if (parent.dataset.id === "stress") {
                    document.querySelector("video").play();
                }
                break;
        };
    }));

const codes = new Set();

document.getElementById("keyboard")
    .addEventListener("keydown", e => {
        e.preventDefault();
        console.log(e);
        const coords = keyMap[ e.code ];
        if (coords) {
            document.querySelector(`#keyboard > div:nth-child(${coords[ 0 ]}) > p:nth-child(${coords[ 1 ]})`).className = "pressed";
        }

        if (wrongLow.includes(e.key)) {
            addKey(keyVal[ e.code ], true, true, false);
        } else if (wrongUpp.includes(e.key)) {
            addKey(keyVal[ e.code ], true, true, true);

        } else if (keyVal[ e.code ]) {
            addKey(keyVal[ e.code ], e.ctrlKey, e.altKey, e.shiftKey);
        }

        return false;
    });

document.getElementById("keyboard")
    .addEventListener("keyup", e => {
        e.preventDefault();

        const coords = keyMap[ e.code ];
        if (coords) {
            document.querySelector(`#keyboard > div:nth-child(${coords[ 0 ]}) > p:nth-child(${coords[ 1 ]})`).className = "";
        }

        return false;
    });

/// Sets for registered keys
const set_c = new Set();
const set_a = new Set();
const set_ca = new Set();
const set_cs = new Set();
const set_as = new Set();
const set_cas = new Set();
/**
 * @param {string} keyValue
 * @param {bool} ctrl
 * @param {alt} alt
 * @param {shift} shift
 */
function addKey(keyValue, ctrl, alt, shift) {
    const flags = ctrl * 1 + alt * 2 + shift * 4;

    console.log(flags, keyValue, ctrl, alt, shift);

    switch (flags) {
        case 0: //None
            return;
        case 1: // Ctrl
            set_c.add(keyValue);
            document.getElementById("s_c")
                .innerHTML = [ ...set_c ]?.map(v => `<span>${v}</span>`)
                    ?.join("") ?? "";
            break;
        case 2: // Alt
            set_a.add(keyValue);
            document.getElementById("s_a")
                .innerHTML = [ ...set_a ]?.map(v => `<span>${v}</span>`)
                    ?.join("") ?? "";
            break;
        case 3: // Ctrl + Alt
            set_ca.add(keyValue);
            document.getElementById("s_ca")
                .innerHTML = [ ...set_ca ]?.map(v => `<span>${v}</span>`)
                    ?.join("") ?? "";
            break;
        case 4: // Shift
            return;
        case 5: // Ctrl + Shift
            set_cs.add(keyValue);
            document.getElementById("s_cs")
                .innerHTML = [ ...set_cs ]?.map(v => `<span>${v}</span>`)
                    ?.join("") ?? "";
            break;
        case 6: // Alt + Shift
            set_as.add(keyValue);
            document.getElementById("s_as")
                .innerHTML = [ ...set_as ]?.map(v => `<span>${v}</span>`)
                    ?.join("") ?? "";
            break;
        case 7: // Ctrl + Alt + Shift
            set_cas.add(keyValue);
            document.getElementById("s_cas")
                .innerHTML = [ ...set_cas ]?.map(v => `<span>${v}</span>`)
                    ?.join("") ?? "";
            break;
    }
}


const keyMap = {
    "Backquote": [1, 1],
    "Digit1": [1, 2],
    "Digit2": [1, 3],
    "Digit3": [1, 4],
    "Digit4": [1, 5],
    "Digit5": [1, 6],
    "Digit6": [1, 7],
    "Digit7": [1, 8],
    "Digit8": [1, 9],
    "Digit9": [1, 10],
    "Digit0": [1, 11],
    "Minus": [1, 12],
    "Equal": [1, 13],
    "KeyQ": [2, 2],
    "KeyW": [2, 3],
    "KeyE": [2, 4],
    "KeyR": [2, 5],
    "KeyT": [2, 6],
    "KeyY": [2, 7],
    "KeyU": [2, 8],
    "KeyI": [2, 9],
    "KeyO": [2, 10],
    "KeyP": [2, 11],
    "BracketLeft": [2, 12],
    "BracketRight": [2, 13],
    "Backslash": [2, 14],
    "KeyA": [3, 2],
    "KeyS": [3, 3],
    "KeyD": [3, 4],
    "KeyF": [3, 5],
    "KeyG": [3, 6],
    "KeyH": [3, 7],
    "KeyJ": [3, 8],
    "KeyK": [3, 9],
    "KeyL": [3, 10],
    "Semicolon": [3, 11],
    "Quote": [ 3, 12 ],
    "ShiftLeft": [4, 1],
    "KeyZ": [4, 2],
    "KeyX": [4, 3],
    "KeyC": [4, 4],
    "KeyV": [4, 5],
    "KeyB": [4, 6],
    "KeyN": [4, 7],
    "KeyM": [4, 8],
    "Comma": [4, 9],
    "Period": [4, 10],
    "Slash": [ 4, 11 ],
    "ShiftRight": [ 4, 12 ],
    "ControlLeft": [5, 1],
    "AltLeft": [5, 4],
    "ControlRight": [5, 8]
}

const keyVal = {
    "Backquote": "`",
    "Digit1": "1",
    "Digit2": "2",
    "Digit3": "3",
    "Digit4": "4",
    "Digit5": "5",
    "Digit6": "6",
    "Digit7": "7",
    "Digit8": "8",
    "Digit9": "9",
    "Digit0": "0",
    "Minus": "-",
    "Equal": "=",
    "KeyQ": "Q",
    "KeyW": "W",
    "KeyE": "E",
    "KeyR": "R",
    "KeyT": "T",
    "KeyY": "Y",
    "KeyU": "U",
    "KeyI": "I",
    "KeyO": "O",
    "KeyP": "P",
    "BracketLeft": "[",
    "BracketRight": "]",
    "Backslash": "\\",
    "KeyA": "A",
    "KeyS": "S",
    "KeyD": "D",
    "KeyF": "F",
    "KeyG": "G",
    "KeyH": "H",
    "KeyJ": "J",
    "KeyK": "K",
    "KeyL": "L",
    "Semicolon": ";",
    "Quote": "'",
    "KeyZ": "Z",
    "KeyX": "X",
    "KeyC": "C",
    "KeyV": "V",
    "KeyB": "B",
    "KeyN": "N",
    "KeyM": "M",
    "Comma": ",",
    "Period": ".",
    "Slash": "/"
}

const wrongUpp = [
    "Ę",
    "Ó",
    "Ą",
    "Ś",
    "Ł",
    "Ż",
    "Ź",
    "Ć",
    "Ń"
]

const wrongLow = [
    "ę",
    "€",
    "ó",
    "ą",
    "ś",
    "ł",
    "ż",
    "ź",
    "ć",
    "ń"
]

document.querySelector("#overlayCoffee > div > img")
    .addEventListener("click", e => {
        const expand = document.querySelector("#overlayCoffee [data-expand]");

        expand.dataset.expand = expand.dataset.expand === "true" ? "false" : "true";
    });

document.querySelectorAll("#overlayCoffee [data-expand] > div")
    .forEach(v => v.addEventListener("click", e => {
        const button = e.target;
        const expand = button.parentElement.dataset.expand === "true";

        if (expand) {
            const fav = button.dataset.fav === "";
            console.log(fav);
            console.log(button.dataset);

            if (fav) {
                button.removeAttribute("data-fav");
            } else {
                button.dataset.fav = "";
            }
        }
    }));
