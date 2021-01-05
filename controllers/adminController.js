
const adminModel = require('../models/adminModel');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

function showUnsignedString(search) {
    var signedChars = "àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬĐÈẺẼÉẸÊỀỂỄẾỆÌỈĨÍỊÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÙỦŨÚỤƯỪỬỮỨỰỲỶỸÝỴ";
    var unsignedChars = "aaaaaaaaaaaaaaaaadeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyAAAAAAAAAAAAAAAAADEEEEEEEEEEEIIIIIOOOOOOOOOOOOOOOOOUUUUUUUUUUUYYYYY";
    var input = search;
    var pattern = new RegExp("[" + signedChars + "]", "g");
    var output = input.replace(pattern, function(m, key, value) {
        return unsignedChars.charAt(signedChars.indexOf(m));
    });
    return output;
}

exports.profile = async (req, res, next) => {
    //const admin = await adminModel.getAdmin(req.params.id);
    res.render('profile',{title: 'Thông tin admin'} );
};

exports.update_profile = async(req, res, next) => {
    
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
          next(err);
          return;
        }
        const coverImage = files.txtProfilePic;
        const imageType = ["image/png", "image/jpeg"];

        // ảnh bìa phải là 1 file ảnh
      
        if (coverImage && coverImage.size > 0) {
            if (imageType.indexOf(coverImage.type) >=0 )  
            {
                cloudinary.uploader.upload(coverImage.path,function(err, result){
                    fields.txtProfilePic = result.url;
                    adminModel.update_profile(fields,req.params.id).then(()=>{
                        res.redirect('/home');
                        });
                });
            }
            else
                adminModel.update_profile(fields,req.params.id).then(()=>{
                res.redirect('/home');
                });
           
        }    
        else 
        {
            adminModel.update_profile(fields,req.params.id).then(()=>{
                res.redirect('/home');
                });
        }    
      });
};

exports.change_password_page = (req, res, next) => {
    res.render('change_password',{ title: 'Đổi mật khẩu'}); 
};

exports.change_password = async (req, res, next) => {
const {oldPassword, newPassword, renewPassword} = req.body;
const isTruePassword = await adminModel.checkCredential(req.user.username, oldPassword);

try
{
    if (isTruePassword)
    {
        if (newPassword != showUnsignedString(newPassword))
        {
            throw("Mật khẩu không được có dấu");
            return;
        }

        if (newPassword.includes(' '))
        {
            throw("Mật khấu không được chứa khoảng trắng");
            return;
        }

        if (newPassword.length <8)
        {
            throw("Mật khấu chứa ít nhất 8 kí tự");
            return;
        }

        if (newPassword != renewPassword)
        {
            throw("Mật khấu nhập lại không đúng");
            return;
        }

        await adminModel.change_password(req.user.username, newPassword);
        res.render('change_password', {title: 'Đổi mật khẩu', messageSuccess: "Đổi mật khẩu thành công!"});

    }
    else
    {
        throw ("Mật khẩu cũ không đúng");
        return;
    }
}
catch (err)
{
    res.render('change_password',{ title: 'Đổi mật khẩu', message: err}); 
}


};