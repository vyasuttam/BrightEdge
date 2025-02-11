export function generateOTP(){
    
    return (Math.round(Math.random() * 900000) + 100000).toString();

}