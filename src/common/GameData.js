class GameData {

	/* This should sync client data to server. This will only be called on the client. */
	sync_to(serverData) {
		if(serverData.name != GamestateManager.GM.current_gamestate.name)
			console.log("Data for wrong gamestate");
	}

}

module.exports = GameData;
