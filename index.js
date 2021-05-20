const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')
try {
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}`);
    fs.readFile('.github/workflows/maven.yml','utf8', function(err, data){
        if(err){
            return console.log(err)
        }
        console.log(data)
    })
    const time = (new Date()).toTimeString()
    core.setOutput("time",time)
    const payload = JSON.stringify(github.context.payload, undefined , 2)
    console.log(`The ivent payload: ${payload}`)
} catch(error) {
    core.setFailed(error.message)
}