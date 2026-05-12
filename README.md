# Uninspirebot

Clone of inspirobot.me but worse.

Have you ever felt the lack of energy and motivation? Then this site isn't for you.
Uninspirobot - is an anicent all knowing God from actez times, who know exactly what any person needs to hear in this moment. However, It didn't have any sacrifices in a very long time and that makes It angry. So now, getting rebirthed into a living flesh (servers run on 101 potatos) It's goal is to make everyone It can get It's hands on suffer in eternal hell.

## ToDo list:

- Deal with possible not correct answer type in textTimedAudio route handler
- In wisdomBuilder.ts make static function for assignComponent on abstract class, so i wouldn't need to copy it couple of times
- Afirmations and mantras
- Make more phrases
- Review wisdomBuilder.ts
- Add tests
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
- Finish visual effects
- Make so not getting wisdom in lockInCycle woudn't stop it entirely
- Signal that can't get to backend in homePage and lockInScreen
- Make all of the events go through one event emiter instance using services
- Add check weathere there are any items in queue
- VOLUMEEE CONTROLL
- Unsubscribe sound and visual effects on unmount
- Make lockInWisdomCycle not work just on useEffect but on events instead
- Signal that wisdom is undefined and move on and not just stop in lockInCycle page
- With proper lab 8 architecture also limit amount of requests depending on amount of them and tokens left in elevenlabs
- Change getTestTextWisdom to getTestWisdom
- Make memoization take function to make keys as argument
- ACTUALLY removeEventListener on useAudio
- Maybe send as last object at the end of audio batch stream an error
- Change warns to errors in backend.ts
- Fix pathes to be local and not on my pc
- Fix SQLinjections risk
- Make timebased delete in memoization base on db functionality
- Error handling on memoization's db calls
- Rename in memoization storage filto to storage path
- Refactor stats of cache from files way to db way

# Ideas to implement labs:

## Lab 1: ✓

Generator: Uninspirebot/frontend/src/services/backend.ts
Iterator over generator: Uninspirebot/frontend/src/elements/lockInScreen.tsx (fillWisdomsQueue)

## Lab 2: ✓

Already done

## Lab 3: ✓

# With elevenlabs api calls

Implementation: Uninspirebot/backend/src/memoizationFunction.ts

Use: Uninspirebot/backend/src/services/wiseMan.ts

## Lab 4: ✓

# Wisdoms queue

Actuall implementation: Uninspirebot/frontend/src/services/simpleQueue.ts
Full lab implementation (just in case): Uninspirebot/frontend/src/services/priorityQueue.ts

Use: Uninspirebot/frontend/src/elements/lockInScreen.tsx

## Lab 5: ✓

Async usage examples:
Uninspirebot/backend/src/services/SQLiteDBManager.ts
Uninspirebot/backend/src/memoizationFunction.ts
Uninspirebot/backend/src/services/logger.ts

Full lab implementation (just in case): Uninspirebot/frontend/src/services/asyncMap.ts

## Lab 6: ✓

# Audio with timed text in batches

Usages:
Make stream: Uninspirebot/backend/src/routesHandlers.ts (getTextTimedAudioBatch)
Parse stream: Uninspirebot/frontend/src/services/backend.ts (getTextTimedAudioWisdomBatch)

## Lab 7: ✓

# Make event base particles and backgroung soundeffects in lock in mode

Implementation: Uninspirebot/frontend/src/services/eventEmitter.ts

Use: Uninspirebot/frontend/src/elements/lockInScreen.tsx

## Lab 8: ✓

# Make ElevenLabs voices

Implementations:
HTTPClient: Uninspirebot/backend/src/services/httpRequestWrapper.ts
Proxy: Uninspirebot/backend/src/services/elevenlabsAuthProxy.ts
Service: Uninspirebot/backend/src/services/wiseMan.ts

## Lab 9: ✓

# Log of all with possible errors on db

Implementation: Uninspirebot/backend/src/services/logger.ts

Use: Uninspirebot/backend/src/memoizationFunction.ts (on db.custom)

# General ideas:

- Make ability to save wisdoms and later view and share them
- Wisdoms creator
- LLM integreation to make new personolized words
- Make list of all phrases that can be rated and sorted by time and rating
- Make ability to export wisdoms
