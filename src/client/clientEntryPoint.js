const qsOptions = require('query-string').parse(location.search);
const GFYClientEngine = require('../client/GFYClientEngine');
const GFYGameEngine = require('../common/GFYGameEngine');
const SimplePhysicsEngine = require('lance-gg').physics.SimplePhysicsEngine;

// default options, overwritten by query-string options
// are sent to both game engine and client engine
const defaults = {
    traceLevel: 0,
    delayInputCount: 8,
    clientIDSpace: 1000000,
    syncOptions: {
        sync: qsOptions.sync || 'extrapolate',
        localObjBending: 0.2,
        remoteObjBending: 0.5
    }
};
let options = Object.assign(defaults, qsOptions);

// create a client engine and a game engine
const physicsEngine = new SimplePhysicsEngine({ collisionOptions: { COLLISION_DISTANCE: 25 } } );
const gameOptions = Object.assign({ physicsEngine: physicsEngine }, options);
const gameEngine = new GFYGameEngine(gameOptions);
const clientEngine = new GFYClientEngine(gameEngine, options);

clientEngine.start();
