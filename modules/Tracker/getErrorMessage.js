const errorType = require('./TypeDef/errors.js');

module.exports.getErrorMessage = (code) =>
{
    error = {}
    error[errorType.noKey] = 'No Keys were provided. Please check the /keys' +
    ' command for more information on keys.';

    error[errorType.dupChar] = 'Sorry, but this character already exists.' +
    ' Please try using a differant name.';

    error[errorType.noChar] = 'Sorry, I cannot find this character.' +
    ' Please check the name is correct.';

    error[errorType.noPerm] = 'You are trying to use a command that requires' +
    ' permissions to use. You are not the owner of this character, an ST ' +
    'or Admin.';

    error[errorType.dupKey] = 'Oops, looks like you used the same key twice.' +
    ' Please check the command and remove and duplicate keys.';

    error[errorType.handle] = 'There was an Error in the Character Handler.\n' +
    'If you are seeing this message then please report it too Mirai-Miki#6631';

    error[errorType.missingHumanity] = 'Looks like you are missing the ' +
    'Humanity key. New characters require this key.\n' +
    'For more information on keys please use the /keys command';

    error[errorType.missingWillpower] = 'Looks like you are missing the ' +
    'Willpower key. New characters require this key.\n' +
    'For more information on keys please use the /keys command';

    error[errorType.missingHealth] = 'Looks like you are missing the ' +
    'Health key. New characters require this key.\n' +
    'For more information on keys please use the /keys command';

    error[errorType.missingVer] = 'Looks like you are missing the ' +
    'Version key. New characters require this key.\n' +
    'For more information on keys please use the /keys command';

    error[errorType.missingSplat] = 'Looks like you are missing the ' +
    'Splat key. New characters require this key.\n' +
    'For more information on keys please use the /keys command';

    error[errorType.incorrectSplatOrVer] = 'Sorry, but the version or splat' +
    ' you have provided does not seem to exist. Please double check the' +
    ' values for those keys.';

    error[errorType.keyReturnNotInt] = 'The value on one of your keys' +
    ' requires a number and it seems you provided something else.\n' +
    'For more information on keys please use the /keys command';

    error[errorType.exceededMinValue] = 'Looks like you have exeeded the' +
    ' Minimum value for one of the keys.\n' +
    'For more information on key constraints please use the /keys command';

    error[errorType.exceededMaxValue] = 'Looks like you have exeeded the' +
    ' Maximum value for one of the keys.\n' +
    'For more information on key constraints please use the /keys command'; 

    return error[code];
}