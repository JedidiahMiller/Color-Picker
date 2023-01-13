
var colorSquareIsDragging = false;
var baseColor = {"r": 0, "g":0, "b":0};

window.onload = () => {



    const box = document.getElementById("colorSquare");
    const slider = document.getElementById("colorSelector");
    const mainSlider = new Slider(box, slider);
    

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

        }
    }

}


// 255 0 0, 255 255 0, 0 255 0, 
// https://cssgradient.io/
// https://rgbacolorpicker.com/