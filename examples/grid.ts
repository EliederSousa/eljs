/**
 * Grid example — draws a full-screen reference grid and runs the
 * World loop (input → physics → render).
 */
import { World } from "../src/objects/World.js";
import { Color } from "../src/util/Color.js";
import { Grid } from "../src/objects/Grid.js";

const world = new World();
const grid = new Grid(world);

grid.setLineWidth(0.2);
grid.setLineColor(new Color(Color.colors.red_brown));
world.add(grid);
world.run();
