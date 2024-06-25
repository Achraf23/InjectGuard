import { getDomainJunidPost } from "./services.gen";
import { GetDomainJunidPostData } from "./types.gen";



export async function get_domain(codeSource) {

    const data: GetDomainJunidPostData = {
        codeBlock: codeSource
    };

    let domainCode: string[] = [];
    
    try {
        domainCode = await getDomainJunidPost(data);
        return domainCode;
        // console.log('Response:', response);
    } catch (error) {
        console.error('Error making POST request:', error);
        return domainCode;
    }
}