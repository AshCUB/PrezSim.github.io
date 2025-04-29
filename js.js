

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const nums = [];
let nums_filled = 0;
let alert = false;

class Num {
    constructor(x, y, vely, num) {
        this.x = x;
        this.y = y;
        this.vely = vely;
        
        this.num = num;
        this.width = 25;
        this.height = 30;
        this.collected = false;
    }

    draw() {
        if (!this.collected) {
            ctx.fillStyle = "black";
            ctx.font = `${30}px Dogica`;
            ctx.fillText(this.num, this.x, this.y);
            
            // Uncomment this to see collision boxes for debugging
            //ctx.strokeStyle = "red";
            //ctx.strokeRect(this.x, this.y - this.height, this.width, this.height);
        }
    }

    update(index) {
        if (this.collected || this.y >= height-40) {
            nums[index] = get_new_num();
            return;
        }
        this.y += this.vely;

        this.checkCollision();
    }
    checkCollision() {
        const bucketRect = getBucketRect();

        const numRect = {
            x: this.x,
            y: this.y - this.height,
            width: this.width,
            height: this.height
        };

        if (isColliding(numRect, bucketRect)) {
            if (nums_filled < 10) {
            this.collected = true;
        
        const numDisplay = document.querySelector('#num_1');
        
        const currentDisplay = numDisplay.textContent;
        const displayArray = currentDisplay.split(' ');
        displayArray[nums_filled] = this.num;
        numDisplay.textContent = displayArray.join(' ');

        nums_filled++;
            }
            else {
            
                setTimeout(() => {
                    alert("your number is: " + numDisplay.textContent);
                    // Reset for a new number
                    numDisplay.textContent = "_ _ _ _ _ _ _ _ _ _";
                    nums_filled = 0;
                }, 500);

                
                return;
            }
        }
    }
};

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function getBucketRect() {
    const bucketStyle = window.getComputedStyle(bucket);
    const bucketX = parseInt(bucketStyle.left, 10) || 0;
    const bucketY = parseInt(bucketStyle.top, 10) || 0;

    const bucketWidth = bucket.offsetWidth;
    const bucketHeight = bucket.offsetHeight;

    return {
        x: bucketX - bucketWidth / 2,
        y: bucketY - bucketHeight / 2,
        width: bucketWidth,
        height: bucketHeight
    };
}





function get_new_num() {
    const num_type = Math.floor(Math.random() * 10); // random int 0-10
    const new_num = new Num(
        Math.random() * width, // random x position
        20, // start near top
        Math.random() * 5 + 3, // random downward speed (1 to 6)
        num_type // the number 0-10
    );
    return new_num;
}

// Create starting numbers
while (nums.length < 25) {
    nums.push(get_new_num());
}

function loop() {
    ctx.fillStyle = "rgb(255 255 255)";
    ctx.fillRect(0, 0, width, height);

  
    for (let i = 0; i < nums.length; i++) {
        nums[i].draw();
        nums[i].update(i); // pass the index so it can replace itself if needed
    }
  
    requestAnimationFrame(loop);

}

let bucket = document.querySelector("#bucket");

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

    bucket.style.left = x + "px";
    bucket.style.top = y + "px";
};

document.addEventListener("mousemove", (e) => {
    move(e);
});

document.addEventListener("touchmove", (e) => {
    move(e);
});



loop();
