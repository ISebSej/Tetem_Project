function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

// load data from resources
function loadJSON0 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', '../resources/resolutions.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON0(function (response) {
  // Parse JSON string into object
  window.DATA_SET = JSON.parse(response)
  console.log(window.DATA_SET[2080])

  // select random instance from tweets
  let randnum = getRandomInt(5000)
  tweet = window.DATA_SET[randnum]

  console.log(tweet)
  //insertdata in tweet
  // name
  document.getElementById('questionOutput').innerHTML =
    'Is this new years resolution about: ' + tweet.resolution_topics
  document.getElementById('tweetOutput').innerHTML = tweet.text
  document.getElementById('nameOutput').innerHTML = tweet.name
  document.getElementById('usernameOutput').innerHTML = tweet.name

  document.getElementById('verifiedOutput').style.visibility = 'visible'
})
