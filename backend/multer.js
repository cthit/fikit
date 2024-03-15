import multer from 'multer';

const postStorage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'public/img/postImages/')
	},
	filename: function (req, file, cb) {
		const ogFile = file.originalname.split(".");

	  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." + ogFile[ogFile.length-1]
	  cb(null, file.fieldname + '-' + uniqueSuffix)
	}
})

const profileImageStorage = multer.diskStorage({
	
	destination: function (req, file, cb) {
	  	cb(null, 'public/img/profileImages/')
	},
	filename: function (req, file, cb) {
		const ogFile = file.originalname.split(".");

	  	const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + "." +ogFile[ogFile.length-1]
		cb(null, file.fieldname + '-' + uniqueSuffix)
	}
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/profileImages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});


export const uploadPost = multer({ storage: postStorage })
export const uploadProfileImage = multer({ storage: profileImageStorage }).single('personImage');