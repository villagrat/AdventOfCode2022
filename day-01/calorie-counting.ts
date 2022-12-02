/* Day 1: Calorie Counting */
// puzzle input is the n° of each elf is carrying
// each elf separates items in their inventory w/ a \n
// find the elf which is carrying the most calories
const events = require('events');
const fs = require('fs');
const readline = require('readline');

type calorie = number;
type blank = '';

(async function processLineByLine() {
  let maxElfCalories: calorie = 0;
  let currElfCalories: calorie = 0;
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('puzzle-01-input.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line: calorie | blank) => {
      if (line !== '') {
        currElfCalories += Number(line);
        // console.log('curr elf now has : ', currElfCalories);
      } else {
        // console.log(
        //   `comparing curr ${currElfCalories} with max so far ${maxElfCalories}`
        // );
        if (currElfCalories > maxElfCalories) {
          maxElfCalories = currElfCalories;
        }
        currElfCalories = 0;
      }
    });
    await events.once(rl, 'close');
    console.log('found max calories: ', maxElfCalories);

    // console.log('Reading file line by line with readline done.');
    // const used = process.memoryUsage().heapUsed / 1024 / 1024;
    // console.log(
    //   `The script uses approximately ${Math.round(used * 100) / 100} MB`
    // );
  } catch (err) {
    console.error(err);
  }
})();
