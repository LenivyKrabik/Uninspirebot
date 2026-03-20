# Uninspirebot

Clone of inspirobot.me but worse

## ToDo list:

- Deal with possible not correct answer type in textTimedAudio route handler
- In wisdomBuilder.ts make static function for assignComponent on abstract class, so i wouldn't need to copy it couple of times
- Afirmations and mantras
- Make more phrases
- Review wisdomBuilder.ts
- Add cors for right addresses access to backend only
- Add test
- Make it look pretier💅
- NotFound page
- Make proper error handing on frontend comunication with backend
- Fix copying of code in backend.ts
- Use 3 lab with database of some sort
- Make lockIn mode text not sometimes go into unexistant space on screen
- Fix invalid url spam in lockIn mode
- Add more typing where needed
- Make event emmiter in front id not just a number
- Cache sound effects on client side
- Instead of hardcoding sound efects amount get it from backend
- Time between wisdoms
- Finish visual effects
- Make so not getting wisdom in lockInCycle woudn't stop it entirely
- Signal that can't get to backend in homePage and lockInScreen

# Ideas to implement labs:

## Lab 1:

- Make id's generator for saved wisdoms to show later
- Generator half in event file on front

## Lab 2: ✓

Already done

## Lab 3: ✓

With elevenlabs api calls

## Lab 4:

- Base particles and soundefects choose on bi-directional priority queue

## Lab 5:

-

## Lab 6:

- Use for claude integration for lab 8
- Use for initializing cache for memoization of elevenlabs calls

## Lab 7:

- Change lock in cycle to be event base instead of basing on useEffect
- Make event base particles or backgroung soundeffects in lock in mode

## Lab 8: ✓

- Make ElevenLabs voices

## Lab 9:

-

# General ideas:

- Make ability to save wisdoms and later view and share them
- Make particles or backgroung soundeffects in lock in mode
- Wisdoms creator
- LLM integreation to make new personolized words
