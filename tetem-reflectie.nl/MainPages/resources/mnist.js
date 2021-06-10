function loadJSON0 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/0.json', true) // Replace 'my_data' with the path to your file
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
  window.d0 = JSON.parse(response)
})
function loadJSON1 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/1.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON1(function (response) {
  // Parse JSON string into object
  window.d1 = JSON.parse(response)
})
function loadJSON2 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/2.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON2(function (response) {
  // Parse JSON string into object
  window.d2 = JSON.parse(response)
})
function loadJSON3 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/3.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON3(function (response) {
  // Parse JSON string into object
  window.d3 = JSON.parse(response)
})
function loadJSON4 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/4.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON4(function (response) {
  // Parse JSON string into object
  window.d4 = JSON.parse(response)
})
function loadJSON5 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/5.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON5(function (response) {
  // Parse JSON string into object
  window.d5 = JSON.parse(response)
})
function loadJSON6 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/6.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON6(function (response) {
  // Parse JSON string into object
  window.d6 = JSON.parse(response)
})
function loadJSON7 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/7.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON7(function (response) {
  // Parse JSON string into object
  window.d7 = JSON.parse(response)
})
function loadJSON8 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/8.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON8(function (response) {
  // Parse JSON string into object
  window.d8 = JSON.parse(response)
})
function loadJSON9 (callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType('application/json')
  xobj.open('GET', './digits/9.json', true) // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == '200') {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}
loadJSON9(function (response) {
  // Parse JSON string into object
  window.d9 = JSON.parse(response)
})

// MNIST digits
export let MNIST = []

// size of the sample images (28 x 28)
var size = 28

// raw data
setTimeout(() => {
  var raw = [
    window.d0.data,
    window.d1.data,
    window.d2.data,
    window.d3.data,
    window.d4.data,
    window.d5.data,
    window.d6.data,
    window.d7.data,
    window.d8.data,
    window.d9.data
  ]
  console.log(raw)

  ;[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(function (id) {
    // mnist digit
    console.log(id)
    var digit = {
      id: id
    }

    // raw data
    digit.raw = raw[digit.id]

    // number of samples
    digit.length = (digit.raw.length / (size * size)) | 0

    // get one sample
    digit.get = function (_which) {
      var which = _which
      // if not specified, or if invalid, pick a random sample
      if ('undefined' == typeof which || which > digit.length || which < 0) {
        which = (Math.random() * digit.length) | 0
      }

      // generate sample
      var sample = []
      for (
        var length = size * size, start = which * length, i = 0;
        i < length;
        sample.push(digit.raw[start + i++])
      );
      return sample
    }

    // get a range of samples
    digit.range = function (start, end) {
      if (start < 0) start = 0
      if (end >= digit.length) end = digit.length - 1
      if (start > end) {
        var tmp = start
        start = end
        end = tmp
      }
      var range = []
      for (var i = start; i <= end; range.push(digit.get(i++)));
      return range
    }

    // get set of digits, ready to be used for training or testing
    digit.set = function (start, end) {
      var set = []
      var output = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      output[digit.id] = 1
      var range = digit.range(start, end)
      for (
        var i = 0;
        i < range.length;
        set.push({
          input: range[i++],
          output: output
        })
      );
      return set
    }

    // add mnist digit
    MNIST.push(digit)
  })
}, 7000)

// Generates non-overlaping training and a test sets, with the desired ammount of samples
MNIST.get = function (count) {
  var range = []
  for (var i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
    range = range.concat(this.set(0, this.length))
  }
  range = shuffle(range)
  if (Number(count)) {
    range = range.slice(0, Number(count))
  }
  return range
}

// Generates non-overlaping training and a test sets, with the desired ammount of samples
MNIST.set = function (_training, _test) {
  var training = (_training / 10) | 0
  var test = (_test / 10) | 0

  if (training < 1) training = 1
  if (test < 1) test = 1

  // check that there are enough samples to make the sets, and change the ammounts if they are too big
  if (training + test + 1 > MNIST.__MINLENGTH) {
    console.warn(
      'There are not enough samples to make a training set of ' +
        training +
        ' elements and a test set of ' +
        test +
        ' elements.'
    )
    if (training > test) {
      test = MNIST.__MINLENGTH * (test / training)
      training = MNIST.__MINLENGTH - training
    } else {
      training = MNIST.__MINLENGTH * (training / test)
      test = MNIST.__MINLENGTH - test
    }
  }

  // make both sets
  var trainingSet = []
  var testSet = []

  for (var i = 0; i < 10; i++) {
    trainingSet = trainingSet.concat(MNIST[i].set(0, training - 1))
    testSet = testSet.concat(MNIST[i].set(training, training + test - 1))
  }

  // return the sets, shuffled
  return {
    training: shuffle(trainingSet),
    test: shuffle(testSet)
  }
}

// draws a given digit in a canvas context
MNIST.draw = function (digit, context, offsetX, offsetY) {
  var imageData = context.getImageData(offsetX || 0, offsetY || 0, size, size)
  for (var i = 0; i < digit.length; i++) {
    imageData.data[i * 4] = (1.0 - digit[i]) * 255
    imageData.data[i * 4 + 1] = (1.0 - digit[i]) * 255
    imageData.data[i * 4 + 2] = (1.0 - digit[i]) * 255
    imageData.data[i * 4 + 3] = 255
  }
  context.putImageData(imageData, offsetX || 0, offsetY || 0)
}

// takes an array of 10 digits representing a number from 0 to 9 (ie. any output in a dataset) and returns the actual number
MNIST.toNumber = function (array) {
  return array.indexOf(Math.max.apply(Math, array))
}

function shuffle (v) {
  for (
    var j, x, i = v.length;
    i;
    j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x
  );
  return v
}
