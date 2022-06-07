

class FetchMemberError extends Error
{
    constructor() 
    {
        super("Could not Fetch Guild Members!");
        this.name = "FetchMemberError";
    }
}