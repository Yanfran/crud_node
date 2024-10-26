import User from "../model/userModel.js"
import admin from 'firebase-admin';

export const create = async (req, res) => {
    try {        
        const serviceAccount = {
            "type": "service_account",
            "project_id": "crud-5e4ca",
            "private_key_id": "f73012aa4bf2f584259410d6671c03a649d46694",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6bAw5oRuDcsVw\nGpQrgnHYgQMhiUA6eoOC9HM2LaiEFn8dt09WE3F7C8MjbgL6ekT+RwPz60uhqmGy\ngbtgYgMAovtUiObd7CFcl+s0doqaW1iJibqkNksO888PGY9gS8aAfGEPhinTqs4r\nhv6snrfxbjhx4HufGvJLhIPvRPZur7LR4nlvcle2jMWy/FfKJocJ/XIsPE8fldxg\n3dcOVJcvpam0V/8TFuBoqOWR84F77/PR++CfSXVAwu/tAETJCoZVY6dKU4M+jgH6\nJbuOBqYoxdtU6cLKGatP/0G9pyF3LcZbAaQdB2fkYgK5eRXibasvqgOEcg/MYNVa\ns3SZXAnlAgMBAAECggEANxzgVF1D1A2nPygsa9yJqbciZNS9z0wO+zUnpnnDGyHH\nfNKHuuvOndDxZNUOPlzNbtsx2PfUCTxk27As5Ca1uod0hB5hGnTHvCcRmxX8jfu5\nZhf4vLlsYURFD7K/x3k/exbKXxuL3A7gGtAzFHdr7A1o1InIIlaGETthAejCbiAz\nOrh9SHJFA1j0xNHt6NIJoNyc+mqMzJsEzn7XClYJgxT5MRozouSNsTyg0qeBiP55\n4M8Rb75oJmeFeaKFIwXXO/z1K7PRkEW6KEKeyB5fId3nyLkXIzPvqRzmGZjOq3am\nTo5HbJVbbEDmpXsW3iFXX28RNp43fk2iF0DLW9FIlQKBgQD27Oy6MjKqNLlh3d3i\n7ZIGTWzfQz6HTsqEfNAj2mGOKc4XBdPnVcPEsJV3r5D8e4FnAYdGjD+mRw3DxZqj\nU1syPo8StPDic88vLC3oCeL7RgQfdlSy2BB3sEF/Lq6WNFOzjaoyNyH5xvCE+kLB\nhzM0XHBNYnzMhbaObGwz20o80wKBgQDBRegf3bZPcxSe24Sb6Lkzz/inbetb4Jlu\nyDEyLTWyQ+xQSS5YLXknWWNTrezejVjotM00T6J/iryjrP4jFZZ1WSt6xR+l+8Lt\nT0/nJAoz9AnrqlpzogflN80Y7Le3zFq0P3Qkw07Gyr1O45B9YSiATT2j7e7kiFun\ntB3crE2LZwKBgChZPLGMRFUlumkwjPJo6aSYAENXRJ9tk5AkqQpCxBAr6p4+eIrj\nq9K3HCVrjeCD+fgv+r/faQMttyUXZBZuJ4fFSzG+WWJXlDJcIMA65Vkz7raJanuy\n7LXyGjHDGgo3ULoVWwtLkQS0qlbAYiongol61Wr/ve7ZpqQNOX0bxzy7AoGAX8Yg\njQn1OdGxOjdVs1zTydUZRv61TsYxwi/6EP9OSJRYGkDpclC2ZMVq7yCU7IPmtwpB\nVdbQk5tQd1tWZFRiRqx1W1Urpbjok2hmFAhL9grMj7fPMtXsS64nOF61e6MMn52C\nFGWkN+ZngRxLkZX/1/Ruwzk41I6tvKEI2z2W/6kCgYEA28yv7nn6+ls/lZV7PuaW\ngCNF513HQlyiyWPgUktQr8acJCYt76gxEvoEqmGFfQjleceF/5VKlBumUvsgQP0x\nc9SWa/j1BbF8lLMHqv7a1j6fa7LmWPzRh1ZW9p+CezJFRGnie2LCz473+lbTuYC7\nav63dqMFe/2cUl2XnvKY1so=\n-----END PRIVATE KEY-----\n",
            "client_email": "firebase-adminsdk-on2q4@crud-5e4ca.iam.gserviceaccount.com",
            "client_id": "110183493060041778865",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-on2q4%40crud-5e4ca.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        };
        
        // Inicializacion de la aplicación de Firebase
        if(!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
        }

        const { name, email, address, fcmToken } = req.body;
        let imageUrl = null;

        // Si el archivo está en la solicitud, almacena la URL
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists." });
        }

        const userData = new User({
            name,
            email,
            address,
            imageUrl            
        });

        const saveUser = await userData.save();

        const message = {
            notification: {
                title: "Nuevo usuario creado",
                body: `${name} ha sido registrado exitosamente`,
            },
            token: fcmToken, 
        };
        
        // Envía la notificación
        try {
            await admin.messaging().send(message);
            console.log("Notificación enviada.");
        } catch (error) {
            console.error("Error al enviar notificación: ", error);
        }

        res.status(201).json(saveUser); 

    } catch (error) {
        console.error("Error:", error.message); 
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};


export const fetch = async (req, res)=>{
    try {
        const users = await User.find();
        if (users.length === 0) {
            return res.status(404).json({message: "User Not Found."})
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error:"Internal Server error"})
    }
}; 


export const update = async (req, res)=>{
    try {

        const id = req.params.id;
        const userExist = await User.findOne({ _id: id });
        if (!userExist) {
            return res.status(404).json({ message: "User Not Found." });
        }

        // Si se carga un nuevo archivo, actualiza la URL de la imagen
        let updateData = { ...req.body };
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updateUser = await User.findByIdAndUpdate(id, updateData, {
            new: true,
        });
        res.status(201).json(updateUser);
       
    } catch (error) {
        res.status(500).json({error:"Internal Server error"})
    }
}; 


export const deleteUser = async (req, res)=>{
    try {
        const id = req.params.id;  
        const userExist = await User.findOne({_id:id})
        if (!userExist) {
            return res.status(404).json({message: "User Not Found."})
        }
        await User.findByIdAndDelete(id);        
        res.status(201).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({error:"Internal Server error"})
    }
}; 