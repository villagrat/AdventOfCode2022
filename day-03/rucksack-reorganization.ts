const events = require('events');
const fs = require('fs');
const readline = require('readline');

type PrioritySum = number;
type AlphabetArray = Array<string>;
type Line = string;
type GroupMemberNumber = number;
/*  
    Part 1
    Each rucksack has two large compartments
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
// 2. add its corresponding value to sum of the priorities

/*
    Part 2
    Elves are divided into groups of three
    Every elf carries a badge that identifies their group
    Within each group of 3 elves, the badge is the only item carried by all three elves ~ if a group's badge is item type B --> all three elves will have item type B somewhere in their rucksack && at most two elves will be carrying any other item type
    The only to tell which item type is the right one is by finding the one item type that is common between all three elves in each group
    Every set of three lines in the puzzle_input corresponds to a single group BUT each group can have a different badge item type

    eg: 
    1st group
    vJrwpWtwJgWrhcsFMMfFFhFp
    jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
    PmmdzqPrVvPwwTWBwg
    ^ the ONLY item type that appears in all three rucksacks is lowercase r
      ^ then this MUST be their badges
        

    2nd group
    wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
    ttgJtRGJQctTZtZT
    CrZsJsPPZsGzwwsLwLmpwMDw
    ^ the ONLY item type that appears in all three rucksacks is uppercase Z

    After finding the badge for a group --> Find the priorities for the item (same value as before)

    Return the sum of the priorities
*/
// 1. find 3-way intersection of sets to get group badge
// 2. add its corresponding value to sum of the priorities

(async function processLineByLine(): Promise<any> {
  let prioritySum: PrioritySum = 0;
  const lower: Array<string> = [...Array(26)].map((_, idx) =>
    String.fromCharCode(idx + 65).toLowerCase()
  );
  const upper: Array<string> = [...Array(26)].map((_, idx) =>
    String.fromCharCode(idx + 65)
  );
  // Added empty string on idx 0 to make idx match the priority
  const alphabet: Array<string> = [''].concat(lower).concat(upper);

  const alphabetArray: AlphabetArray = alphabet;
  // console.log('alphabet array: ', alphabetArray);

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('puzzle-input.txt'),
      crlfDelay: Infinity,
    });
    // Use this variable to determine groups between line reads
    let groupMember: GroupMemberNumber = 1;
    let set1 = new Set();
    let set2 = new Set();
    let set3 = new Set();
    let intersection = new Set();

    rl.on('line', (line: Line) => {
      if (line !== '') {
        console.log('reading line: ', line);
        switch (groupMember) {
          case 1:
            for (let i = 0; i < line.length; i++) {
              set1.add(line[i]);
            }
            groupMember = 2;
            break;
          case 2:
            for (let i = 0; i < line.length; i++) {
              set2.add(line[i]);
            }
            groupMember = 3;
            break;
          case 3:
            for (let i = 0; i < line.length; i++) {
              set3.add(line[i]);
            }

            intersection = [set1, set2, set3].reduce(
              (a, b) => new Set([...a].filter((x) => b.has(x)))
            );
            // console.log('found intersection for group: ', ...intersection);
            // const valuesOfIntersection = intersection.values();
            // console.log('values of intersec: ', valuesOfIntersection);
            // console.log(
            //   'typeof values of intersec: ',
            //   typeof valuesOfIntersection
            // );
            // const value = valuesOfIntersection.next();
            // console.log('value: ', value.value);
            // console.log('typeof value: ', typeof value.value);

            // sum that to priorities and reset array state
            // console.log('which has corresponding priority: ', alphabetArray.indexOf(intersection))
            prioritySum += alphabetArray.indexOf(
              intersection.values().next().value
            );
            console.log('now prioritySum is: ', prioritySum);
            console.log('-------------------------------------');
            groupMember = 1;
            console.log('clearing state of sets...');
            console.log('-------------------------------------');
            set1.clear();
            set2.clear();
            set3.clear();
            intersection.clear();
            break;
        }
      }
    });
    await events.once(rl, 'close');
  } catch (err) {
    console.error(err);
  }
  return 1;
})();
