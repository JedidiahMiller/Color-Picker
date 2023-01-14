
var colorSquareIsDragging = false;
var baseColor = {"r": 0, "g":0, "b":0};

window.onload = () => {

    const box = document.getElementById("colorSquare");
    const slider = document.getElementById("colorSelector");
    const detailSelector = new Slider(box, slider);

    const hueBox = document.getElementById("hueBar");
    const hueSlider = document.getElementById("hueSelector");
    const hueSelector = new Slider(box, slider);

}

class Slider {

    constructor (box, slider) {
        this.box = box;
        this.slider = slider;
        this.isSliding = false;
        
        this.box.addEventListener("mousedown", (event)=>{this.isSliding=true;this.drag(event);});
        window.addEventListener("mouseup", ()=>{this.isSliding=false;});
        window.addEventListener("mousemove", (event) => {this.drag(event);});

        console.log(box.x);
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
    
            this.slider.style.left = `${(x * this.box.clientWidth) - (this.slider.clientWidth / 2)}px`;
            this.slider.style.top = `${(y * this.box.clientHeight) - (this.slider.clientHeight / 2)}px`;

            const color = calculateEdits({"r":255, "g": 0, "b": 0}, x, y);
            this.slider.style.backgroundColor = `rgb(${color["r"]}, ${color["g"]}, ${color["b"]})`;

        }
    }
}

function calculateEdits(base, xPercent, yPercent) {

    var final = base;;

    final["r"] = final["r"] + ((1 - xPercent) * (255 - base["r"]));
    final["g"] = final["g"] + ((1 - xPercent) * (255 - base["g"]));
    final["b"] = final["b"] + ((1 - xPercent) * (255 - base["b"]));

    final["r"] = final["r"] * (1 - yPercent);
    final["g"] = final["g"] * (1 - yPercent);
    final["b"] = final["b"] * (1 - yPercent);

    return final;

}

function baseColorFromRange(percent, layout=[[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255]]) {

    // Percent difference between bases
    const difference = 1 / (layout.length - 1);
    
    // Find left base
    var left = null;
    for (i in layout) {
        if (percent >= (i * difference)) {
            left = i;
        }
    }

    // Percent between bases
    const differencePercent = percent - (left * difference);

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