
// Settings
const hueColorLayout = [[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];
// saturationLightnessSelector and huePercent create the default color (BaseColor and currentColor are set based on them on start)

// Globals
var colorSquareIsDragging = false;
var baseColor = {"r": 255, "g":0, "b":0};
var currentColor = {"r": 0, "g":0, "b":0};
var saturationLightnessSelectorPercents = {"x": 0.9, "y": 0.1}
var huePercent = 0;

window.onload = () => {

    // Elements
    const baseColorBox = document.getElementById("baseColor");
    const saturationLightnessBox = document.getElementById("colorSquare");
    const saturationLightnessSelector = document.getElementById("colorSelector");
    const hueBox = document.getElementById("hueBar");
    const hueSlider = document.getElementById("hueSelector");
    const rgbValue = document.getElementById("rgbValues");

    // Big color box thing
    const detailSelector = new Slider(saturationLightnessBox, saturationLightnessSelector, "3d", (x, y, box, slider)=> {
        // Set current color
        currentColor = calculateEdits(baseColor, x, y);
        // Save settings to global
        saturationLightnessSelectorPercents["x"] = x;
        saturationLightnessSelectorPercents["y"] = y;
        // Change color of selector
        saturationLightnessSelector.style.background = `rgb(${currentColor["r"]}, ${currentColor["g"]}, ${currentColor["b"]})`;
        // Background
        document.body.style.background = `rgb(${currentColor["r"]}, ${currentColor["g"]}, ${currentColor["b"]})`;
        rgbValue.innerText = `rgb(${Math.round(currentColor["r"])}, ${Math.round(currentColor["g"])}, ${Math.round(currentColor["b"])})`;

    });
    // Set start location
    detailSelector.setSliderPosition(saturationLightnessSelectorPercents["x"], saturationLightnessSelectorPercents["y"]);

    // Hue selector
    const hueSelector = new Slider(hueBox, hueSlider, "x", (x, y, box, slider) => {
        // Save hue to global
        huePercent = x;
        // Generate RGB from percentage
        baseColor = baseColorFromRange(x);
        // Set current color based on new base color
        currentColor = calculateEdits(baseColor, saturationLightnessSelectorPercents["x"], saturationLightnessSelectorPercents["y"]);

        saturationLightnessSelector.style.background = `rgb(${currentColor["r"]}, ${currentColor["g"]}, ${currentColor["b"]})`;
        document.body.style.background = `rgb(${currentColor["r"]}, ${currentColor["g"]}, ${currentColor["b"]})`;
        baseColorBox.style.background = `rgb(${baseColor["r"]}, ${baseColor["g"]}, ${baseColor["b"]})`;
        slider.style.background = `rgb(${baseColor["r"]}, ${baseColor["g"]}, ${baseColor["b"]})`;
        rgbValue.innerText = `rgb(${Math.round(currentColor["r"])}, ${Math.round(currentColor["g"])}, ${Math.round(currentColor["b"])})`;

    });
    // Set start location
    hueSelector.setSliderPosition(huePercent);

    // Prep Scene colors
    baseColor = baseColorFromRange(huePercent);
    currentColor = calculateEdits(baseColor, saturationLightnessSelectorPercents["x"], saturationLightnessSelectorPercents["y"]);

    rgbValue.innerText = `rgb(${Math.round(currentColor["r"])}, ${Math.round(currentColor["g"])}, ${Math.round(currentColor["b"])})`;
    document.body.style.background = `rgb(${currentColor["r"]}, ${currentColor["g"]}, ${currentColor["b"]})`;
    baseColorBox.style.background = `rgb(${baseColor["r"]}, ${baseColor["g"]}, ${baseColor["b"]})`;
    saturationLightnessSelector.style.background = `rgb(${currentColor["r"]}, ${currentColor["g"]}, ${currentColor["b"]})`;
    hueSlider.style.background = `rgb(${baseColor["r"]}, ${baseColor["g"]}, ${baseColor["b"]})`;

}

class Slider {

    // Box: containing element
    // Slider: moving selector element
    // SlideType: options for type of slider
    //         x: left to right
    //         y: up and down
    //         3d: both axis
    //         value left null: selector will be frozen
    // ActionOnMove: function that will when selector moves. It will be passed x, y, box and slider paramaters


    constructor (box, slider, slideType, actionOnMove) {

        // Data
        this.box = box;
        this.slider = slider;
        this.slideType = slideType;
        this.actionOnMove = actionOnMove;
        this.isSliding = false;
        
        // Event listeners
        this.box.addEventListener("mousedown", (event)=>{this.isSliding=true;this.drag(event);});
        window.addEventListener("mouseup", ()=>{this.isSliding=false;});
        window.addEventListener("mousemove", (event) => {this.drag(event);});

    }

    drag(event) {

        if (this.isSliding) {

            const boundingBox = this.box.getBoundingClientRect();

            var x = (event.clientX - boundingBox.left) / this.box.clientWidth;
            var y = (event.clientY - boundingBox.top) / this.box.clientHeight;

            if (x > 1) {
                x = 1;
            }
            if (x < 0) {
                x = 0;
            }
            if (y > 1) {
                y = 1;
            }
            if (y < 0) {
                y = 0;
            }
    
            this.setSliderPosition(x, y);

            if (this.slideType && this.actionOnMove) {
                this.actionOnMove(x, y, this.box, this.slider);
            }

        }
    }

    setSliderPosition(x, y) {
        if (this.slideType === "x" || this.slideType === "3d") {
            this.slider.style.left = `${x * (this.box.clientWidth - this.slider.offsetWidth)}px`;
        }
        if ((this.slideType === "y" || this.slideType === "3d")) {
            this.slider.style.top = `${y * (this.box.clientHeight - this.slider.offsetHeight)}px`;
        }
    }
}

function calculateEdits(base, xPercent, yPercent) {

    var final = {"r": base["r"], "g": base["g"], "b": base["b"]};

    final["r"] = final["r"] + ((1 - xPercent) * (255 - base["r"]));
    final["g"] = final["g"] + ((1 - xPercent) * (255 - base["g"]));
    final["b"] = final["b"] + ((1 - xPercent) * (255 - base["b"]));

    final["r"] = final["r"] * (1 - yPercent);
    final["g"] = final["g"] * (1 - yPercent);
    final["b"] = final["b"] * (1 - yPercent);

    return final;

}

function baseColorFromRange(percent, layout=hueColorLayout) {

    // Percent difference between bases
    const difference = 1 / (layout.length - 1);
    
    // Find left base
    var left = null;
    for (let i = 0; i < layout.length; i++) {
        if (percent >= (i * difference)) {
            left = i;
        }
    }

    // Percent between bases
    const differencePercent = (percent - (left * difference)) / difference;

    // Change is set to what the difference between the points is
    // (If left base is final, change stays 0)
    var change = [0,0,0];
    if (left < (layout.length - 1)) {
        change[0] = layout[left+1][0] - layout[left][0];
        change[1] = layout[left+1][1] - layout[left][1];
        change[2] = layout[left+1][2] - layout[left][2];
    }

    // Change difference is altered with the percent
    change = [change[0] * differencePercent, change[1] * differencePercent, change[2] * differencePercent];
    // Change is applied to the left base for the final color
    const final = [layout[left][0] + change[0], layout[left][1] + change[1], layout[left][2] + change[2]];

    // Convert final to dict and return
    return {"r": final[0], "g": final[1], "b": final[2]};

}

function invertColor(color) {

    final = {"r": 0, "g": 0, "b": 0};

    final["r"] = 255 - color["r"];
    final["g"] = 255 - color["g"];
    final["b"] = 255 - color["b"];

    return final;

}