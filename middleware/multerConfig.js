import multer from "multer";

// Configura multer para almacenar las imágenes en una carpeta temporal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Cambia la carpeta según tus necesidades
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const upload = multer({ storage: storage });
