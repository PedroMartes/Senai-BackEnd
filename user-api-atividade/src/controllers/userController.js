
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

const userController = {
    create: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const userCriado = await prisma.users.create({
                data: {
                    name, email, password
                }
            })


            if (!name || !email || !password) {
                return res.status(400).json({
                    msg: "All fields are required"
                })
            }

            return res.status(201).json({
                msg: "User created successfully",
                userCriado
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                msg: "Internal server error"
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