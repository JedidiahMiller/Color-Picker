
var colorSquareIsDragging = false;
var baseColor = {"r": 0, "g":0, "b":0};

window.onload = () => {

    const colorSquare = document.getElementById("colorSquare");

    // Details square
    colorSquare.addEventListener("mousedown", (e)=>{colorSquareIsDragging=true;position(e);});
    window.addEventListener("mouseup", ()=>{colorSquareIsDragging=false;});
    window.addEventListener("mousemove", (e) => {position(e)});

}

function position(event) {

    if (colorSquareIsDragging) {

        const box = document.getElementById("colorSquare").getBoundingClientRect();

        var x = 100 * (event.clientX - box.x) / box.width;
        var y = 100 * (event.clientY - box.y) / box.height;

        if (x > 100) {
            x = 100;
        } 
        if (x < 0) {
            x = 0;
        } 
        if (y > 100) {
            y = 100;
        } 
        if (y < 0) {
            y = 0;
        } 

        const picker = document.getElementById("colorSelector");

        picker.style.top = `${y-4}%`;
        picker.style.left = `${x-4}%`;
        picker.style.background = `hsl(${100}, ${x}%, ${y}%)`;
    }

}


// 255 0 0, 255 255 0, 0 255 0, 