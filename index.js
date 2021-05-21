const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
try {
    fs.readdir('../../_actions/actions','utf8', function(err, data){
        if(err){
            return console.log(err)
        }
        console.log(data)
        core.setOutput("directory", data)
    }) 
} catch(error) {
    core.setFailed(error.message)
}