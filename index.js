const core = require('@actions/core')
const fs = require('fs')

const safeActions = [
    'cache',
    'checkout'
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
        console.log("All actions are safe")
        core.setOutput("OK", "All actions are safe")
    }) 
} catch(error) {
    core.setFailed(error.message)
}