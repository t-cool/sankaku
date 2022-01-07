/*
 * sankaku JavaScript Library v0.9.0
 * https://github.com/gdg-nara/sankaku
 *
 * Copyright t-cool
 * Released under the MIT license
 */

var Triangle = (function(environment) {

// canvas id
const canvasForTriangle = document.getElementById(environment.canvasId);
const context = canvasForTriangle.getContext('2d');

/* 点1~12 の座標を求めるのに必要な情報 */
// 大きな円の情報
const radiusOfPie = 92; // 半径
const centerPointX = 100; // 中心点の座標
const centerPointY = 100; // 中心点の座標

// 30° 60° 90° の三角形の辺の長さ
const shortLine = radiusOfPie /2;
const middleLine = shortLine * Math.sqrt(3);
const longLine = radiusOfPie;

// 12 点の情報
const coordinates = {
  dot1:	{x: centerPointX, y: centerPointY - longLine },
  dot2:	{x: centerPointX + shortLine, y: centerPointY - middleLine},
  dot3:	{x: centerPointX + middleLine, y: centerPointY - shortLine},
  dot4:	{x: centerPointX + longLine, y: centerPointY},
  dot5:	{x: centerPointX + middleLine, y: centerPointY + shortLine},
  dot6:	{x: centerPointX + shortLine, y: centerPointY + middleLine},
  dot7:	{x: centerPointX, y: centerPointY + longLine},
  dot8:	{x: centerPointX - shortLine, y: centerPointY + middleLine},
  dot9:	{x: centerPointX - middleLine, y: centerPointY + shortLine},
  dot10:{x: centerPointX - longLine, y: centerPointY},
  dot11:{x: centerPointX - middleLine, y: centerPointY - shortLine},
  dot12:{x: centerPointX - shortLine, y: centerPointY - middleLine}
}

// 選択された dots
const selectedDots = new Set();

function init(){

  // 環境を白紙にする
  selectedDots.clear();
  context.clearRect(0, 0, 200, 200);

  // 円を描く
  context.beginPath();
  context.lineWidth = 2.5;
  context.arc(100, 100, 92, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
  context.fillStyle = "rgba(0,0,0,0)";
  context.fill();
  context.stroke();

  // 12点を描く
  for(let key in coordinates){
    context.beginPath();
    context.strokeStyle = "black"
    context.arc(coordinates[key].x, coordinates[key].y, 4, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    context.fillStyle = "rgba(0,0,0,0.7)";
    context.fill();
    context.stroke();
  }
}

function getDistanceOf2Dots(dot1, dot2){
  let result =  Math.round(Math.sqrt(Math.pow((coordinates[dot1].x - coordinates[dot2].x),2) + Math.pow((coordinates[dot1].y - coordinates[dot2].y),2)));
  return result
}

// 線の長さを元にラインの色を決定する
function setLineColor (dot1,dot2) {
  let distanceOfDots = Math.round(Math.sqrt(Math.pow((coordinates[dot1].x - coordinates[dot2].x),2) + Math.pow((coordinates[dot1].y - coordinates[dot2].y),2)));

  // 距離が 1 点分の場合
  if(distanceOfDots == getDistanceOf2Dots("dot1","dot2")){
    context.strokeStyle = "red";
  }
  // 距離が 2 点分の場合
  else if(distanceOfDots == getDistanceOf2Dots("dot1","dot3")){
    context.strokeStyle = "blue";
  }
  // 距離が 3 点分の場合
  else if(distanceOfDots == getDistanceOf2Dots("dot1","dot4")){
    context.strokeStyle = "yellow";
  }
  // 距離が 4 点分の場合
  else if(distanceOfDots == getDistanceOf2Dots("dot1","dot5")){
    context.strokeStyle = "green";
  }
  // 距離が 5 点分の場合
  else if(distanceOfDots == getDistanceOf2Dots("dot1","dot6")){
    context.strokeStyle = "orange";
  }
  // 距離が 6 点分の場合
  else if(distanceOfDots == getDistanceOf2Dots("dot1","dot7")){
    context.strokeStyle = "pink";
  }
}

// 12点周辺でのクリック時の処理
canvasForTriangle.addEventListener('mousedown',(e)=>{

  // クリック時の座標に応じてdotに色をつけて、selectedDots に追加する
  for(let key in coordinates){
    if((e.offsetX > coordinates[key].x - 15 && e.offsetX < coordinates[key].x + 15) 
        && (e.offsetY > coordinates[key].y - 15 && e.offsetY < coordinates[key].y + 15)){
      context.beginPath();
      context.lineWidth = 2.5;
      context.strokeStyle = "black"
      context.arc(coordinates[key].x, coordinates[key].y, 6, 0 * Math.PI / 180, 360 * Math.PI / 180, false );
      context.fillStyle = "rgba(255,200,0,0.8)";
      context.fill();
      context.stroke();
      selectedDots.add(key);
    }
  }

  // 2点が選択されたら線を引く
  if(selectedDots.size == 2){
    let dots = Array.from(selectedDots.values());

    // 1 点目から 2点目
    context.beginPath();
    context.lineWidth = 2.5;
    setLineColor(dots[0],dots[1]);
    context.moveTo(coordinates[dots[0]].x, coordinates[dots[0]].y);
    context.lineTo(coordinates[dots[1]].x, coordinates[dots[1]].y);
    context.stroke();
  }

  // 3点が選択されたら三角形を描写する  
  if(selectedDots.size == 3){
    let dots = Array.from(selectedDots.values());

    // 2点目から3点目
    context.beginPath();
    setLineColor(dots[1],dots[2]);
    context.moveTo(coordinates[dots[1]].x, coordinates[dots[1]].y);
    context.lineTo(coordinates[dots[2]].x, coordinates[dots[2]].y);
    context.stroke();

    // 3点目から1点目
    context.beginPath();
    setLineColor(dots[2],dots[0]);
    context.moveTo(coordinates[dots[2]].x, coordinates[dots[2]].y);
    context.lineTo(coordinates[dots[0]].x, coordinates[dots[0]].y);
    context.stroke();
  }

  // 4点目が選択されたときの処理
  if(selectedDots.size > 3){
    init();
  }
});


function getSelectedDots(){
  let result = Array.from(selectedDots.values());
  return result;
}

// 初期化処理を実行する
init();

return {
  getSelectedDots: getSelectedDots  
}

})({
  // 初期化に必要な環境情報
  // HTML 上の canvas の id
  canvasId: "triangle",
})
