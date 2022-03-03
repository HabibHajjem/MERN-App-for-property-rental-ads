const { body, validationResult, check } = require('express-validator');

exports.RegisterValidation = [
    body("firstName","entrer votre nom").notEmpty(),
    body("lastName","entrer votre prénom").notEmpty(),
    body("contact","enter un numéro valide").isNumeric(),
    body("email", "should be a valid email").isEmail(),
    body("password", "should be at least 6 caracters").isLength({min:6})
];

exports.LoginValidation = [
    body("email", "should be a valid email").isEmail(),
    body("password", "should be at least 6 caracters").isLength({min:6})
]

exports.addPostValidation = [
    check("myImages").custom((value,{req})=>{
        if (req.files.length!=0) {
            return true
        }
        else{
            return false
            }
    }).withMessage("Vous devrez ajouter une photo"),
    body("surface","vous devrez entrer la surface du local").isNumeric(),
    body("piecesNbre","vous devrez entrer le nombre des pièces").notEmpty(),
    body("description","vous devrez ajouter une description").notEmpty(),
    body("governate","sélectionner une gouvernorat").notEmpty(),
    body("city","sélectionner une ville").notEmpty(),
    body("location","vous devrez entrer la localité").notEmpty(),
    body("price","vous devrez entrer le prix").isNumeric(),
]

exports.editUserValidation = [
    body("firstName","entrer votre nom").if(body("firstName").exists()).notEmpty(),
    body("lastName","entrer votre prénom").if(body("lastName").exists()).notEmpty(),
    body("contact","enter un numéro valide").if(body("contact").exists()).isNumeric(),
    body("email", "entrer un e-mail valid").if(body("email").exists()).isEmail(),
    body("newPassword","entrer au moins 6 caractères").if(body("newPassword").exists()).
    isLength({min:6})
]


exports.Validation = (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
}
