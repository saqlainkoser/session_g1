let express = require("express")

let app = express()
app.use(express.json())


let fakeDB = [
    {id: 101, username:"shaan1" , phone :12345},
    {id: 102, username:"shaan2" , phone :12345},
    {id: 103, username:"shaan3" , phone :12345},
    {id: 104, username:"shaan4" , phone :12345}
]

app.get("/users/:id",(req,res)=>{
   let id=  req.params.id
   let user = fakeDB.find((u)=> u.id==id)
    console.log(user)
   res.send(`<ul>
            <li>name : ${user.username}</li>
            <li>phone : ${user.phone}</li>
            </ul>`)
})

// put and patch works in express

app.patch("/user/:id",(req,res)=>{
     let user = req.body
     let id = req.params.id
     user.id = id
    //  let {id,username,phone} = user
    let indexNumber = null
     fakeDB.map((e,i)=>{
        if(e.id==id){
           indexNumber = i      
        }
     })

     fakeDB[indexNumber] = user
     console.log(fakeDB)
     res.status(200).json({
        message : "success",
        newData : fakeDB[indexNumber]
     })
 

})

app.listen(3088,(req,res)=>{
    console.log("Server is running on http://localhost:3088")
})