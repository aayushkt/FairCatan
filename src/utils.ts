export function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

export function ProbabilityOfRollingValue(value: number): number {
  switch (value) {
    case 2: return 1/36;
    case 3: return 2/36;
    case 4: return 3/36;
    case 5: return 4/36;
    case 6: return 5/36;
    case 7: return 6/36;
    case 8: return 5/36;
    case 9: return 4/36;
    case 10: return 3/36;
    case 11: return 2/36;
    case 12: return 1/36 ;
    default: throw `ERROR: It is impossible to roll a ${value} with two D6's!`;
  }
}