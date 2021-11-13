const core = require('@actions/core')
const fs = require('fs')
const axios = require('axios');
const validateUrl = 'https://safeaction.1pf.cz/api/actions/validate';
const possibleModes = ['SAFE', 'INFORMATION', 'IGNORE'];

async function callApi(actionsToCheck, authorization) {
    try {
        const response = await axios.post(validateUrl, actionsToCheck,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authorization
                }
            }
        )

        return response.data
    } catch (e) {
        core.error(e)
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

function getOtherTestedVersions(action) {
    if (action.otherTestedVersions && action.otherTestedVersions.length > 0) {
        core.info("Available versions of " + action.name + " are: ")
        core.info(action.otherTestedVersions)
    }
}

try {
    //Additional info
    const authorization = core.getInput('authorization')

    if (!authorization) {
        core.warning("No authorization provided. SafeAction will check just first 3 actions in pipeline.")
        core.warning("If an action is not found or is not OK SafeAction will not provide alternative tested versions.")
        core.warning("For generating your own token, please visit:")
    }

    let appMode = core.getInput('mode')

    if (!possibleModes.includes(appMode)) {
        throw Error('INVALID MODE, POSSIBLE VALUES ARE ' + possibleModes)
    }

    if (appMode === 'IGNORE') {
        core.info('\u001b[93mAction mode set to IGNORE, skipping ACTION validation')
        return;
    }

    let path = '../../_actions/'
    const creators = fs.readdirSync(path)
    core.info("Found creators:")
    core.info(creators)
    const actionsApiModelArray = []
    if (creators != null) {
        const filteredCreators = creators.filter(creator => creator != "1-PF")

        filteredCreators.forEach(creator => {
            fs.readdirSync(path + creator).forEach(action => {
                const actionVersion = fs.readdirSync(path + creator + '/' + action)[0]

                const actionModel = {
                    name: action,
                    creator: creator,
                    version: actionVersion
                }
                actionsApiModelArray.push(actionModel)
            })
        })
    } else {
        logWarnOrErr("No creators found in pipeline!", appMode)
    }
    core.info("Found actions:")
    console.log(actionsApiModelArray)
    callApi(actionsApiModelArray, authorization).then(response => {
        if (response) {
            response.forEach(action => {
                const actionLabel = action.creator + "/" + action.name + "@" + action.version;
                const result = action.overallResult
                if (result === "OK" || result === "PARTIALLY_OK") {
                    core.info("\u001B[32mAction " + actionLabel + " IS " + result + ".")
                } else if (result === "NOT_FOUND") {
                    logWarnOrErr("Action " + actionLabel + " WAS NOT MARKED AS SAFEACTION", appMode)
                    getOtherTestedVersions(action)
                } else if (result === "NOT_OK") {
                    logWarnOrErr("Action " + actionLabel + " NOT SAFE.", appMode)
                    getOtherTestedVersions(action)
                } else if (result === "NOT_EVALUATED") {
                    logWarnOrErr("Action " + actionLabel + " WAS NOT EVALUATED", appMode)
                    getOtherTestedVersions(action)
                }
            })
        } else {
            logWarnOrErr("ERROR WHILE GETTING ACTIONS INFORMATION, NO ACTIONS WERE VALIDATED", appMode)
        }
    }).catch(err => {
        core.setFailed(err.message)
    })
} catch (error) {
    core.setFailed(error.message)
}
