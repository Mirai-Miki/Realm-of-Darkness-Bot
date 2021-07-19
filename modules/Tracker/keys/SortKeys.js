const errorType = require('../TypeDef/errors.js');
const mode = require('../TypeDef/mode.js');

module.exports.sortKeys = (tracker, handler) =>
{
    let keys = {};
    let unknownKeys = [];
    tracker.keys.forEach((value, key, map) => 
    {
        let iskey = false;
        
        for (let keyHelp of Object.values(handler.getKeys()))
        {
            if (keyHelp.keys.includes(key))
            {
                if (keys[keyHelp.codeKey]) 
                {
                    tracker.error = errorType.dupKey;
                }                    
                
                iskey = true;
                if (keyHelp.returnType == 'int')
                {
                    if (value.match(/(?!^-|^\+)\D/g)) 
                    {
                        tracker.error = errorType.keyReturnNotInt;
                        break;
                    }
                    keys[keyHelp.codeKey] = parseInt(value);
                    
                    // Check int values for keys are within constraints
                    if (tracker.mode != mode.update &&
                        keyHelp.setConstraints && 
                        value < keyHelp.setConstraints.min)
                    {
                        // Consumable in new or set mode
                        tracker.error = errorType.exceededSetMinValue;
                        break;
                    }
                    else if (tracker.mode != mode.update &&
                        keyHelp.setConstraints && 
                        value > keyHelp.setConstraints.max)
                    {
                        // Consumable in new or set mode
                        tracker.error = errorType.exceededSetMaxValue;
                        break;
                    }
                    else if ((tracker.mode == mode.update &&
                        keyHelp.setConstraints && 
                        value < keyHelp.constraints.min) ||
                        (!keyHelp.consumable && keyHelp.constraints && 
                        value < keyHelp.constraints.min))
                    {
                        tracker.error = errorType.exceededMinValue;
                        break;
                    }
                    else if ((tracker.mode == mode.update &&
                        keyHelp.setConstraints && 
                        value > keyHelp.constraints.max) ||
                        (!keyHelp.consumable && keyHelp.constraints && 
                        value > keyHelp.constraints.max))
                    {                        
                        tracker.error = errorType.exceededMaxValue;
                        break;
                    }
                }
                else keys[keyHelp.codeKey] = value;
                break;
            }
        }
        if (!iskey) unknownKeys.push(`${key} = ${value}`);
    });
    return [keys, unknownKeys];
}