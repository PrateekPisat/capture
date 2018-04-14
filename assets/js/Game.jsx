import React from 'react';
import ReactDOM from 'react-dom';import socket from "./socket";

export default class Game extends React.Component {
  constructor(props) {
    super(props);
    this.channel = props.channel;
    //i can't tell what info is being passes around at the moment so i'm just gonna make this based off of
    //what i imagine the data should look like
    this.state = ({
      pId: 0,
      location: { lat: 0, long: 0 }, //send this and currentPlayerId to server to calculate proximity stuff 
      players: [], //data structure to follow.
      buildings: [], //also to follow
      score: {
        team1: 0,
        team2: 0,
      },
      chat: [], //to follow
 	  });
    this.channel.join()
                .receive("ok", this.joinGame.bind(this))
                .receive("error", resp => { console.log("couldnt join") }) //add an error alert function that takes in all errors and alerts with the reason
    this.channel.on("update", this.update.bind(this));
  }

  joinGame(resp) {
    //just join the game as the right player on the right team
  }

  update(game) {
    const updated = game.game;
    this.setState(updated);
  }

  getUserLocation() {
    if(navigator.geolocation) {
      const coords = navigator.geolocation.getCurrentPosition()
      this.setState({ location: { lat: coords.latitude, long: coord.longitude }});
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.getUserLocation, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  fakeState() {
    this.state.currentPlayerId = 0;
    this.location = { lat: 0, long: 0 },
    this.state.players = [
      0: {
        id: 0,
        userName: 'ryan',
        alive: true,
        team: 1,
        location: { lat: 0, long: 0 },
        isCapturing: false,
        canRevive: false,
      },
      1: {
        id: 2,
        userName: 'julius',
        alive: true,
        team: 1,
        location: { lat: 0, long: 0 },
        isCapturing: false,
        canRevive: false,
      },
      2: {
        id: 3,
        userName: 'spook',
        alive: true,
        team: 1,
        location: { lat: 0, long: 0 },
        isCapturing: false,
        canRevive: false,
      },
      3: {
        id: 0,
        userName: 'THE',
        alive: true,
        team: 2,
        location: { lat: 0, long: 0 },
        isCapturing: false,
        canRevive: false,
      },
      4: {
        id: 2,
        userName: 'KING',
        alive: true,
        team: 2,
        location: { lat: 0, long: 0 },
        isCapturing: false,
        canRevive: false,
      },
      5: {
        id: 3,
        userName: 'INDANAWF ',
        alive: true,
        team: 2,
        location: { lat: 0, long: 0 },
        isCapturing: false,
        canRevive: false,
      },
    ];
    this.state.snell = {
      location: { lat: 0, long: 0 }, //im keeping this as a seperate part of the state because of different interactions
      // the location should be saved in the server and fetched from there regardless
    }
    this.state.buildings = [ //should come from server
      0: {
        id: 0,
        name: 'CCIS',
        location: { lat: 0, long: 0 }, //location of buildings is for rendering purposes only.
        canInteract: false, //returned true by server if player is nearby enough to capture
        isBeingCaptured: false, //returned true if another player is currently capturing it
        owner: 1, //which team currently owns it. there's also null. maybe -1 instead
        currentlyCapturingPlayer: null, //if a player is capturing the building at that moment, this is their player id
        //^that'll be used for KOing
      },
      1: {
        id: 0,
        name: 'COE',
        location: { lat: 0, long: 0 },
        canInteract: false,
        isBeingCaptured: false,
        owner: null,
        currentlyCapturingPlayer: null,
      },
      2: {
        id: 0,
        name: 'COS',
        location: { lat: 0, long: 0 },
        canInteract: false,
        isBeingCaptured: false,
        owner: null,
        currentlyCapturingPlayer: null,
      },
      3: {
        id: 0,
        name: 'IV',
        location: { lat: 0, long: 0 },
        canInteract: false,
        isBeingCaptured: false,
        owner: null,
        currentlyCapturingPlayer: null,
      }
    ]
    this.state.score = { player: 3, enemy: 1 },
    this.state.chat = [
      {pId: 0, chat: 'gl hf'},
      {pId: 1, chat: 'HAHA GG EZ LOOOOOL'}
    ]
  }

  captureBuilding(building) {
    this.channel.push("capture", { buildingId: building.id }) // can also send the whole building. again, this is a lot of assuming on my part
      .receive("ok", this.update.bind(this))
      .receive("error", resp => { console.log("cannot capture this building") })
  }

  kOPlayer(enemy) {
    this.channel.push("ko", { player1: this.pId, enemy: enemy })
      .receive("ok", this.update.bind(this))
      .receive("error", resp => { console.log("cannot ko this enemy") })
  }

  revive() {
    this.channel.push("revive", { player: this.pId })
      .receive("ok", this.update.bind(this))
      .receive("error", resp => { console.log("cannot revive right now") })
  }

  //so far this just renders the map and throws everything on top of it. itll be nice and clean
  //with that said, if that doesnt work or just looks bad, ill design this with them being seperate
  renderMap() {
    /*
    return (
      //this is meaningless rn but im basing it off of https://github.com/tomchentw/react-google-maps which we dont have yet
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 42.3398, lng: 71.0892 }}
      >
        <div id='chat-button'>
          { this.renderGameButton() }
          { this.renderChat() }
        </div>
        { this.renderScoreAndPlayers() }
      </GoogleMap>
    )
    */
    //until i have a Map ill just...skip it
    <div>
      <div id='chat-button'>
        { this.renderGameButton() }
        { this.renderChat() }
      </div>
      { this.renderScoreAndPlayers() }
    </div>
  }

  renderGameButton() {
    const { buildings, players, pId, canRevive } = this.state;
    const player = players[pId];
    const pTeam = player['team'];

    //default button parameters
    let cFunction = undefined, // the function to pass down
      clickable = false, // whether a user can press it or not
      purpose = 'Capture' // for the style/labeling. default is capture, unclickable
      arg = undefined; // args to pass to the function

    if(player.alive) {
      for(build in buildings) {
        const b = buildings[build];
        if(b.canInteract) { //canInteract indicates whether the current player can interact with it. i dont know if this way is too much work/redundant
          if(b.owner != pTeam) {
            cFunction = this.captureBuilding;
            clickable = true;
            action = 'Capture';
            arg = b;
          }
          else if(b.owner == pTeam && b.isBeingCaptured) { // if you own the building but it's being captured
            cFunction = this.kOPlayer;
            clickable = true;
            purpose = 'KO';
            arg = b.currentlyCapturingPlayer; // <- an ID
          }
        }
      }
    }
    else { //if player is knocked out, they gotta revive
      //this is the same thing as b.canInteract if b was snell. this makes me question my decision making, because
      //it's basically the same quality but used/referenced two different ways
      purpose = 'Revive'
      cFunction = this.revive;
      clickable = canRevive;
    }

    return (
      <GameButton
        arg={arg}
        clickable={clickable}
        clickHandler={cFunction}
        purpose={purpose}
      />
    );
  }

  renderChat() {
    const { chat } = this.state;
    return (
      //im seriously just guessing at the style here. notice a theme?
      <div id='chat' style={{height: '10vh', overflow: 'auto'}}>
        {chat.map(function(line, index) { //for what it's worth, these variables dont matter
            return (
              <p><span id='chat-id'>{ line.pId } :</span> { line.chat }</p>
            );
          }, this)};
      </div>
    )
  }

  renderScoreAndPlayers() {
    const { score, players } = this.props;
    let team1, team2 = [];
    for(p in players) {
      if(players[p]['team'] == 1) {
        team1.push(players[p]);
      }
      else {
        team2.push(players[p]);
      }
    }
    return(
      <div id='score'>
      
      </div>
    )
  }

  render() {
    this.fakeState()
    //none of this is responsive yet
    //i mean, kinda funny that i say that since im not even gonna bother making this working enough to run tonight
    //but, still holds true. TODO: make responsive.
    return (
      <div id='container'>
        <div id='map'>
          { this.renderMap() }
        </div>
      </div>
    );
  }
}

