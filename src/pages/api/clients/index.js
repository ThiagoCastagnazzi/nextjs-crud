import Client from "../../../models/Client"
import dbConnect from "../../../services/db"

dbConnect()

export default async function handler(req, res) {
    const { method } = req

    switch(method){
        case 'GET':
            try {
                const clients = await Client.find({})
                res.status(200).json({succes: true, data: clients})
            } catch (error) {
                console.log(error)
                res.status(500).json({succes: false, error})
            }
            
        break;

        case 'POST':
            try {
                const {name, email} = req.body

                if (!name && !email) throw 'Invalid Data'
                const client = await Client.create({name, email})

                res.status(201).json({sucess: true, data: client})
            } catch (error) {
                console.log(error)
                res.status(500).json({succes: false, error})
            }
    }
  }
  