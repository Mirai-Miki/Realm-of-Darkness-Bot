const errorType = require('../TypeDef/errors.js');

module.exports.sortKeys = (tracker, handler) =>
{
    let keys = {};
    let unknownKeys = [];
    tracker.keys.forEach((value, key, map) => 
    {
        for (let keyHelp of Object.values(handler.getKeys()))
        {
            if (keyHelp.keys.includes(key))
            {
                if (keys[keyHelp.codeKey]) 
                    tracker.error = errorType.dupKey;
                
                if (keyHelp.returnType == 'int')
                {
                    if (parseInt(value) === NaN) 
                    {
                        tracker.error = errorType.keyReturnNotInt;
                        break;
                    }
                    keys[keyHelp.codeKey] = parseInt(value);
                }
                else keys[keyHelp.codeKey] = value;
            }
            else
            {
                unknownKeys.push(`${key} = ${value}`);
            }
        }
    });
    return [keys, unknownKeys];
}