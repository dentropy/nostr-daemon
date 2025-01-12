export function RemoveNIP19FromContent(content){
    return content.replace(/nostr\:\w+/g, "");

}
