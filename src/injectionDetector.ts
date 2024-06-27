import { get_domain } from "./client/client";

export class injectionDetector {

    private codeBlock : string;

    constructor(codeBlock){
        this.codeBlock = codeBlock;
    }

    public get_domain_analysis() : string [] {
        const tab_domain = get_domain(this.codeBlock);
        
        let domainVariables: string[] = [];

        tab_domain
        .then((response)=> {
            console.log(`Received response: ${response}`);
            domainVariables = response;
        })
        .catch((error) => {
            console.log("error getting domain analysis")
        })

        return domainVariables;
    }

}