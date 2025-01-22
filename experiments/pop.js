let a = "test/test2/test3.json"
a = a.split("/")
a.pop()
a = a.join("/")
console.log(a)