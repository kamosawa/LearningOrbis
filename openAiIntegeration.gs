function onOpen() {
   DocumentApp.getUi().createMenu("Auto Blog")
    .addItem('ブログ記事を生成', "argJa")
    .addItem("Generate English Blog", "myFunction")
    .addToUi();
}

function argJa(){
  myFunction("ja")
}

function myFunction(lang) {
  var doc = DocumentApp.getActiveDocument()
  var selectedText = doc.getSelection().getRangeElements()[0].getElement().asText().getText()
  var body = doc.getBody()

  // Replace YOUR_API_KEY with your actual OpenAI API key
  var apiKey = "YOUR API KEY";
  var prompt = "Generate a detailed full length article about " + selectedText;

  // var model = "text-davinci-002";
  var model = "text-davinci-003"
  temperature= 0
  maxTokens = 4000

    // Set up the request body with the given parameters
    const requestBody = {
      "model": model,
      "prompt": prompt,
      "temperature": temperature,
      "max_tokens": maxTokens,
    };

    const requestOptions = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+apiKey
      },
      "payload": JSON.stringify(requestBody)
    }

  // Call the OpenAI API

  const response = UrlFetchApp.fetch("https://api.openai.com/v1/completions", requestOptions);


  // Parse the response and get the generated text
  var responseText = response.getContentText();
  var json = JSON.parse(responseText);
  var theText = json['choices'][0]['text']
  var jpText = LanguageApp.translate(theText, 'en', 'ja')
  Logger.log(json['choices'][0]['text'])
  Logger.log(jpText)

  // set language
  if (lang=="ja"){
    para2 = body.appendParagraph(jpText);
    para = body.appendParagraph(theText);
    } else {
    para = body.appendParagraph(theText);
    para2 = body.appendParagraph(jpText);
  }


  //Image Generation
    // Set up the request body with the given parameters
    var prompt2 = "Generate images for " + selectedText;
    const requestBody2 = {
      "prompt": prompt2,
      "n": 2,
      "size": "512x512"
    };

    const requestOptions2 = {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+apiKey
      },
      "payload": JSON.stringify(requestBody2)
    }


  const response2 = UrlFetchApp.fetch("https://api.openai.com/v1/images/generations", requestOptions2);


  // Parse the response and get the generated text
  var responseText = response2.getContentText();
  var json = JSON.parse(responseText);
  var url1=json['data'][0]['url']
  var url2=json['data'][1]['url']
  body.appendImage(UrlFetchApp.fetch(url1).getBlob());
  body.appendImage(UrlFetchApp.fetch(url2).getBlob());

}
