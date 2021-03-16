const errorType = require('./TypeDef/errors.js');

module.exports.getErrorMessage = (code) =>
{
    error = {}
    error[errorType.noKey] = 'No Keys were provided. Please';
    error[errorType.dupChar] = 'Dup Char';
    error[errorType.noChar] = 'No Char';
    error[errorType.noPerm] = 'No perm';
    error[errorType.dupKey] = 'Dup Key';
    error[errorType.handle] = 'Handle Error';
    error[errorType.missingHumanity] = 'Missing Humanity';
    error[errorType.missingWillpower] = 'Missing Willpower';
    error[errorType.missingHealth] = 'Missing Health';
    error[errorType.missingVer] = 'Missing Version';
    error[errorType.missingSplat] = 'Missing Splat';
    error[errorType.incorrectSplatOrVer] = 'Incorrect Splat or Version';
    error[errorType.keyReturnNotInt] = 'Incorrect Key Usage';
    error[errorType.missingPermission] = 'Missing Permissions';
    

    return error[code];
}