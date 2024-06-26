import { get_domain } from "./client/client";

export class injectionDetector {

    private codeBlock : string;

    constructor(codeBlock){
        this.codeBlock = codeBlock;
    }

    public get_domain_analysis() : void {
        const tab_domain = get_domain(this.codeBlock);
        
        tab_domain.then((response)=> {
            console.log(`Received response: ${response}`);
        })
        
    }

}