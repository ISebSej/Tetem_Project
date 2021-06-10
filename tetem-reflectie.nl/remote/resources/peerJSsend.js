(function () {
  //Set page index for skipping through pages

  var lastPeerId = null;
  window.peer = null; // own peer object
  window.conn = null;

  window.select = false;

  var connectButton = document.getElementById("submitbutton");
  var playButton = document.getElementById("play");

  function initialize() {
    console.log("init peer");
    window.peer = new Peer(
      "tetem-tablet-" +
        Math.floor(100000 + Math.random() * 900000).toString(10),
      {
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
      }
    );

    window.peer.on("connection", function (c) {
      // Disallow incoming connections
      c.on("open", function () {
        c.send("Sender does not accept incoming connections");
        setTimeout(function () {
          c.close();
        }, 500);
      });
    }); // peer.on(connection, ..)

    window.peer.on("open", function (id) {
      console.log("ID: " + window.peer.id);
    }); // peer.on(open, ..)

    window.peer.on("error", function (err) {
      console.log(err.type);
      console.log(err);
      if (err.type == "peer-unavailable") {
        console.log("Peer unavailable - 54");
        location.reload();
      }
    }); // peer.on(error)
  } // function initialize

  function signal(sigName) {
    if (window.conn && window.conn.open) {
      window.conn.send(sigName);
      if (sigName != "ping") {
        console.log(sigName + " signal sent");
      }
    } else {
      console.log("Connection is closed");
      location.reload();
    }
  }

  function join() {
    // Close old connection
    if (window.conn) {
      window.conn.close();
    }
    // Read ID from form and connect to Stand
    console.log(window.peer);
    let nodes = document.querySelectorAll("input[type=number]");
    let connId = "";
    for (var i = 0; i < nodes.length; i++) {
      connId += nodes[i].value.toString(10);
    }
    console.log(connId);

    // Create connection to destination peer specified in the input field
    window.conn = window.peer.connect(connId);

    window.conn.on("open", function () {
      console.log("Connected to: " + window.conn.peer);
    });

    // Handle incoming data (messages only since this is the signal sender)
    window.conn.on("data", function (data) {
      // Setup command received from stand. Relocate to appropriate branch in the setup function
      if (data != "ping") {
        console.log(data);
      }

      //messaging stack
      switch (data) {
        // Button Spawning
        case "Connected":
          initPageControl();
          break;
        case "PageControl":
          fullPageControl();
          break;
        case "MediaControl":
          initMediaControls();
          break;
        case "ModalMediaControl":
          initModalMediaControls();
          break;
        case "DestroyControls":
          destroyControls();
          break;
        case "initQuestions":
          initQuestions();
          break;
        case "initAccess":
          initAccess();
          break;
        case "StandSelect":
          StandSelect();
          break;
        case "initSuccesScreen":
          initSuccessScreen();
          break;

        // stand 0
        case "S0P1":
          S0P1();
          break;
        case "S0P2":
          S0P2();
          break;
        case "S0P3":
          S0P3();
          break;
        // stand 0
        case "S5P1":
          S5P1();
          break;
        case "S5P2":
          S5P2();
          break;
        case "S5P3":
          S5P3();
          break;
        // stand 0
        case "S6P1":
          S6P1();
          break;
        case "S6P2":
          S6P2();
          break;
        case "S6P3":
          S6P3();
          break;

        // Stand 1
        case "ImageSelectControl":
          initImageSelectControlS1();
          break;
        case "Done":
          signal("Done");
          break;

        // stand 3
        case "iFrameSelectS3":
          initStand3();
          break;
        case "S3Select":
          window.select = true;
          break;

        // Stand 4
        case "ModalSelectS4":
          initModalSelectS4();
          break;
        case "Digit-S4":
          initDigitControls();
          break;
        case "Tweet-S4":
          initTweetControls();
          break;
        case "Emotion-S4":
          initEmotionControls();
          break;

        // Stand 7
        case "EcoControl":
          initEcoControls();
          break;

        case "ReflectionControl":
          initReflection();
          break;

        // Stand Info for tablet
        case "Stand0":
          Setup("0");
          break;
        case "Stand1":
          Setup("1");
          break;
        case "Stand2":
          Setup("2");
          break;
        case "Stand3":
          Setup("3");
          break;
        case "Stand4":
          Setup("4");
          break;
        case "Stand5":
          Setup("5");
          break;
        case "Stand6":
          Setup("6");
          break;
        case "Stand7":
          Setup("7");
          break;
        case "Stand8":
          Setup("8");
          break;
        case "Stand11":
          Setup("11");
          break;
        // Misc
        case "ping":
          setTimeout(signal("ping"), 500);
          break;
        default:
          // Pass list of videos to select
          if (data.includes("VideoSelect")) {
            let videoList = data.split("-");
            initVideoSelectControl(videoList);
            break;
          }
          // Error logging
          console.log(" --> Wrong keyword: " + data);
          break;
      }
    });

    window.conn.on("close", function () {
      window.conn = null;
      console.log("Connection destroyed");
      if (!window.questionState) {
        console.log("Connection destroyed?");
        location.reload();
      } else {
        console.log("Not restarting - In question state");
      }
    });

    function Setup(stand) {
      if (window.lan == "nl") {
        signal("NL");
      } else {
        signal("EN");
      }
      // Set questionState to False to allow restart on disconnect
      window.questionState = false;
      // Function to set up a specific stand after connection
      //localStorage.setItem('Stand', stand);
      document.getElementById("connicon").classList = "fa fa-user-o";
      console.log(stand);
      setTimeout(function () {
        document.getElementById("loader").hidden = true;
        console.log(document.getElementsByClassName("inpt"));
        for (let i = 0; i < 6; i++) {
          document.getElementsByClassName("inpt")[i].style.marginTop = "-250px";
        }
        document.getElementById("allbuttons").style.marginTop = "+250px";
      }, 500);
      window.standNum = stand;
      // Fix for modal allignment
      centerModalFix();
    } //setup(){}

    function StandSelect() {
      var newbtn = document.createElement("DIV");
      newbtn.id = "AllButtons";
      newbtn.innerHTML =
        "<div class='btn-group' role='group' aria-label='Basic example'> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>0</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>1</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>2</button> \
        </div> \
        <br> \
        <div class='btn-group' role='group' aria-label='Basic example'> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>3</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>4</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>5</button> \
        </div> \
        <br> \
        <div class='btn-group' role='group' aria-label='Basic example'> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>6</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>7</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>8</button> \
        </div> \
        <br>";
      document.getElementById("buttonbox").appendChild(newbtn);

      let buttons = document.getElementsByClassName("btn-redraw");
      for (let index = 0; index < buttons.length; index++) {
        const button = buttons[index];
        button.addEventListener("click", function () {
          signal("StandSelect-" + button.innerHTML);
          console.log("Restart line 271");
          location.reload();
        });
      }
    }

    function fullPageControl() {
      //Previous Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Terug";
      } else {
        newbtn.innerHTML = "Back";
      }
      newbtn.id = "previous";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.addEventListener("click", function () {
        //
        signal("Prev");
      });
      document.getElementById("pagebox").appendChild(newbtn);

      //Next Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Verder";
      } else {
        newbtn.innerHTML = "Continue";
      }
      newbtn.id = "continue";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.addEventListener("click", function () {
        signal("Cont");
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

    function initAccess() {
      //Decline
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Geen Toestemming";
      } else {
        newbtn.innerHTML = "No Permission";
      }

      newbtn.id = "previous";
      newbtn.classList = "btn btn-spc btn-danger";
      newbtn.addEventListener("click", function () {
        //
        Access(false);
      });
      document.getElementById("pagebox").appendChild(newbtn);

      //Accept
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Toestemming";
      } else {
        newbtn.innerHTML = "Permission";
      }
      newbtn.id = "continue";
      newbtn.classList = "btn btn-spc btn-success";
      newbtn.addEventListener("click", function () {
        Access(true);
      });
      document.getElementById("pagebox").appendChild(newbtn);

      var txt = document.createElement("h3");
      if (window.lan == "nl") {
        txt.innerHTML =
          "Ik geef toestemming voor het anoniem opslaan en gebruiken van mijn data (de antwoorden die ik invul bij de reflectievragen) ten behoeve van installatie 8. Indien u geen toestemming geeft dan wordt u verzocht geen antwoorden in te vullen bij de reflectievragen!";
      } else {
        txt.innerHTML =
          "I consent to the anonymous storage and use of my data for the purposes of installation 8. If you do not consent, please do not fill in the answers to the reflection questions!";
      }
      document.getElementById("buttonbox").appendChild(txt);
    }

    function Access(state) {
      window.state = state;
      // signal("Disconnect");
      if (state) {
        console.log("Load q");
        loadQuestions(true);
        // POST answers to server'
        var http = new XMLHttpRequest();
        var url = "https://tetem-reflectie.nl:3000/visitors";
        var params =
          "agreement=" +
          "true" +
          "&test_usr=" +
          "true" +
          "&tablet_num=" +
          window.peer.id;
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );

        http.onreadystatechange = function () {
          //Call a function when the state changes.
          if (http.readyState == 4 && http.status == 201) {
            let obj = JSON.parse(http.response);
            console.log(obj);
            document.cookie = "user_id=" + obj.user_id;
            document.cookie = "agreement=" + obj.agreement;
          }
        };
        http.send(params);
      } else {
        // POST answers to server'
        var http = new XMLHttpRequest();
        var url = "https://tetem-reflectie.nl:3000/visitors";
        var params =
          "agreement=" +
          "false" +
          "&test_usr=" +
          "true" +
          "&tablet_num=" +
          window.peer.id;
        http.open("POST", url, true);

        //Send the proper header information along with the request
        http.setRequestHeader(
          "Content-type",
          "application/x-www-form-urlencoded"
        );

        http.onreadystatechange = function () {
          //Call a function when the state changes.
          if (http.readyState == 4 && http.status == 201) {
            let obj = JSON.parse(http.response);
            document.cookie = "user_id=" + obj.user_id;
            document.cookie = "agreement=" + obj.agreement;
            initSuccessScreen();
            // signal("Cont");
          }
        };
        http.send(params);
      }
    }

    function initSuccessScreen(params) {
      destroyControls();

      var txt = document.createElement("h3");
      if (window.lan == "nl") {
        txt.innerHTML = "Veel plezier bij de tentoonstelling";
      } else {
        txt.innerHTML = "Enjoy your time at the exhibition";
      }
      document.getElementById("buttonbox").appendChild(txt);
      setTimeout(() => {
        console.log("initSuccesScreen reload");
        location.reload();
      }, 2500);
    }

    function initQuestions() {
      // //Previous Page
      // var newbtn = document.createElement("BUTTON");
      // if (window.lan == "nl") {
      //   newbtn.innerHTML = "Terug";
      // } else {
      //   newbtn.innerHTML = "Back";
      // }
      // newbtn.id = "previous";
      // newbtn.classList = "btn btn-spc btn-primary";
      // newbtn.addEventListener("click", function () {
      //   signal("Prev");
      // });
      // document.getElementById("pagebox").appendChild(newbtn);

      //Next Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Naar vragen";
      } else {
        newbtn.innerHTML = "Go to questions";
      }
      newbtn.id = "finish";
      newbtn.classList = "btn btn-spc btn-success";
      newbtn.addEventListener("click", function () {
        signal("Disconnect");
        // Destroy connection and load questions inputs
        loadQuestions();
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

    function loadQuestions(introScreen = false) {
      if (getCookie("agreement") == "false") {
        initSuccessScreen();
      }
      // Destroy Original Buttons
      destroyControls();
      // Display disconnected button
      document.getElementById("connicon").classList = "fa fa-user-times";
      // Set numbers to zero
      document.getElementById("connectionForm").hidden = true;
      if (window.lan == "nl") {
        document.getElementById("topTxtnl").innerHTML =
          "Beantwoord de volgende vragen en druk op afsluiten";
      } else {
        document.getElementById("topTxten").innerHTML =
          "Answer the following questions and press Finish";
      }

      // Override timeout timer
      window.questionState = true;
      let URL = "";
      if (window.lan == "nl") {
        if (introScreen) {
          URL = "https://tetem-reflectie.nl:3000/questions/0";
        } else {
          URL = "https://tetem-reflectie.nl:3000/questions/" + window.standNum;
        }
      } else {
        if (introScreen) {
          URL = "https://tetem-reflectie.nl:3000/questionsen/0";
        } else {
          URL =
            "https://tetem-reflectie.nl:3000/questionsen/" + window.standNum;
        }
      }

      //Get the questions from the database
      console.log(URL);
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
            case "TEXT":
              generateTextQ(question);
              break;
            case "INPUT":
              generateInputQ(question);
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
        document.getElementById("allbuttons").style.marginTop = "30px";
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
                <input class='form-control' rows='3'></input> \
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
                <textarea class='form-control' rows='3'></textarea> \
              </div> \
            </div> \
          </div> <br>";
        document.getElementById("questionbox").appendChild(questionDiv);
      }

      function generateTextQ(question) {
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
                <input type='radio' name='optradio'>Ja \
              </label> \
              <label class='radio-inline'> \
                <input type='radio' name='optradio'>Nee \
              </label> \
              <label class='radio-inline'> \
                <input type='radio' name='optradio'>Weet ik niet \
              </label> \
            </form> \
              </div> \
            </div> \
          </div> <br>";
        document.getElementById("questionbox").appendChild(questionDiv);
      }

      function generateMTCPlusQ(question) {
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
                <input type='radio' name='optradio'>" +
          question.misc1 +
          " \
              </label> \
              <label class='radio-inline'> \
                <input type='radio' name='optradio'>" +
          question.misc2 +
          " \
              </label> \
              <label class='radio-inline'> \
                <input type='radio' name='optradio'>" +
          question.misc3 +
          " \
              </label> \
            </form> \
              </div> \
            </div> \
          </div> <br>";
        document.getElementById("questionbox").appendChild(questionDiv);
      }

      //Next Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Afsluiten en Opsturen";
      } else {
        newbtn.innerHTML = "Finish and Send";
      }
      newbtn.id = "submit";
      newbtn.classList = "btn btn-spc btn-success";
      newbtn.addEventListener("click", function () {
        let QuestionList = document.getElementById("questionbox").children;
        console.log(QuestionList);
        let empty = 0;

        let QIDArray = [];
        let TXTArray = [];

        for (let index = 0; index < QuestionList.length; index++) {
          const Question = QuestionList[index];
          console.log(Question.dataset.question_type);
          // First check if empty
          switch (Question.dataset.question_type) {
            case "TEXT":
              break;
            case "MTPC+":
            case "MTPC":
              let form = document.getElementsByName(
                "radio" + Question.dataset.question_id
              )[0];
              let radios = form[0];
              empty += 1;
              for (let index = 0; index < form.length; index++) {
                const input = form[index];
                if (input.checked) {
                  empty -= 1;

                  let question_id = Question.dataset.question_id;
                  let value = input.parentElement.textContent.trim();
                  QIDArray.push(question_id);
                  TXTArray.push(value);
                }
              }
              break;
            case "INPUT":
            case "OPEN":
              let value =
                Question.firstChild.children[1].children[0].children[0].value;
              let question_id = Question.dataset.question_id;

              if (value == "") {
                empty += 1;
              }

              QIDArray.push(question_id);
              TXTArray.push(value);
              break;
          }
        }

        console.log(empty);
        console.log(QIDArray);
        console.log(TXTArray);

        if (true) {
          for (let index = 0; index < QIDArray.length; index++) {
            const answer = TXTArray[index];
            const q_id = QIDArray[index];
            // POST answers to server'

            var http = new XMLHttpRequest();
            var url = "https://tetem-reflectie.nl:3000/answers";
            var params =
              "value=" +
              answer +
              "&stand_num=" +
              window.standNum +
              "&question_num=" +
              q_id +
              "&user_id=" +
              getCookie("user_id");
            http.open("POST", url, true);

            //Send the proper header information along with the request
            http.setRequestHeader(
              "Content-type",
              "application/x-www-form-urlencoded"
            );

            http.onreadystatechange = function () {
              //Call a function when the state changes.
              if (http.readyState == 4 && http.status == 201) {
                console.log("reply");
              }
            };
            if (answer) {
              http.send(params);
            }
          }
          console.log("end of question - 787");

          if (introScreen) {
            signal("Cont");
          } else {
            initSuccessScreen();
          }
          //
        } else {
          console.log("check");
        }

        /*
        // check counter for all inputs
        let empty = 0
        console.log('submit answers')
        // Collect responses
        let AnswerList = document.getElementsByClassName('form-control')
        var forms = document.forms
        // find all radios
        let radiolist = ['']
        for (let index = 0; index < forms.length; index++) {
          const form = forms[index]
          radiolist.push(form.name)
        }
        radiolist = radiolist.filter(element => element.includes('radio'))
        // check all radios
        console.log(radiolist)
        for (let index = 0; index < radiolist.length; index++) {
          const radioname = radiolist[index]
          let radio = document.getElementsByName(radioname)[0]
          console.log(radio.children)
          empty += 1
          for (let index = 0; index < radio.children.length; index++) {
            const input = radio.children[index]
            console.log(radio.value)
            if (input.children[0].checked) {
              empty -= 1

              question_id = radioname.replace('radio', '')
              value = input.innerHTML
            }
          }
        }
        console.log(AnswerList)

        for (let index = 0; index < AnswerList.length; index++) {
          const answer = AnswerList[index].value
          if (answer == '') {
            empty += 1
          }
        }
        if (empty == 0) {
          for (let index = 0; index < AnswerList.length; index++) {
            const answer = AnswerList[index].value
            // POST answers to server'

            var http = new XMLHttpRequest()
            var url = 'https://tetem-reflectie.nl:3000/answers'
            var params =
              'value=' +
              answer +
              '&stand_num=' +
              window.standNum +
              '&question_num=' +
              window.questions[index].question_id +
              '&user_id=' +
              getCookie('user_id')
            http.open('POST', url, true)

            //Send the proper header information along with the request
            http.setRequestHeader(
              'Content-type',
              'application/x-www-form-urlencoded'
            )

            http.onreadystatechange = function () {
              //Call a function when the state changes.
              if (http.readyState == 4 && http.status == 201) {
                initSuccessScreen()
              }
            }
            http.send(params)
          }
          for (let index = 0; index < AnswerList.length; index++) {
            const answer = AnswerList[index].value
            // POST answers to server'

            var http = new XMLHttpRequest()
            var url = 'https://tetem-reflectie.nl:3000/answers'
            var params =
              'value=' +
              answer +
              '&stand_num=' +
              window.standNum +
              '&question_num=' +
              window.questions[index].question_id +
              '&user_id=' +
              getCookie('user_id')
            http.open('POST', url, true)

            //Send the proper header information along with the request
            http.setRequestHeader(
              'Content-type',
              'application/x-www-form-urlencoded'
            )

            http.onreadystatechange = function () {
              //Call a function when the state changes.
              if (http.readyState == 4 && http.status == 201) {
                initSuccessScreen()
              }
            }
            http.send(params)
            
          }
        } else {
          alert('Beantwoord graag alle vragen')
        }
        */
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
    }

    function initPageControl() {
      //Previous Page
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML = "Disconnect";
      newbtn.id = "disconnect";
      newbtn.classList = "btn btn-spc btn-danger";
      newbtn.addEventListener("click", function () {
        signal("Disconnect");
        console.log("initPageControl");
        location.reload();
      });
      document.getElementById("pagebox").appendChild(newbtn);

      //Next Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Verder";
      } else {
        newbtn.innerHTML = "Continue";
      }
      newbtn.id = "continue";
      newbtn.classList = "btn btn-spc btn-success";
      newbtn.addEventListener("click", function () {
        signal("Cont");
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

    function initModalMediaControls() {
      if (document.getElementById("modalbuttonbox")) {
        //Backwards Button
        newbtn = null;
        var newbtn = document.createElement("BUTTON");
        newbtn.innerHTML =
          '<i id="connicon" aria-hidden="true" class="fa fa-rotate-left fa-3x"></i>';
        newbtn.id = "backw";
        newbtn.classList = "btn btn-spc btn-primary";
        newbtn.type = "button";
        newbtn.addEventListener("click", function () {
          signal("Backwards");
        });
        document.getElementById("modalbuttonbox").appendChild(newbtn);

        //Forward Button
        newbtn = null;
        var newbtn = document.createElement("BUTTON");
        newbtn.innerHTML =
          '<i id="connicon" aria-hidden="true" class="fa fa-rotate-right fa-3x"></i>';
        newbtn.id = "forw";
        newbtn.classList = "btn btn-spc btn-primary";
        newbtn.type = "button";
        newbtn.addEventListener("click", function () {
          signal("Forwards");
        });
        document.getElementById("modalbuttonbox").appendChild(newbtn);

        //Play Button
        var newbtn = document.createElement("BUTTON");
        newbtn.innerHTML =
          '<i id="connicon" aria-hidden="true" class="fa fa-play fa-3x"></i>';
        newbtn.id = "play";
        newbtn.classList = "btn btn-spc btn-primary";
        newbtn.type = "button";
        newbtn.addEventListener("click", function () {
          signal("Play");
        });
        document.getElementById("modalbuttonbox").appendChild(newbtn);

        //Play Button
        newbtn = null;
        var newbtn = document.createElement("BUTTON");
        newbtn.innerHTML =
          '<i id="connicon" aria-hidden="true" class="fa fa-pause fa-3x"></i>';
        newbtn.id = "pause";
        newbtn.classList = "btn btn-spc btn-primary";
        newbtn.type = "button";
        newbtn.addEventListener("click", function () {
          signal("Pause");
        });
        document.getElementById("modalbuttonbox").appendChild(newbtn);

        //Volume Up Button
        newbtn = null;
        var newbtn = document.createElement("BUTTON");
        newbtn.innerHTML =
          '<i id="connicon" aria-hidden="true" class="fa fa-volume-up fa-3x"></i>';
        newbtn.id = "volup";
        newbtn.classList = "btn btn-spc btn-primary";
        newbtn.type = "button";
        newbtn.addEventListener("click", function () {
          signal("VolUp");
        });
        document.getElementById("modalbuttonbox").appendChild(newbtn);

        //Volume down Button
        newbtn = null;
        var newbtn = document.createElement("BUTTON");
        newbtn.innerHTML =
          '<i id="connicon" aria-hidden="true" class="fa fa-volume-down fa-3x"></i>';
        newbtn.id = "voldown";
        newbtn.classList = "btn btn-spc btn-primary";
        newbtn.type = "button";
        newbtn.addEventListener("click", function () {
          signal("VolDown");
        });
        document.getElementById("modalbuttonbox").appendChild(newbtn);
      } else {
        console.log("no video modal present");
      }
    }

    function initMediaControls() {
      //Backwards Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-rotate-left fa-3x"></i>';
      newbtn.id = "backw";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Backwards");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Forward Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-rotate-right fa-3x"></i>';
      newbtn.id = "forw";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Forwards");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Play Button
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-play fa-3x"></i>';
      newbtn.id = "play";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Play");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Play Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-pause fa-3x"></i>';
      newbtn.id = "pause";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Pause");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Volume Up Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-volume-up fa-3x"></i>';
      newbtn.id = "volup";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("VolUp");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Volume down Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-volume-down fa-3x"></i>';
      newbtn.id = "voldown";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("VolDown");
      });
      document.getElementById("buttonbox").appendChild(newbtn);
    }

    function closeAllModals() {
      let modals = document.getElementsByClassName("modal");
      for (let i = 0; i < modals.length; i++) {
        const element = modals[i];
        element.style.display = "none";
        element.style.opacity = 0;
      }
    }

    function initVideoSelectControl(videoList) {
      console.log(videoList);
      var HttpClient = function () {
        this.get = function (aUrl, aCallback) {
          var anHttpRequest = new XMLHttpRequest();
          anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
              aCallback(anHttpRequest.responseText);
          };

          anHttpRequest.open("GET", aUrl, true);
          anHttpRequest.send(null);
        };
      };
      let baseString = "https://www.googleapis.com/youtube/v3/videos?id=";
      let endString =
        "&key=AIzaSyA6UvPdTM8LV0ve1KEbk5jdNptRHE2l5GE&part=snippet";
      // Prepare HTTP Get request string
      let videoString = "";
      for (let index = 1; index < videoList.length; index++) {
        // Http GET request to YouTube API v3 to get title etc.
        const videoId = videoList[index];
        videoString += videoId;
        if (index != videoList.length) {
          videoString += ",";
        }
      }
      // https://www.googleapis.com/youtube/v3/videos?id=K3bgarlc4lA&key=AIzaSyA6UvPdTM8LV0ve1KEbk5jdNptRHE2l5GE&part=snippet,contentDetails,statistics,status
      // Send request and use callback to process reponse and spawn buttons
      var client = new HttpClient();
      client.get(baseString + videoString + endString, function (response) {
        console.log(response);
        let videoData = JSON.parse(response);
        for (let index = 0; index < videoData.items.length; index++) {
          const videoInfo = videoData.items[index];
          // Create Button with video information
          console.log(videoInfo);
          spawnVideoButton(videoInfo);
        }
      });
    }

    function spawnVideoButton(videoInfo) {
      let id = videoInfo.id;
      let title = videoInfo.snippet.title;
      let description = videoInfo.snippet.description;
      let thumbnail = videoInfo.snippet.thumbnails.medium.url;
      let maxStringLength = 30;
      //
      newimg = null;
      var newimg = document.createElement("IMG");
      newimg.src = thumbnail;

      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.appendChild(newimg);
      newbtn.innerHTML += "<h5>" + title + "</h5>";
      newbtn.id = id;
      newbtn.classList = "btn btn-img btn-primary col-md-4";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        console.log("SelectVideo-" + newbtn.id);
        signal("VideoSelect-" + newbtn.id);
        openVideoModal(title, "<b> Description: </b>" + description);
      });

      document.getElementById("videobox").appendChild(newbtn);
    }

    function openVideoModal(title, description) {
      //Attach close button
      document.getElementById("close").addEventListener("click", function () {
        console.log("Close Window");
        closeAllModals();
        signal("Pause");
      });
      // display title and description
      document.getElementById("videoModalTitle").innerHTML = title;
      document.getElementById("videoModalDescription").innerHTML = description;

      // Open modal manually
      let modal = document.getElementById("videoModal");
      modal.style.backgroundColor = "rgba(0,0,0,0.5)";
      modal.style.display = "block";
      setTimeout(() => {
        modal.style.opacity = 1;
      }); //FOR TRANSITION
    }

    function centerModalFix() {
      console.log("fix center modal");
      let modals = document.getElementsByClassName("modal-dialog");
      for (let i = 0; i < modals.length; i++) {
        const element = modals[i];
        element.style.marginTop = "300px";
        element.style.marginRight = "300px";
      }
    }

    // Stand 3
    function initStand3() {
      //PP1
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML = "Anne Jones";
      newbtn.id = "ann";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("AnnS3");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //PP2
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML = "Jan Samuel";
      newbtn.id = "jan";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("JanS3");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Confirm
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Bevestig";
      } else {
        newbtn.innerHTML = "Confirm";
      }
      newbtn.id = "confirm";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        if (window.select) {
          signal("StartS3");
          initB5Test();
        }
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

    function initB5Test() {
      console.log("start test");

      document.getElementById("ann").hidden = true;
      document.getElementById("jan").hidden = true;
      document.getElementById("confirm").hidden = true;

      document.getElementById("allbuttons").style.marginTop = "30px";

      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Scroll Omhoog";
      } else {
        newbtn.innerHTML = "Scroll Up";
      }
      newbtn.id = "scrollup";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        if (window.select) {
          signal("ScrollUpS3");
        }
      });
      document.getElementById("videobox").appendChild(newbtn);

      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Scroll Omlaag";
      } else {
        newbtn.innerHTML = "Scroll Down";
      }
      newbtn.id = "scrolldown";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        if (window.select) {
          signal("ScrollDownS3");
        }
      });
      document.getElementById("videobox").appendChild(newbtn);

      var newdiv = document.createElement("DIV");

      let basestring =
        "<table> \
          <colgroup> \
            <col span='1' style='width: 40%;'> \
            <col span='1' style='width: 12%;'> \
            <col span='1' style='width: 12%;'> \
            <col span='1' style='width: 12%;'> \
            <col span='1' style='width: 12%;'> \
            <col span='1' style='width: 12%;'> \
          </colgroup> \
          <thead> \
            <tr> \
              <th><p class = 'en'>Question </p><p class = 'nl'>Vraag </p></th> \
              <th><p class = 'en'>Very inaccurate </p><p class = 'nl'>Zeer nauwkeurig </p></th> \
              <th><p class = 'en'>Moderatly inaccurate </p><p class = 'nl'>Matig nauwkeurig </p></th> \
              <th><p class = 'en'>Neither accurate nor inaccurate </p><p class = 'nl'>noch nauwkeurig noch onnauwkeurig</p></th> \
              <th><p class = 'en'>Moderatly accurate </p><p class = 'nl'>Matig onnauwkeurig </p></th> \
              <th><p class = 'en'>Very accurate </p><p class = 'nl'>Zeer onnauwkeurig </p></th> \
            </tr> \
          </thead> \
          <tbody>";
      let midstring = "";
      let questionsen = [
        "Likes the party life",
        "Feels little concern for others",
        "Is always prepared",
        "Gets stressed out easily",
        "Has a rich vocabulary",
        "Doesn't talk a lot",
        "Is interested in people",
        "Leaves belongings around",
        "Is relaxed most of the time",
        "Has difficulty understanding abstract ideas",
        "Feels comfortable around people",
        "Insults people",
        "Pays attention to detail",
        "Worries about things",
        "Has a vivid imagination",
        "Keeps in the background",
        "Sympathizes with others' feelings",
        "Makes a mess of things",
        "Seldom feels down",
        "Is not interested in abstract ideas",
        "Starts conversations",
        "Is not interested in other people's problems",
        "Gets chores done right always",
        "Is easily disturbed",
        "Has excelent ideas",
        "Has little to say ",
        "Has a soft heart",
        "Forgets to put things back in their proper place",
        "Gets easily upset",
        "Does not have a good imagination",
        "Talks to lots of different people at parties",
        "Is not really interested in others",
        "Likes order",
        "Changes moods a lot",
        "Is quick to understand things",
        "Doesn't like to draw attention ",
        "Takes time out for others",
        "Takes responsibilities seriously",
        "Has frequent mood swings",
        "Uses difficult words",
        "Doesn't mind being the center of attention",
        "Feels others' emotions",
        "Follows a schedule",
        "Gets irritated easily",
        "Spends time to reflect",
        "Is quiet around strangers",
        "Makes people feel at ease",
        "Has high work standards",
        "Often feels blue",
        "Is full of ideas",
      ];
      let questionsnl = [
        "Leeft het uitgaansleven",
        "Is niet geïnteresseerd in anderen",
        "Is altijd voorbereid",
        "Raakt snel gestrest",
        "Heeft een goeie woordenschat",
        "Praat niet veel",
        "Luisterd graag naar andere mensen",
        "Raakt makkelijk spullen kwijt",
        "Is meestal relaxed",
        "Vind het lastig om abstracte ideeën te begrijpen",
        "Voelt zich comfortabel rond mensen",
        "Beledigt anderen",
        "Let op details",
        "Maakt zich gauw druk om dingen",
        "Heeft een wilde fantasy",
        "Blijft graag in de achtergrond",
        "Leeft mee met de gevoelens van anderen",
        "Maakt er een potje van",
        "Voelt zich niet vaak down",
        "Is niet geïnteresseerd in abstracte ideeën",
        "Begint de gesprekken meestal",
        "Vindt de problemen van anderen niet belangrijk",
        "Maakt klusjes direct af",
        "Is snel verontrust",
        "Heeft zeer goede ideeën",
        "Heeft niet veel te vertellen",
        "Heeft een zacht hartje",
        "Vergeet dingen op hun plek neer te zetten",
        "Wordt snel boos",
        "Heeft geen geweldige fantasie",
        "Praat met veel verschillende mensen bij feestjes",
        "Is niet echt geïnteresseerd in anderen",
        "Houd van rangorde",
        "Wisselt snel van humeur",
        "Begrijpt dingen snel",
        "Blijft graag buiten de schijnwerpers",
        "Neemt extra tijd voor anderen",
        "Neemt verantwoordelijkheden serieus",
        "Heeft stemmingswisselingen",
        "Gebruikt lastige woorden",
        "Vind het niet erg om alle aandacht te krijgen",
        "Voelt de emoties van anderen",
        "Houdt van een schema",
        "Raakt snel gefrustreerd",
        "Neemt de tijd voor zelfreflectie",
        "Is stil in een groep",
        "Anderen voelen zich gemakkelijk rond deze persoon",
        "Heeft hoge eisen aan zichzelf",
        "Voelt zich vaak down",
        "Heeft veel ideeën te bieden",
      ];
      let questionsnum = [
        "1+",
        "2-",
        "3+",
        "4-",
        "5+",
        "1-",
        "2+",
        "3-",
        "4+",
        "5-",
        "1+",
        "2-",
        "3+",
        "4-",
        "5+",
        "1-",
        "2+",
        "3-",
        "4+",
        "5-",
        "1+",
        "2-",
        "3+",
        "4-",
        "5+",
        "1-",
        "2+",
        "3-",
        "4-",
        "5-",
        "1+",
        "2-",
        "3+",
        "4-",
        "5+",
        "1-",
        "2+",
        "3-",
        "4-",
        "5+",
        "1+",
        "2+",
        "3+",
        "4-",
        "5+",
        "1-",
        "2+",
        "3+",
        "4-",
        "5+",
      ];

      for (let index = 0; index < questionsen.length; index++) {
        const questionen = questionsen[index];
        const questionnl = questionsnl[index];

        let block = `<tr> \
            <td><p class = 'en'>${questionen}</p><p class = 'nl'>${questionnl}</p></td> \
            <td><input type='radio' id='q${index}a1' name='q${index}' value='1'></td> \
            <td><input type='radio' id='q${index}a2' name='q${index}' value='2'></td> \
            <td><input type='radio' id='q${index}a3' name='q${index}' value='3'></td> \
            <td><input type='radio' id='q${index}a4' name='q${index}' value='4'></td> \
            <td><input type='radio' id='q${index}a5' name='q${index}' value='5'></td> \
          </tr> `;

        midstring += block;
      }

      let endstring = "</tbody> \
        </table>";

      newdiv.innerHTML = basestring + midstring + endstring;

      document.getElementById("buttonbox").appendChild(newdiv);

      //Confirm
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Bevestig";
      } else {
        newbtn.innerHTML = "Confirm";
      }
      newbtn.id = "send";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        let P1 = 0;
        let P2 = 0;
        let P3 = 0;
        let P4 = 0;
        let P5 = 0;
        let cont = true;
        for (let index = 0; index < 50; index++) {
          let result = document.querySelector(
            `input[name='q${index}']:checked`
          );
          if (result) {
            switch (questionsnum[index]) {
              case "1+":
                P1 += parseInt(result.value);
                break;
              case "1-":
                P1 -= parseInt(result.value);
                break;
              case "2+":
                P2 += parseInt(result.value);
                break;
              case "2-":
                P2 -= parseInt(result.value);
                break;
              case "3+":
                P3 += parseInt(result.value);
                break;
              case "3-":
                P3 -= parseInt(result.value);
                break;
              case "4+":
                P4 += parseInt(result.value);
                break;
              case "4-":
                P4 -= parseInt(result.value);
                break;
              case "5+":
                P5 += parseInt(result.value);
                break;
              case "5-":
                P5 -= parseInt(result.value);
                break;
            }
          } else {
            cont = false;
            if (window.lan == "nl") {
              alert("Vul graag alle vragen in");
            } else {
              alert("Please fill out all of the questions");
            }
            break;
          }
        }
        if (cont) {
          signal(`S3NUMS_${P1}_${P2}_${P3}_${P4}_${P5}`);
        }
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

	// Everything beyond here is quite crude, but I needed to make a last second
	// change for the client

    // Stand 0
    function S0P1() {
      document.getElementById("allbuttons").style.marginTop = "30px";
      document.getElementById("buttonbox").style.textAlign = "left";

      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl">\
        <h3>Introductie</h3>  \
        <br />  \
        <p>  \
          Hoe ziet onze digitale toekomst eruit? Welke rol spelen mens en machine daarin? In de hybride tentoonstelling Reflecties word je aan de hand van online en offline installaties meegenomen in een verhaal over algoritmes, kunstmatige intelligentie en machine learning technology. Wie ben jij?  \
          Kan de machine jou leren kennen? Hoe werkt AI? Wordt jouw leven beter als algoritmen jouw beslissingen optimaliseren? Is jouw expertise nog iets waard als machines sneller denken en beter zoeken? Wat blijft er dan van jou over?  \
        </p>  \
        <p>  \
          Deze tentoonstelling nodigt jou uit om op deze vragen te reflecteren en stil te staan bij de maatschappelijke uitdaging waar we nu voor staan. AI-experts verwachten dat tegen 2060 de machine in alle domeinen de mens de baas zal zijn. Maar als mensen niet langer nodig zijn vanwege hun  \
          cognitieve of artistieke vaardigheden, waar zijn we dan nog wel voor nodig? Als machines straks beter dan wijzelf kunnen denken, rekenen, schilderen en componeren, als hun verhalen pakkender en schrijnender zijn dan die van ons, waaraan ontlenen we als mens dan onze betekenis en wat is dan  \
          onze nieuwe rol? Om als mens in 2060 nog gelukkig te kunnen zijn is het nodig dat we nu nadenken over onze digitale toekomst, de relatie tussen mens en machine en de menselijke waardigheid hierbinnen.  \
        </p>  \
        <p>  \
          Reflecties is een samenwerking tussen Universiteit Twente en Tetem. De tentoonstelling is ontwikkeld in het kader van het project Make Happiness van Tetem en het onderzoeksproject Man and Machine - Learning in the Digital Society door professor Mieke Boon met studenten van de Master  \
          opleiding PSTS (Philosophy of Science, Technology and Society), de Bachelor opleiding ATLAS-UCT, en het BMS lab van de Universiteit Twente. De tentoonstelling is vormgegeven door kunstenaar Jan Merlin Marski.  \
        </p>  \
      </div>  \
      <div class="en">  \
        <h3>Introduction</h3>  \
        <br />  \
        <p>  \
          What will our digital future look like? What kind of role will man and machine have in it? In the hybrid exhibition Reflections you will find yourself immersed, through the means of online and offline installations, in a story about algorithms, artificial intelligence and machine learning  \
          technology. Who are you? Can the machine get to know you? How does AI work? Does your life get better when algorithms &lsquo;optimize&rsquo; your decisions? Is your expertise still worth something if machines think faster and search better? What will then be left of you?  \
        </p>  \
  \
        <p>  \
          This exhibition invites you to reflect on these questions and to take a moment to reflect on the societal challenges we are now facing. AI experts expect that by 2060 the machine will dominate man in all domains. But if people are no longer needed for their cognitive and artistic skills,  \
          what are we still needed for then? If machines will soon be able to think, calculate, paint and compose better than we ourselves, if their stories are more captivating and poignant than ours, from where do we as human beings then derive our meaning and what will then be our new role? In  \
          order to be happy as a human being in 2060 we need to think about our digital future, the relationship between man and machine and the place of human dignity therein.  \
        </p>  \
  \
        <p>  \
          Reflections is a collaboration between the University of Twente and Tetem. The exhibition was developed within the framework of Tetem&rsquo;s project Make Happiness and the research project Man and Machine &ndash; Learning in the Digital Society by Professor Mieke Boon with students of the  \
          Master&rsquo;s programme PSTS (Philosophy of Science, Technology and Society), the Bachelor&rsquo;s programme ATLAS-UCT, and the BMS lab of the University of Twente. The exhibition is designed by artist Jan Merlin Marski.  \
        </p>  \
      </div> <br>';
      txt.id = "txts0p1";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function S0P2() {
      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Overzicht</h3> \
        <p> \
          Deze tentoonstelling bestaat uit 8 installaties die een verhaallijn vormen over artifici&euml;le intelligentie (AI) en zelflerende systemen (machine-learning) in de toekomstige samenleving. Elke installatie draagt een Engelstalige titel in de vorm van een werkwoord dat op u / jou van \
          toepassing is, en uitdrukt wat we met deze installatie teweeg willen brengen. De verhaallijn is als volgt: \
        </p> \
        <ul> \
          <li>Installatie 1, Look (Kijk!) laat jou naar jezelf kijken door verschillende spiegelbeelden en filters &ndash; en stelt de vraag wie jij bent en wat jouw identiteit is.</li> \
          <li>Installatie 2, Understand (Begrijp!) legt uit hoe AI werkt &ndash; en stelt de vraag of we AI moeten begrijpen.</li> \
          <li>Installatie 3, Experience (Ervaar!) laat ervaren hoe apps, die gebruik maken van jouw gegevens (data) om jou te vertellen wie jij bent &ndash; en stelt de vraag of deze toepassing van AI jouw identiteit beoordeelt en jouw zelfbeeld be&iuml;nvloedt.</li> \
          <li> \
            Installatie 4, Create (Cre&euml;er) laat de cruciale rol zien van menselijke intelligentie in het cre&euml;ren van de gegevens (data). Namelijk, de onmisbare rol van mensen die gegevens (data) labelen en categoriseren alvorens ze door AI en zelflerende systemen gebruikt kunnen worden \
            &ndash; en stelt de vraag of AI eigenlijk wel zo intelligent is. \
          </li> \
          <li>Installatie 5, Immerse (Dompel je onder!) laat je een aantal toepassing van AI ervaren, namelijk virtual reality (VR), augmented reality (AR), en hyper reality &ndash; en stelt de vraag of deze ervaring bijdraagt aan jouw welzijn.</li> \
          <li>Installatie 6, Imagine (Stel je voor!) laat met een aantal video&rsquo;s zien hoe filmmakers zich de digitale toekomst voorstellen &ndash; en stelt de vraag hoe jij daarover denkt.</li> \
          <li> \
            Installatie 7, Learn (Leer) laat jou kennismaken met een mogelijke toepassing van AI in het bouwen van toekomstscenario&rsquo;s waar je als burger kunt deelnemen, leren en bijdragen &ndash; en stelt de vraag of deze vorm van citizen science tot betere politieke besluiten kan leiden. \
          </li> \
          <li> \
            Installatie 8, Reflect (Reflecteer) wordt gevormd door de vragen en de quotes bij de andere zeven installaties. In deze laatste installatie kun je vervolgens zien hoe andere mensen denken over die vragen &ndash; en stelt de vraag of burgers moeten meedenken over de manier waarop de \
            digitale toekomst vorm krijgt. \
          </li> \
        </ul> \
      </div> \
      <div class="en"> \
        <h3>Overview</h3> \
        <p> \
          This exhibition consists of 8 installations that together form a storyline about artificial intelligence (AI) and self-learning systems (machine-learning technology, MLT) in our future society. Every installation has an English title in the form of a verb.<br /> \
          The storyline is as follows:<br /> \
        </p> \
 \
        <ul> \
          <li>Installation 1, Look lets you look at yourself through different mirrors and filters &ndash; and asks you the question of who you are and what your identity is.</li> \
          <li>Installation 2, Understand explains how AI works &ndash; and asks you the question of whether it is important for us to comprehend AI.</li> \
          <li>Installation 3, Experience provides you with an experience of how apps, that use your data, tell you who you are &ndash; and asks the question of whether this approach of AI judges your identity and influences your self-image.<br /></li> \
          <li> \
            Installation 4, Create shows the crucial role of human intelligence in the creation of data. Namely, the indispensable role of people who label and categorize data before it can be used by AI and self-learning systems &ndash; and asks the question of whether AI is actually as intelligent \
            as we make it out to be.<br /> \
          </li> \
          <li>Installation 5, Immerse lets you experience a number of applications of AI, namely virtual reality (VR), augmented reality (AR), and hyper reality &ndash; and asks the question of whether this experience contributes to your well-being.</li> \
          <li>Installation 6, Imagine uses a number of video clips to show how filmmakers imagine the digital future &ndash; and poses the question of how you think about such depicted scenarios.</li> \
          <li> \
            Installation 7, Learn introduces you to a possible application of AI in the creation of future scenarios wherein you, as a citizen, can participate, learn and contribute &ndash; and asks the question of whether this form of citizen science could lead to better political decision-making. \
          </li> \
          <li> \
            Installation 8, Reflect consists of the questions and quotes of the other seven installations. In this last installation you can subsequently see how other people think about these questions &ndash; and asks the question of whether or not citizens should participate in thinking about our \
            digital future. \
          </li> \
        </ul> \
      </div > <br>';
      txt.id = "txts0p2";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function S0P3() {
      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Uitleg</h3> \
        <p>De tentoonstelling is als volgt opgebouwd:</p> \
        <ul> \
          <li>De installaties in deze ruimte kun je vinden aan de hand van nummer en titel.</li> \
          <li>De installaties bestaan veelal uit schermen die je via de tablet kunt bedienen. Je hebt toegang tot een installatie via de button op de tablet, bijvoorbeeld INSTALLATIE 1. LOOK.</li> \
          <li>Op de wanden van de tentoonstellingsruimte en rond de installaties vind je bij iedere installatie een aantal passende citaten en afbeeldingen die aanleiding geven tot reflectie.</li> \
          <li>Bij iedere installaties wordt (mits je hiertoe toestemming geeft) via de tablet een aantal reflectievragen gesteld.</li> \
          <li>Bij het beantwoorden bent je tot niets verplicht, en kunt altijd vragen overslaan.</li> \
          <li>Statistieken van de meerkeuzevragen, en een aantal geselecteerde open vragen worden getoond in Installatie 8.</li> \
          <li>Voor vragen kun je terecht bij de student-assistenten die hier rondlopen.</li> \
        </ul> \
      </div> \
      <div class="en"> \
        <h3>Explanation</h3> \
        <p>The exhibition is structured as follows:</p> \
        <ul> \
          <li>The installations in this exhibition area can be found using the number and title of the installation.</li> \
          <li>The installations usually consist of screens that can be operated via the tablet. You can access an installation through the button on the tablet, for example INSTALLATION 1. LOOK.</li> \
          <li>On the walls of the exhibition area and around the installations you will find a number of relevant quotes and images which encourage a moment of reflection. The quotes can also be read on the tablet.</li> \
          <li>For each installation a number of reflection questions are presented to you through the tablet.</li> \
          <li>You can access these reflection questions via the REFLECTION button. There is no obligation to answer these, and you can always skip questions.</li> \
          <li>You can only submit answers to these questions if you have given permission (see button PERMISSION for an explanation).</li> \
          <li>Statistics of the multiple choice questions and a number of selected open questions are shown in Installation 8.</li> \
          <li>For questions you can contact the student-assistants who will be walking around the exhibition area.</li> \
        </ul> \
      </div>';
      txt.id = "txts0p3";
      document.getElementById("buttonbox").appendChild(txt);
    }

    // Stand 5
    function S5P1() {
      document.getElementById("allbuttons").style.marginTop = "30px";
      document.getElementById("buttonbox").style.textAlign = "left";

      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Immersive room</h3> \
        <br /> \
        <p>Installatie 5, Immerse (Dompel je onder!) laat je een aantal toepassingen van AI ervaren, namelijk virtual reality (VR), augmented reality (AR), en hyper reality &ndash; en stelt de vraag of deze ervaring bijdraagt aan jouw welzijn.</p> \
        <p> \
          Dit deel van de tentoonstelling bestaat uit een VR setup, waarin je kan gaan ervaren hoe bepaalde technologie invloed kan hebben op onze ervaring. De populariteit van VR is over de hele wereld al een aantal jaren sterk aan het groeien. Het is om deze reden dat we VR ook op steeds meer \
          plekken tegenkomen. Virtual Reality maakt het namelijk mogelijk om iemand volledig te laten onderdompelen in een gecre&euml;erde virtuele wereld. Dit biedt mogelijkheden voor zowel entertainment als onderzoek. Het BMS lab (van de Universiteit Twente), waar deze VR setup vandaan komt, is \
          uitgerust voor het laatste en ondersteunt onderzoekers in studies waarbij VR gebruikt wordt. \
        </p> \
        <p> \
          Deze VR setup nodigt je uit om je te laten onderdompelen in een digitale ervaring - je stapt letterlijk in andere wereld. Achteraf ga je door middel van een vragenlijst reflecteren op je ervaring. Hoe voelde het in de VR wereld? Wat zie je als positieve punten van zo&rsquo;n simulatie? En \
          ook belangrijk, voelt het wel echt? Zo niet, welke delen van de realiteit ontbreken er volgens jou? Als laatste laten we je ook kennis maken met Augmented Reality (AR). AR gaat nog verder dan VR en brengt weer nieuwe vragen met zich mee over onze digitale toekomst. \
        </p> \
      </div> \
      <div class="en"> \
        <h3>Immersive room</h3> \
        <br /> \
        <p>Installation 5, Immerse lets you experience a number of applications of AI, namely virtual reality (VR), augmented reality (AR), and hyper reality &ndash; and asks the question of whether this experience contributes to your well-being.</p> \
        <p> \
          This part of the exhibition consists of an AI setup, wherein you can experience how certain technologies in our environment can have an influence on our experience. Virtual reality (VR) has been taking off all around the world for a number of years. As a result, you can find VR anywhere. \
          That is because Virtual Reality allows one to fully immerse another inside a custom created world. This offers opportunities for both entertainment and research purposes. The BMS lab (at the University of Twente), who has provided this VR setup, is equipped for the latter and is able to \
          support researchers in their studies that include Virtual reality. \
        </p> \
        <p> \
          Afterwards you will reflect on your experience through a set of questions. How did it feel to be in the VR world? What do you see as positive aspects of such a simulation? And also important, did it actually feel real to you? If not, which parts of reality are missing in your experience? \
          Finally, we will also introduce you to Augmented Reality (AR). AR goes even further than the immersion of VR and will, thereby, once again bring forth new questions concerning our digital future. \
        </p> \
      </div> <br>';
      txt.id = "txts0p1";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function S5P2() {
      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Overzicht</h3> \
        <p> \
          Deze tentoonstelling bestaat uit 8 installaties die een verhaallijn vormen over artifici&euml;le intelligentie (AI) en zelflerende systemen (machine-learning) in de toekomstige samenleving. Elke installatie draagt een Engelstalige titel in de vorm van een werkwoord dat op u / jou van \
          toepassing is, en uitdrukt wat we met deze installatie teweeg willen brengen. De verhaallijn is als volgt: \
        </p> \
        <ul> \
          <li>Installatie 1, Look (Kijk!) laat jou naar jezelf kijken door verschillende spiegelbeelden en filters &ndash; en stelt de vraag wie jij bent en wat jouw identiteit is.</li> \
          <li>Installatie 2, Understand (Begrijp!) legt uit hoe AI werkt &ndash; en stelt de vraag of we AI moeten begrijpen.</li> \
          <li>Installatie 3, Experience (Ervaar!) laat ervaren hoe apps, die gebruik maken van jouw gegevens (data) om jou te vertellen wie jij bent &ndash; en stelt de vraag of deze toepassing van AI jouw identiteit beoordeelt en jouw zelfbeeld be&iuml;nvloedt.</li> \
          <li> \
            Installatie 4, Create (Cre&euml;er) laat de cruciale rol zien van menselijke intelligentie in het cre&euml;ren van de gegevens (data). Namelijk, de onmisbare rol van mensen die gegevens (data) labelen en categoriseren alvorens ze door AI en zelflerende systemen gebruikt kunnen worden \
            &ndash; en stelt de vraag of AI eigenlijk wel zo intelligent is. \
          </li> \
          <li>Installatie 5, Immerse (Dompel je onder!) laat je een aantal toepassing van AI ervaren, namelijk virtual reality (VR), augmented reality (AR), en hyper reality &ndash; en stelt de vraag of deze ervaring bijdraagt aan jouw welzijn.</li> \
          <li>Installatie 6, Imagine (Stel je voor!) laat met een aantal video&rsquo;s zien hoe filmmakers zich de digitale toekomst voorstellen &ndash; en stelt de vraag hoe jij daarover denkt.</li> \
          <li> \
            Installatie 7, Learn (Leer) laat jou kennismaken met een mogelijke toepassing van AI in het bouwen van toekomstscenario&rsquo;s waar je als burger kunt deelnemen, leren en bijdragen &ndash; en stelt de vraag of deze vorm van citizen science tot betere politieke besluiten kan leiden. \
          </li> \
          <li> \
            Installatie 8, Reflect (Reflecteer) wordt gevormd door de vragen en de quotes bij de andere zeven installaties. In deze laatste installatie kun je vervolgens zien hoe andere mensen denken over die vragen &ndash; en stelt de vraag of burgers moeten meedenken over de manier waarop de \
            digitale toekomst vorm krijgt. \
          </li> \
        </ul> \
      </div> \
      <div class="en"> \
        <h3>Overview</h3> \
        <p> \
          This exhibition consists of 8 installations that together form a storyline about artificial intelligence (AI) and self-learning systems (machine-learning technology, MLT) in our future society. Every installation has an English title in the form of a verb.<br /> \
          The storyline is as follows:<br /> \
        </p> \
 \
        <ul> \
          <li>Installation 1, Look lets you look at yourself through different mirrors and filters &ndash; and asks you the question of who you are and what your identity is.</li> \
          <li>Installation 2, Understand explains how AI works &ndash; and asks you the question of whether it is important for us to comprehend AI.</li> \
          <li>Installation 3, Experience provides you with an experience of how apps, that use your data, tell you who you are &ndash; and asks the question of whether this approach of AI judges your identity and influences your self-image.<br /></li> \
          <li> \
            Installation 4, Create shows the crucial role of human intelligence in the creation of data. Namely, the indispensable role of people who label and categorize data before it can be used by AI and self-learning systems &ndash; and asks the question of whether AI is actually as intelligent \
            as we make it out to be.<br /> \
          </li> \
          <li>Installation 5, Immerse lets you experience a number of applications of AI, namely virtual reality (VR), augmented reality (AR), and hyper reality &ndash; and asks the question of whether this experience contributes to your well-being.</li> \
          <li>Installation 6, Imagine uses a number of video clips to show how filmmakers imagine the digital future &ndash; and poses the question of how you think about such depicted scenarios.</li> \
          <li> \
            Installation 7, Learn introduces you to a possible application of AI in the creation of future scenarios wherein you, as a citizen, can participate, learn and contribute &ndash; and asks the question of whether this form of citizen science could lead to better political decision-making. \
          </li> \
          <li> \
            Installation 8, Reflect consists of the questions and quotes of the other seven installations. In this last installation you can subsequently see how other people think about these questions &ndash; and asks the question of whether or not citizens should participate in thinking about our \
            digital future. \
          </li> \
        </ul> \
      </div > <br>';
      txt.id = "txts0p2";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function S5P3() {
      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Uitleg</h3> \
        <p>De tentoonstelling is als volgt opgebouwd:</p> \
        <ul> \
          <li>De installaties in deze ruimte kun je vinden aan de hand van nummer en titel.</li> \
          <li>De installaties bestaan veelal uit schermen die je via de tablet kunt bedienen. Je hebt toegang tot een installatie via de button op de tablet, bijvoorbeeld INSTALLATIE 1. LOOK.</li> \
          <li>Op de wanden van de tentoonstellingsruimte en rond de installaties vind je bij iedere installatie een aantal passende citaten en afbeeldingen die aanleiding geven tot reflectie.</li> \
          <li>Bij iedere installaties wordt (mits je hiertoe toestemming geeft) via de tablet een aantal reflectievragen gesteld.</li> \
          <li>Bij het beantwoorden bent je tot niets verplicht, en kunt altijd vragen overslaan.</li> \
          <li>Statistieken van de meerkeuzevragen, en een aantal geselecteerde open vragen worden getoond in Installatie 8.</li> \
          <li>Voor vragen kun je terecht bij de student-assistenten die hier rondlopen.</li> \
        </ul> \
      </div> \
      <div class="en"> \
        <h3>Explanation</h3> \
        <p>The exhibition is structured as follows:</p> \
        <ul> \
          <li>The installations in this exhibition area can be found using the number and title of the installation.</li> \
          <li>The installations usually consist of screens that can be operated via the tablet. You can access an installation through the button on the tablet, for example INSTALLATION 1. LOOK.</li> \
          <li>On the walls of the exhibition area and around the installations you will find a number of relevant quotes and images which encourage a moment of reflection. The quotes can also be read on the tablet.</li> \
          <li>For each installation a number of reflection questions are presented to you through the tablet.</li> \
          <li>You can access these reflection questions via the REFLECTION button. There is no obligation to answer these, and you can always skip questions.</li> \
          <li>You can only submit answers to these questions if you have given permission (see button PERMISSION for an explanation).</li> \
          <li>Statistics of the multiple choice questions and a number of selected open questions are shown in Installation 8.</li> \
          <li>For questions you can contact the student-assistants who will be walking around the exhibition area.</li> \
        </ul> \
      </div>';
      txt.id = "txts0p3";
      document.getElementById("buttonbox").appendChild(txt);
    }

    // Stand 6
    function S6P1() {
      document.getElementById("allbuttons").style.marginTop = "30px";
      document.getElementById("buttonbox").style.textAlign = "left";

      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>INSTALLATIE 6: IMAGINE</h3> \
        <p>Installatie 6, Imagine (Stel je voor!) laat met een aantal video&rsquo;s zien hoe filmmakers zich de digitale toekomst voorstellen &ndash; en stelt de vraag hoe jij daarover denkt.</p> \
        <p> \
          Deze installatie stelt je in staat om virtueel te reizen naar mogelijke nabije toekomstbeelden, en soms zelfs van het heden, waar technologie, en vooral kunstmatige intelligentie, sterk is doorgedrongen. Vele artiesten, militanten, en zelfs bepaalde bedrijven hebben geprobeerd hun visie te \
          delen met betrekking tot wat AI kan doen of zou kunnen doen in toekomstige samenlevingen. In deze installatie maken wij gebruik van de mogelijkheid om aan jou verschillende visies op onze technologische realiteit of onze vermeende technologische toekomst te laten zien. Tegelijkertijd \
          willen we je ook een kleine indruk geven van wat er op dit moment al mogelijk is. Vandaag de dag zijn slimme sensoren in combinatie met machine learning technologie&euml;n al in staat tot het scannen en uit te lezen van je lichaam, om vervolgens daaruit conclusies te trekken over je \
          emoties en de waardering van de inhoud die je op dat moment bekijkt. Ben je er klaar voor om in een situatie terecht te komen waarin je zult observeren, maar ook geobserveerd gaat worden door de AI technologie&euml;n!? \
        </p> \
      </div> \
      <div class="en"> \
        <h3>INSTALLATION 6: IMAGINE</h3> \
        <p>Installation 6, Imagine uses a number of video clips to show how filmmakers imagine the digital future &ndash; and poses the question of how you think about such depicted scenarios.</p> \
        <p> \
          This installation allows you to virtually travel in possible near futures and sometimes of already existing presents, where technology and, particularly, artificial intelligence is infused. Many artists, militants, and even certain corporations have tried to share their vision of what AI \
          can do or may do in future societies. In this installation, the idea is to use the opportunity of showing you these many visions of our technological reality or our supposed technological future, while at the same time, giving you a glimpse of what is currently feasible here and now. \
          Today, smart sensors coupled with machine learning technologies are already capable of scanning and reading your body, and from this, they can draw conclusions about your emotions and appreciation of the content you watch. Are you ready to enter in a situation when you will observe and be \
          observed by AI technologies!? \
        </p> \
      </div> <br>';
      txt.id = "txts0p1";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function S6P2() {
      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Overzicht</h3> \
        <p> \
          Deze tentoonstelling bestaat uit 8 installaties die een verhaallijn vormen over artifici&euml;le intelligentie (AI) en zelflerende systemen (machine-learning) in de toekomstige samenleving. Elke installatie draagt een Engelstalige titel in de vorm van een werkwoord dat op u / jou van \
          toepassing is, en uitdrukt wat we met deze installatie teweeg willen brengen. De verhaallijn is als volgt: \
        </p> \
        <ul> \
          <li>Installatie 1, Look (Kijk!) laat jou naar jezelf kijken door verschillende spiegelbeelden en filters &ndash; en stelt de vraag wie jij bent en wat jouw identiteit is.</li> \
          <li>Installatie 2, Understand (Begrijp!) legt uit hoe AI werkt &ndash; en stelt de vraag of we AI moeten begrijpen.</li> \
          <li>Installatie 3, Experience (Ervaar!) laat ervaren hoe apps, die gebruik maken van jouw gegevens (data) om jou te vertellen wie jij bent &ndash; en stelt de vraag of deze toepassing van AI jouw identiteit beoordeelt en jouw zelfbeeld be&iuml;nvloedt.</li> \
          <li> \
            Installatie 4, Create (Cre&euml;er) laat de cruciale rol zien van menselijke intelligentie in het cre&euml;ren van de gegevens (data). Namelijk, de onmisbare rol van mensen die gegevens (data) labelen en categoriseren alvorens ze door AI en zelflerende systemen gebruikt kunnen worden \
            &ndash; en stelt de vraag of AI eigenlijk wel zo intelligent is. \
          </li> \
          <li>Installatie 5, Immerse (Dompel je onder!) laat je een aantal toepassing van AI ervaren, namelijk virtual reality (VR), augmented reality (AR), en hyper reality &ndash; en stelt de vraag of deze ervaring bijdraagt aan jouw welzijn.</li> \
          <li>Installatie 6, Imagine (Stel je voor!) laat met een aantal video&rsquo;s zien hoe filmmakers zich de digitale toekomst voorstellen &ndash; en stelt de vraag hoe jij daarover denkt.</li> \
          <li> \
            Installatie 7, Learn (Leer) laat jou kennismaken met een mogelijke toepassing van AI in het bouwen van toekomstscenario&rsquo;s waar je als burger kunt deelnemen, leren en bijdragen &ndash; en stelt de vraag of deze vorm van citizen science tot betere politieke besluiten kan leiden. \
          </li> \
          <li> \
            Installatie 8, Reflect (Reflecteer) wordt gevormd door de vragen en de quotes bij de andere zeven installaties. In deze laatste installatie kun je vervolgens zien hoe andere mensen denken over die vragen &ndash; en stelt de vraag of burgers moeten meedenken over de manier waarop de \
            digitale toekomst vorm krijgt. \
          </li> \
        </ul> \
      </div> \
      <div class="en"> \
        <h3>Overview</h3> \
        <p> \
          This exhibition consists of 8 installations that together form a storyline about artificial intelligence (AI) and self-learning systems (machine-learning technology, MLT) in our future society. Every installation has an English title in the form of a verb.<br /> \
          The storyline is as follows:<br /> \
        </p> \
 \
        <ul> \
          <li>Installation 1, Look lets you look at yourself through different mirrors and filters &ndash; and asks you the question of who you are and what your identity is.</li> \
          <li>Installation 2, Understand explains how AI works &ndash; and asks you the question of whether it is important for us to comprehend AI.</li> \
          <li>Installation 3, Experience provides you with an experience of how apps, that use your data, tell you who you are &ndash; and asks the question of whether this approach of AI judges your identity and influences your self-image.<br /></li> \
          <li> \
            Installation 4, Create shows the crucial role of human intelligence in the creation of data. Namely, the indispensable role of people who label and categorize data before it can be used by AI and self-learning systems &ndash; and asks the question of whether AI is actually as intelligent \
            as we make it out to be.<br /> \
          </li> \
          <li>Installation 5, Immerse lets you experience a number of applications of AI, namely virtual reality (VR), augmented reality (AR), and hyper reality &ndash; and asks the question of whether this experience contributes to your well-being.</li> \
          <li>Installation 6, Imagine uses a number of video clips to show how filmmakers imagine the digital future &ndash; and poses the question of how you think about such depicted scenarios.</li> \
          <li> \
            Installation 7, Learn introduces you to a possible application of AI in the creation of future scenarios wherein you, as a citizen, can participate, learn and contribute &ndash; and asks the question of whether this form of citizen science could lead to better political decision-making. \
          </li> \
          <li> \
            Installation 8, Reflect consists of the questions and quotes of the other seven installations. In this last installation you can subsequently see how other people think about these questions &ndash; and asks the question of whether or not citizens should participate in thinking about our \
            digital future. \
          </li> \
        </ul> \
      </div > <br>';
      txt.id = "txts0p2";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function S6P3() {
      var txt = document.createElement("DIV");
      txt.innerHTML =
        '<div class="nl"> \
        <h3>Uitleg</h3> \
        <p>De tentoonstelling is als volgt opgebouwd:</p> \
        <ul> \
          <li>De installaties in deze ruimte kun je vinden aan de hand van nummer en titel.</li> \
          <li>De installaties bestaan veelal uit schermen die je via de tablet kunt bedienen. Je hebt toegang tot een installatie via de button op de tablet, bijvoorbeeld INSTALLATIE 1. LOOK.</li> \
          <li>Op de wanden van de tentoonstellingsruimte en rond de installaties vind je bij iedere installatie een aantal passende citaten en afbeeldingen die aanleiding geven tot reflectie.</li> \
          <li>Bij iedere installaties wordt (mits je hiertoe toestemming geeft) via de tablet een aantal reflectievragen gesteld.</li> \
          <li>Bij het beantwoorden bent je tot niets verplicht, en kunt altijd vragen overslaan.</li> \
          <li>Statistieken van de meerkeuzevragen, en een aantal geselecteerde open vragen worden getoond in Installatie 8.</li> \
          <li>Voor vragen kun je terecht bij de student-assistenten die hier rondlopen.</li> \
        </ul> \
      </div> \
      <div class="en"> \
        <h3>Explanation</h3> \
        <p>The exhibition is structured as follows:</p> \
        <ul> \
          <li>The installations in this exhibition area can be found using the number and title of the installation.</li> \
          <li>The installations usually consist of screens that can be operated via the tablet. You can access an installation through the button on the tablet, for example INSTALLATION 1. LOOK.</li> \
          <li>On the walls of the exhibition area and around the installations you will find a number of relevant quotes and images which encourage a moment of reflection. The quotes can also be read on the tablet.</li> \
          <li>For each installation a number of reflection questions are presented to you through the tablet.</li> \
          <li>You can access these reflection questions via the REFLECTION button. There is no obligation to answer these, and you can always skip questions.</li> \
          <li>You can only submit answers to these questions if you have given permission (see button PERMISSION for an explanation).</li> \
          <li>Statistics of the multiple choice questions and a number of selected open questions are shown in Installation 8.</li> \
          <li>For questions you can contact the student-assistants who will be walking around the exhibition area.</li> \
        </ul> \
      </div>';
      txt.id = "txts0p3";
      document.getElementById("buttonbox").appendChild(txt);
    }

    function initImageSelectControlS1() {
      //Backwards Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML = "1";
      newbtn.id = "img1";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Img1-S1");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Forward Button
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML = "2";
      newbtn.id = "img2";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Img2-S1");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Play Button
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML = "3";
      newbtn.id = "img3";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Img3-S1");
      });
      document.getElementById("buttonbox").appendChild(newbtn);
    }

    function initModalSelectS4() {
      //Digits
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-list-ol fa-3x"></i>';
      newbtn.id = "digitselect";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Digit-S4");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Tweets
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-twitter fa-3x"></i>';
      newbtn.id = "tweetselect";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Tweets-S4");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //Image
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-heartbeat fa-3x"></i>';
      newbtn.id = "voldown";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Emotion-S4");
      });
      document.getElementById("buttonbox").appendChild(newbtn);
    }

    function destroyControls() {
      console.log("Destroying Controls");
      document.getElementById("buttonbox").innerHTML = "";
      document.getElementById("pagebox").innerHTML = "";
      document.getElementById("videobox").innerHTML = "";

      document.getElementById("questionbox").innerHTML = "";
    }

    //Stand 4
    function initDigitControls() {
      //Buttoncluster
      var newbtn = document.createElement("DIV");
      newbtn.id = "AllButtons";
      newbtn.innerHTML =
        "<div class='btn-group' role='group' aria-label='Basic example'> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>1</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>2</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>3</button> \
        </div> \
        <br> \
        <div class='btn-group' role='group' aria-label='Basic example'> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>4</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>5</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>6</button> \
        </div> \
        <br> \
        <div class='btn-group' role='group' aria-label='Basic example'> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>7</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>8</button> \
          <button type='button' class='btn btn-primary btn-spc btn-redraw'>9</button> \
        </div> \
        <br>";
      document.getElementById("buttonbox").appendChild(newbtn);

      let buttons = document.getElementsByClassName("btn-redraw");
      for (let index = 0; index < buttons.length; index++) {
        const button = buttons[index];
        button.addEventListener("click", function () {
          signal("Digit-S4-" + button.innerHTML);
        });
      }

      //Previous Page
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Terug";
      } else {
        newbtn.innerHTML = "Back";
      }
      newbtn.id = "previous";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.addEventListener("click", function () {
        signal("CloseAllModals");
      });
      document.getElementById("pagebox").appendChild(newbtn);
    }

    function initTweetControls() {
      destroyControls();
      //Previous Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Terug";
      } else {
        newbtn.innerHTML = "Back";
      }
      newbtn.id = "previous";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.addEventListener("click", function () {
        signal("CloseAllModals");
      });
      document.getElementById("pagebox").appendChild(newbtn);

      //Yes
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-check fa-3x"></i>';
      newbtn.id = "yes";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Tweets-S4-yes");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      //No
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      newbtn.innerHTML =
        '<i id="connicon" aria-hidden="true" class="fa fa-close fa-3x"></i>';
      newbtn.id = "no";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Tweets-S4-no");
      });
      document.getElementById("buttonbox").appendChild(newbtn);
    }

    function initEmotionControls() {
      destroyControls();
      //Previous Page
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Terug";
      } else {
        newbtn.innerHTML = "Back";
      }
      newbtn.id = "previous";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.addEventListener("click", function () {
        destroyControls();
        fullPageControl();
        signal("CloseAllModals");
      });
      document.getElementById("pagebox").appendChild(newbtn);

      let div = document.createElement("DIV");
      if (window.lan == "nl") {
        div.innerHTML =
          "<div class='container'> \
        <div class='btn-group btn-group-toggle' data-toggle='buttons'> \
            <label class='btn btn-xl btn-primary' id='option01'> \
                <input type='radio' name='options'  autocomplete='off'> Neutraal \
            </label> \
            <label class='btn btn-xl btn-primary' id='option02'> \
                <input type='radio' name='options'  autocomplete='off'> Kalm \
            </label> \
            <label class='btn btn-xl btn-primary' id='option03'> \
                <input type='radio' name='options'  autocomplete='off'> Blij \
            </label> \
            <label class='btn btn-xl btn-primary' id='option04'> \
                <input type='radio' name='options'  autocomplete='off'> Verdrietig \
            </label> \
            <label class='btn btn-xl btn-primary' id='option05'> \
                <input type='radio' name='options'  autocomplete='off'> Boos \
            </label> \
            <label class='btn btn-xl btn-primary' id='option06'> \
                <input type='radio' name='options'  autocomplete='off'> Bang \
            </label> \
            <label class='btn btn-xl btn-primary' id='option07'> \
                <input type='radio' name='options'  autocomplete='off'> Walgend \
            </label> \
            <label class='btn btn-xl btn-primary' id='option08'> \
                <input type='radio' name='options'  autocomplete='off'> Verrast \
            </label> \
        </div> \
    </div > <br>";
      } else {
        div.innerHTML =
          "<div class='container'> \
        <div class='btn-group btn-group-toggle' data-toggle='buttons'> \
            <label class='btn btn-xl btn-primary' id='option01'> \
                <input type='radio' name='options'  autocomplete='off'> Neutral \
            </label> \
            <label class='btn btn-xl btn-primary' id='option02'> \
                <input type='radio' name='options'  autocomplete='off'> Calm \
            </label> \
            <label class='btn btn-xl btn-primary' id='option03'> \
                <input type='radio' name='options'  autocomplete='off'> Happy \
            </label> \
            <label class='btn btn-xl btn-primary' id='option04'> \
                <input type='radio' name='options'  autocomplete='off'> Sad \
            </label> \
            <label class='btn btn-xl btn-primary' id='option05'> \
                <input type='radio' name='options'  autocomplete='off'> Angry \
            </label> \
            <label class='btn btn-xl btn-primary' id='option06'> \
                <input type='radio' name='options'  autocomplete='off'> Afraid \
            </label> \
            <label class='btn btn-xl btn-primary' id='option07'> \
                <input type='radio' name='options'  autocomplete='off'> Disgusted \
            </label> \
            <label class='btn btn-xl btn-primary' id='option08'> \
                <input type='radio' name='options'  autocomplete='off'> Surprised \
            </label> \
        </div> \
    </div > <br>";
      }
      document.getElementById("buttonbox").appendChild(div);

      let list = document.getElementsByClassName("btn-xl");
      console.log(list);
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        item.addEventListener("click", function () {
          signal("Emotion-S4-yes");
        });
      }
    }
    // Stand 8
    function initReflection() {
      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Scroll omlaag";
      } else {
        newbtn.innerHTML = "Scroll down";
      }
      newbtn.id = "yes";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("PgDn");
      });
      document.getElementById("videobox").appendChild(newbtn);

      newbtn = null;
      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Scroll omhoog";
      } else {
        newbtn.innerHTML = "Scroll up";
      }
      newbtn.id = "yes";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("PgUp");
      });
      document.getElementById("videobox").appendChild(newbtn);

      let div = document.createElement("DIV");
      div.innerHTML =
        "<br><div class='container'> \
              <div class='btn-group btn-group-toggle' data-toggle='buttons'> \
                  <label class='btn btn-xl btn-primary' id='option01'> \
                      <input type='radio' name='options'  autocomplete='off'> 1 \
                  </label> \
                  <label class='btn btn-xl btn-primary' id='option02'> \
                      <input type='radio' name='options'  autocomplete='off'> 2 \
                  </label> \
                  <label class='btn btn-xl btn-primary' id='option03'> \
                      <input type='radio' name='options'  autocomplete='off'> 3 \
                  </label> \
                  <label class='btn btn-xl btn-primary' id='option04'> \
                      <input type='radio' name='options'  autocomplete='off'> 4 \
                  </label> \
                  <label class='btn btn-xl btn-primary' id='option05'> \
                      <input type='radio' name='options'  autocomplete='off'> 7 \
                  </label> \
              </div> \
          </div > <br>";
      document.getElementById("buttonbox").appendChild(div);

      let list = document.getElementsByClassName("btn-xl");
      console.log(list);
      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        item.addEventListener("click", function () {
          console.log("StandReflect-" + item.innerText);
          signal("StandReflect-" + item.innerText);
        });
      }
    }

    //Stand 7
    function initEcoControls() {
      console.log("init eco controls");
      signal("Eco-S7-Reset");

      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Reset normaal";
      } else {
        newbtn.innerHTML = "Reset default";
      }
      newbtn.id = "resetEco";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Eco-S7-Reset");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Reset met bos";
      } else {
        newbtn.innerHTML = "Reset with forest";
      }
      newbtn.id = "resetEcoForest";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Eco-S7-ResetwForest");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "+1 Jaar";
      } else {
        newbtn.innerHTML = "+1 Year";
      }
      newbtn.id = "1yEco";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Eco-S7-1Y");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      var newbtn = document.createElement("BUTTON");
      if (window.lan == "nl") {
        newbtn.innerHTML = "+5 Jaar";
      } else {
        newbtn.innerHTML = "+5 Year";
      }
      newbtn.id = "5yEco";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Eco-S7-5Y");
      });
      document.getElementById("buttonbox").appendChild(newbtn);

      var newbtn = document.createElement("DIV");
      if (window.lan == "nl") {
        newbtn.innerHTML = "Schakel weergave";
      } else {
        newbtn.innerHTML = "Switch view";
      }
      newbtn.id = "toggleEco";
      newbtn.classList = "btn btn-spc btn-primary";
      newbtn.type = "button";
      newbtn.addEventListener("click", function () {
        signal("Eco-S7-Toggle");
      });
      document.getElementById("videobox").appendChild(newbtn);
    }
  }

  initialize();

  connectButton.addEventListener("click", join);
})();
