import type { WisdomComponentDesc, WisdomsComponentsStorage } from "./wisdomComponentsTypes.ts";

type componentsContainer = "phrases" | "nouns" | "adjectives" | "verbs";

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//Takes in percentage, return true or false
const rollRandomChance = (percent: number) => {
  return getRandomInt(1, 100) <= percent;
};

const makeComponent = (name: string, wisdomsComponentsStorage: WisdomsComponentsStorage) => {
  switch (name) {
    case "phrase":
      return new PhraseObject(wisdomsComponentsStorage);
    case "noun":
      return new NounObject(wisdomsComponentsStorage);
    case "verb":
      return new VerbObject(wisdomsComponentsStorage);
    case "adjective":
      return new AdjectiveObject(wisdomsComponentsStorage);
    case "gerund":
      return new GerundObject(wisdomsComponentsStorage);
    /*case "afirmation":
    return new ################*/
    default:
      console.log(name + " is not valid name for wisdom component");
      return undefined;
  }
};

class WisdomComponent {
  wisdomsComponentsStorage: WisdomsComponentsStorage;
  component: WisdomComponentDesc;
  variables: Array<WisdomComponent>;
  text: string;
  componentsContainer: componentsContainer;

  constructor(wisdomsComponentsStorage: WisdomsComponentsStorage, componentsContainer: componentsContainer) {
    const proto = Object.getPrototypeOf(this);
    if (proto.constructor === WisdomComponent) {
      throw new Error("Abstract class should not be instanciated");
    }
    this.wisdomsComponentsStorage = wisdomsComponentsStorage;
    this.variables = new Array<WisdomComponent>();
    this.componentsContainer = componentsContainer;

    this.finishCreating();
  }

  finishCreating() {
    this.assignComponent();
    this.text = this.component.text;
    this.createVariables();
  }

  assignComponent() {
    const count = this.wisdomsComponentsStorage[this.componentsContainer].length;
    this.component = this.wisdomsComponentsStorage[this.componentsContainer][getRandomInt(0, count - 1)]!;
  }

  createVariables() {
    const iterator = this.text[Symbol.iterator]();
    let variableNumber = 0;

    for (let symbol of iterator) {
      if (symbol !== "#") continue;

      if ("variables" in this.component && this.component.variables !== undefined) {
        const variablesDescArray = this.component.variables[variableNumber++]!;
        const amount = variablesDescArray.length;
        const variableDesc = variablesDescArray[getRandomInt(0, amount - 1)];

        if (variableDesc !== undefined && "type" in variableDesc) {
          const name = variableDesc.type;
          const variable = makeComponent(name, this.wisdomsComponentsStorage);
          if (variable !== undefined) this.variables.push(variable);
        }
      }
    }
  }

  showText(): string {
    const iterator = this.text.split("");
    let variableNumber = 0;
    for (let id = 0; id < iterator.length; id++) {
      if (iterator[id] !== "#") continue;
      if (this.variables[variableNumber] !== undefined) {
        iterator[id] = this.variables[variableNumber++]!.showText();
      } else {
        iterator[id] = "CAN'T GET VARIABLE";
      }
    }
    const fullText = iterator.join("");
    return fullText;
  }
}

class PhraseObject extends WisdomComponent {
  constructor(wisdomsComponentsStorage: WisdomsComponentsStorage) {
    super(wisdomsComponentsStorage, "phrases");
  }

  assignComponent() {
    //Chance for phrase wrapper
    if (rollRandomChance(90)) {
      const count = this.wisdomsComponentsStorage.phrases.length;
      this.component = this.wisdomsComponentsStorage.phrases[getRandomInt(0, count - 1)]!;
    } else {
      const count = this.wisdomsComponentsStorage.wrapers.length;
      this.component = this.wisdomsComponentsStorage.wrapers[getRandomInt(0, count - 1)]!;
    }
  }
}

class NounObject extends WisdomComponent {
  constructor(wisdomsComponentsStorage: WisdomsComponentsStorage) {
    super(wisdomsComponentsStorage, "nouns");
  }
}

class AdjectiveObject extends WisdomComponent {
  constructor(wisdomsComponentsStorage: WisdomsComponentsStorage) {
    super(wisdomsComponentsStorage, "adjectives");
  }
}

class VerbObject extends WisdomComponent {
  constructor(wisdomsComponentsStorage: WisdomsComponentsStorage) {
    super(wisdomsComponentsStorage, "verbs");
  }
}

class GerundObject extends WisdomComponent {
  constructor(wisdomsComponentsStorage: WisdomsComponentsStorage) {
    super(wisdomsComponentsStorage, "verbs");
  }

  finishCreating() {
    this.assignComponent();
    if ("gerund" in this.component) {
      this.text = this.component.gerund;
    } else {
      this.text = "COULDN'T FIND GERUND VERSION OF VERB";
    }
    this.createVariables();
  }
}

//Wisdom maker
class WisdomBuilder {
  wisdomsComponents: WisdomsComponentsStorage;

  constructor(wisdomsComponents: WisdomsComponentsStorage) {
    this.wisdomsComponents = wisdomsComponents;
  }

  createWisdom() {
    return new PhraseObject(this.wisdomsComponents);
  }
}

export default WisdomBuilder;
