type WisdomsComponentsStorage = {
  wrapers: Array<Phrase>;
  phrases: Array<Phrase>;
  nouns: Array<Noun>;
  verbs: Array<Verb>;
  adjectives: Array<Adjective>;
  mantras: Array<Mantra>;
  afirmations: Array<Afirmation>;
};

type Phrase = {
  text: string;
  variables: Array<Array<Variable>>;
};

type Variable = {
  type: string;
};

type Noun = {
  text: string;
};

type Verb = {
  text: string;
  gerund: string;
  variables: Array<Array<Variable>>;
};

type Adjective = {
  text: string;
};

type Mantra = {
  text: string;
};

type Afirmation = {
  text: string;
};

type WisdomComponent = Phrase | Noun | Verb | Adjective | Mantra | Afirmation;

export type { WisdomsComponentsStorage, WisdomComponent, Phrase };
