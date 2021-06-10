// Construct PeerJS connection with Tablet
(function () {
  // Setup connection with server
  function initialize() {
    //Set page index for skipping through pages
    window.tabIndex = 0;
    window.s3done = false;
    //generate random connection ID between 100 000 and 999 999
    let peerId = "";
    let stn = document.getElementById("stand").innerHTML;
    console.log(stn);
    switch (stn) {
      case "0":
        console.log("stn 0");
        peerId = "000000";
        break;
      case "5":
        console.log("stn 5");
        peerId = "555555";
        break;
      case "6":
        console.log("stn 6");
        peerId = "666666";
        break;

      default:
        console.log("default");
        peerId = Math.floor(100000 + Math.random() * 900000).toString(10);
        break;
    }

    let connectionHTML = document.getElementById("ID");
    connectionHTML.innerHTML += peerId;
    // Set up PeerJS connection
    window.peer = new Peer(peerId, {
      host: "tetem-reflectie.nl",
      port: 9000,
      path: "/remote",
      secure: true,
      debug: 2,
      key: "tetem",
      config: {
        iceServers: [
          { urls: "XXX" },
          {
            urls: "XXX",
            credential: "XXX",
            username: "XXX",
          },
        ],
      }, // this is must for keeping the connection open
    });

    window.peer.on("connection", function (c) {
      // Allow only a single connection
      if (window.conn && window.conn.open) {
        //reject if already connected
        c.on("open", function () {
          c.send("Already connected to another client");
          setTimeout(function () {
            c.close();
          }, 500);
        });
        return;
      }
      // if not connected, establish connection
      window.conn = c;
      console.log("Connected to: " + window.conn.peer);
      window.stnd = document.getElementById("stand").innerHTML;
      //quick fix for modal position
      centerModalFix();
      // Setup Tablet
      window.playstatus = false;
      setTimeout(function () {
        signal("Stand" + window.stnd);
        signal("ping");
        signal("Connected");
        signal("ModalMediaControl");
        document.getElementById("connicon").classList = "fa fa-user-o";
        startTimer();
      }, 3500);

      // run ready function
      ready();
    }); // peer.on(connection, ..)

    window.peer.on("open", function (id) {
      console.log("ID: " + window.peer.id);
    }); // peer.on(open, ..)

    window.peer.on("error", function (err) {
      console.log(err);
    }); // peer.on(error)
  } // function initialize

  /**
   * Triggered once a connection has been achieved.
   * Defines callbacks to handle incoming data and connection events.
   */
  function ready() {
    // Decision tree on what to do on a message
    window.conn.on("data", function (data) {
      if (data != "ping") {
        console.log(data);

        window.clearTimeout(timer);
        startTimer();
      }

      //messaging stack
      switch (data) {
        // page control
        case "Cont":
          cont();
          break;
        case "Prev":
          prev();
          break;
        case "Disconnect":
          location.reload();
          break;
        case "CloseAllModals":
          closeAllModals();
          break;

        case "PgDn":
          pagedown();
          break;
        case "PgUp":
          pageup();
          break;

        case "NL":
          console.log("set to NL");
          window.lan = "nl";
          if (document.getElementById("myCssEN")) {
            var element = document.getElementById("myCssEN");
            element.parentNode.removeChild(element);
          }
          if (!document.getElementById("myCssNL")) {
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.id = "myCssNL";
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "/remote/resources/nl.css";
            link.media = "all";
            head.appendChild(link);
          }
          break;

        case "EN":
          console.log("set to EN");
          window.lan = "en";
          if (document.getElementById("myCssNL")) {
            var element = document.getElementById("myCssNL");
            element.parentNode.removeChild(element);
          }
          if (!document.getElementById("myCssEN")) {
            var head = document.getElementsByTagName("head")[0];
            var link = document.createElement("link");
            link.id = "myCssEN";
            link.rel = "stylesheet";
            link.type = "text/css";
            link.href = "/remote/resources/en.css";
            link.media = "all";
            head.appendChild(link);
          }
          break;

        // General media controls
        case "Forwards":
          forwards();
          break;
        case "Backwards":
          backwards();
          break;
        case "Play":
          play();
          break;
        case "Pause":
          pause();
          break;
        case "VolUp":
          volup();
          break;
        case "VolDown":
          voldown();
          break;
        case "Done":
          window.playstatus = false;
          break;

        // For Stand 1
        case "Img1-S1":
          selectImg("1");
          break;
        case "Img2-S1":
          selectImg("2");
          break;
        case "Img3-S1":
          selectImg("3");
          break;

        // For stand 3
        case "AnnS3":
          selectPersonS3("ann");
          break;
        case "JanS3":
          selectPersonS3("jan");
          break;
        case "ScrollUpS3":
          scrollUpS3();
          break;
        case "ScrollDownS3":
          scrollDownS3();
          break;

        // For Stand 4
        case "Digit-S4":
          initDigit();
          break;
        case "Digit-S4-0":
          digitInput(0);
          break;
        case "Digit-S4-1":
          digitInput(1);
          break;
        case "Digit-S4-2":
          digitInput(2);
          break;
        case "Digit-S4-3":
          digitInput(3);
          break;
        case "Digit-S4-4":
          digitInput(4);
          break;
        case "Digit-S4-5":
          digitInput(5);
          break;
        case "Digit-S4-6":
          digitInput(6);
          break;
        case "Digit-S4-7":
          digitInput(7);
          break;
        case "Digit-S4-8":
          digitInput(8);
          break;
        case "Digit-S4-9":
          digitInput(9);
          break;

        case "Tweets-S4":
          initTweets();
          break;
        case "Tweets-S4-yes":
          tweetInput(true);
          break;
        case "Tweets-S4-no":
          tweetInput(false);
          break;

        case "Emotion-S4":
          initEmotions();
          break;
        case "Emotion-S4-yes":
          refEmotions();
          break;
        case "Emotion-S4-no":
          refEmotions();
          break;

        // Stand 7
        case "Eco-S7-Reset":
          ecoReset();
          break;
        case "Eco-S7-ResetwForest":
          ecoResetwForest();
          break;
        case "Eco-S7-Toggle":
          ecoToggle();
          break;
        case "Eco-S7-1Y":
          eco1Y();
          break;
        case "Eco-S7-5Y":
          eco5Y();
          break;
        // misc.
        case "ping":
          setTimeout(signal("ping"), 500);
          break;
        default:
          // Go to stand page
          if (data.includes("StandSelect")) {
            let standNum = data.split("-");
            window.location.href = "/offline/stand" + standNum[1];
            break;
          }
          if (data.includes("StandReflect")) {
            let standNum = data.split("-");
            loadQuestions(standNum[1]);
            break;
          }
          // Pass list of videos to select
          if (data.includes("VideoSelect")) {
            let videoList = data.split("-");
            videoSelect(videoList);
            break;
          }
          if (data.includes("S3NUMS")) {
            let nums = data.split("_");
            displayResultsS3(nums);
            break;
          }
          // Error logging
          console.log(" --> Wrong keyword: " + data);
          break;
      }
    });
    window.peer.on("disconnected", function () {
      console.log("Connection lost. refreshing page");
      setTimeout(function () {
        location.reload();
      }, 500);
    });

    window.conn.on("close", function () {
      window.conn = null;
      console.log("Connection destroyed");
      location.reload();
    });
  }

  function signal(sigName) {
    if (window.conn && window.conn.open) {
      window.conn.send(sigName);
      if (sigName != "ping") {
        console.log(sigName + " signal sent");
      }
    } else {
      console.log("Connection is closed - Signal(" + sigName + ")");
      location.reload();
    }
  }

  function destroyControls() {
    console.log("Destroying Controls");
    document.getElementById("questionbox").innerHTML = "";
  }

  function startTimer() {
    console.log("Starting timer");
    window.timer = setTimeout(function () {
      if (window.playstatus) {
        window.clearTimeout(window.timer);
        startTimer();
      } else {
        console.log("disconnecting on timeout");
        signal("Disconnect");
        location.reload();
      }
    }, 120000);
  }

  function spawn() {
    //Destroy old buttons
    signal("DestroyControls");
    // Button Spawn depending on tab context
    console.log(
      "Stand: " + window.stnd.toString() + " Tab: " + window.tabIndex
    );
    switch (window.stnd) {
      case "11": // Stand 1
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("StandSelect");
            // signal("PageControl");
            break;
          case 2:
            // signal("PageControl");
            break;
          case 3:
            // signal("PageControl");
            break;
          case 4:
            // signal("initAccess");
            break;
        }
        break;
      case "0": // Stand 1
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
              signal("S0P0");
            }
            break;
          case 1:
            signal("PageControl");
            signal("S0P1");
            break;
          case 2:
            signal("PageControl");
            signal("S0P2");
            break;
          case 3:
            signal("PageControl");
            signal("S0P3");
            break;
          case 4:
            signal("initSuccesScreen");
            location.reload();
            break;
        }
        break;
      case "1": // Stand 1
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            break;
          case 2:
            signal("PageControl");
            signal("ImageSelectControl");
            break;
          case 3:
            signal("initAccess");
            break;
          case 4:
            signal("initQuestions");
            break;
        }
        break;
      case "2": // Stand 2
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            break;
          case 2:
            signal("PageControl");
            break;
          case 3:
            signal("PageControl");
            sendVideoSelectOptions();
            break;
          case 4:
            signal("initQuestions");
            break;
        }
        break;
      case "3": // Stand 3
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            break;
          case 2:
            signal("PageControl");
            break;
          case 3:
            // signal("PageControl");
            if (window.s3done) {
              signal("PageControl");
            } else {
              signal("iFrameSelectS3");
            }

            break;
          case 4:
            signal("initQuestions");
            break;
        }
        break;
      case "4": // Stand 4
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            break;
          case 2:
            signal("PageControl");
            break;
          case 3:
            signal("PageControl");
            signal("ModalSelectS4");
            break;
          case 4:
            signal("initQuestions");
            break;
        }
        break;
      case "5": // Stand 5
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            signal("S5P1");
            break;
          case 2:
            signal("PageControl");
            signal("S5P2");
            break;
          case 3:
            signal("initSuccesScreen");
            location.reload();
            break;
          case 4:
            signal("initSuccesScreen");
            break;
        }
        break;
      case "6": // Stand 2
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            signal("S6P1");
            break;
          case 2:
            signal("initSuccesScreen");
            signal("PageControl");
            signal("S6P2");
            location.reload();
            break;
          case 3:
            signal("PageControl");
            signal("S6P3");
            break;
          case 4:
            signal("initSuccesScreen");
            break;
        }
        break;
      case "7": // Stand 2
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            break;
          case 2:
            signal("PageControl");
            break;
          case 3:
            signal("PageControl");
            signal("EcoControl");
            break;
          case 4:
            signal("initQuestions");
            break;
        }
        break;
      case "8": // Stand 3
        switch (window.tabIndex) {
          case 0:
            if (window.conn && window.conn.open) {
              signal("Connected");
            }
            break;
          case 1:
            signal("PageControl");
            break;
          case 2:
            signal("PageControl");
            signal("MediaControl");
            break;
          case 3:
            signal("PageControl");
            signal("ReflectionControl");
            break;
          case 4:
            signal("initQuestions");
            break;
        }
        break;
    }
  }

  // Functions to run on command
  function loadQuestions(Stand) {
    // Destroy Original Buttons
    destroyControls();

    document.getElementById("reflectiontxtnl").innerHTML =
      "De antwoorden op vragen bij opstelling " + Stand;

    document.getElementById("reflectiontxten").innerHTML =
      "The answers to the questions at stand  " + Stand;

    //Get the questions from the database
    let URL = "";
    if (window.lan == "nl") {
      URL = "https://tetem-reflectie.nl:3000/questions/" + Stand;
    } else {
      URL = "https://tetem-reflectie.nl:3000/questionsen/" + Stand;
    }
    // Setup HttpGet object
    var HttpClient1 = function () {
      this.get = function (aUrl, aCallback) {
        console.log(aUrl);
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
          if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
            aCallback(anHttpRequest.responseText);
        };

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
      };
    };
    // Send request
    console.log("Send Post");
    var client = new HttpClient1();
    client.get(URL, function (response) {
      let questions = JSON.parse(response);
      window.questions = questions;
      console.log(questions);
      console.log("Request done");
      questions.sort(function (a, b) {
        return a.order_num - b.order_num;
      });
      console.log(questions);

      for (let index = 0; index < questions.length; index++) {
        const question = questions[index];
        console.log(question.q_type);
        switch (question.q_type) {
          case "OPEN":
            generateOpenQ(question);
            break;
          case "INPUT":
            generateInputQ(question);
            break;
          case "TEXT":
            generateTextQ(question);
            break;
          case "MTPC":
            generateMTCPQ(question);
            break;
          case "MTPC+":
            generateMTCPlusQ(question);
            break;
          default:
            console.log("Question Type Not Recognized -- " + question.q_type);
        }
      }
    });

    function generateInputQ(question) {
      // generate open question
      let questionDiv = document.createElement("DIV");
      questionDiv.setAttribute("data-question_id", question.question_id);
      questionDiv.setAttribute("data-question_type", question.q_type);
      questionDiv.classList = "col";
      questionDiv.innerHTML =
        "<div class='card h-100'> \
            <div class='card-body'> \
              <h4 class='card-title'>" +
        question.question_txt +
        "</h4> \
            </div> \
            <div class='card-footer'> \
              <div class='form-group'> \
                Nog geen verwerkte antwoorden beschikbaar \
              </div> \
            </div> \
          </div> <br>";
      document.getElementById("questionbox").appendChild(questionDiv);
    }

    function generateOpenQ(question) {
      // generate open question
      let questionDiv = document.createElement("DIV");
      questionDiv.setAttribute("data-question_id", question.question_id);
      questionDiv.setAttribute("data-question_type", question.q_type);
      questionDiv.classList = "col";
      questionDiv.innerHTML =
        "<div class='card h-100'> \
            <div class='card-body'> \
              <h4 class='card-title'>" +
        question.question_txt +
        "</h4> \
            </div> \
            <div class='card-footer'> \
              <div class='form-group'> \
                Nog geen verwerkte antwoorden beschikbaar \
              </div> \
            </div> \
          </div> <br>";
      document.getElementById("questionbox").appendChild(questionDiv);
    }

    function generateTextQ(question) {
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
      }
      // generate open question
      let questionDiv = document.createElement("DIV");
      questionDiv.setAttribute("data-question_id", question.question_id);
      questionDiv.setAttribute("data-question_type", question.q_type);
      questionDiv.classList = "col";
      questionDiv.innerHTML =
        "<div class='card h-100'> \
            <div class='card-body'> \
              <h4 class='card-title'>" +
        question.question_txt +
        "</h4> \
            </div> \
          </div> <br>";
      document.getElementById("questionbox").appendChild(questionDiv);
    }

    function generateMTCPQ(question) {
      let ran1 = Math.floor(Math.random() * Math.floor(50));
      let ran2 = Math.floor(Math.random() * Math.floor(50));
      let ran3 = 100 - ran1 - ran2;
      // Generate standard no yes NA question
      let questionDiv = document.createElement("DIV");
      questionDiv.setAttribute("data-question_id", question.question_id);
      questionDiv.setAttribute("data-question_type", question.q_type);
      questionDiv.innerHTML =
        "<div class='card h-100'> \
            <div class='card-body'> \
              <h4 class='card-title'>" +
        question.question_txt +
        "</h4> \
            </div> \
            <div class='card-footer'> \
              <div class='form-group'> \
              <form name = 'radio" +
        question.question_id +
        "'> \
              <label class='radio-inline'> \
                Ja : " +
        ran1 +
        "%\
              </label> \
              <label class='radio-inline'> \
                Nee : " +
        ran2 +
        "%\
              </label> \
              <label class='radio-inline'> \
                Weet ik niet : " +
        ran3 +
        "%\
              </label> \
            </form> \
              </div> \
            </div> \
          </div> <br>";
      document.getElementById("questionbox").appendChild(questionDiv);
    }

    function generateMTCPlusQ(question) {
      let ran1 = Math.floor(Math.random() * Math.floor(50));
      let ran2 = Math.floor(Math.random() * Math.floor(50));
      let ran3 = 100 - ran1 - ran2;
      // Generate standard no yes NA question
      let questionDiv = document.createElement("DIV");
      questionDiv.setAttribute("data-question_id", question.question_id);
      questionDiv.setAttribute("data-question_type", question.q_type);
      questionDiv.innerHTML =
        "<div class='card h-100'> \
            <div class='card-body'> \
              <h4 class='card-title'>" +
        question.question_txt +
        "</h4> \
            </div> \
            <div class='card-footer'> \
              <div class='form-group'> \
              <form name = 'radio" +
        question.question_id +
        "'> <label class='radio-inline'>" +
        question.misc1 +
        " : " +
        ran1 +
        "% \
              </label> \
              <label class='radio-inline'>" +
        question.misc2 +
        " : " +
        ran2 +
        "% \
              </label> \
              <label class='radio-inline'>" +
        question.misc3 +
        " : " +
        ran3 +
        "% \
              </label> \
            </form> \
              </div> \
            </div> \
          </div> <br>";
      document.getElementById("questionbox").appendChild(questionDiv);
    }
  }

  function pageup() {
    window.scrollTo(0, window.scrollY - window.innerHeight * 0.9);
  }

  function pagedown() {
    window.scrollTo(0, window.scrollY + window.innerHeight * 0.9);
  }

  function scrollUpS3() {
    try {
      let frame1 = document.getElementById("annframe");
      let frame2 = document.getElementById("janframe");
      frame1.contentWindow.document
        .elementFromPoint(490, 134)
        .scrollBy(0, -400);
      frame2.contentWindow.document
        .elementFromPoint(490, 134)
        .scrollBy(0, -400);
    } catch (error) {}
  }

  function scrollDownS3() {
    try {
      let frame1 = document.getElementById("annframe");
      let frame2 = document.getElementById("janframe");
      frame1.contentWindow.document.elementFromPoint(490, 134).scrollBy(0, 400);
      frame2.contentWindow.document.elementFromPoint(490, 134).scrollBy(0, 400);
    } catch (error) {}
  }
  //page controls
  function cont() {
    // increase tab index
    window.tabIndex += 1;
    // find tab button
    tablinks = document.getElementsByClassName("tablink");
    tablinks[window.tabIndex].click();
    // software click that tab button to go to that page
    spawn();
  }

  function prev() {
    // increase tab index
    window.tabIndex -= 1;
    // find tab button
    tablinks = document.getElementsByClassName("tablink");
    tablinks[window.tabIndex].click();
    // software click that tab button to go to that page
    spawn();
  }

  function centerModalFix() {
    let modals = document.getElementsByClassName("modal-dialog");
    for (let i = 0; i < modals.length; i++) {
      const element = modals[i];
      element.style.marginTop = "300px";
    }
  }

  function closeAllModals() {
    let modals = document.getElementsByClassName("modal");
    for (let i = 0; i < modals.length; i++) {
      const element = modals[i];
      element.style.display = "none";
      element.style.opacity = 0;
    }
    // Return to modal select screen of stand
    signal("DestroyControls");
    signal("ModalSelectS" + window.stnd);
    signal("PageControl");
  }

  // Video select screen
  function sendVideoSelectOptions() {
    let videoList = document.getElementsByClassName("videoList");
    let videoString = "VideoSelect";
    for (let index = 0; index < videoList.length; index++) {
      const videoID = videoList[index];
      videoString += "-";
      videoString += videoID.innerHTML;
    }
    signal(videoString);
  }

  function videoSelect(videoList) {
    let videoId = videoList[1];
    window.player.loadVideoById(videoId);
    window.playstatus = true;
  }
  // media controls
  function backwards() {
    let time = window.player.getCurrentTime();
    if (time < 30) {
      window.player.seekTo(0);
    } else {
      window.player.seekTo(time - 30);
    }
  }

  function forwards() {
    let time = window.player.getCurrentTime();
    if (time > window.player.getDuration() - 10) {
      window.player.seekTo(window.player.getDuration() - 1);
    } else {
      window.player.seekTo(time + 10);
    }
  }

  function play() {
    console.log("play me");
    window.player.playVideo();
    window.playstatus = true;
  }

  function pause() {
    console.log("pause me");
    window.player.pauseVideo();
    window.playstatus = false;
  }

  function volup() {
    console.log("pause me");
    let vol = window.player.getVolume();
    if (vol < 95) {
      window.player.setVolume(vol + 5);
    }
  }

  function voldown() {
    console.log("pause me");
    let vol = window.player.getVolume();
    if (vol > 5) {
      window.player.setVolume(vol - 5);
    }
  }

  // Stand 1
  function selectImg(img) {
    let imgSelect = document.getElementById("img" + img);
    imgSelect.click();
    imgSelect.focus();
  }

  // Stand 3

  function selectPersonS3(name) {
    switch (name) {
      case "ann":
        console.log("Show ann");
        document.getElementById("ann").hidden = false;
        document.getElementById("jan").hidden = true;
        break;
      case "jan":
        console.log("Show jan");
        document.getElementById("jan").hidden = false;
        document.getElementById("ann").hidden = true;
        break;
    }
    signal("S3Select");
  }

  function displayResultsS3(nums) {
    numsjan = ["48", "27", "56", "41", "51"];
    numsann = ["55", "47", "63", "62", "51"];
    // (1) Extraversion, (2) Agreeableness, (3) Conscientiousness, (4) Emotional Stability, or (5) Intellect/Imagination)

    let ainum = [];
    if (true) {
      ainum = numsann;
    } else {
      ainum = numsjan;
    }
    document.getElementById("jan").hidden = true;
    document.getElementById("ann").hidden = true;

    signal("DestroyControls");
    signal("PageControl");

    window.s3done = true;
    console.log(ainum);
    let newdiv = document.createElement("DIV");
    newdiv.id = "sliderdiv";
    newdiv.innerHTML = `<h3>Extraversion</h3> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          ainum[0]
        }' class='slider' id='myRange1'> \
      </div> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          parseInt(nums[1]) + 50
        }' class='slider' id='myRange2'> \
      </div> \
      <h3>Agreeableness</h3> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          ainum[1]
        }' class='slider' id='myRange3'> \
      </div> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          parseInt(nums[2]) + 50
        }' class='slider' id='myRange4'> \
      </div> \
      <h3>Conscientiousness</h3> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          ainum[2]
        }' class='slider' id='myRange5'> \
      </div> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          parseInt(nums[3]) + 50
        }' class='slider' id='myRange6'> \
      </div> \
      <h3>Emotional Stability</h3> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          ainum[3]
        }' class='slider' id='myRange7'> \
      </div> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          parseInt(nums[4]) + 50
        }' class='slider' id='myRange8'> \
      </div> \
      <h3>Intellect/Imagination</h3> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          ainum[4]
        }' class='slider' id='myRange9'> \
      </div> \
      <div class='slidecontainer'> \
        <input type='range' min= '1' max='100' value='${
          parseInt(nums[5]) + 50
        }' class='slider' id='myRange0'> \
      </div> `;
    document.getElementById("p4").appendChild(newdiv);

    document.getElementById("s3txtnl").innerText =
      "Zie hier jouw resultaten VS de AI";
    document.getElementById("s3txten").innerText =
      "Here you can see your results compared to the AI";
  }
  //Stand 4
  function initDigit() {
    // Open Controls for window
    signal("DestroyControls");
    signal("Digit-S4");
    // Draw First Number
    let redrawBtn = document.getElementById("redraw");
    redrawBtn.click();
    // Set number count
    window.digit = 0;
    window.digitLimit = 30;
    //  Draw status text to screen
    document.getElementById("digitModalTitle").innerHTML =
      window.digit.toString() + "/" + window.digitLimit.toString();
    // Open modal manually
    let modal = document.getElementById("digitModal");
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.style.display = "block";
    setTimeout(() => {
      modal.style.opacity = 1;
    }); //FOR TRANSITION
  }

  function digitInput(input) {
    // Draw new number to screen
    let redrawBtn = document.getElementById("redraw");
    redrawBtn.click();
    // Echo choice
    console.log("You chose " + input.toString());
    // Update click count
    window.digit++;
    document.getElementById("digitModalTitle").innerHTML =
      "Welk nummer zie je?  " +
      window.digit.toString() +
      "/" +
      window.digitLimit.toString();
    if (window.digit == window.digitLimit) {
      closeAllModals();
      window.digit = 0;
    }
  }

  function initTweets() {
    // Open Controls for window
    signal("Tweet-S4");
    // Open modal
    let modal = document.getElementById("tweetModal");
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.style.display = "block";
    setTimeout(() => {
      modal.style.opacity = 1;
    }); //FOR TRANSITION
  }

  function refEmotions() {
    let videoList = [
      "/Actor_01/02-02-02-02-01-02-01.mp4",
      "/Actor_01/02-02-06-02-01-02-01.mp4",
      ];
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
    let randnum = getRandomInt(350);
    let video = videoList[randnum];
    console.log(video);
    videoObject = document.getElementById("videodiv");
    videoObject.src = "../resources/ravdess/" + video;

    setTimeout(() => {
      console.log("Play");
      videoObject.play();
    }, 500);
  }

  function initEmotions() {
    // Open Controls for window
    signal("Emotion-S4");
    // Open modal
    let modal = document.getElementById("emotionModal");
    modal.style.backgroundColor = "rgba(0,0,0,0.5)";
    modal.style.display = "block";
    setTimeout(() => {
      modal.style.opacity = 1;
    }); //FOR TRANSITION


    // This is a bit hacky but needed a quick fix. Shortened here
    let videoList = [
      "/Actor_01/02-02-02-02-01-02-01.mp4",
      "/Actor_01/02-02-06-02-01-02-01.mp4",
      ];

    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }
    let randnum = getRandomInt(350);
    let video = videoList[randnum];
    console.log(video);
    videoObject = document.getElementById("videodiv");
    videoObject.src = "../resources/ravdess/" + video;

    setTimeout(() => {
      console.log("Play");
      videoObject.play();
    }, 500);
  }

  function tweetInput(answer) {
    document.getElementById("iframeid").src = document.getElementById(
      "iframeid"
    ).src;
  }

  // Stand 7
  function ecoReset() {
    // make sure iframe is loaded
    var checkExist1 = setInterval(function () {
      window.simYear = 2020;
      let iframe = document.getElementById("genframe").contentWindow;
      let spinner = iframe.document.getElementById("loading-overlay");
      if (spinner.style.display == "none") {
        clearInterval(checkExist1);
        let checkboxDiv = iframe.document.getElementById("netlogo-switch-13");
        if (checkboxDiv.children[0].checked) {
          checkboxDiv.click();
        }

        let resetBtn = iframe.document.getElementById("netlogo-button-1");
        console.log(resetBtn);
        resetBtn.click();

        let TitleBox = iframe.document.getElementById("netlogo-textBox-17");
        TitleBox.innerHTML = "Jaar " + window.simYear.toString();
      }
    }, 500); // check every 100ms
  }

  function ecoResetwForest() {
    // make sure iframe is loaded
    var checkExist1 = setInterval(function () {
      window.simYear = 2020;
      let iframe = document.getElementById("genframe").contentWindow;
      let spinner = iframe.document.getElementById("loading-overlay");
      if (spinner.style.display == "none") {
        clearInterval(checkExist1);
        let checkboxDiv = iframe.document.getElementById("netlogo-switch-13");
        if (!checkboxDiv.children[0].checked) {
          checkboxDiv.children[0].click();
        }

        let resetBtn = iframe.document.getElementById("netlogo-button-1");
        console.log(resetBtn);
        resetBtn.click();

        let TitleBox = iframe.document.getElementById("netlogo-textBox-17");
        TitleBox.innerHTML = "Jaar " + window.simYear.toString();
      }
    }, 500); // check every 100ms
  }

  function ecoToggle() {
    // make sure iframe is loaded
    var checkExist1 = setInterval(function () {
      let iframe = document.getElementById("genframe").contentWindow;
      let spinner = iframe.document.getElementById("loading-overlay");
      if (spinner.style.display == "none") {
        clearInterval(checkExist1);
        let Btn = iframe.document.getElementById("netlogo-button-11");
        console.log(Btn);
        Btn.click();
      }
    }, 500); // check every 100ms
  }

  function eco1Y() {
    window.simYear += 1;
    // make sure iframe is loaded
    var checkExist1 = setInterval(function () {
      let iframe = document.getElementById("genframe").contentWindow;
      let spinner = iframe.document.getElementById("loading-overlay");
      if (spinner.style.display == "none") {
        clearInterval(checkExist1);
        let Btn = iframe.document.getElementById("netlogo-button-2");
        console.log(Btn);
        Btn.click();
        let TitleBox = iframe.document.getElementById("netlogo-textBox-17");
        TitleBox.innerHTML = "Jaar " + window.simYear.toString();
      }
    }, 500); // check every 100ms
  }

  function eco5Y() {
    window.simYear += 5;
    // make sure iframe is loaded
    var checkExist1 = setInterval(function () {
      let iframe = document.getElementById("genframe").contentWindow;
      let spinner = iframe.document.getElementById("loading-overlay");
      if (spinner.style.display == "none") {
        clearInterval(checkExist1);
        let Btn = iframe.document.getElementById("netlogo-button-57");
        console.log(Btn);
        Btn.click();

        let TitleBox = iframe.document.getElementById("netlogo-textBox-17");
        TitleBox.innerHTML = "Jaar " + window.simYear.toString();
      }
    }, 500); // check every 100ms
  }
  // start PeerJS; Entry Point
  initialize();
})(); // close (function() {
