const core = require('@actions/core')
const fs = require('fs')
const fetch = require("node-fetch");

const safeActions = [
    'cache',
    'checkout'
]

async function postData(url){
    try{
        const response = await fetch(url)
        return response.json();
    } catch(e){
        return null;
    }
}

try {
    const githubToken = core.getInput('github-token') //WORKS!!!
    let path = '../../_actions/'
    fs.readdir(path, function(err, creators){
        if(err){
            core.setFailed(err.message)
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
                        postData('https://actoins-results-provider-arp-be.azuremicroservices.io/api/actions/'+action).then(data =>{
                            //Here we need to add == for all data (does not work for mock data)
                              if(!(data.id && data.version && data.creator == creator && data.commitHash && data.name == action) 
                              || data == null
                              || (creator == '1-PF' && action == 'safeAction')){
                                console.log(data.name + "!=" + actions +", "+actions+"is not OK")
                                throw new Error('Actions are not safe')
                              }
                              console.log(data.name+"is OK")
                          }).catch(err=> {
                                core.setFailed(err.message)
                          })
                    })
                })
            })
        })
    }) 
} catch(error) {
    core.setFailed(error.message)
}