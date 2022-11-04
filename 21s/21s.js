import { getDefaultLogger } from "./logging.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const LOSE_MESSAGE = "Sam lost!";
const WIN_MESSAGE = "Sam won!";
const DRAW_MESSAGE = "Draw!";
const defaultLogger = await getDefaultLogger();

function shuffle(array, seed = 1) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  let random = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  while (0 !== currentIndex) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function generateDeck() {
  const inCards = [];
  const suits = ["S", "D", "C", "H"];
  const cards = [];

  inCards.push("A");

  for (let i = 2; i <= 10; i++) {
    inCards.push(`${i}`);
  }

  inCards.push("J");
  inCards.push("Q");
  inCards.push("K");

  for (const i of suits) {
    for (const j of inCards) {
      cards.push(j + i);
    }
  }

  return cards;
}

function cardPoints(card) {
  if (card[0] === "A") {
    return 11;
  } else if (
    card[0] === "J" ||
    card[0] === "Q" ||
    card[0] === "K" ||
    card[0] + card[1] === "10"
  ) {
    return 10;
  } else {
    for (let i = 2; i <= 9; i++) {
      if (card[0] === i.toString()) {
        return i;
      }
    }
  }
}

function pointsFor(cards) {
  const totalPoints = [];
  for (const i of cards) {
    totalPoints.push(cardPoints(i));
  }

  const sum = totalPoints.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  if (totalPoints[0] == 11 && totalPoints[1] == 11) {
    return sum - 1;
  } else {
    return sum;
  }
}
function playerTurn(deck, hand, logger = defaultLogger) {
  logger.info(`Sam's hand is ${hand.join(", ")}\n(${pointsFor(hand)} points)`);

  if (pointsFor(hand) >= 17) {
    return false;
  }

  //Accept the choice from the player

  const action = window.prompt('What do you want to do? ("hit" or "stick")');

  switch (action) {
    case "hit": {
      // TO DO: Draw a card
      logger.info("Hitting");
      hand.push(deck.shift());
      logger.info(`You draw ${hand[hand.length - 1]}`);

      if (pointsFor(hand) >= 17) {
        logger.info(
          `Sam's hand is ${hand.join(", ")}\n(${pointsFor(hand)} points)`
        );
        return false;
      } else {
        return true;
      }
    }
    case "stick": {
      // End the player's turn
      return false;
    }
    default: {
      // Unknown action
      break;
    }
  }
}

function dealerTurn(deck, hand, logger = defaultLogger) {
  logger.info(
    `The Dealer's hand is ${hand.join(", ")}\n(${pointsFor(hand)} points)`
  );

  //the choice from the computer

  if (pointsFor(hand) < 17) {
    logger.info("Hitting");
    hand.push(deck.shift());
    logger.info(`Dealer draws ${hand[hand.length - 1]}`);
    return true;
  } else {
    return false;
  }
}

function play({ seed = Date.now(), logger = defaultLogger } = {}) {
  const newDeck = generateDeck();
  const shuffledDeck = shuffle(newDeck, seed);
  const playerHand = [shuffledDeck.shift(), shuffledDeck.shift()];

  let isPlayerTurn = true;

  while (isPlayerTurn) {
    isPlayerTurn = playerTurn(shuffledDeck, playerHand, logger);
  }

  if (pointsFor(playerHand) > 21) {
    logger.info(`${LOSE_MESSAGE}`);
  } else if (pointsFor(playerHand) == 21) {
    logger.info(`${WIN_MESSAGE}`);
  } else {
    const dealerHand = [shuffledDeck.shift(), shuffledDeck.shift()];
    let isDealerTurn = dealerTurn(shuffledDeck, dealerHand, logger);

    while (isDealerTurn) {
      isDealerTurn = dealerTurn(shuffledDeck, dealerHand, logger);
    }

    if (
      (pointsFor(playerHand) === 21 && pointsFor(dealerHand) > 21) ||
      (pointsFor(playerHand) === 21 && pointsFor(dealerHand) < 21) ||
      (pointsFor(playerHand) < 21 &&
        pointsFor(playerHand) > pointsFor(dealerHand)) ||
      pointsFor(dealerHand) > 21
    ) {
      logger.info(`${WIN_MESSAGE}`);
    } else if (pointsFor(playerHand) === pointsFor(dealerHand)) {
      logger.info(`${DRAW_MESSAGE}`);
    } else {
      logger.info(`${LOSE_MESSAGE}`);
    }
  }

  // TO DO: Dealer's turn
}

if (import.meta.main) {
  const { seed } = parse(Deno.args);
  play({ seed });
}
