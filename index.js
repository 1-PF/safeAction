const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
try {
    fs.readFile('.github/workflows/maven.yml','utf8', function(err, data){
        if(err){
            return console.log(err)
        }
        console.log(data)
        core.setOutput("file",data)


        let decoder = new TextDecoder();
        let promise = OS.File.read(".github/workflows/maven.yml")
        promise = promise.then(
            function onSuccess(array) {
              return decoder.decode(array);        // Convert this array to a text
            }
          );
        console.log(promise)
    }) 
} catch(error) {
    core.setFailed(error.message)
}