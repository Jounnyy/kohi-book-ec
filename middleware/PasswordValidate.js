export function validatePassword(pass, confPass) {
    let response, result;
    if(pass !== confPass){
        response =  `{"status": "400", "msg": "password and confirm password do not match"}`
        result = JSON.parse(response);
        return result;
    } 
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    const resRegex = regex.test(pass);
    response = `{"status": "200", "msg": "password and confirm password clean!", "regex": "${resRegex}"}`
    result = JSON.parse(response);
    console.log(result);
    return result;
}