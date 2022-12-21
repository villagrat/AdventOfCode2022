const events = require('events');
const fs = require('fs');
const readline = require('readline');

type PrioritySum = number;
type AlphabetArray = string[];
type Line = string;
/*  Each rucksack has two large compartments
    All items of a given type are meant to go into exactly one of the two compartments
    The elf that packed the rucksacks has failed to follow this rule FOR EXACTLY ONE ITEM TYPE PER RUCKSACK

    Every type of item is identified by a case-sensitive letter
    A line in the problem input is one rucksack ~ variable length
    A given rucksack always has the same number of items in each of its two compartments ~ 1st half is on 1st compartment, yada yada

    theres going to be only one type of item (of case-sensitive letter) in both halfs

    Every type can be converted to a priority
    Lowercase item types a-z -> 1-26
    Uppercase item types A-Z -> 27-52
*/

// 1. find the item that appears in both compartments of each rucksack
// 2. find the sum of the priorities of those items

(async function processLineByLine(): Promise<any> {
  let prioritySum: PrioritySum = 0;
  const lower = [...Array(26)].map((_, idx) =>
    String.fromCharCode(idx + 65).toLowerCase()
  );
  const upper = [...Array(26)].map((_, idx) => String.fromCharCode(idx + 65));
  // added empty string on idx 0 to make idx match the priority
  const alphabet = [''].concat(lower).concat(upper);

  const alphabetArray: AlphabetArray = alphabet;
  console.log('alphabet array: ', alphabetArray);

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('puzzle-input.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line: Line) => {
      if (line !== '') {
        console.log('reading line: ', line);
        console.log('length of line: ', line.length);
        // 1st half goes to < length/2
        // add 1st half of elems in a Set
        // when going thru 2nd half, check if elem is in our created Set, if so sum its priority
        const set = new Set();
        for (let i = 0; i < line.length / 2; i++) {
          set.add(line[i]);
        }
        for (let j = line.length / 2; j < line.length; j++) {
          if (set.has(line[j])) {
            console.log('the repeating elem in both halfs is: ', line[j]);
            prioritySum += alphabetArray.indexOf(line[j]);
            console.log('prioritySum is now: ', prioritySum);
            console.log('added one priority from line: ', line);
            console.log(
              '--------------------------------------------------------'
            );
            break;
          }
        }

        // ('-----------------------------------------');
      }
    });
    await events.once(rl, 'close');
  } catch (err) {
    console.error(err);
  }
  return 1;
})();
