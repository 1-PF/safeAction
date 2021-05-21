const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
try {
    fs.readFile('.github/workflows/application.yml','utf-8', function(err, data){
        if(err){
            return console.log(err)
        }
        console.log(data)
        core.setOutput("file", data)
    }) 
} catch(error) {
    core.setFailed(error.message)
}