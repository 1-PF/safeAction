const core = require('@actions/core')
const fs = require('fs')
const axios = require('axios')

const safeActions = [
    'cache',
    'checkout'
]

try {
    let path = '../../_actions/'
    fs.readdir(path, function(err, creators){
        if(err){
            return console.log(err)
        }
        creators.forEach(creator => {
            fs.readdir(path+creator,function(err, actions){
                if(err){
                    return console.log(err)
                }
                actions.forEach(action => {
                    fs.readdir(path+creator+'/'+action, function(err, version){
                        if(err){
                            return console.log(err)
                        }
                        axios.post('https://actoins-results-provider-arp-be.azuremicroservices.io/api/actions/search',{
                            creator: creator,
                            name: action,
                            version: version,
                            detail: "BASIC"
                        }).then(response => {
                            if(response.name
                            && response.creator == creator 
                            && response.version 
                            && response.commitHash 
                            && response.id){
                                console.log("All actions are safe")
                                core.setOutput("OK", "All actions are safe")
                            } else{
                                throw 'Actions are not safe'
                            }
                        })
                    })
                })
            })
        })
    }) 
} catch(error) {
    core.setFailed(error.message)
}