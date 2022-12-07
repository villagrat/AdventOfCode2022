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

/* part 1 - calculate total score iff u were to follow the strategy guide, assuming:
. 1st column is what your opponent is going to play
. 2nd colums is ... what you should play in response? */
// ToDo: model problem using set theory in plain js - typing everything feels like such a waste of time if we end up using if/else and switch statements
/* part 2 - 
. score is calculated the same way
. 1st column is what your opponent is going to play
. 2nd column is how the round needs to end
    X means u need to lose
    Y means u need to draw
    Z means u need to win
--> figure out what you need to play
*/

type Line = string;
type RoundScore = number;
type TotalScore = number;

type RockRepresentation = 'A';
type RockValue = 1;
type PaperRepresentation = 'B';
type PaperValue = 2;
type ScissorsRepresentation = 'C';
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

type LossRepresentation = 'X';
type LossValue = 0;
type TieRepresentation = 'Y';
type TieValue = 3;
type WinRepresentation = 'Z';
type WinValue = 6;
interface Loss {
  key: LossRepresentation;
  value: LossValue;
}
interface Tie {
  key: TieRepresentation;
  value: TieValue;
}
interface Win {
  key: WinRepresentation;
  value: WinValue;
}
type Outcome = Loss | Tie | Win;

const calculateRoundScore = (
  opponentPlay: Play['key'],
  roundOutcome: Outcome['key']
): RoundScore => {
  console.log('calculating round score...');
  // selected shape will dpeend on both opponent play && roundOutcome
  const selected_shape: Play['key'] = selectPlay(opponentPlay, roundOutcome);
  const selected_shape_score: Play['value'] = fromPlayToScore(selected_shape);
  // round outcome score depends on roundOutcome
  const round_outcome_score: number = toOutcomePoints(roundOutcome);
  console.log('selected shape score: ', selected_shape_score);
  console.log('round outcome score: ', round_outcome_score);
  return selected_shape_score + round_outcome_score;
};

const selectPlay = (
  opponentPlay: Play['key'],
  roundOutcome: Outcome['key']
): Play['key'] => {
  let selectedShape: Play['key'] = 'A';
  // need to draw
  if (roundOutcome === 'Y') {
    selectedShape = opponentPlay;
  }
  // need to lose
  else if (roundOutcome === 'X') {
    switch (opponentPlay) {
      case 'A':
        selectedShape = 'C';
        break;
      case 'B':
        selectedShape = 'A';
        break;
      case 'C':
        selectedShape = 'B';
    }
  }
  // need to win
  else if (roundOutcome === 'Z') {
    switch (opponentPlay) {
      case 'A':
        selectedShape = 'B';
        break;
      case 'B':
        selectedShape = 'C';
        break;
      case 'C':
        selectedShape = 'A';
    }
  }
  return selectedShape;
};

const fromPlayToScore = (play: Play['key']): Play['value'] => {
  switch (play) {
    case 'A':
      return 1;
    case 'B':
      return 2;
    case 'C':
      return 3;
    default:
      return 1;
  }
};

const toOutcomePoints = (roundOutcome: Outcome['key']): Outcome['value'] => {
  let points: Outcome['value'] = 0;
  if (roundOutcome === 'X') {
    points = 0;
  } else if (roundOutcome === 'Y') {
    points = 3;
  } else if (roundOutcome === 'Z') {
    points = 6;
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
        // console.log('reading line: ', line);
        const opponentPlay = line[0] as Play['key'];
        const roundOutcome = line[2] as Outcome['key'];
        // console.log('opponent play: ', opponentPlay);
        // console.log('round outcome: ', roundOutcome);
        currRoundScore = calculateRoundScore(opponentPlay, roundOutcome);
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
    // console.log(
    //   `If we follow the elf's strategy guide we would obtain ${totalScore} points`
    // );
  } catch (err) {
    console.error(err);
  }
  return totalScore;
})();
