const engine = require("php-parser");
import * as fs from 'fs';
// var Parser = require("jison").Parser;

// interface args {
//     bar: string;
//     baz: boolean;
//     idk: number;
// }


export class fileParser{
    ast : any;

    mixedArray: (string | object)[]; 

    private get_expression(expression){
        const leftElt = expression['left'];
        this.mixedArray.push(leftElt['name']);
        
        const rightElt = expression['right'];

        switch(rightElt['kind']) { 
            case "call": { 
                // retrieve function name
                const funcName =  rightElt['what']['name'];

                // check function's arguments
                const bool_arg = Object.entries(rightElt).filter(([key1,_]) => key1 == "arguments");
                
                // Make sure function contains arguments
                if(bool_arg){
                    // store number of arguments
                    const numb_arg = rightElt['arguments'].length;
                    
                    const function_args: object[] = [];
                    
                    // Extract all arguments
                    for(let i=0 ; i < numb_arg ; i++){

                        if(rightElt['arguments'][i]['kind'] == "bin"){
                            function_args.push(rightElt['arguments'][i]['left']['raw']);
                            function_args.push(rightElt['arguments'][i]['right']['raw']);    
                        }

                    }
                    this.mixedArray.push(function_args);
                    // console.log(rightElt['arguments'].length)
                    // for(let i =0; i< numb_arg; i++)
                        // console.log(function_args[i]);
                }

                break; 
            } 
            case "variable": { 
                const varName = rightElt['what']['name'];
                this.mixedArray.push(rightElt['name'])
                break; 
            } 
            case "offsetlookup":{
                // offsetlookup <==> probably $_GET or $_POST
                if(rightElt['offset']['kind'] == "string"){
                    const varName = rightElt['offset']['value'];
                    this.mixedArray.push(rightElt['what']['name']);
                }
                break;
            }
            default: { 
                break; 
            } 
        } 
    }

    private displayArr(){
        this.mixedArray.forEach( (element) => {
            // console.log(typeof element)
            if(typeof element == "object")
                console.log(JSON.stringify(element));
            else console.log(element); 

        });
    }


    constructor(filePath){
        // initialize a new parser instance
        const parser = new engine({
            // some options :
            parser: {
            extractDoc: true,
            php7: true,
            },
            ast: {
            withPositions: true,
            },
        });

        const phpFile = fs.readFileSync(filePath);
        this.ast = parser.parseCode(phpFile);
        this.mixedArray = [];
        this.dfsUtil(this.ast,[]);
        console.log("here");
        this.displayArr();
        // console.log(this.mixedArray);
    }
    
    dfsUtil(v, visited){
        for (const [key, value] of Object.entries(v)) {
            if(value != null && typeof value == "object" && key!="loc" && key!="position"){
                this.dfsUtil(value,visited);

                // if(key=="left" && value['kind']=="variable")
                //     console.log(value);
                if(value['kind'] == "expressionstatement"){
                    this.get_expression(value['expression']);
                }
                // console.log("arg taille:" + value['expression']);
            }
        }
        
    }


}