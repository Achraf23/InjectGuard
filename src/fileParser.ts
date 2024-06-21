const engine = require("php-parser");
import * as assert from 'assert';
import { Element, Type, Variable } from './interfaces';



export class FileParser{
    ast : any;

    private static readonly sql_functions: string[] = ['sqlite_query', 'mysql_query', 'mysqli_query', 'pg_query'];

    private static readonly sqlSelectRegex: RegExp = /^(?=.*SELECT.*FROM)(?!.*(?:CREATE|DROP|UPDATE|INSERT|ALTER|DELETE|ATTACH|DETACH)).*$/;
    

    constructor(codeBlock){
        this.ast = this.build_ast(codeBlock);      
    }

    // Static method to test if a given SQL query matches the criteria
    private static isSelectQuery(query: string): boolean {
        return this.sqlSelectRegex.test(query);
    }

    private build_ast(codeBlock){
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

        return parser.parseCode(codeBlock);
    }

    private get_element(element : object) : Element {
        switch(element['kind']){
            case "encapsed":
                return this.get_encapsed(element);
            case "string":
                return this.get_string(element);
            case "variable":
                return this.get_variable(element);
            case "numner":
                return this.get_number(element);
            case "offsetlookup":
                return this.get_offsetlookup(element);
            default:
                console.log("DEFAULT");  
                return {type:Type.NULL, value: "" };
        }
    }


    /**
     * Extract arguments of functions that execute sql queries 
     * Then checks if user's input is present in these arguments 
     */
    public extract_elements(){
        let elements : Array<Element> = new Array<Element>();

        // Retrieve program node
        const program = this.ast['children'];
        // console.log(this.extract_elements_sub(program));
        const args = this.extract_elements_sub(program);
        console.log(JSON.stringify(args))

        // const encapsed = args.filter(arg => arg.type == Type.ENCAPSED);
        // assert.strictEqual(encapsed.length,1);

        // const regex = /\$[a-zA-Z0-9_]+/g;
        // const matches = encapsed[0].value.match(regex);

        // Retrieve variables 
        // let variables: string[] = [];
        // if(matches) {
        //     matches.forEach(match => variables.push(match));
        // } else {
        //     console.log("No matches found.");
        // }
    
        return elements;
    }

    private extract_elements_sub(node) : [Array<Element>,Array<Variable>] {
        let elements : Array<Element> = new Array<Element>();
        let variables : Array<Variable> = new Array<Variable>();

        for (const [key, value] of Object.entries(node)) {
            if(value != null && typeof value == "object" && key!="loc" && key!="position"){
                // console.log(value);
                if(value['kind'] == "call" && FileParser.sql_functions.includes(value['what']['name'])){
                    for(let arg of value['arguments']){
                        // console.log(arg)
                        if(arg['kind'] == "bin"){
                            // console.log("here")
                            elements = elements.concat(this.get_bin(arg));
                        }else{
                            elements.push(this.get_element(arg));
                        }
                    }
                }

                // Detect user's inputs
                if(value['kind'] == "assign" && value['left']['kind'] == "variable" && value['right']['kind'] == "offsetlookup"){
                    
                }

                elements = elements.concat(this.extract_elements_sub(value)[0]);
                variables = variables.concat(this.extract_elements_sub(value)[1])
            }
        }

        return [elements,variables];
    }

    private get_bin(value) : Array<Element>{
        if(value['kind'] == "bin"){
            // var bin_elements: string[];
            let bin_elements: Array<Element> = new Array<Element>();
            bin_elements = this.get_bin(value['left']);
            
            bin_elements = bin_elements.concat(this.get_bin(value['right']));
            return bin_elements;
           
        }else{
            let bin_elements: Array<Element> = new Array<Element>();
            bin_elements.push(this.get_element(value));
            return bin_elements;
        } 
    }

    private get_string(statement : object) : Element {
        return {type: Type.STRING, value: statement['value']};
    }
    private get_variable(statement : object) : Element {
        return {type: Type.VARIABLE, value: statement['name']};

    }
    private get_encapsed(statement : object) : Element {
        return {type: Type.ENCAPSED, value: statement['raw']};
    }
    private get_number(statement : object) : Element {return {type: Type.NUMBER, value: statement['value']};}
    private get_offsetlookup(statement : object) : Element {return {type: Type.OFFSET, value: statement['what']['name']};}

}