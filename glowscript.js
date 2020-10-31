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

function runSim(i, bodies, G = -6.674e-11) {
  // var G = -6.674e-4;
  var dt = 0.001;

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

// Simulation 1
async function simulationOne() {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  var scene = canvas();
  var vector = vec;

  scene.width = 1000;
  scene.height = 600;

  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  var earth_radius = 6371000;
  var bodiesOne = makeBodies([
    {
      name: "sun",
      pos: vec(0, 0, 0),
      radius: 100,
      color: color.yellow,
      mass: 2e10,
      p: vec(0, 0, 0),
      rota: 10,
    },
    {
      name: "asteroid",
      pos: vec(516 * 0.39, 0, 0),
      radius: 50,
      color: vec(0.555, 0.539, 0.503),
      mass: 3.3e3,
      p: vec(0, 0, 300),
      rota: 20,
    },
    {
      name: "jupiter",
      pos: vec(516 * 5.2, 0, 0),
      radius: 75,
      color: color.orange,
      mass: 5.97e4 * 318,
      p: vec(0, 0, 81.9),
      rota: 30,
    },
  ]);

  while (true) {
    await rate(2000);
    for (let b = 0; b < bodiesOne.length; b++) {
      runSim(b, bodiesOne, (G = -6.7e-4));
    }
  }
}
$(function () {
  window.__context = {
    // glowscript_container: $("#glowscript").removeAttr("id"),
    glowscript_container: $("#glowscript"),
  };
});

// Simulation 2
async function simulationTwo() {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  var scene = canvas();
  var vector = vec;

  scene.width = 1000;
  scene.height = 600;

  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  var body_one = sphere({
    pos: vec(100, 0, 0),
    radius: 2,
    color: color.yellow,
  });
  body_one.mass = 1;
  body_one.p = vec(3, 5, 0);
  attach_trail(body_one, { color: body_one.color });

  var body_two = sphere({
    pos: vec(0, 100, 0),
    radius: 2,
    color: vec(0.555, 0.539, 0.503),
  });
  body_two.mass = 1;
  body_two.p = vec(0, 3, 5);
  attach_trail(body_two, { color: body_two.color });

  var body_three = sphere({
    pos: vec(0, 0, 100),
    radius: 2,
    color: vec(1, 0, 1),
  });
  body_three.mass = 1;
  body_three.p = vec(5, 0, 3);
  attach_trail(body_three, { color: body_three.color });

  bodiesTwo = [body_one, body_two, body_three];
  function runSim(i, rot, bodies) {
    var G = -2500;
    var dt = 0.001;

    var b1 = bodies[i].pos["-"](bodies[(i + 1) % 3].pos);
    var b2 = bodies[i].pos["-"](bodies[(i + 2) % 3].pos);

    var magb1 = mag(b1);
    var magb2 = mag(b2);

    var posB1 = b1["/"](magb1);
    var posB2 = b2["/"](magb2);

    var fgB1 = G["*"](
      bodies[(i + 1) % 3].mass["*"](bodies[i].mass)["*"](posB1)
    )["/"](magb1 ** 2);
    var fgB2 = G["*"](
      bodies[(i + 2) % 3].mass["*"](bodies[i].mass)["*"](posB2)
    )["/"](magb2 ** 2);
    var fgB = fgB1["+"](fgB2);

    var prevprevP = fgB["/"](bodies[i].mass);
    var prevP = prevprevP["*"](dt);
    bodies[i].p = bodies[i].p["+"](prevP);

    var prevPos = bodies[i].p["*"](dt);
    bodies[i].pos = bodies[i].pos["+"](prevPos);

    bodies[i].rotate((angle = rot), (axis = vec(0, 1, 0)));
  }

  var stop_simulation = true;
  $("#stopSimulation").click(() => {
    stop_simulation = false;
    console.log("click");
  });
  while (true) {
    await rate(2000);
    runSim(0, 10, bodiesTwo);
    runSim(1, 20, bodiesTwo);
    runSim(2, 30, bodiesTwo);
  }
}
$(function () {
  window.__context = {
    // glowscript_container: $("#glowscript").removeAttr("id"),
    glowscript_container: $("#glowscript"),
  };
});

// Simulation 3
async function simulationThree() {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  var scene = canvas();
  var vector = vec;

  scene.width = 1000;
  scene.height = 600;

  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

  var earth_radius = 6371000;
  var bodiesOne = makeBodies([
    {
      name: "sun",
      pos: vec(0, 0, 0),
      radius: earth_radius * 109,
      color: color.yellow,
      mass: 1.989e30,
      p: vec(0, 0, 0),
      rota: 10,
    },
    {
      name: "jupiter",
      pos: vec(7.78e11, 0, 0),
      radius: earth_radius * 11,
      color: color.orange,
      mass: 1.898e27,
      p: vec(0, 13060, 0),
      rota: 30,
    },
    {
      name: "jupitermoon",
      pos: vec(7.78e11, 0, 4.216e8),
      radius: earth_radius * 0.002,
      color: color.red,
      mass: 8.9e22,
      p: vec(0, 0, 17334),
      rota: 30,
    },
  ]);

  while (true) {
    await rate(2000);
    for (let b = 0; b < bodiesOne.length; b++) {
      runSim(b, bodiesOne);
    }
  }
}
$(function () {
  window.__context = {
    // glowscript_container: $("#glowscript").removeAttr("id"),
    glowscript_container: $("#glowscript"),
  };
});

// Custom
async function simulationCustom(data, newG = -6.67e-4) {
  Array.prototype.toString = function () {
    return __parsearray(this);
  };

  var scene = canvas();
  var vector = vec;

  scene.width = 1000;
  scene.height = 600;

  scene.forward = vec(0, (0.3)["-u"](), (1)["-u"]());

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
  console.log(listdata);
  console.log(newG);
  var bodiesOne = makeBodies(listdata);

  while (true) {
    await rate(2000);
    for (let b = 0; b < bodiesOne.length; b++) {
      runSim(b, bodiesOne, newG);
    }
  }
}
$(function () {
  window.__context = {
    // glowscript_container: $("#glowscript").removeAttr("id"),
    glowscript_container: $("#glowscript"),
  };
});
