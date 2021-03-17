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
                    if (isNaN(parseInt(value))) 
                    {
                        tracker.error = errorType.keyReturnNotInt;
                        break;
                    }
                    keys[keyHelp.codeKey] = parseInt(value);

                    if (keyHelp.constraints && value < keyHelp.constraints.min)
                    {
                        tracker.error = errorType.exceededMinValue;
                        break;
                    }
                    else if (keyHelp.constraints && 
                        value > keyHelp.constraints.max)
                    {
                        tracker.error = errorType.exceededMaxValue;
                        break;
                    }
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