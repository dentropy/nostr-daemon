  
import parse from 'jsr:@inro/slash-command-parser'

let result = parse('/todos add name: My Todo Name')

console.log(result)
