const canvas = document.querySelector("#simscreen");
const ctx = canvas.getContext("2d");
const btnStart = document.querySelector(".btn-start");
const btnReset = document.querySelector(".btn-reset");
const voltageButtons = document.querySelectorAll(".voltage");
const vfspinner = document.querySelector("#vfspinner");
const temperature1 = document.querySelector("#temp1");
const temperature2 = document.querySelector("#temp2");
const temperature3 = document.querySelector("#temp3");
const temperature4 = document.querySelector("#temp4");
const temperature5 = document.querySelector("#temp5");
const btnCheck1 = document.querySelector(".btn-check1");
const btnCheck2 = document.querySelector(".btn-check2");

btnStart.addEventListener("click", initiateProcess);
btnReset.addEventListener("click", resetAll);
voltageButtons.forEach((voltage) =>
  voltage.addEventListener("click", () => setVoltage(voltage))
);

let steadyState = 0;
let currentVoltage = 0;
//controls section
let v = 0;
let vf = 0;

//timing section
let simTimeId = setInterval("", "1000");
let TimeInterval = setInterval("", "1000");
let TimeInterval1 = setInterval("", "1000");
let time = 0;
let time1 = 0;
let time2 = 0;

//point tracing section and initial(atmospheric section)
let t1 = [27.5, 27, 27, 26.5, 27.5, 27, 26.8];
let th = [55, 55, 55, 55, 55];
let off = [0, 0, 0, 0, 0];
let slope = [-282.86, -315.71, -354.29];
let k = [40.83, 37.99, 37.61];

//temporary or dummy variables for locking buttons
let temp = 0;
let temp1 = 2;
let temp2 = 0;
let tempslope = 0;
let tempk = 0;

function displayDiv(ele) {
  const taskScreen = document.querySelectorAll(".task-screen");
  taskScreen.forEach((task) => {
    task.classList.add("hide");
  });
  if (ele.classList.contains("tool-objective")) {
    document.querySelector(".objective").classList.remove("hide");
  }
  if (ele.classList.contains("tool-description")) {
    document.querySelector(".description").classList.remove("hide");
  }
  if (ele.classList.contains("tool-explore")) {
    document.querySelector(".explore").classList.remove("hide");
    document.querySelector(".extra-info").classList.add("hide");
    if (temp2 !== 1) {
      drawModel();
      startsim();
      varinit();
    }
  }
  if (ele.classList.contains("tool-practice")) {
    document.querySelector(".practice").classList.remove("hide");
    if (temp2 == 1) {
      temp1 = 1;
      validation();
      document.querySelector("#info").innerHTML = "Temperature Gradient";
      document.querySelector(".extra-info").classList.remove("hide");
    } else {
      document.querySelector("#info").innerHTML =
        "Perform the experiment to solve the questions";
      document.querySelector(".extra-info").classList.add("hide");
      document.querySelector(".graph-div").classList.add("hide");
      document.querySelector(".questions").classList.add("hide");
    }
  }
}
//Change in Variables with respect to time
function varinit() {
  // varchange();
  //Variable r1 slider and number input types
  // $("#vslider").slider("value", v);
  // $("#vspinner").spinner("value", v);

  // //$('#vfslider').slider("value", vf);
  // $("#vfspinner").spinner("value", vf);
  console.log(currentVoltage, vf);
  if (time2 > 0) {
    t1[0] += off[0];
  }
  if (time2 > 1) {
    t1[1] += off[1];
  }
  if (time2 > 2) {
    t1[2] += off[2];
  }
  if (time2 > 3) {
    t1[3] += off[3];
  }
  if (time2 > 4) {
    t1[4] += off[4];
  }

  vfspinner.textContent = vf;
  temperature1.textContent = t1[0].toFixed(2);
  temperature2.textContent = t1[1].toFixed(2);
  temperature3.textContent = t1[2].toFixed(2);
  temperature4.textContent = t1[3].toFixed(2);
  temperature5.textContent = t1[4].toFixed(2);
}

//water temperature changes
function watertemp() {
  switch (vf) {
    case 26:
      t1[6] += 2.2;
      break;
    case 54:
      t1[6] += 1.2;
      break;
    case 60:
      t1[6] += 1.2;
      break;
  }
}

//stops simulations
function simperiod() {
  if (time1 >= 5.0) {
    clearInterval(TimeInterval);
    clearInterval(TimeInterval1);
    time1 = 0;
    time2 = 0;
    temp1 = 0;
    temp2 = 1;
    watertemp();

    ctx.clearRect(620, 485, 100, 50);
    t1[6] = t1[6].toFixed(1);
    ctx.font = "15px Comic Sans MS";
    //ctx.fillText(t1[5]+" \u00B0C", 470, 170);
    ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment("", 2);
  } else {
    drawGradient();
    steadyState = 5 - Math.round(time1);
    document.querySelector(
      ".comment"
    ).innerHTML = `Wait for  ${steadyState} seconds for steady state`;
    if (steadyState === 0) {
      temp2 = 0;
      document.querySelector(
        ".comment"
      ).innerHTML = `The steady state is achieved
`;
      btnReset.removeAttribute("disabled");
    }
    // printcomment(
    //   "Wait for " + (5 - Math.round(time1)) + " seconds for steady state",
    //   2
    // );
  }
}
//draw gradient w.r.t. time in thermometer water flow and heater
function drawGradient() {
  //heater simulation
  var h = 100 * time1;
  //create gradient
  var grd1 = ctx.createLinearGradient(0, 0, h, 0);
  grd1.addColorStop(0, "red");
  grd1.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd1;
  ctx.fillRect(115, 314, 70, 98);

  //water simulation
  var w = 150 * time1;
  //create gradient
  var grd2 = ctx.createLinearGradient(0, 0, 0, w);
  grd2.addColorStop(0, "skyblue");
  grd2.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd2;
  ctx.fillRect(664, 270, 11, 60);
  ctx.fillRect(650, 330, 25, 64);
  ctx.fillRect(639, 330, 11, 115);

  //rod gradient
  var x = 160 * time1;
  // Create gradient
  var grd = ctx.createLinearGradient(0, 0, x, 0);
  grd.addColorStop(0, "red");
  grd.addColorStop(1, "white");
  // Fill with gradient
  ctx.fillStyle = grd;
  ctx.fillRect(185, 338, 452, 50);

  //thermometer heights add offset
  if (time1 > 0) {
    th[0] += 1.0;
  }
  if (time1 > 1) {
    th[1] += 0.9;
  }
  if (time1 > 2) {
    th[2] += 0.9;
  }
  if (time1 > 3) {
    th[3] += 0.9;
  }
  if (time1 > 4) {
    th[4] += 0.9;
  }

  //thermometers drawing
  ctx.fillStyle = "black";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.rect(255, 196, 14, 168);
  ctx.fillRect(259, 350, 6, 8);
  ctx.rect(325, 196, 14, 168);
  ctx.fillRect(329, 350, 6, 8);
  ctx.rect(395, 196, 14, 168);
  ctx.fillRect(401, 350, 6, 8);
  ctx.rect(465, 196, 14, 168);
  ctx.fillRect(469, 350, 6, 8);
  ctx.rect(535, 196, 14, 168);
  ctx.fillRect(539, 350, 6, 8);

  //outer body drawing
  ctx.rect(115, 315, 7, 96);
  ctx.rect(125, 315, 7, 96);
  ctx.rect(135, 315, 7, 96);
  ctx.rect(145, 315, 7, 96);
  ctx.rect(155, 315, 7, 96);
  ctx.rect(165, 315, 7, 96);
  ctx.rect(175, 315, 7, 96);

  //thermometer reading
  ctx.fillRect(262, 350, 1.5, -th[0]);
  ctx.fillRect(332, 350, 1.5, -th[1]);
  ctx.fillRect(401, 350, 1.5, -th[2]);
  ctx.fillRect(472, 350, 1.5, -th[3]);
  ctx.fillRect(542, 350, 1.5, -th[4]);

  ctx.stroke();
}

// initial model
function drawModel() {
  ctx.clearRect(0, 0, 800, 600); //clears the complete canvas#simscreen everytime

  var background = new Image();
  background.src = "./images//model1.2.png";

  // Make sure the image is loaded first otherwise nothing will draw.
  background.onload = function () {
    //550,400
    ctx.drawImage(background, 0, 0, 800, 600);
    ctx.clearRect(110, 300, 70, 110);
    ctx.font = "15px Comic Sans MS";
    ctx.fillText(t1[5] + " \u00B0C", 650, 220);
    ctx.fillText(t1[6] + " \u00B0C", 650, 500);
    // printcomment(
    //   "<i>Diameter, </i> d = 20mm <br><i> Length interval</i> = 70mm<br><i>Cp</i>  = 4.187kJ/kg-K<br><i> Length of shaded area</i> = 300mm",
    //   1
    // );

    drawGradient();
  };
}

function comment1() {
  if (currentVoltage != 0) {
    time = 0;
    temp = 1;
    // $("#vspinner").spinner({disabled : true});
    // //$("#vfspinner").spinner({disabled : true});
    // $("#vslider").slider({disabled : true});
    // $("#vfslider").slider({disabled : true});
    clearInterval(simTimeId);
    //printcomment("start simulation", 0);
    if (currentVoltage == 10) {
      vf = 26;
    } else if (currentVoltage == 20) {
      vf = 54;
    } else if (currentVoltage == 30) {
      vf = 60;
    }
    offset();
  }
}

//offset for thermometer and temp change
function offset() {
  if (currentVoltage == 10) {
    //path = "./images//currentVoltage1.jpg";
    off[0] = 19.1;
    off[1] = 18.25;
    off[2] = 18;
    off[3] = 17.75;
    off[4] = 15.5;
  } else if (currentVoltage == 20) {
    //path = "./images//currentVoltage2.jpg";
    off[0] = 21.1;
    off[1] = 20;
    off[2] = 19.33;
    off[3] = 18.75;
    off[4] = 16.5;
  } else if (currentVoltage == 30) {
    //path = "./images//currentVoltage3.jpg";
    off[0] = 23.7;
    off[1] = 22.5;
    off[2] = 22;
    off[3] = 21.25;
    off[4] = 18.5;
  }
  // temp1 = 0;
  // temp2 = 1;
}
function setVoltage(ele) {
  currentVoltage = Number(ele.value);
  btnStart.removeAttribute("disabled");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; comment1(); ", "100");
}
function initiateProcess() {
  if (currentVoltage === 0) return;
  btnStart.setAttribute("disabled", true);
  btnReset.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => voltage.setAttribute("disabled", true));
  simstate();
}

function simstate() {
  if (temp == 1) {
    temp = 0;
    temp1 = 1;
    TimeInterval = setInterval("time1=time1+.1; simperiod();", "100");
    TimeInterval1 = setInterval("time2=time2+1; varinit()", "1000");
  }
}

//Calculations of the experienment
function validation() {
  datapoints = [
    { x: 0.07, y: t1[0] },
    { x: 0.14, y: t1[1] },
    { x: 0.21, y: t1[2] },
    { x: 0.28, y: t1[3] },
    { x: 0.35, y: t1[4] },
  ];
  document.querySelector(".graph-div").classList.remove("hide");
  document.querySelector(".questions").classList.remove("hide");
  drawgraph("graph", datapoints, "Length(m)", "Temperature(⁰C)");
  if (currentVoltage == 10) {
    tempslope = slope[0];
    tempk = k[0];
  } else if (currentVoltage == 20) {
    tempslope = slope[1];
    tempk = k[1];
  } else if (currentVoltage == 30) {
    tempslope = slope[2];
    tempk = k[2];
  }
  btnCheck1.addEventListener("click", () => validateAnswer1());
  btnCheck2.addEventListener("click", () => validateAnswer2());
}

function validateAnswer1() {
  const correctAnswer = document.querySelector(".correct-answer1");
  const unit = document.querySelector(".question-unit1");
  unit.innerHTML = `<sup>&deg;</sup>C/m`;
  let userEnteredValue = Number(
    document.querySelector(".question-input1").value
  );
  let answer = userEnteredValue === tempslope ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${tempslope} <sup>&deg;</sup>C/m`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function validateAnswer2() {
  const correctAnswer = document.querySelector(".correct-answer2");
  const unit = document.querySelector(".question-unit2");
  unit.innerHTML = `W/m.K`;
  let userEnteredValue = Number(
    document.querySelector(".question-input2").value
  );
  let answer = userEnteredValue === tempk ? true : false;
  if (!userEnteredValue) return;
  if (!answer) {
    correctAnswer.classList.remove("hide");
    unit.innerHTML += " <span class='wrong'>&#x2717;</span>";
    correctAnswer.innerHTML = `<span class='correct'>Correct Answer </span>= ${tempk} W/m.K`;
  } else if (answer) {
    correctAnswer.classList.add("hide");
    unit.innerHTML += " <span class='correct'>&#x2713;</span>";
  }
}
function resetAll() {
  btnStart.setAttribute("disabled", true);
  btnReset.setAttribute("disabled", true);
  voltageButtons.forEach((voltage) => {
    voltage.removeAttribute("disabled");
    voltage.checked = false;
  });
  document.querySelector(".comment").innerHTML = "";
  // if (temp1 == 0) {
  temp2 = 0;
  temp1 = 2;
  t1 = [27.5, 27, 27, 26.5, 27.5, 27, 26.8];
  th = [45, 45, 45, 45, 45];
  currentVoltage = 0;
  vf = 0;
  document.querySelector(".correct-answer1").innerHTML = "";
  document.querySelector(".question-unit1").innerHTML = `<sup>&deg;</sup>C/m`;
  document.querySelector(".question-input1").value = "";
  document.querySelector(".correct-answer2").innerHTML = "";
  document.querySelector(".question-unit2").innerHTML = `W/m.K`;
  document.querySelector(".question-input2").value = "";
  varinit();
  startsim();
  drawModel();
}

function movetoTop() {
  practiceDiv.scrollIntoView();
}
