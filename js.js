const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
let TNT = document.querySelector("#TNT img");

document.querySelector("#TNT").style.display = "none";

const nums = [];
let nums_filled = 0;
let alert = false;
let got_num = false;


function isColliding(rect1, rect2) { //checks if rec1 and rec2 are colliding
    return rect1.x < rect2.x + rect2.width && 
           rect1.x + rect1.width > rect2.x && //checks if rec1 and rec2 x loc are the same
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y; //checks if rec1 and rec2 y loc are the same
}

class Falling {
    constructor(x, y, vely, num) {
        this.x = x;
        this.y = y;
        this.rotation = 0;
        this.vely = vely;

        this.num = num;
        this.width = 25;
        this.height = 30;
        this.collected = false;
        this.is_num = true;
        this.is_TNT = false;
    }

    draw() {
        if (this.is_num) {
        if (!this.collected) {
            ctx.fillStyle = "black";
            ctx.font = `${30}px Dogica`;
            ctx.fillText(this.num, this.x, this.y); //takes current num, the x pos and y pos draws on canvas (ctx)
        }
    }
    else if (this.is_TNT){
        ctx.save(); //saves all current canavs items and transformations
        ctx.translate(this.x, this.y); //moves TNT to x and y pos
        ctx.rotate(this.rotation); //rotates 
        ctx.drawImage(TNT, -20, -10, 40, 10);//gets orgin and size of TNT
        ctx.restore(); //loads a new frame of animation
    }

    }

    update(index) {
        if (this.collected || this.y >= height-40) { //if num is collected or goes off screen
            nums[index] = get_new_num();
            return;
        }
        this.y += this.vely; //moves num down by speed
        if (this.is_TNT){ //if is TNT roates
        this.rotation += 0.03;
        }

        this.checkCollision(); //checks if collision
    }
    checkCollision() {
        const bucketRect = getBucketRect(); //bucket boarders

        const numRect = { //create num boarders
            x: this.x,
            y: this.y - this.height,
            width: this.width,
            height: this.height
        };

        if (nums_filled>= 10) { //if all nums are filled
            got_num = true; //end loop
            return;

        }
        if (isColliding(numRect, bucketRect)) {
            if (this.is_TNT){
                this.collected = true;
                nums_filled = 0; //reset nums_filled

                document.querySelector('#dash_1').style.color = "white"; //make flash white
                document.querySelector('#dash_2').style.color = "white";
                document.querySelector('#num_1').style.color = "white";
                document.querySelector('#num_2').style.color = "white";
                document.querySelector('#num_3').style.color = "white";
                document.querySelector('#num_1').textContent = "_ _ _"; //clear nums
                document.querySelector('#num_2').textContent = "_ _ _";
                document.querySelector('#num_3').textContent = "_ _ _ _";



                setTimeout(() => {
                    document.querySelector('#dash_1').style.color = "black"; //go back to black
                    document.querySelector('#dash_2').style.color = "black";
                    document.querySelector('#num_1').style.color = "black";
                    document.querySelector('#num_2').style.color = "black";
                    document.querySelector('#num_3').style.color = "black";
                }, 250);//time flash
            }
            else if (nums_filled < 10) { //otherwise... if not TNT and not not all nums filled 
            this.collected = true;
        
        let numDisplay = document.querySelector('#num_1'); //fill in first 3 nums
        let currentDisplay = numDisplay.textContent; //get text from first 3 nums
        let displayArray = currentDisplay.split(' '); //create array of nums
        if (this.is_num){
        if (nums_filled < 3)
        {
            numDisplay = document.querySelector('#num_1'); //set to first 3 nums
            currentDisplay = numDisplay.textContent; 
            displayArray = currentDisplay.split(' ');  
            displayArray[nums_filled] = this.num;
            numDisplay.textContent = displayArray.join(' '); //get nums from array and add spaces between each num
        }
        else if (nums_filled < 6)
            {
                numDisplay = document.querySelector('#num_2'); //set to second 3 nums
                currentDisplay = numDisplay.textContent;
                displayArray = currentDisplay.split(' ');
                displayArray[nums_filled-3] = this.num;
                numDisplay.textContent = displayArray.join(' ');
            }
        else 
        {
            numDisplay = document.querySelector('#num_3'); //set to last 4 nums
            currentDisplay = numDisplay.textContent;
            displayArray = currentDisplay.split(' ');
            displayArray[nums_filled-6] = this.num;
            numDisplay.textContent = displayArray.join(' ');
        }
    }


        nums_filled++; //add nums filled 
                    } 
                        
        }
    }
};



function getBucketRect() {
    const bucketStyle = window.getComputedStyle(bucket); //get bucket location
    const bucketX = parseInt(bucketStyle.left, 10) || 0; //get x pos
    const bucketY = parseInt(bucketStyle.top, 10) || 0; //get y pos

    const bucketWidth = bucket.offsetWidth; //get bucket width
    const bucketHeight = bucket.offsetHeight; //get bucket height

    return {
        x: bucketX - bucketWidth / 2, //get avarage of x and width
        y: bucketY - bucketHeight / 2, //get avarage of y and height
        width: bucketWidth,
        height: bucketHeight
    };
}





function get_new_num() {
    const isTNT = Math.random() < .15; //change of getting TNT

    const num_type = Math.floor(Math.random() * 10); // random int 0-10
    if (!isTNT){
    const new_num = new Falling(
        Math.random() * width, //x pos
        20, //y pos
        Math.random() * 5 + 3, //speed (3-5)
        num_type //inserts num
    );
    return new_num;
}
else {
    const new_TNT = new Falling(
        Math.random() * width, //x pos
        20, //y pos
        Math.random() * 5 + 3, //speed (3-5)
        "TNT" //logs TNT
    );
    new_TNT.is_num = false;
    new_TNT.is_TNT = true;
    return new_TNT;
}
}

while (nums.length < 25) { //if not enough nums add more
    nums.push(get_new_num());
}

function loop() {
    if (!got_num) // if num not caught
    {
    ctx.fillStyle = "rgb(255 255 255)"; //fill canvas with white
    ctx.fillRect(0, 0, width, height); //make white between frames

  
    for (let i = 0; i < nums.length; i++) {
        nums[i].draw(); //draw num
        nums[i].update(i); //update num
    }
  
    requestAnimationFrame(loop); //animate :D
}
    else { //alert user of num
        window.alert("Number Entered: " + document.querySelector('#num_1').textContent + " - " + document.querySelector('#num_2').textContent + " - " + document.querySelector('#num_3').textContent);
        setTimeout(() => {
            window.location.reload(); //reload page
        }, 20); //after 20ms
        got_num = false; //rest num
    }

}

let bucket = document.querySelector("#bucket"); //get bucket image

//getting mouse 
function isTouchDevice() {
    try {
        document.createEvent("TouchEvent");
        return true;
    }
    catch (e) {
        return false;
    }
}

const move = (e) => {
    try{
        var x = !isTouchDevice() ? e.pageX : e.touches[0].pageX;
        var y = !isTouchDevice() ? e.pageY : e.touches[0].pageY;
    }

    catch (e) {}

    bucket.style.left = x + "px"; //move bucket to x pos
    bucket.style.top = y + "px"; //move bucket to y pos
};

document.addEventListener("mousemove", (e) => {
    move(e);
});

document.addEventListener("touchmove", (e) => {
    move(e);
});



loop();
