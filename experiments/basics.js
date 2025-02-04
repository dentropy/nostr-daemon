  
import parse from 'jsr:@inro/slash-command-parser'

const result = parse('/todos add name: My Todo Name')

console.log(result)
