import bcrypt from 'bcryptjs'

const users = [
    {
        name: "Unais",
        email:"unaisnml@gmail.com",
        password: bcrypt.hashSync('12345',10),
        isAdmin:true
    },
    {
        name: "Fathima",
        email:"fathima@gmail.com",
        password: bcrypt.hashSync('12345',10),
        isAdmin:false
    },
    {
        name: "Masri",
        email:"masri@gmail.com",
        password: bcrypt.hashSync('12345',10),
        isAdmin:false
    }
]

export {users}