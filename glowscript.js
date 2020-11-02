function makeBodies(instructions) {
  var bodies = [];
  for (let i = 0; i < instructions.length; i++) {
    let instruction = instructions[i];
    let new_sphere = sphere({
      pos: instruction.pos,
      radius: instruction.radius,
      color: instruction.color,
      mass: instruction.mass,
      p: instruction.p,
      rota: instruction.rota,
    });
    attach_trail(new_sphere, { color: new_sphere.color });
    bodies.push(instruction.name);
    bodies[i] = new_sphere;
  }
  return bodies;
}

function runSim(i, bodies, G) {
  var dt = 0.1;
  var dt = 0.01;

  var forces = [];
  for (let j = 0; j < bodies.length; j++) {
    if (j !== i) {
      // Get the necessary data
      let current_body = bodies[i];
      let next_body = bodies[j];
      let distance = current_body.pos["-"](next_body.pos);
      let mag_distance = mag(distance);
      let position = distance["/"](mag_distance);

      // Get the force
      // G * (m1 * m2 * r) / mag(r)^2
      let precalc_force = current_body.mass["*"](next_body.mass)["*"](position);
      let force = G["*"](precalc_force)["/"](mag_distance ** 2);
      forces.push(force);
    }
  }

  var generalForce = vec(0, 0, 0);
  for (let k = 0; k < forces.length; k++) {
    generalForce = generalForce["+"](forces[k]);
  }

  // Change graphical interface
  var prevprevP = generalForce["/"](bodies[i].mass);
  var prevP = prevprevP["*"](dt);
  bodies[i].p = bodies[i].p["+"](prevP);

  var prevPos = bodies[i].p["*"](dt);
  bodies[i].pos = bodies[i].pos["+"](prevPos);

  bodies[i].rotate((angle = bodies[i].rota), (axis = vec(0, 1, 0)));
}

// --------------------------
//
// ------ Simulation 1
// The following runs the code for the first simulation
//
// --------------------------
async function simulationOne() {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  // Simulation Parameters
  var scene = canvas();
  scene.width = 1000;
  scene.height = 600;
  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  var masa_tierra = 5.97e4;
  var UA = 516;
  var bodiesOne = makeBodies([
    {
      name: "sun",
      pos: vec(0, 0, 0),
      radius: 100,
      color: color.yellow,
      mass: 2e10,
      // p: vec(1, 1, 0),
      p: vec(0, 0, 0),
      rota: 10,
    },
    {
      name: "asteroid",
      pos: vec(-UA * 5.12, -280, 00),
      radius: 1,
      color: vec(205 / 254, 125 / 254, 132 / 254),
      mass: masa_tierra * 0.005,
      p: vec(0, 0, 82),
      rota: 20,
    },
    {
      name: "jupiter",
      pos: vec(516 * 5.2, 0, 0),
      radius: 75,
      color: vec(0.8307, 0.6141, 0.496),
      mass: masa_tierra * 318,
      p: vec(0, 0, 82),
      rota: 30,
    },
  ]);

  // Stop simulation on click
  var stop_simulation = true;
  $("#stopSimulation").click(() => {
    stop_simulation = false;
    console.log("click");
  });
  while (stop_simulation) {
    await rate(2000);
    for (let b = 0; b < bodiesOne.length; b++) {
      runSim(b, bodiesOne, (G = -6.7e-4));
    }
  }
}
$(function () {
  window.__context = {
    glowscript_container: $("#glowscript"),
  };
});

// --------------------------
//
// ------ Simulation 2
// The following runs the code for the second simulation
//
// --------------------------
async function simulationTwo() {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  // Simulation Parameters
  var scene = canvas();
  scene.width = 1000;
  scene.height = 600;
  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  var bodiesTwo = makeBodies([
    {
      name: "m1",
      pos: vec(100, 0, 0),
      radius: 2,
      color: color.yellow,
      mass: 1,
      p: vec(3, 5, 0),
      rota: 10,
    },
    {
      name: "m2",
      pos: vec(0, 100, 0),
      radius: 2,
      color: vec(0.555, 0.539, 0.503),
      mass: 1,
      p: vec(0, 3, 5),
      rota: 20,
    },
    {
      name: "m3",
      pos: vec(0, 0, 100),
      radius: 2,
      color: vec(1, 0, 1),
      mass: 1,
      p: vec(5, 0, 3),
      rota: 30,
    },
  ]);

  // Click to stop simulation
  var stop_simulation = true;
  $("#stopSimulation").click(() => {
    stop_simulation = false;
    console.log("click");
  });
  while (stop_simulation) {
    await rate(1000);
    for (let b = 0; b < bodiesTwo.length; b++) {
      runSim(b, bodiesTwo, -2500);
    }
  }
}
$(function () {
  window.__context = {
    glowscript_container: $("#glowscript"),
  };
});

// --------------------------
//
// ------ Simulation 3
// The following runs the code for the third simulation
//
// --------------------------
async function simulationThree() {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  // Simulation Parameters
  var scene = canvas();
  scene.width = 1000;
  scene.height = 600;
  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  var GG = -6.67e4;
  var masa_tierra = 5.97e4;
  var UA = 516;
  var dist_luna = 67.08;
  var pos_jupiter = vec(0, 5.2 * UA, 0);
  var pos_luna_dist = Math.sqrt(dist_luna ** 2 / 3);
  var pos_luna = vec(pos_luna_dist, pos_luna_dist, pos_luna_dist)["+"](
    pos_jupiter
  );
  var v_jupiter = vec(70.2927, 0, 0);
  console.log(v_jupiter);
  var v_luna = vec(84.0321, 0, 0);
  console.log(v_luna);

  var bodiesThree = makeBodies([
    {
      name: "sun",
      pos: vec(0, 0, 0),
      radius: 110,
      color: color.yellow,
      mass: masa_tierra * 332946,
      p: vec(0, 0, 0),
      rota: 10,
    },
    {
      name: "jupiter",
      pos: pos_jupiter,
      radius: 35,
      color: vec(0.8307, 0.6141, 0.496),
      mass: masa_tierra * 318,
      p: v_jupiter,
      rota: 20,
    },
    {
      name: "europa",
      pos: pos_luna,
      radius: 2,
      color: vec(200 / 254, 139 / 254, 58 / 254),
      mass: masa_tierra * 0.008,
      p: v_luna,
      rota: 30,
    },
  ]);

  var run_simulation = true;
  $("#stopSimulation").click(() => {
    run_simulation = false;
    console.log("click");
  });
  while (run_simulation) {
    await rate(1000);
    for (let b = 0; b < bodiesThree.length; b++) {
      runSim(b, bodiesThree, -6.67e-4);
    }
  }
}
$(function () {
  window.__context = {
    glowscript_container: $("#glowscript"),
  };
});

// --------------------------
//
// ------ Custom Simulation
// The following runs the code for the custom simulation
//
// --------------------------
async function simulationCustom(data, newG) {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  // Simulation Parameters
  var scene = canvas();
  scene.width = 1000;
  scene.height = 600;
  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  // If value of g is not provided
  if (!newG) {
    newG = -6.67e-4;
  }

  var listdata = [];
  var newData = data.split("{");
  for (let i = 1; i < newData.length; i++) {
    var match = newData[i].split("}")[0];
    var newBody = {};
    var commaMatch = match.split("\n");
    for (let j = 0; j < commaMatch.length; j++) {
      let propmatch = commaMatch[j].replace(/\s+/g, "");
      let endmylife = propmatch.split(":");
      switch (endmylife[0]) {
        case "name":
          newBody.name = endmylife[1];
          break;
        case "position":
          let jesuschirst = endmylife[1].substring(1, endmylife[1].length - 1);
          let godpls = jesuschirst.split(",");
          console.log(godpls);
          let newvec = vec(
            parseInt(godpls[0]),
            parseInt(godpls[1]),
            parseInt(godpls[2])
          );
          newBody.pos = newvec;
          break;
        case "speed":
          let jesus = endmylife[1].substring(1, endmylife[1].length - 1);
          let god = jesus.split(",");
          let newp = vec(parseInt(god[0]), parseInt(god[1]), parseInt(god[2]));
          newBody.p = newp;
          break;
        case "radius":
          newBody.radius = endmylife[1] * 1;
          break;
        case "mass":
          let calc;
          try {
            let suck = endmylife[1].split("e");
            calc = suck[0] * 10 ** suck[1];
          } catch {
            calc = endmylife[1] * 1;
          }
          newBody.mass = calc;
          break;
        case "rotation":
          newBody.rota = endmylife[1] * 1;
          break;
      }
    }
    newBody.color = color.orange;
    listdata.push(newBody);
  }
  var bodiesCustom = makeBodies(listdata);

  var run_simulation = true;
  $("#stopSimulation").click(() => {
    run_simulation = false;
    console.log("click");
  });
  while (run_simulation) {
    await rate(1000);
    for (let b = 0; b < bodiesCustom.length; b++) {
      runSim(b, bodiesCustom, newG);
    }
  }
}
$(function () {
  window.__context = {
    glowscript_container: $("#glowscript"),
  };
});
