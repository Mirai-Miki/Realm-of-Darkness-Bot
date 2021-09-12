module.exports = class Util
{
    static hourToMilli(hour)
    {
        return this.minToMilli(hour * 60);
    }

    static minToMilli(min)
    {
        return ((min*60)*1000);
    }
}