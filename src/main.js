import { World } from "./objects/World.js";
import { Color } from "./util/Color.js";
import { Grid } from "./objects/Grid.js";

let world = new World();
let g = new Grid(world);

g.setLineWidth(.2);
g.setLineColor(new Color(Color.colors.red_brown));
world.add(g);
world.run();