export default interface PayloadResponses{
    "to-be-suggested":string[],
    "suggested-words": SuggestedWords[]
}

interface SuggestedWords{
    [property_name:string]:string[]
}

