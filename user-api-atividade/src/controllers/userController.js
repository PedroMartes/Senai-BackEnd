
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()
const bcrypt = require("bcryptjs"); // Importando o bcrypt 

const jwt = require("jsonwebtoken"); // Importando o JWT

const userController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }

        const userEncontrado = await prisma.users.findUnique({
            where: { email }    
        });

        
        if(!userEncontrado) {
            return res.status(403).json({
                masg: "E-mail or password invalid"
            });
        }

        const isCerto = await bcrypt.compare(password, userEncontrado.password);

        if(!isCerto) {
            return res.status(401).json({
                masg: "E-mail or password invalid"
            });
        }

        // payload -> Conteudo de dentro so JWT
        const payload = {
            id: userEncontrado.id,
            name: userEncontrado.name
        }

        //token vai sobreviver po 1h
        //palavra secreta -> Winghslompson o maior do Brasil E de Cuba -> base64 -> V2luZ2hzbG9tcHNvbiBvIG1haW9yIGRvIEJyYXNpbCBFIGRlIEN1YmE=
        const token = jwt.sign(payload, 'V2luZ2hzbG9tcHNvbiBvIG1haW9yIGRvIEJyYXNpbCBFIGRlIEN1YmE=' , {
            expiresIn: '1h' // Tempo de expiração do token
        })

        return res.status(200).json({
            token,
            msg: "User autenticated successfully" 
        })
    },
    create: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    msg: "All fields are required"
                })
            }

            // Senha criptografada
            const hashSenha = await bcrypt.hash(password, 10)

            const userCriado = await prisma.users.create({
                data: {
                    name, email, password: hashSenha
                }
            })

            return res.status(201).json({
                msg: "User created successfully",
                userCriado
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg: "Internal server error",
            })
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;

            const userDelete = await prisma.users.delete({
                where: { id: Number(id) }
            })

            if (!id) {
                return res.status(400).json({
                    msg: "ID is required",
                    userDelete
                })
            }

            return res.status(200).json({
                msg: "User deleted successfully"
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg: "Internal server error"
            })
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;

            console.log(id)

            if (!name || !email || !password) {
                return res.status(400).json({
                    msg: 'User not found'
                });
            }

            await prisma.users.update({
                data: {
                    name, email, password
                }, where: {
                    id: Number(id)
                }
            });

            return res.status(200).json({
                msg: 'User updated successfully',
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                msg: 'Internal server error'
            })
        }
    },

    getAll: async (req, res) => {
        try {

            const usersAchados = await prisma.users.findMany()

            return res.status(200).json({
                msg: "Users retrieved successfully",
                usersAchados
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg: "Internal server error"
            })
        }
    }

}

module.exports = userController;