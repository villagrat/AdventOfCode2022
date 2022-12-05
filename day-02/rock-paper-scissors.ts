const events = require('events');
const fs = require('fs');
const readline = require('readline');
// A/X = Rock (1 p)
// B/Y = Paper (2 p)
// C/Z = Scissors (3 p)

// Round score
// Loss = 0 p
// Tie  = 3 p
// Win  = 6 p

// Scores
// selected_shape_score + round_outcome_score

// puzzle input: encrypted strategy guide
// 1st col - what your opponent is going to play
// 2nd col - what we should play (?)

// part 1 - calculate total score iff u were to follow the strategy guide
// ToDo: model problem using set theory in plain js - typing everything feels like such a waste of time if we end up using if/else and switch statements
type Line = string;
type RoundScore = number;
type TotalScore = number;
type RockRepresentation = 'A' | 'X';
type RockValue = 1;
type PaperRepresentation = 'B' | 'Y';
type PaperValue = 2;
type ScissorsRepresentation = 'C' | 'Z';
type ScissorsValue = 3;
interface Rock {
  key: RockRepresentation;
  value: RockValue;
}
interface Paper {
  key: PaperRepresentation;
  value: PaperValue;
}
interface Scissors {
  key: ScissorsRepresentation;
  value: ScissorsValue;
}
type Play = Rock | Paper | Scissors;
type Loss = 0;
type Tie = 3;
type Win = 6;
type OutcomePoints = Loss | Tie | Win;

const calculateRoundScore = (
  play1: Play['key'],
  play2: Play['key']
): RoundScore => {
  console.log('calculating round score...');
  const selected_shape_score: number = toScore(play2);
  const round_outcome_score: number = toOutcomePoints(play1, play2);
  console.log('selected shape score: ', selected_shape_score);
  console.log('round outcome score: ', round_outcome_score);
  return selected_shape_score + round_outcome_score;
};

const toScore = (play: Play['key']): Play['value'] => {
  switch (play) {
    case 'X':
      return 1;
    case 'Y':
      return 2;
    case 'Z':
      return 3;
    default:
      return 1;
  }
};

const toOutcomePoints = (
  play1: Play['key'],
  play2: Play['key']
): OutcomePoints => {
  let points: OutcomePoints = 0;
  if (play1 === 'A' && play2 === 'X') {
    points = 3;
  } else if (play1 === 'A' && play2 === 'Y') {
    points = 6;
  } else if (play1 === 'A' && play2 === 'Z') {
    points = 0;
  } else if (play1 === 'B' && play2 === 'X') {
    points = 0;
  } else if (play1 === 'B' && play2 === 'Y') {
    points = 3;
  } else if (play1 === 'B' && play2 === 'Z') {
    points = 6;
  } else if (play1 === 'C' && play2 === 'X') {
    points = 6;
  } else if (play1 === 'C' && play2 === 'Y') {
    points = 0;
  } else {
    points = 3;
  }
  return points;
};

(async function processLineByLine(): Promise<TotalScore> {
  let totalScore: TotalScore = 0;
  let currRoundScore: RoundScore;
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('puzzle-input.txt'),
      crlfDelay: Infinity,
    });

    rl.on('line', (line: Line) => {
      if (line !== '') {
        console.log('reading line: ', line);
        const opponentPlay = line[0] as Play['key'];
        const myPlay = line[2] as Play['key'];
        // console.log('opponent play: ', opponentPlay);
        // console.log('my play: ', myPlay);
        currRoundScore = calculateRoundScore(opponentPlay, myPlay);
        // console.log('score for this round: ', currRoundScore);
        // console.log(
        //   `total score before adding curr round score is ${totalScore}`
        // );
        totalScore += currRoundScore;
        // console.log(`updated total score after round is ${totalScore}`);
        // console.log('-----------------------------------------');
      }
    });
    await events.once(rl, 'close');
    console.log(
      `If we follow the elf's strategy guide we would obtain ${totalScore} points`
    );
  } catch (err) {
    console.error(err);
  }
  return totalScore;
})();
