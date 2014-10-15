hungman
=======

A server which replicates (as best it can) the functionality of Hulu's hangman challenge

It can be accessed at hungman.herokuapp.com

Three distinct differences are obvious from the actual hulu api:

1. The `code` you provide is completely ignored by this server. You need to have it, but it isn't used for anything.

2. Your game token expires after 2 hours of inactivity. 

3. The word you were given is never actually revealed even after you die (this might be fixed)
