const core = require('@actions/core')
const github = require('@actions/github')
const fs = require('fs')

const safeActions = [
    'cache',
    'actions'
]
try {
    fs.readdir('../../_actions/actions', function(err, data){
        if(err){
            return console.log(err)
        }
        //console.log(data)
        data.forEach(action => {
            if(!safeActions.includes(action)){
                throw "Not safety action was detected"
            }
        })
        core.setOutput("directoryFiles", data)
    }) 
} catch(error) {
    core.setFailed(error.message)
}