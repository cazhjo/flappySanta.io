class Obstacle {
    Top = class Top {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    Bottom = class Bottom {
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    constructor(x, width, gap) {
        this.x = x;
        this.width = width;
        this.gap = gap
        this.y = 0;

        this.Top = new this.Top(this.x, this.y, this.width, Math.random() * (canv.height - 150 - 150) + 150);
        this.gap = this.Top.height + this.gap;
        this.Bottom = new this.Bottom(this.x, this.gap, this.width, canv.height - this.gap);
    }

    move(amount) {
        this.x -= amount;
        this.Top.x -= amount;
        this.Bottom.x -= amount;
    }

    draw() {
        drawRect(this.x, this.Top.y, this.width, this.Top.height, "black", true);
        drawRect(this.x, this.Bottom.y, this.width, this.Bottom.height, "black", true);
    }
}

var scoreArray = [];
var obstacles = [];

function createObstacles() {
    var obstacle = new Obstacle(canv.width, 50, 157);
    obstacles.push(obstacle);
    scoreArray.push(obstacle);
}

function moveObstacles() {
    var moveLeft = isDead ? 0 : 3;
  
    for (const obs of obstacles) {
      if (obs.x < -300) {
        const index = obstacles.indexOf(obs);
        if (index > -1) {
          obstacles.splice(index, 1);
        }
        //continue;
      }
      obs.move(moveLeft);
      obs.draw();
    }
  }

//skapar hinder och lägger in dom i varsin array
function collisionDetection() {
    for (const obs of obstacles) {
        if ((x + playerPos.width > obs.x) && (y < obs.Top.height)) {
            if (!(x > obs.x + obs.width))
                isDead = true;
        }

        if ((x + playerPos.width > obs.x) && (y + playerPos.height > obs.Bottom.y)) {
            if (!(x > obs.x + obs.width))
                isDead = true;
        }
    }
}