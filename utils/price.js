
function validationPrice(nominal) {
    if(nominal.length){
        for(let i = 0; i >= nominal.length; i++){
            if(nominal.length % 3){
                i = nominal.length[0];
                
            }
        }
    }
}

function convert(price) {
    const validatePrice = validationPrice(price);

    if(validatePrice == null || validatePrice == " ") return "Rp. 0,00";
    if(validatePrice.length >= 1) return `Rp. ${validatePrice},00`
}

export default convert;