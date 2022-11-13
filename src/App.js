const{ Random, Console } = require("@woowacourse/mission-utils");
const Lotto = require("./Lotto");

const LOTTO_PRICE = 1000;
const START_LOTTO_NUMBER = 1;
const END_LOTTO_NUMBER = 45;
const LOTTO_LENGTH = 6;

class App {

  constructor() {
    this.purchaseAmount = 0;
    this.lottoAmount = 0;
    this.lottoList = {};
    this.luckyNumbers = 0;
    this.bonusNumber = 0;
    this.nullBonusArr = 0;
    this.overlapList = 0;
    this.countRankList = {};
    this.profitRates = 0;
  }

  play() {
  return Console.readLine('구입금액을 입력해 주세요.\n', (answer) => {
      this.validatePrice(answer);
      this.purchaseAmount = answer;
      this.countBuyLotto();
    })
  }

  validatePrice(answer) {
    if(answer % LOTTO_PRICE !== 0) throw new Error(`[ERROR] ${LOTTO_PRICE}원으로 나누어 떨어져야 합니다.`);
  }

  countBuyLotto() {
    this.lottoAmount = this.purchaseAmount / LOTTO_PRICE;
    Console.print(`${this.lottoAmount}개를 구매했습니다.`);
    this.getLottoNumberes();
    this.printOutBuyLotto();
  }

  getLottoNumberes() {
    let lottoList = [];
    for(let idex = 0; idex < this.lottoAmount; idex++){
      let makeLotto = Random.pickUniqueNumbersInRange(START_LOTTO_NUMBER, END_LOTTO_NUMBER, LOTTO_LENGTH);
      lottoList.push(makeLotto.sort((elementOne, elementTwo) => elementOne - elementTwo));
    }
    return this.lottoList = lottoList;
  }

  printOutBuyLotto() {
    for(let idex = 0; idex < this.lottoAmount; idex++){
      Console.print(`[${this.lottoList[idex].join(", ")}]`);
    }
    this.getLuckyNumbers();
  }

  getLuckyNumbers() {
    Console.readLine('당첨번호를 입력해 주세요.\n', (answer)=>{
      this.validateLuckyNumbers(answer);
      this.getBonusNumber();
    })
  }

  validateLuckyNumbers(answer) {
    let checkAnswer = answer.split(',');
    let lotto = new Lotto(checkAnswer);
    lotto.validate(checkAnswer);
    return this.luckyNumbers = checkAnswer;
  }

  getBonusNumber() {
    Console.readLine('보너스 번호를 입력해 주세요.\n', (answer)=>{
      this.validateBonusNum(answer);
      this.bonusNumber = answer;
      this.calcOverlapNum();
      this.getRankCountNum();
      this.calcProfit();
    })
  }

  validateBonusNum(answer) {
    let bonusArr = new Array(5).fill(null);
    bonusArr.push(answer);
    this.nullBonusArr = bonusArr;
    let lotto = new Lotto(bonusArr);
    lotto.validate(bonusArr);
    lotto.validateOverlap(this.luckyNumbers, bonusArr);
    return answer;
  }

  calcOverlapNum() {
    let count =  0;
    let result = [];
    for(let listIndex = 0; listIndex < this.lottoAmount; listIndex++){
      for(let index = 0; index < 6; index++) {
        if(this.lottoList[listIndex].some(element => element == this.luckyNumbers[index]) == true) count += 1;
      } result.push(count);
        count = 0;
    }
    this.overlapList = result;
    return this.overlapList;
  }

  getRankCountNum(){
    let countRankFive = this.overlapList.filter((value) => value === 3).length;
    let countRankFour = this.overlapList.filter((value) => value === 4).length;
    let countRankOne = this.overlapList.filter((value) => value === 6).length;
    let countRankThree = 0, countRankTwo = 0;
    for(let index= 0; index < this.overlapList.length; index++){
      if(this.overlapList[index] === 5){
        if(this.lottoList[index].some(element => element == this.bonusNumber) === true) countRankTwo += 1;
        if(this.lottoList[index].some(element => element == this.bonusNumber) === false) countRankThree += 1;
      }
    }
    return this.countRankList = [countRankFive, countRankFour, countRankThree, countRankTwo, countRankOne];
  }

  calcProfit(){
    let profit = this.countRankList[0] * 5000 + this.countRankList[1] * 50000 + this.countRankList[2] * 1500000 + this.countRankList[3] * 30000000 + this.countRankList[4] * 2000000000;
    let calProfitRates = ((profit  / this.purchaseAmount) * 100)
    return this.profitRates = calProfitRates.toFixed(1);
  }
}
let app = new App();
app.play();
module.exports = App;
