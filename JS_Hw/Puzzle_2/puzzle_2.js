let img = document.querySelectorAll('img');
let ul = document.querySelector('ul');
let btn = document.querySelectorAll('.play')
let wallParents = document.querySelector('#picOne')
let choImg;//選擇的照片
let picNum = [];//移動前的答案 
let picArray = []
let status = [];
let tip = document.getElementById('tip');
let steps = 0;
let allSteps = 0;
let currentIndex = 0
let speed;
let bricks = document.querySelectorAll('[box-id]')


bricks = Array.from(bricks).sort((a, b) => {
  return a.getAttributeNode('box-id').value - b.getAttributeNode('box-id').value
})
document.querySelector("#run").addEventListener("click", () => {
  speed = 50;
  let random = Math.floor(Math.random() * bricks.length) + 1;
  steps = random + (2 * bricks.length);
  allSteps = steps;
  turnAround();
})

function turnAround() {
  bricks[currentIndex].classList.remove("active")
  currentIndex++
  if (currentIndex >= bricks.length) currentIndex = 0;

  bricks[currentIndex].classList.add("active")
  steps--
  if (steps > 0) {
    setTimeout(turnAround, speed)
    if (steps < Math.floor((allSteps / 3))) speed += 7
  } else {
    ul.innerHTML = ''
    let img = document.createElement('img');
    img.setAttribute('src', bricks[currentIndex].src);
    console.log(bricks[currentIndex]);
    choImg = bricks[currentIndex].src;
    ul.appendChild(img)
    if (ul.children.length != 0) {
      btn.forEach(x => x.disabled = false);
    }

  }
}





//加入圖片至方格
img.forEach(item => {
  item.addEventListener('click', function (e) {
    ul.innerHTML = ''
    let img = document.createElement('img');
    img.setAttribute('src', e.target.src);
    choImg = e.target.src;
    ul.appendChild(img)
    if (ul.children.length != 0) {
      btn.forEach(x => x.disabled = false);
    }
    bricks.forEach(e=>{
      e.classList.remove("active")
    })
  })
});

//點擊難易度
btn.forEach((item) => {
  item.addEventListener('click', function (e) {
    let wall = document.createElement('img');
    wall.setAttribute('src', choImg);

    wall.classList.add('wall');
    wallParents.appendChild(wall);
    ul.innerHTML = ''
    rowNum = Number(this.dataset.num);
    let pic_X = 0, pic_Y = 0;
    for (let i = 0; i < Math.pow(this.dataset.num, 2); i++) {
      let temp = 0;
      while (temp < rowNum) {
        if (i % rowNum == temp) {
          pic_X = (100 / (rowNum - 1)) * temp;
        }
        if (Math.floor(i / rowNum == temp)) {
          pic_Y = (100 / (rowNum - 1)) * temp
        }
        temp++
      }
      picArray.push({ x: pic_X, y: pic_Y })

      let li = document.createElement('li');
      li.setAttribute('style', `width:${500 / this.dataset.num}px;
    height:${500 / this.dataset.num}px;
    line-height:${500 / this.dataset.num}px;
    background-position:${pic_X}% ${pic_Y}%;`);
      ul.appendChild(li);
      picNum.push(i);
    }
    let tipOn = true;
    tip.addEventListener('click', () => {
      let li = document.querySelectorAll('ul li');
      if (tipOn) {
        li.forEach(x => {
          x.style.color = 'white';
          x.style.fontSize = '30px'
          tipOn = false
        })
      }
      else {
        li.forEach(x => {
          x.style.color = 'transparent';
          x.style.fontSize = '30px'
          tipOn = true
        })
      }
    })

    let allList = document.querySelectorAll('ul li');
    start(picNum, allList)
    move(picNum, allList)
    btn.forEach((item) => item.disabled = true)
    setInterval("Check_Time()", 1000);
  })

})
//洗牌
function shuffle(arr) {
  let newArray = [...arr]
  for (let i = 0; i < arr.length; i++) {
    let random = Math.floor(Math.random() * arr.length)
    let temp = newArray[i];
    newArray[i] = newArray[random];
    newArray[random] = temp;
  }
  return newArray;
}

//初始化
function start(arr, list) {
  status = shuffle(arr);
  list.forEach((li, index) => {
    li.innerText = status[index]
    li.style.backgroundImage = `url(${choImg})`
    li.style.backgroundPosition = `${picArray[Number(li.innerText)].x}% ${picArray[Number(li.innerText)].y}%`
    if (li.innerText == arr[arr.length - 1]) {
      li.classList.add('empty')
      li.innerText = ''
      li.style.backgroundImage = "none";
    }
  })

}

//取得各點位置 
function getStatus(arr, numarray) {
  let cols = [];
  let total = [];
  for (let i = 0; i < arr.length; i += rowNum) {
    cols.push(arr.slice(i, i + rowNum))
    console.log(cols);
  }
  cols.forEach((row, index) => {
    row.forEach((x, i) => {
      if (x == numarray[numarray.length - 1]) { x = ""; }
      total.push({ name: x, row: index, col: i })
    });
  });
  return total;
}


//更新目前狀態
function updateStatus(list) {
  list.forEach((x, index) => status[index] = x.innerText)
  win(picNum, list)
}

//辦別輸贏
function win(picNum, list) {
  let win = []
  picNum.forEach((item, index) => {
    if (item === Number(list[index].innerHTML)) {
      win.push(item)
    }
    else {
      return
    }
  })

  console.log(win);
  console.log(picNum);
  if (win.length == picNum.length - 1) {
    alert('win!');
  }
}


function move(arr, list) {
  list.forEach(x => {
    x.addEventListener('click', (e) => {
      let empty = Array.from(list).filter((item) => item.innerText == "")
      let choose = getStatus(status, arr).filter(x => x.name == e.target.innerText)
      console.log(choose);
      let limit = getStatus(status, arr).filter((x) => (
        ((x.row == choose[0].row - 1 || x.row == choose[0].row + 1) && x.col == choose[0].col)) ||
        ((x.col == choose[0].col - 1 || x.col == choose[0].col + 1) && x.row == choose[0].row));
      if (!limit.some(x => x.name === "")) return;
      empty[0].style.backgroundImage = `url(${choImg})`
      empty[0].innerText = e.target.innerText;
      empty[0].classList.remove('empty');
      empty[0].style.backgroundPosition = `${picArray[Number(e.target.innerText)].x}% ${picArray[Number(e.target.innerText)].y}%`
      e.target.innerText = "";
      e.target.classList.add('empty');
      e.target.style.backgroundImage = "none";
      updateStatus(list);
    });
  })

}
//時間計時
let SetMinute = 0;
function Check_Time() {
  SetMinute += 1;
  let Check_i = document.getElementById("Check_i");
  let Cal_Hour = Math.floor(SetMinute / 3600);
  let Cal_Minute = Math.floor(Math.floor(SetMinute % 3600) / 60);
  let Cal_Second = SetMinute % 60;

  Check_i.innerHTML = Cal_Hour + "hours" + Cal_Minute + "ms" + Cal_Second + "s";
}

let reset = document.querySelector('#reset');
reset.addEventListener('click', function () {
  location.reload()
})