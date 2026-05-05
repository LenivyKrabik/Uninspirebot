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
- Fix invalid URI spam in lockIn mode
- Add more typing where needed
- Make event emmiter in front id not just a number
- Cache sound effects on client side
- Instead of hardcoding sound efects amount get it from backend
- Time between wisdoms
- Finish visual effects
- Make so not getting wisdom in lockInCycle woudn't stop it entirely
- Signal that can't get to backend in homePage and lockInScreen
- Make all of the events go through one event emiter instance using services
- Add check weathere there are any items in queue
- Rework api proxy
- VOLUMEEE CONTROLL
- Unsubscribe sound and visual effects on unmount
- Make lockInWisdomCycle not work just on useEffect but on events instead
- Signal that wisdom is undefined and move on and not just stop in lockInCucle page

# Ideas to implement labs:

## Lab 1: ✓

Generator: Uninspirebot/frontend/src/services/eventEmitter.ts

## Lab 2: ✓

Already done

## Lab 3: ✓

# With elevenlabs api calls

Implementation: Uninspirebot/backend/src/memoizationFunction.ts

Use: Uninspirebot/backend/src/routesHandlers.ts

## Lab 4: ✓

- Base particles and soundefects choose on bi-directional priority queue
- Make list of all phrases that can be rated and sorted by time and rating

# Wisdoms queue

Actuall implementation: Uninspirebot/frontend/src/services/simpleQueue.ts
Full lab implementation (just in case): Uninspirebot/frontend/src/services/priorityQueue.ts

Use: Uninspirebot/frontend/src/elements/lockInScreen.tsx

## Lab 5: ✓

Async usage: Uninspirebot/frontend/src/elements/lockInScreen.tsx (fillWisdomsQueue function)

## Lab 6:

- Use for claude integration for LLM integreation to make new personolized words
- Use for initializing cache for memoization of elevenlabs calls

## Lab 7: ✓

# Make event base particles and backgroung soundeffects in lock in mode

Implementation: Uninspirebot/frontend/src/services/eventEmitter.ts

Use: Uninspirebot/frontend/src/elements/lockInScreen.tsx

## Lab 8: ✓

- Make ElevenLabs voices

## Lab 9:

- Use on route handlers

# General ideas:

- Make ability to save wisdoms and later view and share them
- Wisdoms creator
- LLM integreation to make new personolized words
- Make list of all phrases that can be rated and sorted by time and rating
- Make ability to export wisdoms
