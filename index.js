const core = require('@actions/core')
const fs = require('fs')
const fetch = require("node-fetch");

const safeActions = [
    'cache',
    'checkout'
]

async function postData(url='', data={}){
    try{
    const response = await fetch(url,{
        method: 'POST',
        mode: 'cors',
        cache: 'no-chache',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    });
    return response.json();
    } catch(err){
        return err;
    }
}

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
                        postData('https://actoins-results-provider-arp-be.azuremicroservices.io/api/actions/search',{
                            creator: creator,
                            name: action,
                            version: version,
                            detail: "BASIC"
                          }).then(data =>{
                              if(!(data.id && data.version && data.creator && data.commitHash && data.name) || data == null){
                                throw new Error('Actions are not safe')
                              }
                          }).catch(err=> {
                              throw err
                          })
                    })
                })
            })
        })
    }) 
} catch(error) {
    core.setFailed(error.message)
}