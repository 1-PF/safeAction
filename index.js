const core = require('@actions/core')
const fs = require('fs')
const axios = require('axios');
const searchUrl = 'http://arp-services.westeurope.azurecontainer.io:8080/api/actions/search';
const possibleModes = ['SAFE', 'INFORMATION', 'IGNORE'];

async function postData(url, creator, version, action) {
    try {
        const response = await axios.post(url, {
            creator: creator,
            name: action,
            version: version,
            detail: 'BASIC'
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        return response.data
    } catch (e) {
        console.log("Error while getting action information")
        return null;
    }
}

function logWarnOrErr(errMsg, appMode) {
    if (appMode === 'SAFE') {
        core.error(errMsg);
        core.setFailed('Action validation failed')
    } else if (appMode === 'INFORMATION') {
        core.warning(errMsg)
    }
}

try {
    //Additional info
    const githubToken = core.getInput('github-token') //WORKS!!!

    let appMode = core.getInput('mode')

    if (!possibleModes.includes(appMode)) {
        throw Error('INVALID MODE, POSSIBLE VALUES ARE ' + possibleModes)
    }

    if (appMode === 'IGNORE') {
        core.info('\u001b[93mAction mode set to IGNORE, skipping ACTION validation')
        return;
    }

    let path = '../../_actions/'
    fs.readdir(path, function (err, creators) {
        core.info("Found creators in pipeline: " + creators)
        const filteredCreators = creators.filter(creator => creator != "1-PF")
        if (err) {
            core.setFailed(err.message)
            return console.log(err)
        }
        filteredCreators.forEach(creator => {
            fs.readdir(path + creator, function (err, actions) {
                if (err) {
                    return console.log(err)
                }
                actions.forEach(action => {
                    fs.readdir(path + creator + '/' + action, function (err, version) {
                        if (err) {
                            return console.log(err)
                        }
                        postData(searchUrl, creator, version[0], action).then((data) => {
                            const actionLabel = creator + "/" + action + "@" + version[0];
                            if (data.length === 0) {
                                logWarnOrErr("Action " + actionLabel + " WAS NOT MARKED AS SAFEACTION", appMode)
                                postData(searchUrl, creator, null, action).then(res => {
                                    core.info("Available versions of " + action + " are: ")
                                    core.info(res.map(action => action.version))
                                })
                            } else if (data.length > 0) {
                                if (data[0].overallResult !== 'OK') {
                                    logWarnOrErr("Action " + actionLabel + " NOT SAFE.", appMode)
                                } else if (data[0].overallResult == 'OK') {
                                    core.info("Action " + actionLabel + " IS SAFE.")
                                }
                            } else if (!data) {
                                logWarnOrErr("Could not verify action, an error occured while retrieving action results")
                            }
                        }).catch(err => {
                            core.setFailed(err.message)
                        })
                    })
                })
            })
        })
    })
} catch (error) {
    core.setFailed(error.message)
}
