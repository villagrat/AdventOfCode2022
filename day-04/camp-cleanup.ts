const events = require('events');
const fs = require('fs');
const readline = require('readline');

// type declarations
type Line = string;
type ParsedLine = Array<number>;
type FirstElfRange = [number, number];
type SecondElfRange = [number, number];
type Count = number;

/*
    Part 1
    Every section has a UNIQUE id_number
    Each elf is assigned a range of section ids
    Many of the assignments overlap

    eg:
    2-4,6-8
    2-3,4-5
    5-7,7-9
    2-8,3-7
    6-6,4-6
    2-6,4-8
    ^ first elf was assigned sections 2-4
      second elf was assigned sections 6-8
      
    Some pairs fully contain each other

    Count how many of these pairs are contained in the puzzle input
*/
// 1. separate line into elf 1 and 2 ranges
// 2. check if either elf1_range is completely container by elf2_range or viceversa and count ocurrences

/*
    Part 2
    Find the n° of pairs that overlap at all

    eg:
    2-4,6-8
    2-3,4-5
    5-7,7-9
    2-8,3-7
    6-6,4-6
    2-6,4-8
    ^ no overlap @ first 2 pairs
      some overlap @ 3rd thru 6th pairs
*/

(async function processLineByLine(): Promise<any> {
  // var initialization
  let count: Count = 0;
  let parsedLine: ParsedLine = [];
  let firstElfRange: FirstElfRange = [-1, -1];
  let secondElfRange: SecondElfRange = [-1, -1];

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('puzzle-input.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line: Line) => {
      if (line !== '') {
        console.log('reading line: ', line);
        console.log('separated line: ', line.split(/[-,]/));
        parsedLine = line.split(/[,-]/).map((elem) => Number(elem));
        firstElfRange[0] = parsedLine[0];
        firstElfRange[1] = parsedLine[1];
        secondElfRange[0] = parsedLine[2];
        secondElfRange[1] = parsedLine[3];

        // check if either range completely contains the other
        if (
          firstElfRange[1] === secondElfRange[0] ||
          firstElfRange[0] === secondElfRange[1] ||
          (firstElfRange[1] > secondElfRange[0] &&
            firstElfRange[1] <= secondElfRange[1]) ||
          (secondElfRange[1] > firstElfRange[0] &&
            secondElfRange[1] <= firstElfRange[1])
        ) {
          console.log(
            'found partially contained intervals: ',
            firstElfRange,
            secondElfRange
          );
          count += 1;
          console.log('count is now: ', count);
        }
      }
      console.log('count: ', count);
    });
    await events.once(rl, 'close');
  } catch (err) {
    console.error(err);
  }
  return 1;
})();
