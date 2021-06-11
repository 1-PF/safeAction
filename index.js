const core = require('@actions/core')
const fs = require('fs')
const axios = require('axios');

async function postData(url, creator, version, action){
    try{
        const response = await axios.post(url, {
            creator: creator,
            name: action,
            version: version,
            detail: 'FULL'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        console.log("HERE?")
        console.log(response)
        return response.json();
    } catch(e){
        return null;
    }
}

try {
    //Additional info
    const githubToken = core.getInput('github-token') //WORKS!!!
    let appMode = core.getInput('mode')
    console.log(appMode)
    if(appMode != 'alert' || appMode != 'stop')
        appMode = 'stop'
    
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
                        postData('https://arp-be-prod.azurewebsites.net/api/actions/search', creator, version[0], action).then(data =>{
                            console.log(data);
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